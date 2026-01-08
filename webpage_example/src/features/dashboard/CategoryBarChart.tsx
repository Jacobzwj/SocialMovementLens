import React from 'react';
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
import { Movement } from '../../types';
import './Dashboard.css';

interface Props {
  movements: Movement[];
}

const CategoryBarChart: React.FC<Props> = ({ movements }) => {
  // Aggregate data by tag (category)
  const dataMap: Record<string, number> = {};
  
  movements.forEach(m => {
      m.tags.forEach(tag => {
          if (!dataMap[tag]) dataMap[tag] = 0;
          dataMap[tag]++;
      });
  });

  const data = Object.keys(dataMap)
    .map(tag => ({
      name: tag,
      count: dataMap[tag]
    }))
    .sort((a, b) => b.count - a.count); // Sort descending

  // Colors for different categories
  const COLORS = ['#8b5cf6', '#22d3ee', '#10b981', '#f59e0b', '#ec4899'];

  return (
    <div className="dashboard-card category-card">
      <div className="card-header-sm">
        <h3>Theme Spectrum</h3>
        <span className="subtitle">Category Distribution</span>
      </div>
      <div style={{ width: '100%', flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
            <XAxis type="number" hide />
            <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#a1a1aa" 
                tick={{fontSize: 11, fill: '#a1a1aa'}} 
                width={70}
                tickLine={false}
                axisLine={false}
            />
            <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}}
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333', borderRadius: '4px' }}
                itemStyle={{ color: '#e4e4e7' }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryBarChart;
