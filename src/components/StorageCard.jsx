import React, { useMemo, useState } from 'react';

function bytesForString(str) {
  try {
    return new Blob([str]).size;
  } catch {
    return str ? str.length : 0;
  }
}

const ConfirmDialog = ({ open, title, description, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={onCancel} />
      <div className="relative w-[92vw] max-w-md rounded-lg border border-[#2A2A2A] bg-[#0E0E12] p-6 shadow-xl">
        <h3 className="text-lg font-semibold" style={{ color: '#E0E0E0' }}>{title}</h3>
        <p className="mt-2 text-sm opacity-80" style={{ color: '#E0E0E0' }}>{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-3 py-2 rounded-md border border-[#2A2A2A] text-sm hover:bg-white/5"
            style={{ color: '#E0E0E0' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-2 rounded-md text-sm font-medium"
            style={{ backgroundColor: '#00E5FF', color: '#08080A' }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

const StorageCard = ({ title, entries, showSizes = true, onClear }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { totalItems, totalBytes } = useMemo(() => {
    if (!entries) return { totalItems: 0, totalBytes: 0 };
    const total = entries.reduce((acc, e) => acc + (showSizes ? (e.size || 0) : 0), 0);
    return { totalItems: entries.length, totalBytes: total };
  }, [entries, showSizes]);

  const totalKB = useMemo(() => (totalBytes / 1024).toFixed(2), [totalBytes]);

  return (
    <div className="flex flex-col rounded-xl border border-[#2A2A2A] bg-[#0B0B0E] shadow-sm h-full">
      <div className="p-4 border-b border-[#2A2A2A]">
        <h3 className="text-base font-semibold" style={{ color: '#E0E0E0' }}>{title}</h3>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="opacity-90" style={{ color: '#E0E0E0' }}>Total Items: <span style={{ color: '#00E5FF' }}>{totalItems}</span></div>
          {showSizes && (
            <div className="opacity-90" style={{ color: '#E0E0E0' }}>Total Size: <span style={{ color: '#00E5FF' }}>{totalKB}</span> KB</div>
          )}
        </div>
        <div className="relative min-h-0 flex-1">
          <div className="absolute inset-0 overflow-auto rounded-lg border border-[#2A2A2A]">
            <table className="min-w-full text-sm" style={{ color: '#E0E0E0' }}>
              <thead className="sticky top-0 bg-[#0E0E12]">
                <tr>
                  <th className="text-left px-3 py-2 font-medium border-b border-[#2A2A2A]">Key</th>
                  <th className="text-left px-3 py-2 font-medium border-b border-[#2A2A2A]">Value</th>
                  {showSizes && (
                    <th className="text-left px-3 py-2 font-medium border-b border-[#2A2A2A]">Size (bytes)</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {(entries && entries.length > 0) ? (
                  entries.map((row, idx) => (
                    <tr key={idx} className="hover:bg-white/5">
                      <td className="px-3 py-2 align-top max-w-[220px]">
                        <div className="truncate" title={row.key}>{row.key}</div>
                      </td>
                      <td className="px-3 py-2 align-top max-w-[360px]">
                        <div className="truncate" title={row.value}>{row.value}</div>
                      </td>
                      {showSizes && (
                        <td className="px-3 py-2 align-top w-[120px] opacity-80">{row.size}</td>
                      )}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-3 py-6 text-center opacity-70" colSpan={showSizes ? 3 : 2}>No data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {onClear && (
        <div className="p-4 border-t border-[#2A2A2A] flex items-center justify-end">
          <button
            onClick={() => setConfirmOpen(true)}
            className="px-3 py-2 rounded-md border border-[#2A2A2A] text-sm hover:bg-white/5"
            style={{ color: '#E0E0E0' }}
          >
            Clear {title}
          </button>
        </div>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title={`Clear ${title}?`}
        description={`This action will remove all entries from ${title.toLowerCase()}. This cannot be undone.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => { setConfirmOpen(false); onClear && onClear(); }}
      />
    </div>
  );
};

export default StorageCard;
export { bytesForString };
