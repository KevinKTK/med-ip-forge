import { Button } from '@/components/ui/button';
import { Wallet, Users } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect, useBalance } from 'wagmi';
import { formatEther } from 'viem';

export const Navigation = () => {
  const location = useLocation();
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  
  // Get the native token balance (IP)
  const { data: balance } = useBalance({
    address: address,
  });

  const shortenAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const navItems = [
    { label: 'Dashboard', href: '/', active: location.pathname === '/' },
    { label: 'Artists', href: '/artists', active: location.pathname === '/artists' },
    { label: 'Staking', href: '/staking', active: location.pathname === '/staking' },
    { label: 'Patents', href: '/patents', active: location.pathname === '/patents' },
    { label: 'Portfolio', href: '/portfolio', active: location.pathname === '/portfolio' },
    { label: 'History', href: '/history', active: location.pathname === '/history' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold gradient-text">
              MEDICI
            </Link>
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`text-sm ${
                    item.active
                      ? 'text-cyber-violet'
                      : 'text-gray-400 hover:text-cyber-violet'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right mr-4 font-pixel">
              <p className="text-xs text-cyber-purple/70">$IP BALANCE</p>
              <p className="text-lg font-bold text-cyber-violet">
                {isConnected && balance ? `${Number(formatEther(balance.value)).toFixed(2)} $IP` : '0.00 $IP'}
              </p>
            </div>
            {isConnected ? (
              <div className="flex items-center gap-4">
                <p className="font-pixel text-xs text-cyber-violet hidden sm:block">
                  {shortenAddress(address!)}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="pixel-button"
                  onClick={() => disconnect()}
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="pixel-button"
                  onClick={() => openConnectModal && openConnectModal()}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  CONNECT
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="border-2 border-cyber-magenta text-cyber-magenta hover:bg-cyber-magenta hover:text-black"
                  onClick={() => openConnectModal && openConnectModal()}
                >
                  <Users className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
