import React, { useState, useRef } from 'react';
import { Card } from '../ui/Card';
import { Device } from '../../types/device';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

type AnalyticsPeriod = 'monthly' | 'yearly';

interface WarrantyAnalyticsProps {
  devices: Device[];
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateStr: string) => {
  if (dateStr.includes('-')) {
    const [year, month] = dateStr.split('-');
    return new Date(parseInt(year), parseInt(month) - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  }
  return dateStr;
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e293b] p-3 shadow-lg rounded-lg">
        <p className="text-sm text-gray-300 mb-1">{formatDate(label)}</p>
        <p className="text-base font-semibold text-white">
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    );
  }
  return null;
};

export function WarrantyAnalytics({ devices }: WarrantyAnalyticsProps) {
  const [period, setPeriod] = useState<AnalyticsPeriod>('monthly');
  const [isExpanded, setIsExpanded] = useState(false);
  const scrollTargetRef = useRef<HTMLDivElement>(null);

  const handleExpand = () => {
    const newIsExpanded = !isExpanded;
    setIsExpanded(newIsExpanded);

    if (newIsExpanded) {
      setTimeout(() => {
        if (scrollTargetRef.current) {
          const fixedHeaderHeight = 70;
          const elementRect = scrollTargetRef.current.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const elementTopRelativeToDocument = elementRect.top + scrollTop;
          const targetScrollPosition = elementTopRelativeToDocument - fixedHeaderHeight;

          window.scrollTo({
            top: targetScrollPosition,
            behavior: 'smooth'
          });
        }
      }, 500);
    }
  };

  const getBarColor = (index: number) => {
    const colors = {
      light: ['#3B82F6', '#10B981', '#F59E0B'],
      dark: ['#60A5FA', '#34D399', '#FBBF24']
    };
    const themeColors = document.documentElement.classList.contains('dark') ? colors.dark : colors.light;
    return themeColors[index % themeColors.length];
  };

  const calculateExpenses = () => {
    const expenses = devices.reduce((acc, device) => {
      const purchaseDate = new Date(device.purchaseDate);
      const key = period === 'monthly' 
        ? `${purchaseDate.getFullYear()}-${purchaseDate.getMonth() + 1}`
        : purchaseDate.getFullYear().toString();

        const price = Number(device.purchasePrice ?? 0);
        acc[key] = (acc[key] || 0) + (!isNaN(price) ? price : 0);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(expenses)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .map(([date, amount], index) => ({
        date,
        amount,
        fill: getBarColor(index)
      }));
  };

  const expenseData = calculateExpenses();
  const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6">
      <div 
        className="flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded-lg transition-colors duration-500"
        onClick={handleExpand}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          )}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Warranty Expenses
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Expenses</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          {isExpanded && (
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as AnalyticsPeriod)}
              className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <option value="monthly">Monthly View</option>
              <option value="yearly">Yearly View</option>
            </select>
          )}
        </div>
      </div>

      {isExpanded && (
        <div ref={scrollTargetRef}>
          <Card 
            className="p-6 bg-white dark:bg-gray-800 transition-all duration-500"
            onClick={() => {}}
            clickable={false}
          >
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={expenseData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" className="dark:opacity-10" />
                  <XAxis 
                    dataKey="date"
                    tickFormatter={formatDate}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    tick={{ fill: '#4B5563', fontSize: 13, fontWeight: 500 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={{ stroke: '#E5E7EB' }}
                  />
                  <YAxis 
                    tickFormatter={formatCurrency}
                    tick={{ fill: '#4B5563', fontSize: 13, fontWeight: 500 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={{ stroke: '#E5E7EB' }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
                  <Bar
                    dataKey="amount"
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                    name="Expense"
                    fillOpacity={0.9}
                  >
                    {expenseData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getBarColor(index)}
                        className="transition-all duration-300 hover:brightness-110"
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
