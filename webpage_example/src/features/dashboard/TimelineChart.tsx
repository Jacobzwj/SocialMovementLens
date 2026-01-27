import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Movement } from '../../types';
import './Dashboard.css';

interface Props {
  movements: Movement[];
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // Access the full data object passed to chart
    return (
      <div className="custom-tooltip" style={{ backgroundColor: '#18181b', border: '1px solid #333', padding: '10px', borderRadius: '4px' }}>
        <p style={{ color: '#e4e4e7', fontWeight: 'bold', margin: '0 0 5px 0' }}>{label}: {payload[0].value} Movements</p>
        <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
          {data.movements.slice(0, 5).map((m: string, i: number) => (
            <div key={i}>• {m}</div>
          ))}
          {data.movements.length > 5 && <div>...and {data.movements.length - 5} more</div>}
        </div>
      </div>
    );
  }
  return null;
};

const TimelineChart: React.FC<Props> = ({ movements }) => {
  // Aggregate data by year
  const dataMap = movements.reduce((acc, curr) => {
    let year = curr.year;
    if (year.length > 4) year = year.substring(0, 4);
    
    if (!acc[year]) acc[year] = { count: 0, movements: [] };
    acc[year].count++;
    acc[year].movements.push(curr.name);
    return acc;
  }, {} as Record<string, { count: number, movements: string[] }>);

  const data = Object.keys(dataMap)
    .sort()
    .map(year => ({
      year,
      count: dataMap[year].count,
      movements: dataMap[year].movements
    }));

  return (
    <div className="dashboard-card timeline-card">
      <div className="card-header-sm">
        <h3>Movement Timeline</h3>
        <span className="subtitle">Number of movements started per year</span>
      </div>
      {/* Changed height to 100% and flex-grow to fill the card */}
      <div style={{ width: '100%', flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 0, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/> {/* Reduced top opacity */}
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/> {/* Completely transparent at bottom */}
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
                dataKey="year" 
                stroke="#666" 
                tick={{fill: '#666', fontSize: 10, angle: -45, textAnchor: 'end', dy: 5}} 
                tickLine={false}
                axisLine={false}
                interval={0}
                padding={{ left: 10, right: 10 }} // Add slight padding to prevent edge clipping
                height={40} // Increase height to accommodate rotated text
            />
            <YAxis 
                stroke="#666" 
                tick={{fill: '#666', fontSize: 10}} 
                tickLine={false}
                axisLine={false}
                width={30}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#8b5cf6', strokeWidth: 1 }} />
            <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#8b5cf6" 
                fillOpacity={1} 
                fill="url(#colorCount)" 
                strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TimelineChart;
