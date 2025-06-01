
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Users, DollarSign, CheckCircle, MessageCircle } from 'lucide-react';

interface Artist {
  id: number;
  name: string;
  avatar: string;
  genre: string;
  verified: boolean;
  totalRaised: number;
  completedProjects: number;
  followers: number;
  rating: number;
  currentProject: string;
  bio: string;
}

interface ArtistCardProps {
  artist: Artist;
}

export const ArtistCard = ({ artist }: ArtistCardProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card className="glass-card hover:neon-glow transition-all duration-300 cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={artist.avatar} alt={artist.name} />
            <AvatarFallback>{artist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-white">{artist.name}</h3>
              {artist.verified && (
                <CheckCircle className="w-4 h-4 text-neon-blue" />
              )}
            </div>
            <Badge variant="outline" className="mb-2 neon-border">
              {artist.genre}
            </Badge>
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-300">{artist.rating}</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-gray-400 line-clamp-2">{artist.bio}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-lg font-bold text-neon-blue">${formatNumber(artist.totalRaised)}</p>
            <p className="text-xs text-gray-400">Total Raised</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">{artist.completedProjects}</p>
            <p className="text-xs text-gray-400">Projects</p>
          </div>
          <div>
            <p className="text-lg font-bold text-white">{formatNumber(artist.followers)}</p>
            <p className="text-xs text-gray-400">Followers</p>
          </div>
        </div>
        
        <div className="p-3 bg-background/30 rounded-lg">
          <p className="text-sm text-gray-400">Current Project</p>
          <p className="text-white font-medium">{artist.currentProject}</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 neon-border">
            <Users className="w-4 h-4 mr-2" />
            Follow
          </Button>
          <Button variant="outline" className="neon-border">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
