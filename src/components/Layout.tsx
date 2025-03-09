import React, { ReactNode } from 'react';
import { useTheme } from './theme-provider';
import ThemeToggle from './ui/theme-toggle';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <header className={cn(
        "sticky top-0 z-40 w-full border-b bg-card text-card-foreground",
        "backdrop-blur-sm transition-all"
      )}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* App Logo/Icon */}
            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4.5 12.5l3-3a1 1 0 0 1 1.4 0L12 12" />
                <line x1="20" x2="6" y1="4" y2="18" />
                <path d="M12 12l3 3a1 1 0 0 0 1.4 0L20 11.5" />
              </svg>
            </div>
            <h1 className="text-xl font-bold">
              Calorie Counter
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      
      <footer className={cn(
        "border-t bg-card text-card-foreground",
        "py-6 md:py-0"
      )}>
        <div className="container mx-auto px-4 flex flex-col md:flex-row md:h-16 items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Calorie Counter App. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span className="size-2 rounded-full bg-green-500"></span>
            <span className="text-sm font-medium">All systems operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;