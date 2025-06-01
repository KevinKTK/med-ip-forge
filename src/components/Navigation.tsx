
import { Button } from '@/components/ui/button';
import { Wallet, Users, History, Settings } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { label: 'Dashboard', href: '/', active: location.pathname === '/' },
    { label: 'Portfolio', href: '/portfolio', active: location.pathname === '/portfolio' },
    { label: 'Staking', href: '/staking', active: location.pathname === '/staking' },
    { label: 'History', href: '/history', active: location.pathname === '/history' },
  ];

  return (
    <nav className="glass-card mx-4 mt-4 mb-6">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-neon-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold gradient-text">Medici</span>
            </div>
            
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    item.active
                      ? 'text-neon-blue border-b-2 border-neon-blue'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="neon-border">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
            <Button variant="ghost" size="sm">
              <Users className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
