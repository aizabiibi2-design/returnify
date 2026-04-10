import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, FileText, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({ 
        stats: { totalUsers: 0, totalPosts: 0, lostItems: 0, foundItems: 0 }, 
        allPosts: [] 
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('token');
            
            // Check agar token hi nahi hai toh login pe bhej do
            if (!token) {
                console.error("No token found!");
                navigate('/login');
                return;
            }

            try {
                const res = await axios.get('http://localhost:5000/api/items/admin/dashboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // Console mein check karein ke data aa bhi raha hai ya nahi
                console.log("Admin Data Received:", res.data);

                if (res.data) {
                    setData({
                        stats: res.data.stats || { totalUsers: 0, totalPosts: 0, lostItems: 0, foundItems: 0 },
                        allPosts: res.data.allPosts || []
                    });
                }
                setLoading(false);
            } catch (err) {
                console.error("Dashboard error:", err.response?.data || err.message);
                if (err.response?.status === 401) {
                    // Token expired ho gaya toh refresh login
                    localStorage.removeItem('token');
                    navigate('/login');
                }
                setLoading(false);
            }
        };
        fetchStats();
    }, [navigate]);

    // Value check logic: data.stats se numbers uthana
    const statCards = [
        { title: 'Total Users', value: data.stats?.totalUsers || 0, icon: <Users size={24}/>, color: 'from-blue-600 to-blue-400' },
        { title: 'Total Reports', value: data.stats?.totalPosts || 0, icon: <FileText size={24}/>, color: 'from-purple-600 to-purple-400' },
        { title: 'Lost Items', value: data.stats?.lostItems || 0, icon: <Search size={24}/>, color: 'from-red-600 to-red-400' },
        { title: 'Found Items', value: data.stats?.foundItems || 0, icon: <CheckCircle size={24}/>, color: 'from-green-600 to-green-400' },
    ];

    if (loading) return <div className="flex justify-center items-center h-screen bg-[#0f0c29] text-white text-xl animate-pulse tracking-widest uppercase">Syncing Admin Data...</div>;

    return (
        <div className="p-4 md:p-8 bg-[#0f0c29] min-h-screen text-white font-sans">
            <header className="flex justify-between items-center mb-10 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent underline decoration-pink-500/30">Returnify Admin Portal</h1>
                    <p className="text-gray-400 mt-1">Status: <span className="text-green-500 font-bold">● System Online</span></p>
                </div>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {statCards.map((card, i) => (
                    <div key={i} className="bg-slate-800/50 backdrop-blur-md p-6 rounded-2xl border border-white/10 hover:border-pink-500 transition-all duration-300 shadow-2xl group cursor-default">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${card.color} w-fit mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                            {card.icon}
                        </div>
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{card.title}</p>
                        <h2 className="text-5xl font-black mt-2 font-mono tracking-tighter">{card.value}</h2>
                    </div>
                ))}
            </div>

            <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl p-6 border border-white/5 shadow-inner">
                <div className="flex items-center gap-2 mb-6">
                    <AlertCircle className="text-pink-500 animate-pulse" size={24} />
                    <h3 className="text-2xl font-bold tracking-tight">Active Incident Logs</h3>
                </div>
                <div className="overflow-x-auto rounded-xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-gray-300 text-xs tracking-widest uppercase">
                                <th className="py-4 px-6 font-bold">Reported Item</th>
                                <th className="font-bold">Classification</th>
                                <th className="font-bold">User Identity</th>
                                <th className="font-bold">Origin City</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {data.allPosts && data.allPosts.length > 0 ? data.allPosts.map((post) => (
                                <tr key={post._id} className="hover:bg-white/10 transition-all group">
                                    <td className="py-5 px-6 font-semibold group-hover:text-pink-400">{post.title}</td>
                                    <td>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${post.type === 'Lost' ? 'bg-red-900/40 text-red-400 border border-red-500/40' : 'bg-green-900/40 text-green-400 border border-green-500/40'}`}>
                                            {post.type}
                                        </span>
                                    </td>
                                    <td className="text-gray-400">{post.user?.name || 'User Missing'}</td>
                                    <td className="text-gray-500 italic text-sm">{post.city || 'N/A'}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="py-20 text-center">
                                        <div className="flex flex-col items-center opacity-40">
                                            <Search size={48} className="mb-4" />
                                            <p className="text-xl font-light italic">Database is currently empty. No logs found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Admin;