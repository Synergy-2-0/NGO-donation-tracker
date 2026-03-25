import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, OrbitControls } from '@react-three/drei';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function AnimatedBackground() {
  const mesh = useRef();
  useFrame((state) => {
    mesh.current.rotation.x = state.clock.getElapsedTime() * 0.1;
    mesh.current.rotation.y = state.clock.getElapsedTime() * 0.15;
  });

  return (
    <Sphere ref={mesh} args={[1, 100, 200]} scale={2.5}>
      <MeshDistortMaterial
        color="#6366f1"
        speed={1.5}
        distort={0.4}
        radius={1}
        opacity={0.15}
        transparent
      />
    </Sphere>
  );
}

function LandingNavbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-6 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-3 pointer-events-auto cursor-pointer group">
                <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">Synergy</span>
                    <span className="text-[9px] font-bold text-indigo-500 tracking-[0.2em] uppercase mt-0.5">Global Foundation</span>
                </div>
            </div>
            <div className="hidden md:flex items-center gap-8 pointer-events-auto">
                <a href="#impact" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-indigo-600 transition-colors">Our Impact</a>
                <a href="#partners" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-indigo-600 transition-colors">Global Partners</a>
                <a href="#roadmap" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 hover:text-indigo-600 transition-colors">Transparency</a>
            </div>
            <div className="flex items-center gap-4 pointer-events-auto">
                <Link to="/login" className="px-6 py-2.5 bg-slate-900 shadow-xl shadow-black/10 hover:bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95">
                    Terminal Login
                </Link>
            </div>
        </nav>
    );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-600">
      <LandingNavbar />
      
      {/* Hero Section with Three.js */}
      <section className="relative h-screen flex items-center px-12 lg:px-24">
        <div className="absolute inset-0 z-0">
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={null}>
                <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                    <AnimatedBackground />
                </Float>
                <OrbitControls enableZoom={false} enablePan={false} autoRotate />
            </Suspense>
          </Canvas>
        </div>

        <div className="relative z-10 max-w-4xl space-y-12">
            <motion.div 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
                className="space-y-6"
            >
                <div className="inline-block px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 italic">2.4m lives impacted globally</span>
                </div>
                <h1 className="text-7xl lg:text-9xl font-black text-slate-900 leading-[0.9] tracking-tighter">
                  Strategic <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient-x underline decoration-slate-200 underline-offset-8">Humanity.</span>
                </h1>
                <p className="text-xl md:text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl">
                    Synergy is the first decentralized NGO operating system bridging verified funding with on-the-ground execution through a cryptographically transparent ledger.
                </p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.5 }}
                className="flex flex-wrap gap-6 items-center"
            >
                <Link to="/login" className="px-12 py-6 bg-indigo-600 shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 text-white text-xs font-black uppercase tracking-[0.3em] rounded-[24px] transition-all active:scale-95">
                    Initialize Contribution
                </Link>
                <div className="flex -space-x-4">
                    {[1,2,3,4].map(i => (
                        <div key={i} className={`w-12 h-12 rounded-2xl border-[3px] border-white bg-slate-${200 + i*100} shadow-xl flex items-center justify-center font-black text-[10px] text-gray-400`}>A{i}</div>
                    ))}
                    <div className="w-12 h-12 rounded-2xl border-[3px] border-white bg-indigo-50 shadow-xl flex items-center justify-center font-black text-[10px] text-indigo-400">+12k</div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Active verified partners in 42 regions.</p>
            </motion.div>
        </div>

        {/* Floating elements */}
        <div className="absolute right-24 bottom-24 hidden lg:block max-w-sm">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[40px] border border-white shadow-[0_32px_64px_rgba(0,0,0,0.06)] space-y-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Real-time Pulse</p>
                        <p className="text-sm font-black text-slate-800 tracking-tight">LKR 14.2M Allocated</p>
                    </div>
                </div>
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[88%] shadow-[0_0_12px_#10b981]"></div>
                </div>
                <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">
                    Funding cycle #B42 initialized. Currently distributing resources for Educational Infrastructure in Northern Province.
                </p>
            </div>
        </div>
      </section>

      {/* Grid Stats Area */}
      <section id="impact" className="px-12 lg:px-24 py-32 space-y-24 bg-white/40 border-y border-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="space-y-4">
                  <h4 className="text-5xl font-black text-slate-900 tracking-tighter">$42.4M</h4>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] italic">Cumulative Funding</p>
                  <p className="text-sm text-slate-400 font-medium">Verified capital flow audited through synergy secure-ledger system.</p>
              </div>
              <div className="space-y-4">
                  <h4 className="text-5xl font-black text-slate-900 tracking-tighter">12k+</h4>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] italic">Identity Registry</p>
                  <p className="text-sm text-slate-400 font-medium">Individual and corporate entities committed to strategic relief.</p>
              </div>
              <div className="space-y-4">
                  <h4 className="text-5xl font-black text-slate-900 tracking-tighter">100%</h4>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] italic">Auditable Trust</p>
                  <p className="text-sm text-slate-400 font-medium">Every cent tracked from donor wallet to beneficiary hand.</p>
              </div>
              <div className="space-y-4">
                  <h4 className="text-5xl font-black text-slate-900 tracking-tighter">12</h4>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] italic">Global Hubs</p>
                  <p className="text-sm text-slate-400 font-medium">Operating strategic logistics bases in critical high-need sectors.</p>
              </div>
          </div>
      </section>

      {/* Footer Branding Section */}
      <footer className="px-12 lg:px-24 pt-48 pb-24 text-center">
            <h3 className="text-[10vw] font-black text-slate-100 uppercase tracking-tighter leading-none select-none">SynergyOS</h3>
            <div className="mt-24 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">&copy; 2026 Strategic Humanity Foundation. All Protocol Rights Reserved.</p>
                <div className="flex gap-8">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 cursor-pointer">Compliance</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 cursor-pointer">API Keys</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 cursor-pointer">Nodes</span>
                </div>
            </div>
      </footer>
    </div>
  );
}
