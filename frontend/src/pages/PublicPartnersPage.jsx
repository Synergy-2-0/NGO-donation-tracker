import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FiSearch, FiFilter, FiExternalLink, FiMapPin, FiBriefcase, FiAward, FiArrowRight, FiShield, FiCpu, FiDollarSign, FiHeart, FiDroplet, FiBookOpen, FiX } from 'react-icons/fi';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';
import { usePartner } from '../context/PartnerContext';
import LoadingSpinner from '../components/LoadingSpinner';

const PartnerIcon = ({ partner }) => {
  if (partner.logo) return <img src={partner.logo} className="w-full h-full object-cover" />;
  const name = (partner.organizationName || partner.name || "").toLowerCase();
  const industry = (partner.industry || "").toLowerCase();
  
  if (industry.includes('tech') || name.includes('tech')) return <FiCpu />;
  if (industry.includes('financ') || name.includes('bank') || industry.includes('banking')) return <FiDollarSign />;
  if (industry.includes('health') || name.includes('med')) return <FiHeart />;
  if (industry.includes('water')) return <FiDroplet />;
  if (industry.includes('edu')) return <FiBookOpen />;
  
  return <FiShield />;
};

const INDUSTRY_FILTERS = [
  { id: 'all', label: 'All Industries' },
  { id: 'Technology', label: 'Technology' },
  { id: 'Financial Services', label: 'Finance' },
  { id: 'Healthcare', label: 'Healthcare' },
  { id: 'Education', label: 'Education' },
  { id: 'Manufacturing', label: 'Manufacturing' }
];

