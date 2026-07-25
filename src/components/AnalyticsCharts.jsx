import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-navy-900 border border-navy-700 text-white p-3 rounded-xl shadow-xl">
        <p className="text-xs font-bold text-brand-400">{data.name}</p>
        <p className="text-sm font-extrabold text-white mt-0.5">{`Count: ${data.value}`}</p>
      </div>
    );
  }
  return null;
};

export const AnalyticsCharts = ({ statusDistribution = [], monthlyLeads = [] }) => {
  const COLORS = ['#2563EB', '#F59E0B', '#10B981'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8">
      {/* Monthly Leads Bar Chart (7 Cols) */}
      <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-navy-900 border border-gray-200/80 dark:border-navy-800 shadow-lg shadow-gray-200/40 dark:shadow-none">
        <div className="mb-4">
          <h3 className="text-base font-bold text-navy-800 dark:text-white">Monthly Lead Acquisition</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Total volume of customer inquiries over the last 6 months</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyLeads} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(37, 99, 235, 0.08)' }} />
              <Bar dataKey="leads" fill="#2563EB" radius={[6, 6, 0, 0]} name="Leads" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Lead Status Pie Chart (5 Cols) */}
      <div className="lg:col-span-5 p-6 rounded-2xl bg-white dark:bg-navy-900 border border-gray-200/80 dark:border-navy-800 shadow-lg shadow-gray-200/40 dark:shadow-none">
        <div className="mb-4">
          <h3 className="text-base font-bold text-navy-800 dark:text-white">Lead Status Distribution</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Breakdown of leads by current status stage</p>
        </div>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="45%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }) => `${name} (${value})`}
                labelLine={false}
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 ml-1">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
