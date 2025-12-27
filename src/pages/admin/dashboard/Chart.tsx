// fomogame/src/pages/admin/dashboard/Chart.tsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { useMemo } from 'react';

// --- FAKE DATA GENERATION ---

// Generate fake revenue data for the last 30 days
const generateLast30DaysRevenue = () => {
    const data = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const day = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
        // Revenue between 20jt and 60jt
        const revenue = Math.floor(Math.random() * (60000000 - 20000000 + 1)) + 20000000;
        data.push({ name: day, Pendapatan: revenue });
    }
    return data;
};

// Top 5 games data
const topGamesData = [
  { name: 'Mobile Legends', value: 450000000 },
  { name: 'PUBG Mobile', value: 320000000 },
  { name: 'Genshin Impact', value: 280000000 },
  { name: 'Free Fire', value: 210000000 },
  { name: 'Valorant', value: 180000000 },
];

const COLORS = ['#e879f9', '#c084fc', '#818cf8', '#60a5fa', '#f472b6'];

// --- CUSTOM COMPONENTS ---

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/80 backdrop-blur-lg border border-gray-700 p-4 rounded-lg shadow-xl">
        <p className="label text-white font-bold">{`${label}`}</p>
        <p className="intro text-pink-400">{`Pendapatan : Rp${new Intl.NumberFormat('id-ID').format(payload[0].value)}`}</p>
      </div>
    );
  }
  return null;
};


// --- CHART COMPONENTS ---

export const RevenueChart = () => {
    const revenueData = useMemo(() => generateLast30DaysRevenue(), []);
    
    return (
        <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={revenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5, }}
                >
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                    <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#9ca3af" tickFormatter={(value) => `Rp${Number(value) / 1000000} Jt`} tick={{ fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: '#fff' }}/>
                    <Line
                        type="monotone"
                        dataKey="Pendapatan"
                        stroke="#f472b6"
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#f472b6' }}
                        activeDot={{ r: 8, fill: '#f472b6', stroke: '#fff', strokeWidth: 2 }}
                        
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export const TopGamesChart = () => {
  return (
    <div className="h-96 w-full">
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={topGamesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    legendType="circle"
                >
                    {topGamesData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value, entry) => <span className="text-white">{value}</span>}/>
            </PieChart>
        </ResponsiveContainer>
    </div>
  );
}