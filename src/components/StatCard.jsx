import React from 'react';
import { Users, UserPlus, PhoneCall, CheckCircle2 } from 'lucide-react';

export const StatCard = ({ title, value, icon: Icon, trend, colorClass, bgClass, badgeText, stats }) => {
  // If stats object is passed (e.g. <StatCard stats={stats.summary} />), render the 4 top metric cards grid!
  if (stats) {
    const cardsData = [
      {
        title: 'Total Leads',
        value: stats.totalLeads ?? 0,
        icon: Users,
        colorClass: 'text-brand-600 dark:text-brand-400',
        bgClass: 'bg-brand-50 dark:bg-brand-950',
        badgeText: 'All Inquiries',
        trend: '↑ +12% this month',
      },
      {
        title: 'New Leads',
        value: stats.newLeads ?? 0,
        icon: UserPlus,
        colorClass: 'text-blue-600 dark:text-blue-400',
        bgClass: 'bg-blue-50 dark:bg-blue-950',
        badgeText: 'Requires Action',
        trend: 'Action needed',
      },
      {
        title: 'Contacted Leads',
        value: stats.contactedLeads ?? 0,
        icon: PhoneCall,
        colorClass: 'text-amber-600 dark:text-amber-400',
        bgClass: 'bg-amber-50 dark:bg-amber-950',
        badgeText: 'In Outreach',
        trend: 'Active follow-up',
      },
      {
        title: 'Closed Leads',
        value: stats.closedLeads ?? 0,
        icon: CheckCircle2,
        colorClass: 'text-emerald-600 dark:text-emerald-400',
        bgClass: 'bg-emerald-50 dark:bg-emerald-950',
        badgeText: 'Converted',
        trend: 'Successfully closed',
      },
    ];

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
        {cardsData.map((card, idx) => {
          const CardIcon = card.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-gray-200/80 dark:border-navy-800 shadow-lg shadow-gray-200/40 dark:shadow-none hover:border-brand-500/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`w-11 h-11 rounded-xl ${card.bgClass} ${card.colorClass} flex items-center justify-center shadow-sm`}>
                  <CardIcon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-3xl font-extrabold text-navy-800 dark:text-white tracking-tight">
                  {card.value}
                </span>
                {card.badgeText && (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300">
                    {card.badgeText}
                  </span>
                )}
              </div>
              {card.trend && (
                <div className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                  <span>{card.trend}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Single card fallback safely checking Icon
  const SafeIcon = Icon || Users;

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-navy-900 border border-gray-200/80 dark:border-navy-800 shadow-lg shadow-gray-200/40 dark:shadow-none hover:border-brand-500/40 transition-all duration-300">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title || 'Metric'}
        </span>
        <div className={`w-11 h-11 rounded-xl ${bgClass || 'bg-brand-50'} ${colorClass || 'text-brand-600'} flex items-center justify-center shadow-sm`}>
          <SafeIcon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-3xl font-extrabold text-navy-800 dark:text-white tracking-tight">
          {value ?? 0}
        </span>
        {badgeText && (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-gray-300">
            {badgeText}
          </span>
        )}
      </div>
      {trend && (
        <div className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
          <span>{trend}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
