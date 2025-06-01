
interface ActivityItem {
  user: string;
  action: string;
  asset: string;
  amount?: string;
  time: string;
}

const mockActivity: ActivityItem[] = [
  {
    user: "0x1234...5678",
    action: "Staked",
    asset: "Beatles Discography",
    amount: "1,500 MEDICI",
    time: "2m ago"
  },
  {
    user: "0xabcd...efgh",
    action: "Claimed rewards from",
    asset: "Tesla Patent #123",
    amount: "45.2 MEDICI",
    time: "5m ago"
  },
  {
    user: "0x9876...5432",
    action: "Listed",
    asset: "Novel IP Rights",
    time: "12m ago"
  },
  {
    user: "0x5555...7777",
    action: "Unstaked from",
    asset: "Netflix Originals",
    amount: "800 MEDICI",
    time: "18m ago"
  }
];

export const ActivityFeed = () => {
  return (
    <div className="glass-card p-6 neon-border">
      <h3 className="text-lg font-semibold text-white mb-4">Live Activity</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {mockActivity.map((activity, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
            <div className="flex-1">
              <p className="text-sm text-white">
                <span className="text-neon-blue">{activity.user}</span>{' '}
                <span className="text-gray-300">{activity.action}</span>{' '}
                <span className="text-neon-purple">{activity.asset}</span>
                {activity.amount && (
                  <span className="text-neon-green ml-2">{activity.amount}</span>
                )}
              </p>
            </div>
            <span className="text-xs text-gray-400 ml-4">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
