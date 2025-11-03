import React from 'react';
import Spline from '@splinetool/react-spline';

const Hero = () => {
  return (
    <section className="relative w-full h-[280px] md:h-[320px] rounded-xl overflow-hidden border border-[#2A2A2A] bg-[#0B0B0E]">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#08080A] via-transparent to-transparent pointer-events-none" />
      <div className="relative z-10 h-full flex flex-col items-start justify-end p-6">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight" style={{ color: '#E0E0E0' }}>
          Browser Internals Dashboard
        </h1>
        <p className="mt-2 text-sm md:text-base opacity-80 max-w-2xl" style={{ color: '#E0E0E0' }}>
          Inspect client-side storage, environment, and performance metrics in real time — clean, precise, and cyberpunk.
        </p>
      </div>
    </section>
  );
};

export default Hero;
