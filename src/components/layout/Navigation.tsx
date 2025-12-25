import { NavLink, useLocation } from 'react-router-dom';
import { Clock, Timer, Globe, Settings, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Clock, label: 'Clock' },
  { path: '/stopwatch', icon: Gauge, label: 'Stopwatch' },
  { path: '/timer', icon: Timer, label: 'Timer' },
  { path: '/world', icon: Globe, label: 'World' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-safe">
      <div className="mx-auto max-w-md">
        <div className="glass-strong rounded-2xl mb-4 p-2">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'relative flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-colors',
                    isActive ? 'text-primary' : 'text-foreground-muted hover:text-foreground'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-primary/10 rounded-xl"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="text-[10px] font-medium relative z-10">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
