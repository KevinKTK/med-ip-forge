
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { TrendingUp, Trophy, Medal, Award } from 'lucide-react';

interface ProjectLeaderboardProps {
  projects: Array<{
    id: number;
    name: string;
    ticker: string;
    votes: number;
    marketCap: string;
    completion: number;
  }>;
}

export const ProjectLeaderboard = ({ projects }: ProjectLeaderboardProps) => {
  const chartData = [
    { day: 'Mon', 'Quantum Art': 2400, 'Neural Music': 1800, 'Bio-Digital': 890 },
    { day: 'Tue', 'Quantum Art': 2600, 'Neural Music': 1900, 'Bio-Digital': 920 },
    { day: 'Wed', 'Quantum Art': 2800, 'Neural Music': 2100, 'Bio-Digital': 980 },
    { day: 'Thu', 'Quantum Art': 3200, 'Neural Music': 2300, 'Bio-Digital': 1100 },
    { day: 'Fri', 'Quantum Art': 3600, 'Neural Music': 2500, 'Bio-Digital': 1200 },
    { day: 'Sat', 'Quantum Art': 3800, 'Neural Music': 2700, 'Bio-Digital': 1350 },
    { day: 'Sun', 'Quantum Art': 4200, 'Neural Music': 2900, 'Bio-Digital': 1450 },
  ];

  const chartConfig = {
    'Quantum Art': { label: 'Quantum Art Generator', color: '#00FFFF' },
    'Neural Music': { label: 'Neural Music Composer', color: '#9D4EDD' },
    'Bio-Digital': { label: 'Bio-Digital Sculptures', color: '#FF6B6B' },
  };

  const sortedProjects = [...projects].sort((a, b) => b.votes - a.votes);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 1: return <Medal className="w-5 h-5 text-gray-300" />;
      case 2: return <Award className="w-5 h-5 text-orange-400" />;
      default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-400">#{index + 1}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h3 className="text-xl font-bold gradient-text mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Project Popularity Trends
        </h3>
        
        <ChartContainer config={chartConfig} className="h-80">
          <LineChart data={chartData}>
            <XAxis dataKey="day" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line 
              type="monotone" 
              dataKey="Quantum Art" 
              stroke="#00FFFF" 
              strokeWidth={3}
              dot={{ fill: '#00FFFF', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="Neural Music" 
              stroke="#9D4EDD" 
              strokeWidth={3}
              dot={{ fill: '#9D4EDD', strokeWidth: 2, r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="Bio-Digital" 
              stroke="#FF6B6B" 
              strokeWidth={3}
              dot={{ fill: '#FF6B6B', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ChartContainer>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold gradient-text mb-4">Top Projects by Votes</h3>
        <div className="space-y-4">
          {sortedProjects.map((project, index) => (
            <div key={project.id} className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
              <div className="flex items-center space-x-4">
                {getRankIcon(index)}
                <div>
                  <h4 className="font-semibold text-white">{project.name}</h4>
                  <p className="text-sm text-gray-400">{project.ticker}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-neon-blue">{project.votes.toLocaleString()} votes</p>
                <p className="text-sm text-gray-400">{project.completion}% funded</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
