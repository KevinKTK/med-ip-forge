
interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  positive?: boolean;
  icon?: React.ReactNode;
}

export const StatCard = ({ title, value, change, positive, icon }: StatCardProps) => {
  return (
    <div className="glass-card p-6 neon-border hover:neon-glow transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${positive ? 'text-neon-green' : 'text-red-400'}`}>
              {positive ? '+' : ''}{change}
            </p>
          )}
        </div>
        {icon && (
          <div className="text-neon-blue opacity-80">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};
