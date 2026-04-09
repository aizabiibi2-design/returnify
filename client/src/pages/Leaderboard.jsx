import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Award, Star } from 'lucide-react';

const Leaderboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // UPDATE: /api/items ki jagah ab /api/actions use hoga
        const response = await fetch('http://localhost:5000/api/actions/leaderboard/top');
        const data = await response.json();
        
        if (Array.isArray(data)) {
          setStats(data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getBadge = (points, index) => {
    if (index === 0 && points > 0) return { name: 'Gold Guardian', color: 'text-yellow-400', icon: <Trophy className="w-5 h-5" /> };
    if (index === 1 && points > 0) return { name: 'Silver Savior', color: 'text-gray-300', icon: <Medal className="w-5 h-5" /> };
    if (index === 2 && points > 0) return { name: 'Bronze Benefactor', color: 'text-orange-400', icon: <Award className="w-5 h-5" /> };
    if (points > 50) return { name: 'Elite Member', color: 'text-bright-cyan', icon: <Star className="w-4 h-4" /> };
    return null;
  };

  return (
    <div className="min-h-screen bg-[#0f0c29] p-8 flex flex-col items-center">
      <div className="text-center mb-16 mt-10">
        <h1 className="text-6xl font-black text-white italic uppercase tracking-tighter">
          Community <span className="text-bright-cyan underline decoration-neon-pink">Heroes</span>
        </h1>
        <p className="text-gray-500 font-bold uppercase tracking-[0.4em] text-xs mt-4">Top contributors in the recovery network</p>
      </div>

      <div className="max-w-4xl w-full bg-[#1a1a4b]/50 border-2 border-white/5 rounded-[40px] p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-pink/5 blur-[100px] -z-10"></div>
        
        <div className="grid gap-6 relative z-10">
          {loading ? (
            <div className="text-center py-20 text-white font-black animate-pulse uppercase">Fetching Hero Rankings...</div>
          ) : stats.length > 0 ? (
            stats.map((stat, index) => {
              const badge = getBadge(stat.points, index);
              return (
                <div key={index} className="flex justify-between items-center bg-white/5 p-8 rounded-[30px] border-2 border-white/5 hover:border-neon-pink transition-all duration-500 group">
                  <div className="flex items-center gap-8">
                    <div className={`text-4xl font-black italic ${index === 0 ? 'text-yellow-400 scale-125' : index === 1 ? 'text-gray-300 scale-110' : index === 2 ? 'text-orange-400' : 'text-white/20'}`}>
                      {index + 1}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-2xl font-black text-white uppercase italic tracking-tighter group-hover:text-bright-cyan transition-colors">
                          {stat.name}
                        </span>
                        {badge && (
                          <div className={`flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 ${badge.color} text-[10px] font-black uppercase tracking-widest`}>
                            {badge.icon}
                            {badge.name}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em]">
                          {stat.city || 'Network Member'}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-white/20"></div>
                        <span className="text-[10px] text-neon-pink uppercase font-black tracking-[0.2em]">Verified Hero</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-1">
                      <span className="text-bright-cyan font-black text-5xl italic leading-none">{stat.points}</span>
                      <span className="text-white/20 font-black text-xl italic uppercase">PTS</span>
                    </div>
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-2">Honor Credits</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-[30px]">
              <p className="text-gray-500 font-black uppercase tracking-[0.4em]">No Heroes identified in this cycle</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;