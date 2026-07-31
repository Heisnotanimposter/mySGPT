import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel" style={{ 
        padding: '12px 16px', 
        border: '1px solid var(--border-glass)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        background: 'rgba(15, 23, 42, 0.9)'
      }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '4px', textTransform: 'uppercase' }}>Year {label}</p>
        <p style={{ color: '#fff', fontSize: '1.2rem', fontWeight: '700' }}>
          {payload[0].value.toFixed(1)}% <span style={{ fontSize: '0.8rem', fontWeight: '400', opacity: 0.8 }}>Unemployment</span>
        </p>
      </div>
    );
  }
  return null;
};

const HistoryChart = ({ countryName, data, loading }) => {
  if (loading) {
    return (
      <div className="glass-panel" style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
        <div className="animate-pulse" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '4px solid var(--color-primary)', borderTopColor: 'transparent' }}></div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Analyzing Historical Trends...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="glass-panel" style={{ minHeight: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px', flexDirection: 'column', gap: '20px' }}>
        <div>
          <p style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Select a country on the map to visualize historical informatics.</p>
          <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>Or select from the most active OECD markets:</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['USA', 'GBR', 'FRA', 'DEU', 'CAN', 'JPN', 'KOR'].map(iso => (
            <button 
              key={iso}
              onClick={() => {
                // This will trigger the global selection via a helper if we expose it
                // For now, it's a visual cue, but let's make it work by passing onSelect to the chart
                document.dispatchEvent(new CustomEvent('selectCountry', { detail: iso }));
              }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-glass)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                color: '#fff',
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {iso}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '24px', height: '100%', minHeight: '350px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--color-primary)' }}>|</span> {countryName} <span style={{ opacity: 0.5, fontWeight: 400 }}>History</span>
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>10-Year Unemployment Trend Analysis</p>
        </div>
        <div style={{ textAlign: 'right' }}>
           <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Source: World Bank</span>
        </div>
      </div>

      <div style={{ flex: 1, width: '100%', minHeight: '220px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="year" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              tickFormatter={(val) => `${val}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1 }} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="var(--color-primary)" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div style={{ marginTop: '16px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
          Interactive Insight: Hover over data points to see precise annual shifts. This time-series data provides context for current real-time market signals.
        </p>
      </div>
    </div>
  );
};

export default HistoryChart;
