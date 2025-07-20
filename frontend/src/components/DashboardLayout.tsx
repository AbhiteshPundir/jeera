import { useState } from 'react';
import { useAuth } from '../context/auth.context';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from './ui/sheet';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Card } from './ui/card';

import {
  Menu,
  LogOut,
  Settings,
  Home,
  FolderKanban,
  CheckSquare,
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', to: '/', icon: Home },
    { name: 'Projects', to: '/projects', icon: FolderKanban },
    { name: 'My Tasks', to: '/tasks', icon: CheckSquare },
  ];

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const NavItems = ({ mobile = false }) => (
    <nav className={`${mobile ? 'flex flex-col space-y-2' : 'hidden lg:flex lg:space-x-1'}`}>
      {navLinks.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.to}
            variant={isActive(item.to) ? 'default' : 'ghost'}
            className={`${mobile ? 'justify-start' : ''} ${
              isActive(item.to)
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}
            onClick={() => {
              navigate(item.to);
              if (mobile) setIsOpen(false);
            }}
          >
            <Icon className="w-4 h-4 mr-2" />
            {item.name}
          </Button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
          {/* Logo and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-card">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="px-3 py-2">
                    <h2 className="mb-2 px-2 text-lg font-semibold text-foreground">
                      🧠 Task Manager
                    </h2>
                  </div>
                  <NavItems mobile />
                  <Button variant="destructive" onClick={handleLogout} className="mt-4">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

            <Button
              variant="ghost"
              className="text-xl font-bold text-foreground hover:bg-transparent"
              onClick={() => navigate('/')}
            >
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                🧠 Task Manager
              </span>
            </Button>
          </div>

          {/* Desktop Nav */}
          <NavItems />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={user?.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name?.[0] ?? 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-popover" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.name ?? 'User'}</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user?.email ?? ''}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">
            Welcome, {user?.name?.split(' ')[0]} 👋
          </h1>
        </div>
        <Card className="bg-base-200 rounded-box shadow p-6 min-h-[60vh]">
          <Outlet />
        </Card>
      </main>
    </div>
  );
};

export default DashboardLayout;