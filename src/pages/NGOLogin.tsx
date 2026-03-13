import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  TreePine,
  Lock,
  Loader2,
  MapPin,
  Search,
} from "lucide-react";
import { pageStyles } from "@/lib/design-system";
import { ngoCredentialsList } from "@/lib/statePollutionData";

const NGOLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const filteredCredentials = ngoCredentialsList.filter(
    (c) =>
      c.username.toLowerCase().includes(username.toLowerCase()) ||
      c.ngoName.toLowerCase().includes(username.toLowerCase()) ||
      c.state.toLowerCase().includes(username.toLowerCase())
  );

  const selectCredential = (cred: typeof ngoCredentialsList[0]) => {
    setUsername(cred.username);
    setPassword(cred.password);
    setShowSuggestions(false);
    setHighlightedIndex(-1);
    setError("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || filteredCredentials.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredCredentials.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCredentials.length - 1
      );
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      selectCredential(filteredCredentials[highlightedIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset highlighted index when filter changes
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [username]);

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    const matched = ngoCredentialsList.find(
      (c) => c.username === username && c.password === password
    );

    if (matched) {
      localStorage.setItem("ngoAuthenticated", "true");
      localStorage.setItem("ngoName", matched.ngoName);
      localStorage.setItem("ngoState", matched.state);
      navigate("/ngo-dashboard");
    } else {
      setError("Invalid NGO credentials");
    }

    setIsLoading(false);
  };

  return (
    <div className={pageStyles.centeredWrapper}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mx-auto mb-4 shadow-glow">
              <TreePine className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              NGO Portal
            </h1>
            <p className="text-muted-foreground mt-1">
              State-level pollution monitoring & AI recommendations
            </p>
          </div>

          <Card className="bg-card/80 backdrop-blur-md shadow-elevated border-primary/10">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                NGO Login
              </CardTitle>
              <CardDescription>
                Sign in with your assigned NGO credentials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Username with auto-search */}
                <div className="space-y-2 relative">
                  <Label htmlFor="ngo-username">Username / Search NGO</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      ref={inputRef}
                      id="ngo-username"
                      type="text"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setShowSuggestions(true);
                        setError("");
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type username, NGO name, or state..."
                      disabled={isLoading}
                      className="pl-9"
                      autoComplete="off"
                    />
                  </div>

                  {/* Suggestions dropdown */}
                  <AnimatePresence>
                    {showSuggestions && filteredCredentials.length > 0 && (
                      <motion.div
                        ref={suggestionsRef}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-[220px] overflow-y-auto rounded-xl border border-border bg-popover shadow-lg"
                      >
                        {filteredCredentials.map((cred, idx) => (
                          <button
                            key={cred.username}
                            type="button"
                            onClick={() => selectCredential(cred)}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                              highlightedIndex === idx
                                ? "bg-primary/10 text-primary"
                                : "hover:bg-muted/50"
                            } ${idx !== filteredCredentials.length - 1 ? "border-b border-border/50" : ""}`}
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                              <MapPin className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-foreground truncate">
                                {cred.ngoName}
                              </p>
                              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                                <span className="font-mono">{cred.username}</span>
                                <span className="text-border">•</span>
                                <span>{cred.state}</span>
                              </p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ngo-password">Password</Label>
                  <Input
                    id="ngo-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    placeholder="Enter password"
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <p className="text-[11px] text-muted-foreground">
                  💡 Start typing a username, NGO name, or state to auto-fill credentials. Password for all: <span className="font-mono text-primary font-medium">ngo@123</span>
                </p>

                <Button
                  onClick={handleLogin}
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NGOLogin;
