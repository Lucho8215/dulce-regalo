import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      await signIn(email, password);
      navigate('/admin', { replace: true });
    } catch (error) {
      const msg = error?.message || JSON.stringify(error);
      setErrorMsg(msg);
      toast({
        title: 'Error al iniciar sesión',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Acceso Admin - Dulce Regalo</title>
      </Helmet>

      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-primary mb-2">
              <Heart className="w-8 h-8" fill="currentColor" />
              <span className="text-2xl font-bold">Dulce Regalo</span>
            </div>
            <p className="text-muted-foreground text-sm">Panel de administración</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-card-foreground mb-6">Iniciar sesión</h1>

            {/* Debug: muestra URL configurada y error exacto */}
            <div className="mb-4 p-3 bg-muted rounded-lg text-xs text-muted-foreground space-y-1 font-mono break-all">
              <p><span className="font-bold text-foreground">URL:</span> {import.meta.env.VITE_SUPABASE_URL || '⚠️ NO CONFIGURADA'}</p>
              {errorMsg && <p className="text-destructive font-bold">Error: {errorMsg}</p>}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dulceregalo.com"
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-background"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-5 rounded-xl"
              >
                {isLoading ? (
                  'Verificando...'
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Entrar
                  </>
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;
