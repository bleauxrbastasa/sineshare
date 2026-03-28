import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

const ADMIN_USER = "blue";
const ADMIN_PASS = "sineshare1234ak47";

interface Props {
  onAuth: () => void;
}

const AdminLogin = ({ onAuth }: Props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      sessionStorage.setItem("sineshare_admin", "1");
      onAuth();
    } else {
      setError(true);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-20 max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <Lock className="w-10 h-10 text-primary mx-auto" />
          <h1 className="text-2xl font-display font-bold text-foreground">Admin Login</h1>
          <p className="text-muted-foreground text-sm">Enter your credentials to continue.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-user">Username</Label>
            <Input
              id="admin-user"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(false); }}
              className="bg-secondary border-border/50"
              autoComplete="username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-pass">Password</Label>
            <Input
              id="admin-pass"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              className="bg-secondary border-border/50"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-destructive text-sm">Invalid credentials.</p>}
          <Button type="submit" className="w-full">Sign In</Button>
        </form>
      </div>
    </Layout>
  );
};

export default AdminLogin;
