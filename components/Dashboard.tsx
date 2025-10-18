
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Card from './Card';

const trafficData = [
  { name: 'Jan', uv: 4000, pv: 2400 },
  { name: 'Feb', uv: 3000, pv: 1398 },
  { name: 'Mar', uv: 2000, pv: 9800 },
  { name: 'Apr', uv: 2780, pv: 3908 },
  { name: 'May', uv: 1890, pv: 4800 },
  { name: 'Jun', uv: 2390, pv: 3800 },
  { name: 'Jul', uv: 3490, pv: 4300 },
];

const keywordData = [
    { name: 'Top 3', count: 15 },
    { name: '4-10', count: 45 },
    { name: '11-20', count: 80 },
    { name: '21-50', count: 120 },
    { name: '51-100', count: 200 },
]

const StatCard: React.FC<{ title: string; value: string; change: string; isPositive: boolean }> = ({ title, value, change, isPositive }) => (
    <div className="bg-surface p-6 rounded-xl shadow-md">
        <p className="text-sm font-medium text-text-secondary">{title}</p>
        <p className="text-3xl font-bold text-text-primary mt-2">{value}</p>
        <p className={`text-sm mt-1 flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17l-5-5m0 0l5-5m-5 5h12" /></svg>
            )}
            {change}
        </p>
    </div>
);


const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Organic Traffic" value="2,345" change="+12.5%" isPositive={true} />
            <StatCard title="Keyword Rankings" value="1,280" change="-2.1%" isPositive={false} />
            <StatCard title="Domain Authority" value="45" change="+2" isPositive={true} />
            <StatCard title="Backlinks" value="12,890" change="+250" isPositive={true} />
        </div>

        <Card title="Organic Traffic Overview (Last 6 Months)">
            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="pv" stroke="#4f46e5" activeDot={{ r: 8 }} name="Page Views" />
                    <Line type="monotone" dataKey="uv" stroke="#10b981" name="Unique Visitors"/>
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
      
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card title="Keyword Positions">
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={keywordData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#4f46e5" name="Number of Keywords" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
            <Card title="Recent Site Audit">
                <div className="flex flex-col items-center justify-center h-80">
                    <p className="text-6xl font-bold text-green-500">92/100</p>
                    <p className="text-text-secondary mt-2">Overall Site Health</p>
                    <button className="mt-6 bg-secondary text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200">
                        View Full Report
                    </button>
                </div>
            </Card>
        </div>
    </div>
  );
};

export default Dashboard;
