import React, { useEffect, useMemo, useState } from 'react';
import Hero from './components/Hero.jsx';
import StorageCard, { bytesForString } from './components/StorageCard.jsx';
import MetricsCard from './components/MetricsCard.jsx';
import PerformanceCard from './components/PerformanceCard.jsx';

const useLocalStorageData = () => {
  const [data, setData] = useState([]);
  const refresh = () => {
    try {
      const entries = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        const value = window.localStorage.getItem(key);
        entries.push({ key, value, size: bytesForString(String(value ?? '')) });
      }
      setData(entries);
    } catch (e) {
      setData([]);
    }
  };
  useEffect(() => { refresh(); }, []);
  return { data, refresh };
};

const useSessionStorageData = () => {
  const [data, setData] = useState([]);
  const refresh = () => {
    try {
      const entries = [];
      for (let i = 0; i < window.sessionStorage.length; i++) {
        const key = window.sessionStorage.key(i);
        const value = window.sessionStorage.getItem(key);
        entries.push({ key, value, size: bytesForString(String(value ?? '')) });
      }
      setData(entries);
    } catch (e) {
      setData([]);
    }
  };
  useEffect(() => { refresh(); }, []);
  return { data, refresh };
};

const useCookiesData = () => {
  const [data, setData] = useState([]);
  const refresh = () => {
    try {
      const cookieStr = document.cookie || '';
      if (!cookieStr.trim()) { setData([]); return; }
      const entries = cookieStr.split('; ').map(pair => {
        const eq = pair.indexOf('=');
        if (eq === -1) return { key: pair, value: '' };
        const key = decodeURIComponent(pair.slice(0, eq));
        const value = decodeURIComponent(pair.slice(eq + 1));
        return { key, value };
      });
      setData(entries);
    } catch (e) {
      setData([]);
    }
  };
  useEffect(() => { refresh(); }, []);
  return { data, refresh };
};

const useEnvironmentMetrics = () => {
  const [viewport, setViewport] = useState({ w: 0, h: 0 });
  const [online, setOnline] = useState(navigator.onLine);
  const [connection, setConnection] = useState(() => {
    const c = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return c || null;
  });

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener('resize', onResize);
    const onOnline = () => setOnline(true);
    const onOffline = () => setOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const onConnChange = () => setConnection({ ...conn });
    if (conn && conn.addEventListener) conn.addEventListener('change', onConnChange);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      if (conn && conn.removeEventListener) conn.removeEventListener('change', onConnChange);
    };
  }, []);

  const envItems = useMemo(() => ([
    { label: 'User Agent', value: navigator.userAgent },
    { label: 'Language', value: navigator.language },
    { label: 'Platform', value: navigator.platform },
    { label: 'Screen Resolution', value: `${window.screen.width} × ${window.screen.height}` },
    { label: 'Viewport (Live)', value: `${viewport.w} × ${viewport.h}`, accent: true },
  ]), [viewport]);

  const netItems = useMemo(() => ([
    { label: 'Status', value: online ? 'Online' : 'Offline', dot: online },
    { label: 'Connection Type', value: connection?.effectiveType || 'Unknown' },
    { label: 'Downlink', value: connection?.downlink ? `${connection.downlink} Mbps` : 'Unknown' },
  ]), [online, connection]);

  return { envItems, netItems };
};

const usePerformanceNavigation = () => {
  const [entry, setEntry] = useState(null);
  useEffect(() => {
    const nav = performance.getEntriesByType('navigation');
    if (nav && nav.length) setEntry(nav[0]);
    // also observe future navigations if SPA changes occur
    const po = 'PerformanceObserver' in window ? new PerformanceObserver((list) => {
      const navs = list.getEntries().filter(e => e.entryType === 'navigation');
      if (navs.length) setEntry(navs[0]);
    }) : null;
    try {
      po?.observe({ type: 'navigation', buffered: true });
    } catch {}
    return () => po?.disconnect();
  }, []);
  return entry;
};

function App() {
  const { data: localData, refresh: refreshLocal } = useLocalStorageData();
  const { data: sessionData, refresh: refreshSession } = useSessionStorageData();
  const { data: cookieData } = useCookiesData();
  const { envItems, netItems } = useEnvironmentMetrics();
  const navEntry = usePerformanceNavigation();

  const clearLocal = () => { localStorage.clear(); refreshLocal(); };
  const clearSession = () => { sessionStorage.clear(); refreshSession(); };

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: '#08080A' }}>
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
        <Hero />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 md:gap-6">
          {/* Local Storage */}
          <StorageCard title="Local Storage" entries={localData} onClear={clearLocal} />

          {/* Session Storage */}
          <StorageCard title="Session Storage" entries={sessionData} onClear={clearSession} />

          {/* Cookies */}
          <StorageCard title="Cookies" entries={cookieData} showSizes={false} />

          {/* Environment & Device */}
          <MetricsCard title="Environment & Device" items={envItems} />

          {/* Performance */}
          <PerformanceCard navEntry={navEntry} />

          {/* Network */}
          <MetricsCard title="Network" items={netItems} />
        </div>
      </div>
    </div>
  );
}

export default App;
