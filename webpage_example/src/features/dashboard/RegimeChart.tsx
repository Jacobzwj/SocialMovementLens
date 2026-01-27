import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Movement } from '../../types';
import './Dashboard.css';

interface Props {
  movements: Movement[];
}

const RegimeChart: React.FC<Props> = ({ movements }) => {
  // Aggregate data by regime
  const dataMap: Record<string, number> = {};
  
  movements.forEach(m => {
      // Normalize value, handle empty/unknown
      let r = m.regime;
      if (!r || r === 'nan' || r === 'Unknown') r = 'Unspecified';
      // Capitalize first letter
      r = r.charAt(0).toUpperCase() + r.slice(1);
      
      if (!dataMap[r]) dataMap[r] = 0;
      dataMap[r]++;
  });

  const data = Object.keys(dataMap)
    .map(key => ({
      name: key,
      value: dataMap[key]
    }))
    .sort((a, b) => b.value - a.value);

  // Cyberpunk colors for regimes
  // Democracy: Blue/Green, Authoritarian: Red/Orange, Semi: Yellow/Purple
  const getColor = (name: string) => {
      const lower = name.toLowerCase();
      if (lower.includes('democracy') && !lower.includes('semi')) return '#10b981'; // Green
      if (lower.includes('authoritarian') || lower.includes('autocracy')) return '#ef4444'; // Red
      if (lower.includes('semi') || lower.includes('hybrid')) return '#f59e0b'; // Amber
      return '#6366f1'; // Default Indigo
  };

  return (
    <div className="dashboard-card regime-card">
      <div className="card-header-sm">
        <h3>Political Regime Context</h3>
        <span className="subtitle">Regime types where movements occurred</span>
      </div>
      <div style={{ width: '100%', flex: 1, minHeight: 0, position: 'relative' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={60}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
              ))}
            </Pie>
            <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333', borderRadius: '4px' }}
                itemStyle={{ color: '#e4e4e7' }}
                formatter={(value: number) => [`${value} Movements`, 'Count']}
            />
            <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '10px', color: '#a1a1aa' }}
            />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text displaying total */}
        <div style={{
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -60%)', // Shift up slightly to center in donut (accounting for legend)
            textAlign: 'center',
            pointerEvents: 'none'
        }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fff' }}>{movements.length}</div>
            <div style={{ fontSize: '0.6rem', color: '#666', textTransform: 'uppercase' }}>Total</div>
        </div>
      </div>
    </div>
  );
};

export default RegimeChart;
