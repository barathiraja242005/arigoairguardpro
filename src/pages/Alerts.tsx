import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { onValue, ref, remove } from 'firebase/database';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertTriangle,
  Info,
  XCircle,
  CheckCircle,
  X,
  Trash2,
} from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { database } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import {
  pageStyles,
  pageHeader,
  responsive,
} from '@/lib/design-system';

type AlertType = 'error' | 'warning' | 'info' | 'success';

interface Alert {
  id: string;
  type: AlertType;
  message: string;
  timestamp: string;
  description?: string;
}

const getAlertColor = (type: AlertType) => {
  switch (type) {
    case 'error': return 'from-red-500/20 to-red-600/20 border-red-500/30';
    case 'warning': return 'from-amber-500/20 to-amber-600/20 border-amber-500/30';
    case 'info': return 'from-blue-500/20 to-blue-600/20 border-blue-500/30';
    case 'success': return 'from-green-500/20 to-green-600/20 border-green-500/30';
  }
};

const getAlertIcon = (type: AlertType) => {
  switch (type) {
    case 'error': return <XCircle className="w-6 h-6 text-red-500" />;
    case 'warning': return <AlertTriangle className="w-6 h-6 text-amber-500" />;
    case 'info': return <Info className="w-6 h-6 text-blue-500" />;
    case 'success': return <CheckCircle className="w-6 h-6 text-green-500" />;
  }
};

