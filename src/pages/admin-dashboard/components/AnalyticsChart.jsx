import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AnalyticsChart = ({ type, data, title, description }) => {
  const colors = {
    primary: '#C17817',
    secondary: '#2D5016',
    accent: '#E8B547',
    success: '#4A7C59',
    warning: '#D4941E',
    error: '#B85450'
  };

  const pieColors = [colors?.primary, colors?.secondary, colors?.accent, colors?.success, colors?.warning, colors?.error];

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(193, 120, 23, 0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="#6B5B4F" 
                fontSize={12}
                tick={{ fill: '#6B5B4F' }}
              />
              <YAxis 
                stroke="#6B5B4F" 
                fontSize={12}
                tick={{ fill: '#6B5B4F' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#F7F3ED',
                  border: '1px solid rgba(193, 120, 23, 0.2)',
                  borderRadius: '8px',
                  color: '#2C1810'
                }}
              />
              <Bar dataKey="value" fill={colors?.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(193, 120, 23, 0.1)" />
              <XAxis 
                dataKey="name" 
                stroke="#6B5B4F" 
                fontSize={12}
                tick={{ fill: '#6B5B4F' }}
              />
              <YAxis 
                stroke="#6B5B4F" 
                fontSize={12}
                tick={{ fill: '#6B5B4F' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#F7F3ED',
                  border: '1px solid rgba(193, 120, 23, 0.2)',
                  borderRadius: '8px',
                  color: '#2C1810'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={colors?.primary} 
                strokeWidth={3}
                dot={{ fill: colors?.primary, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: colors?.accent }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
              >
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors?.[index % pieColors?.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#F7F3ED',
                  border: '1px solid rgba(193, 120, 23, 0.2)',
                  borderRadius: '8px',
                  color: '#2C1810'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-4">
        <h3 className="font-heading font-semibold text-lg text-card-foreground mb-1">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="h-64 w-full" aria-label={`${title} Chart`}>
        {renderChart()}
      </div>
    </div>
  );
};

export default AnalyticsChart;