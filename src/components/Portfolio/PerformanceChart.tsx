
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const performanceData = [
  { date: '2024-01', value: 45000 },
  { date: '2024-02', value: 52000 },
  { date: '2024-03', value: 48000 },
  { date: '2024-04', value: 61000 },
  { date: '2024-05', value: 67000 },
  { date: '2024-06', value: 89420 },
];

const chartConfig = {
  value: {
    label: 'Portfolio Value',
    color: '#00D4FF',
  },
};

export const PerformanceChart = () => {
  return (
    <Card className="glass-card neon-border">
      <CardHeader>
        <CardTitle className="text-white">Portfolio Performance</CardTitle>
        <CardDescription className="text-gray-400">
          Your portfolio value over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={performanceData}>
            <defs>
              <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickFormatter={(value) => `$IP ${(value / 1000).toFixed(0)}k`}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value) => [`$IP ${value.toLocaleString()}`, 'Portfolio Value']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00D4FF"
              strokeWidth={2}
              fill="url(#fillValue)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
