import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-br from-royal-blue via-[#1a1a4b] to-[#2d1b4d] py-20 px-10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-pink opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-bright-cyan opacity-10 rounded-full blur-3xl"></div>
        
        <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-4">
          Returnify <span className="text-neon-pink">Network</span>
        </h1>
        <p className="text-bright-cyan text-xs font-bold uppercase tracking-[0.5em] mb-10">
          Smart AI-Based Lost & Found Portal
        </p>
        
        <div className="flex flex-wrap justify-center gap-6">
          <Link to="/post" className="bg-neon-pink text-white px-10 py-4 rounded-xl font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 transition-transform">
            Report Lost Item
          </Link>
          <Link to="/post" className="bg-transparent border-2 border-bright-cyan text-bright-cyan px-10 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-bright-cyan hover:text-royal-blue transition-all">
            I Found Something
          </Link>
        </div>

        
        <div className="mt-12">
          <Link to="/ai-intelligence" className="group relative inline-flex items-center justify-center px-8 py-3 font-black text-white uppercase italic tracking-widest transition-all duration-300">
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-neon-pink to-bright-cyan rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity"></span>
            <span className="relative bg-[#0f0c29] px-8 py-3 rounded-full border border-white/20 group-hover:border-neon-pink transition-colors text-[10px]">
              🚀 Launch AI Intelligence Scan
            </span>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="p-8 rounded-3xl bg-gray-50 border-b-4 border-royal-blue hover:shadow-xl transition-all">
            <h3 className="text-4xl font-black text-royal-blue mb-2">Many</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Items Reported</p>
          </div>
          
          {/* AI Stat Card ko humne clickable bana dia hai taake user wahan se bhi AI page par ja sake */}
          <Link to="/ai-intelligence" className="p-8 rounded-3xl bg-gray-50 border-b-4 border-neon-pink hover:scale-105 transition-all">
            <h3 className="text-4xl font-black text-neon-pink mb-2">AI Match</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest underline decoration-bright-cyan">Smart Text Comparison</p>
          </Link>

          <div className="p-8 rounded-3xl bg-gray-50 border-b-4 border-bright-cyan hover:shadow-xl transition-all">
            <h3 className="text-4xl font-black text-bright-cyan mb-2">Secure</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verified Communication</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;