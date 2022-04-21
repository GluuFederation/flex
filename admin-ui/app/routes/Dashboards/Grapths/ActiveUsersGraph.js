import React from 'react';
import {
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { useTranslation } from 'react-i18next';

function ActiveUsersGraph({ data }) {
  const { t } = useTranslation();

  return (
    <ResponsiveContainer className="mau" width="98%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <XAxis dataKey="month" />
        <YAxis />
        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
        <Line
          name={t('fields.monthly_active_users')}
          type="monotone"
          dataKey="mau"
          stroke="#8884d8"
        />
        <Tooltip />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default ActiveUsersGraph;
