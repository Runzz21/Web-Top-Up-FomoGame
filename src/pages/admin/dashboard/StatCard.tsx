// fomogame/src/pages/admin/dashboard/StatCard.tsx
import { ArrowUpRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => {
  const changeColor = change?.startsWith('+') ? 'text-green-400' : 'text-red-400';

  return (
    <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-2xl p-6 group transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {change && (
            <div className={`flex items-center text-sm font-semibold ${changeColor}`}>
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>{change}</span>
            </div>
          )}
        </div>
        <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${color}1A`, color: color }}
        >
            {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;