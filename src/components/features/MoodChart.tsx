"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MoodLog } from '@/types';
import { formatDate } from '@/lib/utils';

interface MoodChartProps {
  moods: MoodLog[];
}

export function MoodChart({ moods }: MoodChartProps) {
  const data = [...moods]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map(m => ({
      date: formatDate(m.created_at),
      score: m.score,
    }));

  return (
    <div className="w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 16, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6B7280' }} />
          <YAxis domain={[1, 10]} tick={{ fontSize: 11, fill: '#6B7280' }} />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #F3F4F6',
              boxShadow: '0 4px 16px rgba(44,74,110,0.12)'
            }}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#1A9E7A"
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#1A9E7A' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
