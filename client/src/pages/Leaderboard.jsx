import React, { useEffect, useState } from 'react';

const Leaderboard = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/items/leaderboard/top');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f0c29] p-8 flex flex-col items-center">
      <h1 className="text-5xl font-black text-white italic uppercase mb-12 mt-10">
        Community <span className="text-bright-cyan">Impact</span>
      </h1>

      <div className="max-w-3xl w-full bg-white/5 border border-white/10 rounded-[30px] p-8 shadow-2xl">
        <div className="grid gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-neon-pink transition-all">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-black text-neon-pink">#{index + 1}</span>
                <span className="text-xl font-bold text-white uppercase tracking-wider">{stat._id}</span>
              </div>
              <div className="text-right">
                <span className="text-bright-cyan font-black text-2xl">{stat.count}</span>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Reports</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;