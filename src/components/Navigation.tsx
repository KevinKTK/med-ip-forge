
import { Button } from '@/components/ui/button';
import { Wallet, Users, History, Settings } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { label: 'Dashboard', href: '/', active: location.pathname === '/' },
    { label: 'Artists', href: '/artists', active: location.pathname === '/artists' },
    { label: 'Patents', href: '/patents', active: location.pathname === '/patents' },
    { label: 'Portfolio', href: '/portfolio', active: location.pathname === '/portfolio' },
    { label: 'Staking', href: '/staking', active: location.pathname === '/staking' },
    { label: 'History', href: '/history', active: location.pathname === '/history' },
  ];

  return (
    <nav className="pixel-card mx-4 mt-4 mb-6 relative">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="molecular-icon text-cyber-purple animate-pixel-pulse">
              </div>
              <span className="text-2xl font-retro neon-text glitch-text" data-text="MEDICI">MEDICI</span>
            </div>
            
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`px-4 py-2 font-retro text-xs uppercase transition-all ${
                    item.active
                      ? 'bg-cyber-purple text-white border-2 border-cyber-purple'
                      : 'text-cyber-purple hover:bg-cyber-purple/10 border-2 border-transparent hover:border-cyber-purple'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right mr-4 font-pixel">
              <p className="text-xs text-cyber-purple/70">$IP BALANCE</p>
              <p className="text-lg font-bold neon-text">12,450 $IP</p>
            </div>
            <Button variant="outline" size="sm" className="pixel-button">
              <Wallet className="w-4 h-4 mr-2" />
              CONNECT
            </Button>
            <Button variant="ghost" size="sm" className="border-2 border-cyber-magenta text-cyber-magenta hover:bg-cyber-magenta hover:text-black">
              <Users className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
