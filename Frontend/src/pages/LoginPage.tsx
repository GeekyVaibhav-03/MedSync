import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Heart, Mail, Lock, ArrowRight, Shield, Stethoscope, FlaskConical, Pill, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loginSuccess } from '@/store/slices/authSlice';
import { authAPI } from '@/services/api';

const roles = [
  { id: 'admin', label: 'Admin', icon: Shield, color: 'bg-primary/10 text-primary' },
  { id: 'receptionist', label: 'Receptionist', icon: UserCheck, color: 'bg-violet-500/10 text-violet-500' },
  { id: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'bg-info/10 text-info' },
  { id: 'lab', label: 'Lab Technician', icon: FlaskConical, color: 'bg-warning/10 text-warning' },
  { id: 'pharmacy', label: 'Pharmacist', icon: Pill, color: 'bg-success/10 text-success' },
] as const;

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('admin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getRoleRoute = (role: string) => {
    switch (role) {
      case 'admin': return '/admin';
      case 'receptionist': return '/receptionist';
      case 'doctor': return '/doctor';
      case 'lab': return '/lab';
      case 'pharmacy': return '/pharmacy';
      default: return '/admin';
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login({ email, password });
      const { user, token } = response.data.data;

      // Verify role matches selected role
      if (user.role !== selectedRole) {
        setError(`This account has "${user.role}" role. Please select the correct role.`);
        setLoading(false);
        return;
      }

      // Store token
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch(loginSuccess({
        user: { 
          id: user.id || user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role 
        },
        token,
      }));

      navigate(getRoleRoute(user.role));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative items-center justify-center p-12">
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/20">
              <Heart className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-primary-foreground">MediFlow</span>
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Welcome back to your healthcare dashboard
          </h2>
          <p className="text-primary-foreground/70 leading-relaxed">
            Manage patients, tokens, and hospital operations with our intelligent management system.
          </p>
        </div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-primary-foreground" />
          <div className="absolute bottom-20 right-10 h-48 w-48 rounded-full bg-primary-foreground" />
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">MediFlow</span>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Sign in to your account</h1>
          <p className="text-muted-foreground mb-8">Select your role and enter your credentials</p>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`flex items-center gap-3 rounded-xl border-2 p-3 transition-all text-left ${
                  selectedRole === role.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/30'
                }`}
              >
                <div className={`rounded-lg p-2 ${role.color}`}>
                  <role.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-foreground">{role.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mediflow.com"
                  className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full rounded-xl py-3 gap-2" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
