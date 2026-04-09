import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, FileText, Search, CheckCircle, AlertCircle } from 'lucide-react';

const Admin = () => {
    const [data, setData] = useState({ stats: { totalUsers: 0, totalPosts: 0, lostItems: 0, foundItems: 0 }, allPosts: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/items/admin/dashboard', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setData(res.data);
                setLoading(false);
            } catch (err) {
                console.error("Dashboard error:", err);
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = [
        { title: 'Total Users', value: data.stats.totalUsers, icon: <Users size={24}/>, color: 'from-blue-600 to-blue-400' },
        { title: 'Total Reports', value: data.stats.totalPosts, icon: <FileText size={24}/>, color: 'from-purple-600 to-purple-400' },
        { title: 'Lost Items', value: data.stats.lostItems, icon: <Search size={24}/>, color: 'from-red-600 to-red-400' },
        { title: 'Found Items', value: data.stats.foundItems, icon: <CheckCircle size={24}/>, color: 'from-green-600 to-green-400' },
    ];

    if (loading) return <div className="flex justify-center items-center h-screen bg-[#0f0c29] text-white text-xl animate-pulse">Initializing Secure Admin Portal...</div>;

    return (
        <div className="p-4 md:p-8 bg-[#0f0c29] min-h-screen text-white font-sans">
            <header className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">Returnify Dashboard</h1>
                    <p className="text-gray-400 mt-1">Real-time system monitoring & oversight</p>
                </div>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {statCards.map((card, i) => (
                    <div key={i} className={`bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-pink-500/50 transition-all duration-300 shadow-xl`}>
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color} w-fit mb-4 shadow-lg shadow-black/20`}>
                            {card.icon}
                        </div>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{card.title}</p>
                        <h2 className="text-4xl font-bold mt-2">{card.value}</h2>
                    </div>
                ))}
            </div>

            <div className="bg-slate-800/40 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-2xl overflow-hidden">
                <div className="flex items-center gap-2 mb-6">
                    <AlertCircle className="text-pink-500" size={20} />
                    <h3 className="text-xl font-bold">Recent Incident Reports</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/10 text-gray-400 text-sm">
                                <th className="py-4 px-4 font-semibold uppercase">Item</th>
                                <th className="font-semibold uppercase">Type</th>
                                <th className="font-semibold uppercase">Reporter</th>
                                <th className="font-semibold uppercase">City</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data.allPosts.length > 0 ? data.allPosts.map((post) => (
                                <tr key={post._id} className="hover:bg-white/5 transition-colors group">
                                    <td className="py-4 px-4 font-medium">{post.title}</td>
                                    <td>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${post.type === 'Lost' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                                            {post.type}
                                        </span>
                                    </td>
                                    <td className="text-gray-300">{post.user?.name || 'Anonymous'}</td>
                                    <td className="text-gray-400 italic">{post.city}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="py-10 text-center text-gray-500 italic">No reports found in the database.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Admin;