const AlertCard = ({ alert, onDismiss }: { alert: Alert; onDismiss: (id: string) => void }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <Card className={`bg-gradient-to-br ${getAlertColor(alert.type)} backdrop-blur-md shadow-elevated border hover:shadow-lg transition-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 mt-1">{getAlertIcon(alert.type)}</div>
          <div className="flex-grow">
            <h3 className="font-semibold text-foreground mb-1">{alert.message}</h3>
            {alert.description && (
              <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
            )}
            <p className="text-xs text-muted-foreground/80">
              {new Date(alert.timestamp).toLocaleString()}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDismiss(alert.id)}
            className="flex-shrink-0 hover:bg-destructive/20 hover:text-destructive"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

interface FirebaseAqiAlertMeta {
  last_called_at?: string;
  last_called_aqi?: number;
  last_call_sid?: string;
  threshold?: number;
  last_test_id?: string;
}

const Alerts = () => {
  const { session } = useAuth();
  const deviceId = session?.role === 'device' ? session.deviceId : 'AIRGUARD_001';

  const [aqiMeta, setAqiMeta] = useState<FirebaseAqiAlertMeta | null>(null);
  const [batteryStatus, setBatteryStatus] = useState<{ percent?: number; online?: boolean; lastSeen?: string } | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(() => {
    const raw = localStorage.getItem('arigo_dismissed_alerts');
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  });
  const [activeTab, setActiveTab] = useState<'all' | AlertType>('all');

  useEffect(() => {
    const aqiRef = ref(database, `airguard_devices/${deviceId}/alerts/aqi_over_50`);
    const statusRef = ref(database, `airguard_devices/${deviceId}/device_status`);

    const unsubAqi = onValue(aqiRef, (snap) => {
      setAqiMeta(snap.exists() ? (snap.val() as FirebaseAqiAlertMeta) : null);
    });
    const unsubStatus = onValue(statusRef, (snap) => {
      const v = snap.exists() ? (snap.val() as { battery_percent?: number; online?: boolean; last_seen?: string }) : null;
      setBatteryStatus(v ? { percent: v.battery_percent, online: v.online, lastSeen: v.last_seen } : null);
    });

    return () => {
      unsubAqi();
      unsubStatus();
    };
  }, [deviceId]);

  const alerts = useMemo<Alert[]>(() => {
    const list: Alert[] = [];

    if (aqiMeta?.last_called_at) {
      const id = `aqi-${aqiMeta.last_called_at}`;
      if (!dismissed.has(id)) {
        list.push({
          id,
          type: 'error',
          message: `AQI exceeded threshold (${aqiMeta.threshold ?? 50})`,
          description: `Voice alert placed for device ${deviceId}. Last reading: ${aqiMeta.last_called_aqi ?? '—'}`,
          timestamp: aqiMeta.last_called_at,
        });
      }
    }

    if (batteryStatus?.online === false && batteryStatus.lastSeen) {
      const id = `offline-${batteryStatus.lastSeen}`;
      if (!dismissed.has(id)) {
        list.push({
          id,
          type: 'warning',
          message: 'Device offline',
          description: `No telemetry received from ${deviceId}. Check power and Wi-Fi.`,
          timestamp: batteryStatus.lastSeen,
        });
      }
    }

    if (batteryStatus?.percent !== undefined && batteryStatus.percent <= 20) {
      const id = `battery-low-${deviceId}`;
      if (!dismissed.has(id)) {
        list.push({
          id,
          type: 'warning',
          message: 'Low battery',
          description: `Device battery at ${batteryStatus.percent}%. Plug in soon.`,
          timestamp: batteryStatus.lastSeen ?? new Date().toISOString(),
        });
      }
    }

    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [aqiMeta, batteryStatus, dismissed, deviceId]);

  const dismissAlert = (id: string) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem('arigo_dismissed_alerts', JSON.stringify(Array.from(next)));
      return next;
    });
    if (id.startsWith('aqi-')) {
      void remove(ref(database, `airguard_devices/${deviceId}/alerts/aqi_over_50`)).catch(() => {
        /* ignore */
      });
    }
  };

  const dismissAll = () => {
    const allIds = alerts.map((a) => a.id);
    setDismissed((prev) => {
      const next = new Set(prev);
      allIds.forEach((id) => next.add(id));
      localStorage.setItem('arigo_dismissed_alerts', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const filteredAlerts = activeTab === 'all' ? alerts : alerts.filter((a) => a.type === activeTab);
  const errorCount = alerts.filter((a) => a.type === 'error').length;
  const warningCount = alerts.filter((a) => a.type === 'warning').length;
  const infoCount = alerts.filter((a) => a.type === 'info').length;
  const successCount = alerts.filter((a) => a.type === 'success').length;

  const isEmptyState = filteredAlerts.length === 0;

  return (
    <div className={`${pageStyles.gradientWrapper} ${responsive.pagePadding}`}>
      <ThemeToggle />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={pageHeader.wrapper}
      >
        <h1 className={pageHeader.title}>System Alerts</h1>
        <p className={pageHeader.description}>
          Live device events from your AriGo device
        </p>
      </motion.div>

      {/* Alert Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { type: 'error' as const, count: errorCount, label: 'Errors', color: 'red', Icon: XCircle },
          { type: 'warning' as const, count: warningCount, label: 'Warnings', color: 'amber', Icon: AlertTriangle },
          { type: 'info' as const, count: infoCount, label: 'Info', color: 'blue', Icon: Info },
          { type: 'success' as const, count: successCount, label: 'Success', color: 'green', Icon: CheckCircle },
        ].map(({ type, count, label, color, Icon }, i) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
          >
            <Card
              className={`cursor-pointer bg-gradient-to-br from-${color}-500/10 to-${color}-600/10 border-${color}-500/30 hover:border-${color}-500/60 transition-all ${activeTab === type ? `border-${color}-500/60 shadow-lg` : ''}`}
              onClick={() => setActiveTab(type)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className={`text-2xl font-bold text-${color}-500`}>{count}</p>
                  </div>
                  <Icon className={`w-8 h-8 text-${color}-500/40`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Alert Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button variant={activeTab === 'all' ? 'default' : 'outline'} onClick={() => setActiveTab('all')} className="rounded-lg">
          All ({alerts.length})
        </Button>
        <Button variant={activeTab === 'error' ? 'destructive' : 'outline'} onClick={() => setActiveTab('error')} className="rounded-lg">
          <XCircle className="w-4 h-4 mr-2" />
          Errors ({errorCount})
        </Button>
        <Button variant={activeTab === 'warning' ? 'default' : 'outline'} onClick={() => setActiveTab('warning')} className="rounded-lg">
          <AlertTriangle className="w-4 h-4 mr-2" />
          Warnings ({warningCount})
        </Button>
        <Button variant={activeTab === 'info' ? 'default' : 'outline'} onClick={() => setActiveTab('info')} className="rounded-lg">
          <Info className="w-4 h-4 mr-2" />
          Info ({infoCount})
        </Button>
        {alerts.length > 0 && (
          <Button variant="ghost" onClick={dismissAll} className="ml-auto text-destructive hover:bg-destructive/10">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Alerts List */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        {isEmptyState ? (
          <Card className="bg-card/80 backdrop-blur-md shadow-elevated border-border/50 rounded-2xl">
            <CardContent className="p-12 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {activeTab === 'all' ? 'All Systems Operational' : `No ${activeTab} alerts`}
              </h3>
              <p className="text-muted-foreground">
                {activeTab === 'all'
                  ? "Nothing to worry about. We'll notify you when your device reports something."
                  : `No ${activeTab} alerts at this time.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} onDismiss={dismissAlert} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Alerts;
