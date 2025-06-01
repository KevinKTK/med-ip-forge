
import { Button } from '@/components/ui/button';
import { wallet, users, history, settings } from 'lucide-react';

export const Navigation = () => {
  const navItems = [
    { label: 'Dashboard', href: '/', active: true },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Staking', href: '/staking' },
    { label: 'History', href: '/history' },
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
              <wallet className="w-4 h-4 mr-2" />
              Connect Wallet
            </Button>
            <Button variant="ghost" size="sm">
              <users className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