export default function PublicPartnersPage() {
  const navigate = useNavigate();
  const { partners, loading, fetchPartners } = usePartner();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedPartner, setSelectedPartner] = useState(null);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const filteredPartners = useMemo(() => {
    return partners.filter(p => {
      const name = (p.organizationName || p.name || "").toLowerCase();
      const industry = (p.industry || "").toLowerCase();
      const matchesSearch = name.includes(search.toLowerCase()) || industry.includes(search.toLowerCase());
      const matchesFilter = filter === 'all' || p.industry === filter;
      return matchesSearch && matchesFilter;
    });
  }, [partners, search, filter]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-tf-primary selection:text-white overflow-x-hidden">
      <PublicNavbar />
      
      {/* Premium Hero Section */}
      <section className="relative pt-64 pb-32 px-8 lg:px-24 bg-slate-950 overflow-hidden group">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 z-0"
        >
           <img 
             src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2400" 
             className="w-full h-full object-cover brightness-[0.2] group-hover:scale-105 transition-transform duration-[10s]" 
             alt="Global Infrastructure" 
           />
           <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </motion.div>

        <div className="max-w-[1400px] mx-auto relative z-10 text-center lg:text-left">
          <div className="grid lg:grid-cols-2 items-center gap-20">
            <div className="space-y-10">
              <motion.div 
                initial={{ opacity: 0, x: -30 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-tf-primary/30 bg-tf-primary/5 shadow-2xl backdrop-blur-md"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-tf-primary animate-pulse" />
                <span className="text-tf-primary font-extrabold text-[10px] tracking-[0.4em] uppercase">
                  Partner Network Directory
                </span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: 0.2 }}
                className="text-6xl md:text-8xl font-extrabold tracking-tighter uppercase leading-[0.85] selection:bg-tf-primary font-bold"
              >
                Verified <br /> <span className="text-tf-primary uppercase">Partners.</span> Network
              </motion.h1>
              
                Supporting a global network of trusted humanitarian organizations. Browse our verified partners providing essential resources and community support.
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="hidden lg:grid grid-cols-2 gap-6"
            >
              {[
                { label: 'Active Partners', val: partners.length, icon: FiShield },
                { label: 'Trust Rating', val: '99.9%', icon: FiAward },
                { label: 'Aid Sectors', val: '12+', icon: FiBriefcase },
                { label: 'Service Regions', val: 'Global Hub', icon: FiMapPin }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] space-y-4 hover:border-tf-primary/50 transition-colors group/stat">
                   <div className="p-4 bg-white/5 rounded-2xl w-fit group-hover/stat:bg-tf-primary group-hover/stat:text-white transition-all">
                     <stat.icon size={22} className="text-tf-primary group-hover/stat:text-white" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-3xl font-extrabold text-white tracking-tighter ">{stat.val}</p>
                      <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] ">{stat.label}</p>
                   </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Control Registry: Search & Filter */}
      <section className="relative z-20 -mt-16 px-8 max-w-[1400px] mx-auto">
        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-4xl p-8 lg:p-12">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-1 hidden lg:flex justify-center text-slate-200">
               <FiFilter size={24} />
            </div>
            <div className="lg:col-span-5 relative group">
              <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-tf-primary transition-colors" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search partners and sectors..." 
                className="w-full bg-slate-50 border border-slate-100 rounded-3xl pl-16 pr-8 py-5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-tf-primary/5 focus:bg-white transition-all  placeholder:text-slate-300"
              />
            </div>
            <div className="lg:col-span-6 flex flex-wrap gap-3">
               {INDUSTRY_FILTERS.map(f => (
                 <button 
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`px-8 py-4 rounded-full text-[10px] font-extrabold uppercase tracking-[0.25em] transition-all  ${
                    filter === f.id 
                    ? 'bg-tf-primary text-white shadow-xl shadow-tf-primary/30 scale-105' 
                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                  }`}
                 >
                   {f.label}
                 </button>
               ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Registry Grid */}
      <section className="py-24 max-w-[1400px] mx-auto px-8 min-h-[600px]">
         {loading ? (
           <div className="flex justify-center items-center h-96">
              <LoadingSpinner />
           </div>
         ) : filteredPartners.length > 0 ? (
           <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence>
                {filteredPartners.map((p, i) => (
                   <motion.div 
                     layout
                     key={p._id || i}
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     transition={{ delay: i * 0.05 }}
                     className="group/card relative bg-white border border-slate-100 rounded-[4rem] p-12 hover:shadow-5xl hover:-translate-y-2 transition-all duration-700 overflow-hidden "
                   >
                     <div className="absolute top-0 right-0 w-48 h-48 bg-slate-50 rounded-full blur-[80px] -mr-20 -mt-20 group-hover/card:bg-tf-primary/10 transition-colors duration-700" />
                     
                     <div className="relative z-10 space-y-10">
                        <div className="flex items-start justify-between">
                           <div className="text-5xl bg-slate-50 p-10 rounded-[2.5rem] shadow-inner group-hover/card:rotate-6 group-hover/card:scale-105 transition-all duration-700 border border-slate-100/50 text-slate-400 group-hover/card:text-tf-primary flex items-center justify-center">
                              <PartnerIcon partner={p} />
                           </div>
                           <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-500 shadow-sm" title="Institutional Identity Verified">
                              <FiShield size={20} />
                           </div>
                        </div>
                        
                        <div className="space-y-3">
                           <p className="text-[10px] font-extrabold text-tf-primary uppercase tracking-[0.4em] mb-2 leading-none">
                             {p.industry || 'Organization Sector'}
                           </p>
                           <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-950 tracking-tighter leading-[1.1]">
                             {p.organizationName || p.name}
                           </h3>
                        </div>

                        <div className="grid grid-cols-2 gap-6 py-8 border-y border-slate-50">
                           <div className="space-y-1">
                              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Type</span>
                              <p className="text-xs font-extrabold text-slate-700 leading-none">{p.organizationType || 'Partner'}</p>
                           </div>
                           <div className="space-y-1">
                              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Location Hub</span>
                              <p className="text-xs font-extrabold text-slate-700 leading-none">{p.address?.city || 'Verified'}</p>
                           </div>
                        </div>

                        <div className="flex items-center justify-between pt-4">
                           <div className="flex -space-x-4">
                              {[1,2,3].map(n => (
                                <div key={n} className="w-10 h-10 rounded-full border-[3px] border-white bg-slate-100 flex items-center justify-center text-[10px] font-extrabold text-slate-400 ">
                                  {n}+
                                </div>
                              ))}
                              <div className="pl-6 pt-2 text-[9px] font-extrabold text-slate-300 uppercase tracking-widest">Active Projects Hub</div>
                           </div>
                           <button 
                             onClick={() => setSelectedPartner(p)}
                             className="w-14 h-14 bg-slate-950 text-white rounded-3xl flex items-center justify-center hover:bg-tf-primary hover:shadow-xl hover:shadow-tf-primary/30 transition-all active:scale-90 group/btn"
                           >
                              <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                           </button>
                        </div>
                     </div>
                   </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Contact Details Modal Hub */}
            <AnimatePresence>
              {selectedPartner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    onClick={() => setSelectedPartner(null)}
                    className="absolute inset-0 bg-slate-950/70 backdrop-blur-xl"
                  />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="relative bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden p-10 "
                  >
                     <div className="absolute top-0 right-0 w-64 h-64 bg-tf-primary/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
                     
                     <div className="flex justify-between items-start mb-10 relative z-10">
                       <div className="flex items-center gap-6">
                         <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[28px] shadow-inner text-4xl flex items-center justify-center text-slate-400">
                           <PartnerIcon partner={selectedPartner} />
                         </div>
                         <div>
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-extrabold uppercase tracking-widest rounded-lg border border-emerald-100 mb-2 inline-block">
                              Verified Institutional Contact Hub
                            </span>
                            <h3 className="text-3xl font-extrabold text-slate-950 tracking-tighter leading-none mb-1">
                              {selectedPartner.organizationName || selectedPartner.name}
                            </h3>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{selectedPartner.industry || 'Global Partner'}</p>
                         </div>
                       </div>
                       <button onClick={() => setSelectedPartner(null)} className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-colors">
                         <FiX size={20} />
                       </button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 space-y-4">
                           <h4 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2"><FiBriefcase className="text-tf-primary" /> Primary Contact</h4>
                           <div>
                              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Full Name</p>
                              <p className="text-base font-extrabold text-slate-800">{selectedPartner.contactPerson?.name || 'Authorized Representative'}</p>
                              <p className="text-xs font-medium text-slate-500 mt-0.5">{selectedPartner.contactPerson?.position || 'Operations Officer'}</p>
                           </div>
                           <div className="pt-3 border-t border-slate-200">
                              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Direct Line Hub</p>
                              <p className="text-sm font-bold text-slate-700 underline decoration-tf-primary/30 uppercase">{selectedPartner.contactPerson?.phone || 'Encrypted Registry'}</p>
                           </div>
                        </div>

                        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-white space-y-4 shadow-xl">
                           <h4 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500 mb-4 flex items-center gap-2"><FiMapPin className="text-tf-primary" /> Registered Address Hub</h4>
                           <div>
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Base Operations</p>
                              <p className="text-base font-extrabold text-white">{selectedPartner.address?.city || 'Verified Capital'}</p>
                              <p className="text-xs font-medium text-slate-400 mt-0.5">{selectedPartner.address?.country || 'Global Territory'}</p>
                           </div>
                           <div className="pt-3 border-t border-slate-800">
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Mail Comm Protocol</p>
                              <p className="text-sm font-bold text-emerald-400 underline decoration-emerald-400/30 line-clamp-1">{selectedPartner.contactPerson?.email || 'N/A'}</p>
                           </div>
                        </div>
                     </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
           </>
         ) : (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-48 space-y-10 ">
              <div className="text-8xl grayscale opacity-20 animate-pulse">📡</div>
              <div className="space-y-4">
                <p className="text-2xl font-extrabold text-slate-900 tracking-tighter uppercase">No Partners Found</p>
                <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.4em] max-w-md mx-auto leading-relaxed">The organization you are looking for may not be registered yet or is currently undergoing our verification process.</p>
              </div>
              <button 
                onClick={() => {setSearch(''); setFilter('all');}} 
                className="px-10 py-4 bg-slate-900 text-white rounded-full text-[10px] font-extrabold uppercase tracking-[0.3em]"
              >
                Clear All Filters Hub
              </button>
           </motion.div>
         )}
      </section>

      {/* Global Expansion CTA */}
      <section className="py-48 px-8 max-w-[1400px] mx-auto">
         <div className="bg-slate-950 rounded-[5rem] p-20 lg:p-32 text-center space-y-16 relative overflow-hidden group shadow-5xl border border-white/5">
            <div className="absolute inset-0 bg-tf-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-[3s] pointer-events-none" />
            <div className="max-w-4xl mx-auto space-y-16 relative z-10">
               <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="space-y-8">
                  <h2 className="text-5xl md:text-8xl font-extrabold text-white  tracking-tighter uppercase leading-[0.8] selection:bg-tf-primary">
                    Become a <br /> <span className="text-tf-primary not-">Verified</span> <br /> Partner Hub.
                  </h2>
                  <p className="text-white/40 text-lg leading-relaxed font-medium  max-w-2xl mx-auto border-t border-white/5 pt-12 mt-12 lowercase tracking-tight">
                    Register your organization to join our community. Verified partners connect with donors and contribute to global impact through transparent reporting. Hub
                  </p>
               </motion.div>
               <div className="pt-10 flex flex-col md:flex-row justify-center gap-6">
                 <button onClick={() => navigate('/login?tab=signup')} className="px-16 py-8 bg-tf-primary text-white text-[11px] font-extrabold uppercase tracking-[0.5em] rounded-[2.5rem] shadow-4xl shadow-tf-primary/40 hover:bg-white hover:text-slate-950 transition-all hover:scale-105 active:scale-95 ">
                    Submit Credentials
                 </button>
                 <button onClick={() => navigate('/transparency')} className="px-16 py-8 bg-white/5 text-white border border-white/10 text-[11px] font-extrabold uppercase tracking-[0.5em] rounded-[2.5rem] hover:bg-white/10 transition-all ">
                    View Transparency Report Hub
                 </button>
               </div>
            </div>
         </div>
      </section>

      <PublicFooter />
    </div>
  );
}
