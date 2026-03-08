import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Stethoscope,
  UserRound,
  FlaskConical,
  Pill,
  BarChart3,
  Settings,
  Heart,
  LogOut,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';

const sidebarLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'OPD', href: '/dashboard/opd', icon: Stethoscope },
  { label: 'Doctor', href: '/dashboard/doctor', icon: UserRound },
  { label: 'Lab', href: '/dashboard/lab', icon: FlaskConical },
  { label: 'Pharmacy', href: '/dashboard/pharmacy', icon: Pill },
  { label: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
];

const Sidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
          <Heart className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="text-lg font-bold">MediFlow</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = location.pathname === link.href;
          return (
            <Link key={link.label} to={link.href}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                }`}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={() => dispatch(logout())}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
