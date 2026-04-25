import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const Admin = () => {
    const [data, setData] = useState({ 
        stats: { users: 0, reports: 0, lost: 0, found: 0 }, 
        allPosts: [], 
        allUsers: [], 
        matches: [],
        heroes: []
    }); 
    const [activeTab, setActiveTab] = useState('reports');
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/items/admin/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setData(res.data);
            }
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleResolve = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`http://localhost:5000/api/items/admin/resolve/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                alert("SUCCESS: Item Resolved! 🎉");
                fetchData();
            }
        } catch (err) { alert("Update Failed"); }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Remove this report?")) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/items/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchData();
            } catch (err) { alert("Action failed"); }
        }
    };

    if (loading) return <div className="h-screen bg-[#0f0c29] flex items-center justify-center text-white font-black italic uppercase animate-pulse">Syncing Admin...</div>;

    return (
        <div className="p-10 bg-[#0f0c29] min-h-screen text-white">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-black italic uppercase bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent">RETURNIFY CONTROL</h1>
                <button onClick={() => setActiveTab('ai-engine')} className="bg-white text-black px-6 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-cyan-400 transition-all">
                    <span>⚡</span> RUN AI MATCHER ({data?.matches?.length || 0})
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6 mb-12">
                {[{ label: 'USERS', val: data?.stats?.users, color: 'text-cyan-400' },
                  { label: 'REPORTS', val: data?.stats?.reports, color: 'text-pink-500' },
                  { label: 'LOST', val: data?.stats?.lost, color: 'text-red-500' },
                  { label: 'FOUND', val: data?.stats?.found, color: 'text-green-500' }
                ].map((s, i) => (
                    <div key={i} className="bg-white/5 p-8 rounded-[30px] border border-white/5 shadow-2xl">
                        <p className="text-[10px] uppercase font-black text-gray-500 mb-2">{s.label}</p>
                        <h2 className={`text-5xl font-black ${s.color}`}>{s.val || 0}</h2>
                    </div>
                ))}
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-4 mb-8">
                {['reports', 'user-registry', 'ai-engine', 'community-heroes'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-2 rounded-full text-[10px] font-black uppercase transition-all ${activeTab === tab ? 'bg-pink-600 shadow-[0_0_15px_pink]' : 'bg-white/5 text-gray-600 hover:text-white'}`}>{tab.replace('-', ' ')}</button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="bg-[#161336] rounded-[40px] p-10 border border-white/5 shadow-2xl min-h-[400px]">
                
                {/* Reports Tab */}
                {activeTab === 'reports' && (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-gray-600 text-[10px] uppercase font-black border-b border-white/5">
                                <th className="pb-6">Subject</th>
                                <th className="pb-6 text-center">Type</th>
                                <th className="pb-6 text-center">Status</th>
                                <th className="pb-6 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.allPosts?.map(p => (
                                <tr key={p._id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                                    <td className="py-6 font-black italic uppercase text-lg">{p.title}</td>
                                    <td className={`py-6 text-center font-black text-[12px] ${p.type === 'Lost' ? 'text-red-500' : 'text-green-500'}`}>{p.type}</td>
                                    <td className="py-6 text-center text-gray-400 font-bold uppercase text-[10px]">
                                        {p.status === 'Resolved' ? <span className="text-green-400 font-black italic">✓ Returned</span> : <span className="text-yellow-500 tracking-widest opacity-50">Pending</span>}
                                    </td>
                                    <td className="py-6 text-right flex gap-4 justify-end items-center">
                                        {p.status !== 'Resolved' && (
                                            <button onClick={() => handleResolve(p._id)} className="text-cyan-400 hover:text-white border border-cyan-400/30 px-3 py-1 rounded-lg text-[9px] font-black uppercase">Resolve</button>
                                        )}
                                        <button onClick={() => handleDelete(p._id)} className="text-red-500 text-[9px] font-black uppercase hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* User Registry Tab */}
                {activeTab === 'user-registry' && (
                    <div className="grid gap-4">
                        {data?.allUsers?.map(u => (
                            <div key={u._id} className="bg-white/5 p-6 rounded-[25px] border border-white/5 flex justify-between items-center">
                                <span className="font-black italic uppercase text-cyan-400 text-lg">{u.name || "USER"}</span>
                                <span className="text-gray-500 text-[10px] font-bold uppercase">{u.email}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* AI Engine Tab - UPDATED DYNAMIC UI */}
                {activeTab === 'ai-engine' && (
                    <div className="grid gap-6">
                        {data?.matches?.length > 0 ? (
                            data.matches.map((m, i) => (
                                <div key={i} className="bg-white/5 p-10 rounded-[35px] border border-white/5 flex justify-between items-center hover:border-pink-500/50 transition-all">
                                    <div>
                                        <h3 className="text-2xl font-black italic uppercase text-white">
                                            LOST: <span className="text-pink-500">{m.lostItem}</span> ↔ FOUND: <span className="text-cyan-400">{m.foundItem}</span>
                                        </h3>
                                        <p className="text-[10px] text-gray-500 uppercase mt-2 font-bold italic tracking-widest italic">
                                            Neural Match Detected | Reporters: {m.reporterL} & {m.reporterF}
                                        </p>
                                    </div>
                                    {/* Yahan matchScore ab dynamic backend value (80%) uthaye ga */}
                                    <div className="bg-neon-pink text-white px-8 py-3 rounded-full text-sm font-black italic shadow-[0_0_15px_rgba(255,0,128,0.4)]">
                                        MATCH: {m.matchScore}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-20 font-black italic uppercase border-2 border-dashed border-white/5 rounded-[40px]">
                                No AI Matches Detected in Neural Network.
                            </div>
                        )}
                    </div>
                )}

                {/* Community Heroes Tab */}
                {activeTab === 'community-heroes' && (
                    <div className="grid gap-6">
                        {data?.heroes?.length > 0 ? (
                            data.heroes.map((h, i) => (
                                <div key={i} className="bg-white/5 p-8 rounded-[35px] border border-white/5 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-xl font-black italic uppercase text-cyan-400">{h.name}</h3>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase">{h.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-black text-pink-500">{h.points}</span>
                                        <p className="text-[9px] text-white/30 uppercase font-black italic">Return Points</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-20 font-black italic uppercase">No Heroes identified in this cycle yet.</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;