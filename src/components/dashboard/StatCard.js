import { motion } from 'framer-motion';

export const StatCard = ({ title, value, icon: Icon, bg, color }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4"
  >
    <div className={`p-3 rounded-2xl ${bg} ${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">{title}</p>
      <h3 className="text-xl font-black text-slate-900">{value}</h3>
    </div>
  </motion.div>
);