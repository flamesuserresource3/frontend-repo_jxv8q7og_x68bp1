import React, { useMemo } from 'react';

const MetricBar = ({ label, valueMs, maxMs }) => {
  const width = Math.max(2, Math.min(100, (valueMs / Math.max(1, maxMs)) * 100));
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs" style={{ color: '#E0E0E0' }}>
        <span className="opacity-80">{label}</span>
        <span className="font-medium" style={{ color: '#00E5FF' }}>{Math.round(valueMs)} ms</span>
      </div>
      <div className="h-2 w-full rounded bg-[#121218] border border-[#2A2A2A] overflow-hidden">
        <div
          className="h-full"
          style={{ width: `${width}%`, backgroundColor: '#00E5FF' }}
        />
      </div>
    </div>
  );
};

const PerformanceCard = ({ navEntry }) => {
  const metrics = useMemo(() => {
    if (!navEntry) return [];
    const start = navEntry.startTime || 0;
    const ttfb = (navEntry.responseStart ?? 0) - (navEntry.requestStart ?? 0);
    const domInteractive = (navEntry.domInteractive ?? 0) - start;
    const loadTime = (navEntry.loadEventEnd ?? 0) - start;
    const firstPaint = performance.getEntriesByType('paint')?.find(p => p.name === 'first-paint');
    const fcp = performance.getEntriesByType('paint')?.find(p => p.name === 'first-contentful-paint');
    return [
      { label: 'Time to First Byte (TTFB)', value: Math.max(0, ttfb) },
      { label: 'DOM Interactive', value: Math.max(0, domInteractive) },
      { label: 'Page Load Time', value: Math.max(0, loadTime) },
      ...(firstPaint ? [{ label: 'First Paint', value: firstPaint.startTime }] : []),
      ...(fcp ? [{ label: 'First Contentful Paint', value: fcp.startTime }] : []),
    ];
  }, [navEntry]);

  const max = useMemo(() => metrics.reduce((m, x) => Math.max(m, x.value), 0) || 1000, [metrics]);

  return (
    <div className="flex flex-col rounded-xl border border-[#2A2A2A] bg-[#0B0B0E] shadow-sm h-full">
      <div className="p-4 border-b border-[#2A2A2A]">
        <h3 className="text-base font-semibold" style={{ color: '#E0E0E0' }}>Navigation Performance</h3>
      </div>
      <div className="p-4 space-y-4">
        {metrics.length ? (
          metrics.map((m, i) => (
            <MetricBar key={i} label={m.label} valueMs={m.value} maxMs={max} />
          ))
        ) : (
          <p className="text-sm opacity-80" style={{ color: '#E0E0E0' }}>No navigation entries available.</p>
        )}
      </div>
    </div>
  );
};

export default PerformanceCard;
