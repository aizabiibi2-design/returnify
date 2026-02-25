import React, { useEffect, useState } from 'react';

const Leaderboard = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Ab ye route top users ka data layega (name, points, city)
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
      <h1 className="text-5xl font-black text-white italic uppercase mb-12 mt-10 text-center">
        Community <span className="text-bright-cyan">Heroes</span>
      </h1>

      <div className="max-w-3xl w-full bg-white/5 border border-white/10 rounded-[30px] p-8 shadow-2xl backdrop-blur-sm">
        <div className="grid gap-6">
          {stats.length > 0 ? (
            stats.map((stat, index) => (
              <div key={index} className="flex justify-between items-center bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-neon-pink transition-all group">
                <div className="flex items-center gap-6">
                  {/* Ranking Number */}
                  <span className={`text-3xl font-black ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-neon-pink'}`}>
                    #{index + 1}
                  </span>
                  
                  <div>
                    {/* User Name - Ab stat._id ki jagah stat.name use hoga */}
                    <span className="text-xl font-bold text-white uppercase tracking-wider block group-hover:text-bright-cyan transition-colors">
                      {stat.name}
                    </span>
                    {/* City Name */}
                    <span className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em]">
                      {stat.city || 'Network Member'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  {/* Points - Ab stat.count ki jagah stat.points use hoga */}
                  <span className="text-bright-cyan font-black text-3xl">{stat.points}</span>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Honor Points</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 font-bold uppercase tracking-widest py-10">
              No Heroes in the network yet...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;