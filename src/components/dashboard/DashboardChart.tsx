
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

interface DataPoint {
  name: string;
  value: number;
}

interface DashboardChartProps {
  data: DataPoint[];
}

const DashboardChart = ({ data }: DashboardChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis dataKey="name" stroke="#888888" />
        <YAxis stroke="#888888" />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#8989DE"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DashboardChart;
