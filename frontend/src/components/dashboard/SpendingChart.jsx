// src/components/dashboard/SpendingChart.jsx

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function SpendingChart({ data }) {
  // Formatter for the Y-axis to show currency
  const formatCurrency = (value) => `₹${value.toLocaleString('en-IN')}`;

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 20,
            left: 30, // Increased left margin for currency values
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
          <XAxis dataKey="year" />
          <YAxis tickFormatter={formatCurrency} />
          <Tooltip 
            formatter={(value) => [formatCurrency(value), 'Spending']} 
            cursor={{ fill: 'rgba(128, 128, 128, 0.1)' }}
          />
          <Legend />
          <Bar dataKey="spending" fill="#3b82f6" name="Total Spending" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}