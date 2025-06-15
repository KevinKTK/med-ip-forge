
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowRight, Users, BarChart3, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Index = () => {
  const [typedText, setTypedText] = useState('');
  const [showContent, setShowContent] = useState(false);
  
  const fullText = 'Fractional IP Rights Marketplace';
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        setTimeout(() => setShowContent(true), 500);
      }
    }, 80);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <Layout>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyber-purple opacity-20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
        
        {/* Geometric Shapes */}
        <div className="absolute top-20 left-10 w-16 h-16 border border-cyber-violet/20 rotate-45 animate-slow-spin" />
        <div className="absolute bottom-32 right-16 w-8 h-8 bg-cyber-purple/10 animate-pulse" />
        <div className="absolute top-1/3 right-20 w-12 h-12 border border-cyber-cyan/20 rounded-full animate-slow-spin" />
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center relative z-10">
        {/* Hero Section */}
        <div className="text-center space-y-8 max-w-4xl mx-auto px-4">
          {/* Enhanced Medici Logo */}
          <div className="relative inline-block">
            {/* Orbital Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border border-cyber-purple/30 rounded-full animate-orbital-slow" />
              <div className="absolute w-48 h-48 border border-cyber-violet/20 rounded-full animate-orbital-medium" />
              <div className="absolute w-64 h-64 border border-cyber-cyan/10 rounded-full animate-orbital-fast" />
            </div>
            
            {/* Main Logo */}
            <div className="relative z-10">
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-6 relative">
                <div className="molecular-icon-large text-cyber-purple animate-logo-pulse relative z-10">
                  {/* Enhanced molecular structure */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 bg-current rounded-full animate-pulse" />
                    {/* Electron orbits */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 bg-current rounded-full animate-electron-orbit"
                        style={{
                          animationDelay: `${i * 0.3}s`,
                          transformOrigin: '0 0'
                        }}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Pulsing Glow Effect */}
                <div className="absolute inset-0 bg-cyber-purple/20 rounded-full animate-glow-pulse blur-xl" />
              </div>
              
              {/* Enhanced Glitch Text */}
              <h1 className="text-6xl md:text-8xl font-retro mb-4 relative">
                <span className="glitch-text-enhanced gradient-text animate-glitch-intense" data-text="MEDICI">
                  MEDICI
                </span>
              </h1>
            </div>
          </div>

          {/* Typing Animation */}
          <div className="h-16 flex items-center justify-center">
            <p className="text-xl md:text-2xl text-cyber-violet font-pixel">
              {typedText}
              <span className="animate-blink">|</span>
            </p>
          </div>

          {/* Animated Description */}
          <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Stake tokens in premium intellectual property assets. Trade copyrights and patents with cutting-edge blockchain technology.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/artists">
                <Button className="pixel-button px-8 py-4 text-lg group">
                  EXPLORE ASSETS
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/staking">
                <Button variant="outline" className="pixel-outline px-8 py-4 text-lg">
                  START STAKING
                </Button>
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
              {[
                { icon: <BarChart3 className="w-8 h-8" />, value: '$47.2M', label: 'Total Market Cap' },
                { icon: <Users className="w-8 h-8" />, value: '8,542', label: 'Active Stakers' },
                { icon: <Zap className="w-8 h-8" />, value: '2.2M', label: 'IP Assets' }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="glass-card p-6 text-center transform hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="text-cyber-purple mb-3 flex justify-center">{stat.icon}</div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm font-pixel">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="mt-16 p-8 glass-card max-w-2xl mx-auto">
              <h3 className="text-2xl font-retro text-cyber-purple mb-4">Ready to Start?</h3>
              <p className="text-gray-300 mb-6">
                Join thousands of creators and investors in the future of intellectual property.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/portfolio">
                  <Button className="pixel-button">
                    VIEW PORTFOLIO
                  </Button>
                </Link>
                <Link to="/patents">
                  <Button variant="outline" className="pixel-outline">
                    BROWSE PATENTS
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
