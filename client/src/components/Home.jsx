import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Aapki Royal Blue Theme mein */}
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
      </section>

      {/* Stats Section - Proposal Goals ko show karne ke liye */}
      <section className="py-20 px-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div className="p-8 rounded-3xl bg-gray-50 border-b-4 border-royal-blue">
            <h3 className="text-4xl font-black text-royal-blue mb-2">500+</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Items Reported</p>
          </div>
          <div className="p-8 rounded-3xl bg-gray-50 border-b-4 border-neon-pink">
            <h3 className="text-4xl font-black text-neon-pink mb-2">AI Match</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Smart Text Comparison</p>
          </div>
          <div className="p-8 rounded-3xl bg-gray-50 border-b-4 border-bright-cyan">
            <h3 className="text-4xl font-black text-bright-cyan mb-2">Secure</h3>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Verified Communication</p>
          </div>
        </div>
      </section>

      {/* Target Audience Section - According to Proposal Section 1.3 */}
      <section className="bg-gray-50 py-16 px-10 text-center">
        <h2 className="text-2xl font-black text-royal-blue uppercase italic mb-10 tracking-tighter">Trusted by Communities</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {['University Students', 'Public Places', 'Office Staff', 'Event Organizers'].map((tag) => (
            <span key={tag} className="px-6 py-2 bg-white rounded-full text-[10px] font-bold text-gray-500 shadow-sm uppercase tracking-widest border border-gray-100">
              {tag}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;