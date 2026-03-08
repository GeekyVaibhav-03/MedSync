import { Outlet, useNavigate } from 'react-router-dom';
import { Bell, LogOut, User } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { Button } from '@/components/ui/button';

const DashboardLayout = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-primary text-primary-foreground';
      case 'receptionist': return 'bg-violet-500 text-white';
      case 'doctor': return 'bg-info text-white';
      case 'lab': return 'bg-warning text-white';
      case 'pharmacy': return 'bg-success text-white';
      default: return 'bg-primary text-primary-foreground';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrator';
      case 'receptionist': return 'Receptionist';
      case 'doctor': return 'Doctor';
      case 'lab': return 'Lab Technician';
      case 'pharmacy': return 'Pharmacist';
      default: return role;
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      {/* Top Header - No Sidebar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-lg">
        <div className="container mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Logo & Role Badge */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
                  <span className="text-lg font-bold text-primary-foreground">M</span>
                </div>
                <span className="text-xl font-bold text-foreground">MedSync</span>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getRoleColor(user?.role || '')}`}>
                {getRoleLabel(user?.role || '')}
              </span>
            </div>

            {/* User Info & Actions */}
            <div className="flex items-center gap-4">
              <button className="relative rounded-xl bg-muted p-2.5 text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary" />
              </button>
              
              <div className="flex items-center gap-3 border-l border-border pl-4">
                <div className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-foreground">{user?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout}
                className="gap-2 rounded-lg"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Full Width */}
      <main className="container mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
