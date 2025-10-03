import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RatingChartProps {
  reviews: any[];
}

const RatingChart = ({ reviews }: RatingChartProps) => {
  const ratingCounts = [1, 2, 3, 4, 5].map((rating) => ({
    rating: `${rating} ★`,
    count: reviews.filter((r) => r.rating === rating).length,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={ratingCounts}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="rating" className="text-xs" />
        <YAxis className="text-xs" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
        />
        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RatingChart;
