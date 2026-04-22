import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Admin = () => {
    const [data, setData] = useState(null); 
    const [activeTab, setActiveTab] = useState('reports');
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/items/admin/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) setData(res.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // Logic: Item ko resolved mark karne ke liye
    const handleResolve = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/items/admin/resolve/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchData(); 
        } catch (err) { alert("Status update failed"); }
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

    if (loading) return <div className="h-screen bg-[#0f0c29] flex items-center justify-center text-white font-black italic uppercase animate-pulse">Syncing Returnify...</div>;

    return (
        <div className="p-10 bg-[#0f0c29] min-h-screen text-white font-sans">
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-black italic uppercase bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent italic tracking-tighter">RETURNIFY CONTROL</h1>
                <button onClick={() => setActiveTab('ai-engine')} className="bg-white text-black px-6 py-2 rounded-xl font-black text-[10px] flex items-center gap-2 uppercase shadow-xl hover:bg-cyan-400 transition-all">
                    <span>⚡</span> RUN AI MATCHER ({data?.matches?.length || 0})
                </button>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-12">
                {[{ label: 'USERS', val: data?.stats?.users, color: 'text-cyan-400' },
                  { label: 'REPORTS', val: data?.stats?.reports, color: 'text-pink-500' },
                  { label: 'LOST', val: data?.stats?.lost, color: 'text-red-500' },
                  { label: 'FOUND', val: data?.stats?.found, color: 'text-green-500' }
                ].map((s, i) => (
                    <div key={i} className="bg-white/5 p-8 rounded-[30px] border border-white/5 shadow-2xl">
                        <p className="text-[10px] uppercase font-black text-gray-500 mb-2 tracking-widest">{s.label}</p>
                        <h2 className={`text-5xl font-black ${s.color}`}>{s.val || 0}</h2>
                    </div>
                ))}
            </div>

            <div className="flex gap-4 mb-8">
                {['reports', 'user-registry', 'ai-engine'].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-8 py-2 rounded-full text-[10px] font-black uppercase transition-all ${activeTab === tab ? 'bg-pink-600' : 'bg-white/5 text-gray-600'}`}>{tab.replace('-', ' ')}</button>
                ))}
            </div>

            <div className="bg-[#161336] rounded-[40px] p-10 border border-white/5 shadow-2xl min-h-[400px]">
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
                                        {p.status === 'Resolved' ? <span className="text-green-400">✓ Returned</span> : <span className="text-yellow-500 tracking-widest opacity-50">Pending</span>}
                                    </td>
                                    <td className="py-6 text-right flex gap-4 justify-end items-center">
                                        {p.status !== 'Resolved' && (
                                            <button onClick={() => handleResolve(p._id)} className="text-cyan-400 hover:text-white border border-cyan-400/30 px-3 py-1 rounded-lg text-[9px] font-black uppercase transition-all">Resolve</button>
                                        )}
                                        <button onClick={() => handleDelete(p._id)} className="text-red-500 text-[9px] font-black uppercase">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {activeTab === 'user-registry' && (
                    <div className="grid gap-4">
                        {data?.allUsers?.map(u => (
                            <div key={u._id} className="bg-white/5 p-6 rounded-[25px] border border-white/5 flex justify-between items-center"><span className="font-black italic uppercase text-cyan-400 text-lg">{u.name || "USER"}</span><span className="text-gray-500 text-[10px] font-bold uppercase">{u.email}</span></div>
                        ))}
                    </div>
                )}

                {activeTab === 'ai-engine' && (
                    <div className="grid gap-6">
                        {data?.matches?.map((m, i) => (
                            <div key={i} className="bg-white/5 p-10 rounded-[35px] border border-white/5 flex justify-between items-center shadow-2xl">
                                <div>
                                    <h3 className="text-2xl font-black italic uppercase text-white">LOST: <span className="text-pink-500">{m.lostItem}</span> ↔ FOUND: <span className="text-cyan-400">{m.foundItem}</span></h3>
                                    <p className="text-[10px] text-gray-500 uppercase mt-2 font-bold tracking-widest italic">Matched By: {m.reporterL} & {m.reporterF}</p>
                                </div>
                                <div className="bg-green-500 text-black px-8 py-3 rounded-full text-sm font-black shadow-[0_0_30px_rgba(34,197,94,0.4)] italic">MATCH: 100%</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Admin;