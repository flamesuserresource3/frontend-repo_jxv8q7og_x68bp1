import React from 'react';

const Dot = ({ on }) => (
  <span
    className={`inline-block h-2.5 w-2.5 rounded-full mr-2 ${on ? 'bg-emerald-400' : 'bg-rose-500'}`}
    aria-hidden
  />
);

const MetricsCard = ({ title, items }) => {
  return (
    <div className="flex flex-col rounded-xl border border-[#2A2A2A] bg-[#0B0B0E] shadow-sm h-full">
      <div className="p-4 border-b border-[#2A2A2A]">
        <h3 className="text-base font-semibold" style={{ color: '#E0E0E0' }}>{title}</h3>
      </div>
      <div className="p-4 flex-1">
        <ul className="space-y-3 text-sm" style={{ color: '#E0E0E0' }}>
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start justify-between gap-4">
              <span className="opacity-80">{item.label}</span>
              <span className="font-medium text-right" style={{ color: item.accent ? '#00E5FF' : '#E0E0E0' }}>
                {item.dot != null ? (<span className="inline-flex items-center"><Dot on={item.dot} />{item.value}</span>) : item.value}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MetricsCard;
