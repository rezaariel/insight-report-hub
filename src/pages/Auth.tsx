import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ClipboardList, Eye, EyeOff, Loader2, Shield, User } from 'lucide-react';
import { z } from 'zod';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type RoleType = 'admin' | 'user';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedRole, setSelectedRole] = useState<RoleType>('user');

  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const result = loginSchema.safeParse({ email, password });
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(fieldErrors);
        setLoading(false);
        return;
      }

      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: 'Login Gagal',
          description: error.message === 'Invalid login credentials' 
            ? 'Email atau password salah' 
            : error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Selamat Datang!',
          description: `Anda berhasil masuk sebagai ${selectedRole === 'admin' ? 'Admin' : 'User'}`,
        });
        navigate('/');
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent/30" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
        </div>
        <div className="relative z-10 text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <ClipboardList className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">SI-LAPOR</h1>
          <p className="text-xl text-white/80 mb-2">Sistem Pelaporan Industri Internal</p>
          <p className="text-white/60 max-w-md">
            Platform pelaporan terpadu untuk divisi GA, ACC, PCC, dan HRD
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <ClipboardList className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">SI-LAPOR</h1>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Masuk ke Akun</h2>
            <p className="text-muted-foreground mt-2">
              Pilih role dan masukkan kredensial Anda
            </p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">Masuk Sebagai</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('user')}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200",
                  selectedRole === 'user'
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground"
                )}
              >
                <User className="h-8 w-8 mb-2" />
                <span className="font-medium">User</span>
                <span className="text-xs opacity-70">Pengisi Laporan</span>
              </button>
              
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={cn(
                  "flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200",
                  selectedRole === 'admin'
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground"
                )}
              >
                <Shield className="h-8 w-8 mb-2" />
                <span className="font-medium">Admin</span>
                <span className="text-xs opacity-70">Kelola Sistem</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRole === 'admin' ? 'admin@silapor.com' : 'nama@perusahaan.com'}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Masuk sebagai {selectedRole === 'admin' ? 'Admin' : 'User'}
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
            <p className="text-xs text-muted-foreground text-center">
              {selectedRole === 'admin' 
                ? 'Akun Admin memiliki akses untuk mengelola user dan melihat semua laporan.'
                : 'Akun User dibuat oleh Admin. Hubungi Admin jika belum memiliki akun.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
