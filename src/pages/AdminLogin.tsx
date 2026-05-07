import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import DemoBadge from '@/components/ui/DemoBadge';
import { useAuth } from '@/contexts/AuthContext';
import { authenticateAdmin, DEMO_ADMIN, DEMO_MODE_ENABLED } from '@/lib/demoAuth';
import { pageStyles } from '@/lib/design-system';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { session, signInAdmin } = useAuth();

  useEffect(() => {
    if (session?.role === 'admin') {
      navigate('/admin-pollution-map', { replace: true });
    }
  }, [session, navigate]);

  const handleLogin = () => {
    if (authenticateAdmin(username, password)) {
      signInAdmin();
      navigate('/admin-pollution-map', { replace: true });
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className={pageStyles.centeredWrapper}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
        <Card className="w-full max-w-sm bg-card/80 backdrop-blur-md shadow-elevated border-primary/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">Admin Login</CardTitle>
            <CardDescription>Enter credentials to access the admin dashboard.</CardDescription>
            <div className="flex justify-center pt-2">
              <DemoBadge />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter password"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              {DEMO_MODE_ENABLED && (
                <div className="text-xs text-muted-foreground bg-primary/5 border border-primary/10 p-3 rounded-lg">
                  <strong className="text-primary">Demo Credentials:</strong><br />
                  Username: {DEMO_ADMIN.username}<br />
                  Password: {DEMO_ADMIN.password}
                </div>
              )}
              <Button onClick={handleLogin} className="w-full">
                Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
