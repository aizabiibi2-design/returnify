import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-royal-blue border-t border-neon-pink/20 py-10 mt-auto">
      <div className="container mx-auto px-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Logo & Tagline */}
          <div className="text-center md:text-left">
            <h2 className="text-bright-cyan text-xl font-black italic tracking-tighter uppercase">FoundIt</h2>
            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
              Smart Recovery Network
            </p>
          </div>

          {/* Links Section */}
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-gray-300">
            <span className="hover:text-neon-pink cursor-pointer transition">Privacy</span>
            <span className="hover:text-neon-pink cursor-pointer transition">Terms</span>
            <span className="hover:text-neon-pink cursor-pointer transition">Support</span>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="text-gray-500 text-[9px] font-medium tracking-widest uppercase">
              &copy; 2025 Returnify Platform. All Rights Reserved.
            </p>
          </div>

        </div>

        {/* Bottom Accent Line */}
        <div className="mt-8 h-1 w-full bg-gradient-to-r from-transparent via-neon-pink/30 to-transparent"></div>
      </div>
    </footer>
  );
};

export default Footer;