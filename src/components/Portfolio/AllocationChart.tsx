
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

const allocationData = [
  { name: 'Copyrights', value: 65, amount: 58123 },
  { name: 'Patents', value: 35, amount: 31297 },
];

const COLORS = ['#00D4FF', '#B83DFF'];

const chartConfig = {
  copyrights: {
    label: 'Copyrights',
    color: '#00D4FF',
  },
  patents: {
    label: 'Patents', 
    color: '#B83DFF',
  },
};

export const AllocationChart = () => {
  return (
    <Card className="glass-card neon-border">
      <CardHeader>
        <CardTitle className="text-white">Asset Allocation</CardTitle>
        <CardDescription className="text-gray-400">
          Distribution of your IP portfolio
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <PieChart>
            <Pie
              data={allocationData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              strokeWidth={2}
            >
              {allocationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <ChartTooltip 
              content={<ChartTooltipContent />}
              formatter={(value, name, props) => [
                `${value}% ($${props.payload.amount.toLocaleString()})`,
                name
              ]}
            />
          </PieChart>
        </ChartContainer>
        
        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4">
          {allocationData.map((item, index) => (
            <div key={item.name} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-sm text-gray-300">
                {item.name} ({item.value}%)
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
