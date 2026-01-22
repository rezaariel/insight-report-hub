import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Trash2, UserPlus, Users } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { z } from 'zod';

const createUserSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter').max(100),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

interface UserProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  created_at: string;
  role: 'admin' | 'user';
}

export function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    
    // Fetch profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      toast({
        title: 'Error',
        description: 'Gagal memuat data user',
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    // Fetch roles for each user
    const usersWithRoles: UserProfile[] = [];
    
    for (const profile of profiles || []) {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', profile.user_id)
        .single();

      usersWithRoles.push({
        ...profile,
        role: roleData?.role || 'user',
      });
    }

    setUsers(usersWithRoles);
    setLoading(false);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = createUserSchema.safeParse({ name, email, password });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setCreating(true);

    try {
      // Create user via Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { name }
        }
      });

      if (error) {
        toast({
          title: 'Gagal Membuat User',
          description: error.message.includes('already registered')
            ? 'Email sudah terdaftar'
            : error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Berhasil!',
        description: `User ${name} berhasil dibuat dengan email ${email}`,
      });

      // Reset form and close dialog
      setName('');
      setEmail('');
      setPassword('');
      setDialogOpen(false);
      
      // Refresh user list
      setTimeout(() => fetchUsers(), 1000);

    } catch (err) {
      toast({
        title: 'Error',
        description: 'Terjadi kesalahan. Silakan coba lagi.',
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manajemen User
          </h2>
          <p className="text-sm text-muted-foreground">
            Kelola akun pengguna sistem
          </p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Tambah User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Akun User Baru</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="create-name">Nama Lengkap</Label>
                <Input
                  id="create-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-email">Email</Label>
                <Input
                  id="create-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@perusahaan.com"
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-password">Password</Label>
                <Input
                  id="create-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className={errors.password ? 'border-destructive' : ''}
                />
                {errors.password && (
                  <p className="text-xs text-destructive">{errors.password}</p>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={creating}>
                  {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Buat User
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border bg-card">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-foreground">
              Belum ada user
            </p>
            <p className="text-sm text-muted-foreground">
              Klik tombol "Tambah User" untuk membuat akun baru
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Dibuat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.created_at), 'd MMM yyyy', { locale: id })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
