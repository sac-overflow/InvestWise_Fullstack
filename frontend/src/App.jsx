import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Briefcase, 
  ListTodo, 
  Calculator, 
  BrainCircuit, 
  Plus, 
  Trash2, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownRight, 
  Info, 
  CheckCircle,
  HelpCircle,
  AlertCircle,
  FileText
} from 'lucide-react';

const API_BASE = 'http://localhost:8080/api';

// Fallback Mock Data for Offline Mode
const MOCK_ASSETS = [
  { id: 1, symbol: 'AAPL', name: 'Apple Inc.', quantity: 10.0, purchasePrice: 150.00, currentPrice: 175.50, assetType: 'STOCK' },
  { id: 2, symbol: 'TSLA', name: 'Tesla Inc.', quantity: 5.0, purchasePrice: 220.00, currentPrice: 190.00, assetType: 'STOCK' },
  { id: 3, symbol: 'BTC', name: 'Bitcoin', quantity: 0.5, purchasePrice: 35000.00, currentPrice: 62450.00, assetType: 'CRYPTO' },
  { id: 4, symbol: 'ETH', name: 'Ethereum', quantity: 2.5, purchasePrice: 1800.00, currentPrice: 3120.00, assetType: 'CRYPTO' }
];

const MOCK_WATCHLIST = [
  { id: 1, symbol: 'NVDA', name: 'NVIDIA Corp.', assetType: 'STOCK', currentPrice: 950.00 },
  { id: 2, symbol: 'GOOGL', name: 'Alphabet Inc.', assetType: 'STOCK', currentPrice: 175.00 },
  { id: 3, symbol: 'SOL', name: 'Solana', assetType: 'CRYPTO', currentPrice: 155.00 }
];

const MOCK_CALCULATORS = [
  { id: 1, title: 'Early Retirement Plan', initialInvestment: 10000.0, monthlyContribution: 500.0, annualInterestRate: 8.0, years: 15, projectedValue: 178550.0 },
  { id: 2, title: 'House Downpayment', initialInvestment: 5000.0, monthlyContribution: 1000.0, annualInterestRate: 6.0, years: 5, projectedValue: 73560.0 }
];

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isOffline, setIsOffline] = useState(false);
  const [notification, setNotification] = useState(null);

  // Core Data States
  const [assets, setAssets] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [calculators, setCalculators] = useState([]);
  const [riskProfile, setRiskProfile] = useState(null);

  // Form / Loading States
  const [loading, setLoading] = useState(false);
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);

  // Asset Form State
  const [assetForm, setAssetForm] = useState({
    symbol: '',
    name: '',
    quantity: '',
    purchasePrice: '',
    currentPrice: '',
    assetType: 'STOCK'
  });

  // Watchlist Form State
  const [watchlistForm, setWatchlistForm] = useState({
    symbol: '',
    name: '',
    assetType: 'STOCK',
    currentPrice: ''
  });

  // Trigger notifications
  const showNotice = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch Data on Load
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    let offlineDetected = false;

    // 1. Fetch Assets
    try {
      const res = await fetch(`${API_BASE}/assets`);
      if (res.ok) {
        const data = await res.json();
        setAssets(data);
      } else {
        throw new Error();
      }
    } catch (e) {
      offlineDetected = true;
      const stored = localStorage.getItem('iw_assets');
      setAssets(stored ? JSON.parse(stored) : MOCK_ASSETS);
    }

    // 2. Fetch Watchlist
    try {
      const res = await fetch(`${API_BASE}/watchlist`);
      if (res.ok) {
        const data = await res.json();
        setWatchlist(data);
      } else {
        throw new Error();
      }
    } catch (e) {
      offlineDetected = true;
      const stored = localStorage.getItem('iw_watchlist');
      setWatchlist(stored ? JSON.parse(stored) : MOCK_WATCHLIST);
    }

    // 3. Fetch Saved Calculators
    try {
      const res = await fetch(`${API_BASE}/calculators`);
      if (res.ok) {
        const data = await res.json();
        setCalculators(data);
      } else {
        throw new Error();
      }
    } catch (e) {
      offlineDetected = true;
      const stored = localStorage.getItem('iw_calculators');
      setCalculators(stored ? JSON.parse(stored) : MOCK_CALCULATORS);
    }

    // 4. Fetch Latest Risk Profile
    try {
      const res = await fetch(`${API_BASE}/risk-profile/latest`);
      if (res.status === 200) {
        const data = await res.json();
        setRiskProfile(data);
      } else if (res.status === 204) {
        setRiskProfile(null);
      }
    } catch (e) {
      offlineDetected = true;
      const stored = localStorage.getItem('iw_risk_profile');
      if (stored) setRiskProfile(JSON.parse(stored));
    }

    setIsOffline(offlineDetected);
    setLoading(false);
  };

  // Sync to localStorage if offline
  useEffect(() => {
    if (isOffline) {
      localStorage.setItem('iw_assets', JSON.stringify(assets));
      localStorage.setItem('iw_watchlist', JSON.stringify(watchlist));
      localStorage.setItem('iw_calculators', JSON.stringify(calculators));
      if (riskProfile) {
        localStorage.setItem('iw_risk_profile', JSON.stringify(riskProfile));
      }
    }
  }, [assets, watchlist, calculators, riskProfile, isOffline]);

  // -- Asset CRUD Operations --
  const handleAddAsset = async (e) => {
    e.preventDefault();
    const newAsset = {
      symbol: assetForm.symbol.toUpperCase(),
      name: assetForm.name,
      quantity: parseFloat(assetForm.quantity),
      purchasePrice: parseFloat(assetForm.purchasePrice),
      currentPrice: parseFloat(assetForm.currentPrice || assetForm.purchasePrice),
      assetType: assetForm.assetType
    };

    if (isNaN(newAsset.quantity) || isNaN(newAsset.purchasePrice)) {
      showNotice('Please enter valid numerical quantities.', 'error');
      return;
    }

    if (!isOffline) {
      try {
        const res = await fetch(`${API_BASE}/assets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAsset)
        });
        if (res.ok) {
          const savedAsset = await res.json();
          setAssets([...assets, savedAsset]);
          showNotice('Asset added to portfolio!');
        } else {
          throw new Error();
        }
      } catch (err) {
        showNotice('Server error. Adding in offline mode.', 'warning');
        fallbackAddAsset(newAsset);
      }
    } else {
      fallbackAddAsset(newAsset);
    }

    setShowAddAssetModal(false);
    setAssetForm({ symbol: '', name: '', quantity: '', purchasePrice: '', currentPrice: '', assetType: 'STOCK' });
  };

  const fallbackAddAsset = (newAsset) => {
    const item = { ...newAsset, id: Date.now() };
    setAssets([...assets, item]);
    showNotice('Asset added successfully (Offline Mode).');
  };

  const handleDeleteAsset = async (id) => {
    if (!isOffline) {
      try {
        const res = await fetch(`${API_BASE}/assets/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setAssets(assets.filter(a => a.id !== id));
          showNotice('Asset removed from portfolio.');
        } else {
          throw new Error();
        }
      } catch (err) {
        showNotice('Server error. Removing in offline mode.', 'warning');
        setAssets(assets.filter(a => a.id !== id));
      }
    } else {
      setAssets(assets.filter(a => a.id !== id));
      showNotice('Asset removed successfully (Offline Mode).');
    }
  };

  // -- Watchlist Operations --
  const handleAddWatchlist = async (e) => {
    e.preventDefault();
    if (!watchlistForm.symbol) return;

    const newItem = {
      symbol: watchlistForm.symbol.toUpperCase(),
      name: watchlistForm.name || watchlistForm.symbol.toUpperCase(),
      assetType: watchlistForm.assetType,
      currentPrice: parseFloat(watchlistForm.currentPrice) || 0.0
    };

    if (watchlist.some(item => item.symbol === newItem.symbol)) {
      showNotice('Asset is already in your watchlist.', 'error');
      return;
    }

    if (!isOffline) {
      try {
        const res = await fetch(`${API_BASE}/watchlist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newItem)
        });
        if (res.ok) {
          const savedItem = await res.json();
          setWatchlist([...watchlist, savedItem]);
          showNotice('Added to watchlist!');
        } else {
          const errorMsg = await res.text();
          showNotice(errorMsg || 'Failed to add item.', 'error');
        }
      } catch (err) {
        showNotice('Server error. Adding in offline mode.', 'warning');
        fallbackAddWatchlist(newItem);
      }
    } else {
      fallbackAddWatchlist(newItem);
    }

    setWatchlistForm({ symbol: '', name: '', assetType: 'STOCK', currentPrice: '' });
  };

  const fallbackAddWatchlist = (newItem) => {
    const item = { ...newItem, id: Date.now() };
    setWatchlist([...watchlist, item]);
    showNotice('Added to watchlist (Offline Mode).');
  };

  const handleRemoveWatchlist = async (id) => {
    if (!isOffline) {
      try {
        const res = await fetch(`${API_BASE}/watchlist/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setWatchlist(watchlist.filter(item => item.id !== id));
          showNotice('Removed from watchlist.');
        } else {
          throw new Error();
        }
      } catch (err) {
        setWatchlist(watchlist.filter(item => item.id !== id));
      }
    } else {
      setWatchlist(watchlist.filter(item => item.id !== id));
      showNotice('Removed from watchlist (Offline Mode).');
    }
  };

  // Calculated properties for Dashboard
  const portfolioSummary = assets.reduce((acc, asset) => {
    const cost = asset.quantity * asset.purchasePrice;
    const value = asset.quantity * asset.currentPrice;
    const gain = value - cost;
    acc.totalCost += cost;
    acc.totalValue += value;
    acc.totalGain += gain;
    
    if (asset.assetType === 'STOCK') {
      acc.stockValue += value;
    } else if (asset.assetType === 'CRYPTO') {
      acc.cryptoValue += value;
    }
    return acc;
  }, { totalCost: 0, totalValue: 0, totalGain: 0, stockValue: 0, cryptoValue: 0 });

  const totalGainPercent = portfolioSummary.totalCost > 0 
    ? (portfolioSummary.totalGain / portfolioSummary.totalCost) * 100 
    : 0;

  // Render components according to activeTab
  return (
    <div className="app-container">
      {/* Notifications */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          padding: '1rem 1.5rem',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: notification.type === 'error' ? 'var(--color-danger)' : notification.type === 'warning' ? 'var(--color-warning)' : 'var(--color-success)',
          color: '#fff',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          animation: 'slideInRight 0.3s ease'
        }}>
          {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <span style={{ fontWeight: 600 }}>{notification.message}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div>
          <div className="logo-container">
            <div className="logo-icon">
              <TrendingUp size={24} />
            </div>
            <h1 className="logo-text">InvestWise</h1>
          </div>

          <nav className="nav-links">
            <div 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <Briefcase size={20} />
              <span>Dashboard</span>
            </div>
            <div 
              className={`nav-item ${activeTab === 'watchlist' ? 'active' : ''}`}
              onClick={() => setActiveTab('watchlist')}
            >
              <ListTodo size={20} />
              <span>Watchlist</span>
            </div>
            <div 
              className={`nav-item ${activeTab === 'calculator' ? 'active' : ''}`}
              onClick={() => setActiveTab('calculator')}
            >
              <Calculator size={20} />
              <span>Calculator</span>
            </div>
            <div 
              className={`nav-item ${activeTab === 'advisor' ? 'active' : ''}`}
              onClick={() => setActiveTab('advisor')}
            >
              <BrainCircuit size={20} />
              <span>AI Advisor</span>
            </div>
          </nav>
        </div>

        <div>
          <div className="sidebar-footer">
            <RefreshCw 
              size={14} 
              className={loading ? 'spin-anim' : ''} 
              style={{ cursor: 'pointer' }}
              onClick={fetchInitialData} 
            />
            <span>
              {isOffline ? 'Offline Cache Mode' : 'Connected to API'}
            </span>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <DashboardTab 
            assets={assets}
            summary={portfolioSummary}
            gainPercent={totalGainPercent}
            loading={loading}
            onAddAsset={() => setShowAddAssetModal(true)}
            onDeleteAsset={handleDeleteAsset}
          />
        )}

        {activeTab === 'watchlist' && (
          <WatchlistTab 
            watchlist={watchlist}
            watchlistForm={watchlistForm}
            setWatchlistForm={setWatchlistForm}
            onAdd={handleAddWatchlist}
            onRemove={handleRemoveWatchlist}
          />
        )}

        {activeTab === 'calculator' && (
          <CalculatorTab 
            calculators={calculators}
            setCalculators={setCalculators}
            isOffline={isOffline}
            showNotice={showNotice}
          />
        )}

        {activeTab === 'advisor' && (
          <AdvisorTab 
            riskProfile={riskProfile}
            setRiskProfile={setRiskProfile}
            isOffline={isOffline}
            showNotice={showNotice}
          />
        )}
      </main>

      {/* Add Asset Modal */}
      {showAddAssetModal && (
        <div className="modal-backdrop" onClick={() => setShowAddAssetModal(false)}>
          <div className="modal-content card" onClick={(e) => e.stopPropagation()}>
            <h2 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Add Asset to Portfolio</h2>
            <form onSubmit={handleAddAsset}>
              <div className="form-group">
                <label className="form-label">Asset Type</label>
                <select 
                  className="form-input form-select"
                  value={assetForm.assetType}
                  onChange={(e) => setAssetForm({ ...assetForm, assetType: e.target.value })}
                >
                  <option value="STOCK">Stock (Share)</option>
                  <option value="CRYPTO">Cryptocurrency</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Symbol / Ticker</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. AAPL, BTC" 
                  required
                  value={assetForm.symbol}
                  onChange={(e) => setAssetForm({ ...assetForm, symbol: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company / Coin Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Apple Inc." 
                  required
                  value={assetForm.name}
                  onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Quantity Held</label>
                <input 
                  type="number" 
                  step="any"
                  className="form-input" 
                  placeholder="0.00" 
                  required
                  value={assetForm.quantity}
                  onChange={(e) => setAssetForm({ ...assetForm, quantity: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Average Purchase Price ($)</label>
                <input 
                  type="number" 
                  step="any"
                  className="form-input" 
                  placeholder="0.00" 
                  required
                  value={assetForm.purchasePrice}
                  onChange={(e) => setAssetForm({ ...assetForm, purchasePrice: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Current Price ($) [Optional]</label>
                <input 
                  type="number" 
                  step="any"
                  className="form-input" 
                  placeholder="Defaults to purchase price" 
                  value={assetForm.currentPrice}
                  onChange={(e) => setAssetForm({ ...assetForm, currentPrice: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddAssetModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// TAB 1: DASHBOARD TAB
// ----------------------------------------------------
function DashboardTab({ assets, summary, gainPercent, loading, onAddAsset, onDeleteAsset }) {
  const totalAlloc = summary.stockValue + summary.cryptoValue;
  const stockPerc = totalAlloc > 0 ? (summary.stockValue / totalAlloc) * 100 : 0;
  const cryptoPerc = totalAlloc > 0 ? (summary.cryptoValue / totalAlloc) * 100 : 0;

  // Simple SVG doughnut metrics
  const r = 50;
  const circ = 2 * Math.PI * r;
  const stockDash = (stockPerc / 100) * circ;
  const cryptoDash = (cryptoPerc / 100) * circ;

  return (
    <div>
      <header className="section-header">
        <div>
          <h2 className="section-title">Portfolio Analytics</h2>
          <p className="section-subtitle">Real-time valuation of your stock and cryptocurrency assets</p>
        </div>
        <button className="btn btn-primary" onClick={onAddAsset}>
          <Plus size={16} /> Add Asset
        </button>
      </header>

      {/* Analytics widgets */}
      <div className="grid-3">
        <div className="card stat-widget">
          <div className="stat-icon-wrapper" style={{ color: 'var(--color-primary)', background: 'var(--color-primary-glow)' }}>
            <Briefcase size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-title">Net Asset Value</span>
            <span className="stat-value">${summary.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            <span className="stat-subtext" style={{ color: 'var(--text-secondary)' }}>
              Cost Basis: ${summary.totalCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>

        <div className="card stat-widget">
          <div className="stat-icon-wrapper" style={{ 
            color: summary.totalGain >= 0 ? 'var(--color-success)' : 'var(--color-danger)', 
            background: summary.totalGain >= 0 ? 'var(--color-success-glow)' : 'var(--color-danger-glow)' 
          }}>
            {summary.totalGain >= 0 ? <ArrowUpRight size={24} /> : <ArrowDownRight size={24} />}
          </div>
          <div className="stat-details">
            <span className="stat-title">Unrealized P&amp;L</span>
            <span className={`stat-value ${summary.totalGain >= 0 ? 'text-positive' : 'text-negative'}`}>
              {summary.totalGain >= 0 ? '+' : ''}${summary.totalGain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`stat-subtext ${summary.totalGain >= 0 ? 'text-positive' : 'text-negative'}`} style={{ fontWeight: 600 }}>
              {summary.totalGain >= 0 ? '▲' : '▼'} {gainPercent.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="card stat-widget">
          <div className="stat-icon-wrapper" style={{ color: 'var(--color-warning)', background: 'rgba(245, 158, 11, 0.1)' }}>
            <TrendingUp size={24} />
          </div>
          <div className="stat-details">
            <span className="stat-title">Holdings Count</span>
            <span className="stat-value">{assets.length} Assets</span>
            <span className="stat-subtext" style={{ color: 'var(--text-secondary)' }}>
              {assets.filter(a => a.assetType === 'STOCK').length} Stocks | {assets.filter(a => a.assetType === 'CRYPTO').length} Cryptos
            </span>
          </div>
        </div>
      </div>

      <div className="grid-2-1">
        {/* Assets table card */}
        <div className="card" style={{ padding: '1.25rem 0 0 0' }}>
          <div style={{ padding: '0 1.75rem 1rem 1.75rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem' }}>Asset Breakdown</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Prices in USD</span>
          </div>
          
          <div className="table-container">
            {assets.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Briefcase size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                <p>No assets in portfolio. Click "Add Asset" to start tracking.</p>
              </div>
            ) : (
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Qty</th>
                    <th>Avg Buy</th>
                    <th>Current</th>
                    <th>Market Value</th>
                    <th>P&amp;L</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => {
                    const value = asset.quantity * asset.currentPrice;
                    const cost = asset.quantity * asset.purchasePrice;
                    const pl = value - cost;
                    const plPerc = cost > 0 ? (pl / cost) * 100 : 0;
                    return (
                      <tr key={asset.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: '#fff' }}>{asset.symbol}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{asset.name}</div>
                        </td>
                        <td>{asset.quantity}</td>
                        <td>${asset.purchasePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td>${asset.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td style={{ fontWeight: 600 }}>${value.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                        <td className={pl >= 0 ? 'text-positive' : 'text-negative'} style={{ fontWeight: 500 }}>
                          <div>{pl >= 0 ? '+' : ''}${pl.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                          <div style={{ fontSize: '0.75rem' }}>{pl >= 0 ? '▲' : '▼'} {plPerc.toFixed(1)}%</div>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '0.4rem', borderRadius: '6px' }}
                            onClick={() => onDeleteAsset(asset.id)}
                          >
                            <Trash2 size={14} className="text-negative" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Allocation chart card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: '1.5rem' }}>Asset Allocation</h3>

          {totalAlloc === 0 ? (
            <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', height: '200px' }}>
              Add assets to view charts.
            </div>
          ) : (
            <>
              <div className="chart-container" style={{ height: '160px', margin: '1rem 0' }}>
                <svg width="150" height="150" viewBox="0 0 120 120">
                  {/* Background Circle */}
                  <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
                  
                  {/* Stocks Circle */}
                  {stockPerc > 0 && (
                    <circle 
                      cx="60" 
                      cy="60" 
                      r={r} 
                      fill="none" 
                      stroke="var(--color-stock)" 
                      strokeWidth="12" 
                      strokeDasharray={`${stockDash} ${circ}`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                    />
                  )}

                  {/* Cryptos Circle */}
                  {cryptoPerc > 0 && (
                    <circle 
                      cx="60" 
                      cy="60" 
                      r={r} 
                      fill="none" 
                      stroke="var(--color-crypto)" 
                      strokeWidth="12" 
                      strokeDasharray={`${cryptoDash} ${circ}`}
                      strokeDashoffset={-stockDash}
                      strokeLinecap="round"
                      transform="rotate(-90 60 60)"
                    />
                  )}
                </svg>
                <div className="chart-center-text">
                  <div className="chart-center-title">Equity</div>
                  <div className="chart-center-val">{stockPerc.toFixed(0)}%</div>
                </div>
              </div>

              <div className="chart-legend">
                <div className="legend-item">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="legend-color-dot" style={{ background: 'var(--color-stock)' }}></span>
                    <span>Stocks</span>
                  </div>
                  <div style={{ fontWeight: 600, color: '#fff' }}>
                    ${summary.stockValue.toLocaleString('en-US', { maximumFractionDigits: 0 })} ({stockPerc.toFixed(1)}%)
                  </div>
                </div>
                <div className="legend-item">
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span className="legend-color-dot" style={{ background: 'var(--color-crypto)' }}></span>
                    <span>Cryptocurrency</span>
                  </div>
                  <div style={{ fontWeight: 600, color: '#fff' }}>
                    ${summary.cryptoValue.toLocaleString('en-US', { maximumFractionDigits: 0 })} ({cryptoPerc.toFixed(1)}%)
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// TAB 2: WATCHLIST TAB
// ----------------------------------------------------
function WatchlistTab({ watchlist, watchlistForm, setWatchlistForm, onAdd, onRemove }) {
  return (
    <div>
      <header className="section-header">
        <div>
          <h2 className="section-title">Market Watchlist</h2>
          <p className="section-subtitle">Add custom assets to track key indices, stocks, and crypto tokens</p>
        </div>
      </header>

      <div className="grid-2-1">
        {/* Items Watchlist List */}
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: '1.25rem' }}>Currently Tracking</h3>
          
          {watchlist.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <ListTodo size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
              <p>Your watchlist is empty. Add a ticker on the right panel to track.</p>
            </div>
          ) : (
            <div className="watchlist-grid">
              {watchlist.map((item) => (
                <div key={item.id} className="card watchlist-card" style={{ background: 'rgba(0,0,0,0.15)' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>{item.symbol}</span>
                      <span className={`badge ${item.assetType === 'STOCK' ? 'badge-stock' : 'badge-crypto'}`}>
                        {item.assetType}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                      {item.name}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: '#fff' }}>
                        ${item.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>USD</div>
                    </div>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '0.4rem', borderRadius: '6px' }}
                      onClick={() => onRemove(item.id)}
                    >
                      <Trash2 size={14} className="text-danger" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Ticker Card */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: '1.25rem' }}>Track New Ticker</h3>
          <form onSubmit={onAdd}>
            <div className="form-group">
              <label className="form-label">Asset Type</label>
              <select 
                className="form-input form-select"
                value={watchlistForm.assetType}
                onChange={(e) => setWatchlistForm({ ...watchlistForm, assetType: e.target.value })}
              >
                <option value="STOCK">Stock / Index</option>
                <option value="CRYPTO">Cryptocurrency</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ticker Symbol</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. NVDA, SOL, GOOG"
                required
                value={watchlistForm.symbol}
                onChange={(e) => setWatchlistForm({ ...watchlistForm, symbol: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Asset Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Nvidia Corp."
                value={watchlistForm.name}
                onChange={(e) => setWatchlistForm({ ...watchlistForm, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Current Price ($)</label>
              <input 
                type="number" 
                step="any"
                className="form-input" 
                placeholder="0.00"
                required
                value={watchlistForm.currentPrice}
                onChange={(e) => setWatchlistForm({ ...watchlistForm, currentPrice: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'center' }}>
              <Plus size={16} /> Track Ticker
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// TAB 3: COMPOUND INTEREST CALCULATOR TAB
// ----------------------------------------------------
function CalculatorTab({ calculators, setCalculators, isOffline, showNotice }) {
  const [title, setTitle] = useState('');
  const [initialInvestment, setInitialInvestment] = useState(10000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualInterestRate, setAnnualInterestRate] = useState(8);
  const [years, setYears] = useState(10);
  const [calcResult, setCalcResult] = useState(null);

  // Compute compound interest projections
  useEffect(() => {
    runCalculation();
  }, [initialInvestment, monthlyContribution, annualInterestRate, years]);

  const runCalculation = () => {
    const P = initialInvestment;
    const PMT = monthlyContribution;
    const r = annualInterestRate / 100;
    const t = years;
    const n = 12; // Monthly compounding

    // Formula for compound interest with regular contributions:
    // A = P(1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)] * (1 + r/n) (annuity due)
    const nt = n * t;
    const rn = r / n;
    
    let totalValue = P * Math.pow(1 + rn, nt);
    if (rn > 0) {
      totalValue += PMT * ((Math.pow(1 + rn, nt) - 1) / rn) * (1 + rn);
    } else {
      totalValue += PMT * nt;
    }

    const totalContributed = P + (PMT * nt);
    const totalInterest = Math.max(0, totalValue - totalContributed);

    // Make yearly projection curve data for custom rendering
    const yearlyBreakdown = [];
    for (let y = 1; y <= t; y++) {
      let val = P * Math.pow(1 + rn, n * y);
      if (rn > 0) {
        val += PMT * ((Math.pow(1 + rn, n * y) - 1) / rn) * (1 + rn);
      } else {
        val += PMT * n * y;
      }
      const contributed = P + (PMT * n * y);
      yearlyBreakdown.push({
        year: y,
        contributed: Math.round(contributed),
        totalValue: Math.round(val),
        interest: Math.round(Math.max(0, val - contributed))
      });
    }

    setCalcResult({
      finalValue: Math.round(totalValue),
      contributed: Math.round(totalContributed),
      interest: Math.round(totalInterest),
      yearly: yearlyBreakdown
    });
  };

  const handleSaveGoal = async (e) => {
    e.preventDefault();
    if (!title) {
      showNotice('Please provide a title for your goal.', 'error');
      return;
    }

    const goalToSave = {
      title,
      initialInvestment: parseFloat(initialInvestment),
      monthlyContribution: parseFloat(monthlyContribution),
      annualInterestRate: parseFloat(annualInterestRate),
      years: parseInt(years),
      projectedValue: parseFloat(calcResult.finalValue)
    };

    if (!isOffline) {
      try {
        const res = await fetch(`${API_BASE}/calculators`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(goalToSave)
        });
        if (res.ok) {
          const savedGoal = await res.json();
          setCalculators([...calculators, savedGoal]);
          showNotice('Calculation goal saved successfully!');
        } else {
          throw new Error();
        }
      } catch (err) {
        showNotice('Server offline. Saving locally.', 'warning');
        saveLocalGoal(goalToSave);
      }
    } else {
      saveLocalGoal(goalToSave);
    }
    setTitle('');
  };

  const saveLocalGoal = (goalToSave) => {
    const goal = { ...goalToSave, id: Date.now() };
    setCalculators([...calculators, goal]);
    showNotice('Saved goal locally (Offline Mode).');
  };

  const handleDeleteGoal = async (id) => {
    if (!isOffline) {
      try {
        const res = await fetch(`${API_BASE}/calculators/${id}`, { method: 'DELETE' });
        if (res.ok) {
          setCalculators(calculators.filter(g => g.id !== id));
          showNotice('Saved goal deleted.');
        } else {
          throw new Error();
        }
      } catch (err) {
        setCalculators(calculators.filter(g => g.id !== id));
      }
    } else {
      setCalculators(calculators.filter(g => g.id !== id));
      showNotice('Goal deleted (Offline Mode).');
    }
  };

  return (
    <div>
      <header className="section-header">
        <div>
          <h2 className="section-title">Investment Calculator</h2>
          <p className="section-subtitle">Project your compound growth and outline long-term financial goals</p>
        </div>
      </header>

      <div className="grid-2-1">
        {/* Sliders Input Card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: '0.25rem' }}>Growth Parameters</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Adjust variables to calculate projections</p>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <label className="form-label">Initial Principal</label>
              <span className="range-value">${initialInvestment.toLocaleString()}</span>
            </div>
            <div className="range-container">
              <input 
                type="range" 
                min="0" 
                max="500000" 
                step="1000"
                className="range-input" 
                value={initialInvestment} 
                onChange={(e) => setInitialInvestment(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <label className="form-label">Monthly Contribution</label>
              <span className="range-value">${monthlyContribution.toLocaleString()}</span>
            </div>
            <div className="range-container">
              <input 
                type="range" 
                min="0" 
                max="10000" 
                step="50"
                className="range-input" 
                value={monthlyContribution} 
                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <label className="form-label">Expected Annual Return</label>
              <span className="range-value">{annualInterestRate}%</span>
            </div>
            <div className="range-container">
              <input 
                type="range" 
                min="1" 
                max="30" 
                step="0.5"
                className="range-input" 
                value={annualInterestRate} 
                onChange={(e) => setAnnualInterestRate(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
              <label className="form-label">Time Horizon</label>
              <span className="range-value">{years} Years</span>
            </div>
            <div className="range-container">
              <input 
                type="range" 
                min="1" 
                max="40" 
                step="1"
                className="range-input" 
                value={years} 
                onChange={(e) => setYears(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Save Goal Form */}
          <form onSubmit={handleSaveGoal} style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.5rem', display: 'block' }}>Save this scenario</label>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Retirement Goal"
                required
                style={{ flexGrow: 1 }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Save Goal
              </button>
            </div>
          </form>
        </div>

        {/* Results Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card calculator-results">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', marginBottom: '1.25rem' }}>Future Projection</h3>
            
            {calcResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Total Estimated Value
                  </div>
                  <div style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--color-success)', marginTop: '0.2rem' }}>
                    ${calcResult.finalValue.toLocaleString()}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <div className="calc-summary-item">
                    <span style={{ color: 'var(--text-secondary)' }}>Principal Contributed</span>
                    <span style={{ fontWeight: 600, color: '#fff' }}>${calcResult.contributed.toLocaleString()}</span>
                  </div>
                  <div className="calc-summary-item">
                    <span style={{ color: 'var(--text-secondary)' }}>Total Interest Earned</span>
                    <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>${calcResult.interest.toLocaleString()}</span>
                  </div>
                </div>

                {/* SVG Visual Stacked Progress Bar */}
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', background: 'var(--bg-tertiary)' }}>
                    <div style={{ 
                      width: `${(calcResult.contributed / calcResult.finalValue) * 100}%`, 
                      background: '#fff' 
                    }}></div>
                    <div style={{ 
                      width: `${(calcResult.interest / calcResult.finalValue) * 100}%`, 
                      background: 'var(--color-primary)' 
                    }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    <span>Contributed (White)</span>
                    <span>Compound Interest (Blue)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Saved Scenarios List */}
          <div className="card">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem' }}>Saved Scenarios</h3>
            {calculators.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '1rem', textAlign: 'center' }}>
                No saved configurations.
              </p>
            ) : (
              <div className="saved-goals-list">
                {calculators.map(goal => (
                  <div key={goal.id} className="saved-goal-item">
                    <div>
                      <div className="saved-goal-title">{goal.title}</div>
                      <div className="saved-goal-details">
                        ${goal.initialInvestment.toLocaleString()} initial + ${goal.monthlyContribution}/mo | {goal.years} yrs @ {goal.annualInterestRate}%
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--color-success)', fontSize: '1rem' }}>
                        ${goal.projectedValue.toLocaleString()}
                      </span>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '0.35rem', borderRadius: '6px' }}
                        onClick={() => handleDeleteGoal(goal.id)}
                      >
                        <Trash2 size={13} className="text-danger" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// TAB 4: AI FINANCIAL ADVISOR TAB (RISK ASSESSMENT)
// ----------------------------------------------------
function AdvisorTab({ riskProfile, setRiskProfile, isOffline, showNotice }) {
  const [step, setStep] = useState(0);
  const [assessmentInputs, setAssessmentInputs] = useState({
    ageGroup: '',
    investmentGoal: '',
    marketReaction: '',
    investmentHorizon: '',
    knowledgeLevel: ''
  });
  const [loading, setLoading] = useState(false);

  // Questionnaire configurations
  const QUESTIONS = [
    {
      key: 'ageGroup',
      question: 'What is your current age group?',
      options: [
        { label: 'Under 30 years', value: 'Under 30', description: 'Long-term investment horizon with high recovery capability.' },
        { label: '30 to 45 years', value: '30-45', description: 'Established career seeking balance of growth and capital safety.' },
        { label: '45 to 60 years', value: '45-60', description: 'Pre-retirement stage transitioning to conservative asset classes.' },
        { label: 'Over 60 years', value: 'Over 60', description: 'Capital preservation and regular income generation focus.' }
      ]
    },
    {
      key: 'investmentGoal',
      question: 'What is your primary investment goal?',
      options: [
        { label: 'Maximum Capital Growth', value: 'Wealth accumulation', description: 'Aggressively compound funds over the long run.' },
        { label: 'Retirement Security', value: 'Retirement', description: 'Build a robust nest egg for a worry-free future.' },
        { label: 'Saving for a major life event', value: 'Saving for a big purchase', description: 'Goal-driven saving with fixed timelines (house, college).' },
        { label: 'Income Preservation', value: 'Income generation', description: 'Generate steady cash flow and dividend yields.' }
      ]
    },
    {
      key: 'marketReaction',
      question: 'How would you react to a sudden 20% drop in your portfolio?',
      options: [
        { label: 'Buy More (Opportunistic)', value: 'Buy more', description: 'View market dips as buying opportunities for discounted assets.' },
        { label: 'Do Nothing (Hold)', value: 'Do nothing', description: 'Accept volatility as a normal part of long-term cycles.' },
        { label: 'Sell Everything (Risk-averse)', value: 'Sell everything', description: 'Liquidate assets immediately to protect remaining capital.' }
      ]
    },
    {
      key: 'investmentHorizon',
      question: 'What is your expected investment timeframe?',
      options: [
        { label: 'More than 15 years', value: '15+ years', description: 'Ultra long-term; short term price drops are insignificant.' },
        { label: '7 to 15 years', value: '7-15 years', description: 'Medium to long term; comfortable with multiple cycles.' },
        { label: '3 to 7 years', value: '3-7 years', description: 'Short to medium term; seeking structured hybrid returns.' },
        { label: 'Less than 3 years', value: '<3 years', description: 'Short term; capital preservation is critical.' }
      ]
    },
    {
      key: 'knowledgeLevel',
      question: 'Rate your overall financial investment knowledge:',
      options: [
        { label: 'Expert (Sophisticated)', value: 'Expert', description: 'Understand derivatives, market liquidity, and asset valuations.' },
        { label: 'Intermediate (Experienced)', value: 'Intermediate', description: 'Familiar with ETF allocation, compounding rates, and indexes.' },
        { label: 'Beginner (Learning)', value: 'Beginner', description: 'Understand simple banking structures, basic stock concepts.' }
      ]
    }
  ];

  const handleSelectOption = (key, value) => {
    setAssessmentInputs({ ...assessmentInputs, [key]: value });
    
    // Automatically transition to next step after short delay
    setTimeout(() => {
      if (step < QUESTIONS.length - 1) {
        setStep(step + 1);
      }
    }, 200);
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmitAssessment = async () => {
    setLoading(true);
    
    if (!isOffline) {
      try {
        const res = await fetch(`${API_BASE}/risk-profile/assess`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(assessmentInputs)
        });
        if (res.ok) {
          const profile = await res.json();
          setRiskProfile(profile);
          showNotice('Assessment submitted successfully!');
        } else {
          throw new Error();
        }
      } catch (err) {
        showNotice('Server error. Evaluating locally.', 'warning');
        evaluateOfflineRisk();
      }
    } else {
      evaluateOfflineRisk();
    }
    setLoading(false);
  };

  const evaluateOfflineRisk = () => {
    // Scoring logic duplicate for client-side fallback
    let score = 0;
    
    switch (assessmentInputs.ageGroup) {
      case 'Under 30': score += 5; break;
      case '30-45': score += 4; break;
      case '45-60': score += 2; break;
      case 'Over 60': score += 1; break;
    }

    switch (assessmentInputs.investmentGoal) {
      case 'Wealth accumulation': score += 5; break;
      case 'Retirement': score += 3; break;
      case 'Saving for a big purchase': score += 2; break;
      case 'Income generation': score += 1; break;
    }

    switch (assessmentInputs.marketReaction) {
      case 'Buy more': score += 5; break;
      case 'Do nothing': score += 3; break;
      case 'Sell everything': score += 1; break;
    }

    switch (assessmentInputs.investmentHorizon) {
      case '15+ years': score += 5; break;
      case '7-15 years': score += 4; break;
      case '3-7 years': score += 2; break;
      case '<3 years': score += 1; break;
    }

    switch (assessmentInputs.knowledgeLevel) {
      case 'Expert': score += 5; break;
      case 'Intermediate': score += 3; break;
      case 'Beginner': score += 1; break;
    }

    let category = "Balanced";
    let strategy = "";
    if (score <= 9) {
      category = "Conservative";
      strategy = "### Your Investment Persona: **Conservative** (Score: " + score + "/25)\n\n" +
        "#### Recommended Asset Allocation\n" +
        "*   **Fixed Income (Bonds/FDs):** 60%\n" +
        "*   **Equities (Large Cap/Index Funds):** 20%\n" +
        "*   **Gold & Commodities:** 15%\n" +
        "*   **Cash & Liquid Funds:** 5%\n\n" +
        "#### Advisor Insights\n" +
        "Based on your risk profile, capital preservation is your primary objective. High equity exposure is not recommended due to market volatility. Focus on high-quality bonds and dividend-paying stocks to secure a steady income stream.\n\n" +
        "#### Actionable Steps\n" +
        "1. **Emergency Fund:** Ensure 6-12 months of expenses are kept in liquid funds.\n" +
        "2. **Core Portfolio:** Invest in low-cost government bond ETFs or corporate bonds.\n" +
        "3. **Equity Exposure:** Limit stock investments to blue-chip companies with stable earnings.";
    } else if (score <= 14) {
      category = "Moderately Conservative";
      strategy = "### Your Investment Persona: **Moderately Conservative** (Score: " + score + "/25)\n\n" +
        "#### Recommended Asset Allocation\n" +
        "*   **Fixed Income (Bonds/FDs):** 45%\n" +
        "*   **Equities (Large Cap/Index Funds):** 40%\n" +
        "*   **Gold & Commodities:** 10%\n" +
        "*   **Cash & Liquid Funds:** 5%\n\n" +
        "#### Advisor Insights\n" +
        "You are looking for modest growth while maintaining a buffer against severe market downturns. A hybrid portfolio of equities and debt will help achieve this. Large-cap stock indexes will drive growth, while bonds mitigate volatility.\n\n" +
        "#### Actionable Steps\n" +
        "1. **Asset Mix:** Focus on Balanced Advantage Funds or Conservative Hybrid Mutual Funds.\n" +
        "2. **Growth Core:** Invest in Large-Cap index funds.\n" +
        "3. **Protection:** Hold 45% in top-rated debt mutual funds or high-yield savings accounts.";
    } else if (score <= 19) {
      category = "Balanced";
      strategy = "### Your Investment Persona: **Balanced** (Score: " + score + "/25)\n\n" +
        "#### Recommended Asset Allocation\n" +
        "*   **Equities (Large/Mid Cap):** 60%\n" +
        "*   **Fixed Income (Bonds/Debt):** 25%\n" +
        "*   **Gold & Commodities:** 10%\n" +
        "*   **Cryptocurrencies / Alternatives:** 5%\n\n" +
        "#### Advisor Insights\n" +
        "A balanced approach fits you perfectly. You seek long-term capital appreciation but want a safety net during bear markets. You are comfortable with moderate swings and can allocate a small portion to speculative assets like crypto.\n\n" +
        "#### Actionable Steps\n" +
        "1. **Diversify:** Establish a 60/40 or 70/30 stock-to-bond portfolio.\n" +
        "2. **Core Equities:** Invest in Broad Market index funds (70% of equity part) and Mid-Cap growth funds (30% of equity part).\n" +
        "3. **Alternative Exposure:** Allocate 5% of your portfolio to top-tier cryptocurrencies (Bitcoin/Ethereum) to capture growth trends.";
    } else if (score <= 22) {
      category = "Growth";
      strategy = "### Your Investment Persona: **Growth** (Score: " + score + "/25)\n\n" +
        "#### Recommended Asset Allocation\n" +
        "*   **Equities (Large/Mid/Small Cap):** 75%\n" +
        "*   **Fixed Income (Bonds):** 10%\n" +
        "*   **Cryptocurrencies / Alternatives:** 10%\n" +
        "*   **Cash & Liquid Funds:** 5%\n\n" +
        "#### Advisor Insights\n" +
        "You seek substantial wealth accumulation over a longer horizon. You can tolerate short-to-medium-term drawdowns in exchange for outsized returns. Growth-oriented equities and high-conviction alternative assets should form the core of your holdings.\n\n" +
        "#### Actionable Steps\n" +
        "1. **Core Growth:** Focus on Sectoral ETFs (Technology, Healthcare) and Mid-Cap/Small-Cap funds.\n" +
        "2. **Regular SIPs:** Set up automated monthly investments to benefit from dollar-cost averaging.\n" +
        "3. **Crypto Allocation:** Limit crypto and high-risk plays to 10% maximum to manage total downside risk.";
    } else {
      category = "Aggressive";
      strategy = "### Your Investment Persona: **Aggressive** (Score: " + score + "/25)\n\n" +
        "#### Recommended Asset Allocation\n" +
        "*   **Equities (Small/Mid Cap, Growth, Sectoral):** 85%\n" +
        "*   **Cryptocurrencies / Alternatives:** 10%\n" +
        "*   **Cash & Liquid Funds:** 5%\n" +
        "*   **Fixed Income:** 0%\n\n" +
        "#### Advisor Insights\n" +
        "You are an aggressive investor looking for maximum compound growth. You view market drops as buying opportunities and have a long time horizon. A heavily equity and alternative asset-skewed portfolio is appropriate for your goals.\n\n" +
        "#### Actionable Steps\n" +
        "1. **Aggressive Equities:** Build a core of tech/growth stocks, mid-cap ETFs, and emerging market funds.\n" +
        "2. **Opportunistic Buying:** Keep 5% cash to buy during major market corrections.\n" +
        "3. **Risk Management:** Rebalance annually to ensure your volatile crypto or single-stock holdings do not grow to consume too much of your portfolio.";
    }

    const mockProfile = {
      id: Date.now(),
      ...assessmentInputs,
      riskScore: score,
      riskCategory: category,
      investmentStrategy: strategy
    };
    setRiskProfile(mockProfile);
    showNotice('Calculated risk profile locally (Offline Mode).');
  };

  const handleRetake = () => {
    setAssessmentInputs({
      ageGroup: '',
      investmentGoal: '',
      marketReaction: '',
      investmentHorizon: '',
      knowledgeLevel: ''
    });
    setStep(0);
    setRiskProfile(null);
  };

  // Render Risk Profile Results
  if (riskProfile) {
    // Parse Recommended Asset Allocation from Markdown
    const matches = riskProfile.investmentStrategy.match(/\*\s+\*\*([^*]+)\*\*:\s*(\d+)%/g) || [];
    const allocation = matches.map(m => {
      const parts = m.split(':');
      const name = parts[0].replace(/\*\s+\*\*/, '').replace(/\*\*/, '').trim();
      const value = parseInt(parts[1].trim());
      return { name, value };
    });

    const isAggressive = riskProfile.riskCategory === 'Aggressive';
    const isConservative = riskProfile.riskCategory === 'Conservative';

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 className="section-title">Your AI Portfolio Strategy</h2>
            <p className="section-subtitle">Custom recommendation based on your financial goals &amp; risk tolerances</p>
          </div>
          <button className="btn btn-secondary" onClick={handleRetake}>
            Retake Assessment
          </button>
        </div>

        <div className="card advisor-result-grid" style={{ minHeight: '400px' }}>
          {/* Visual Pie Chart allocation */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid var(--glass-border)', paddingRight: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Risk Classification
              </div>
              <div style={{ 
                fontSize: '1.75rem', 
                fontFamily: 'var(--font-heading)', 
                fontWeight: 800, 
                color: isAggressive ? 'var(--color-danger)' : isConservative ? 'var(--color-success)' : 'var(--color-primary)',
                marginTop: '0.25rem' 
              }}>
                {riskProfile.riskCategory}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Score: {riskProfile.riskScore} / 25
              </div>
            </div>

            {/* Custom SVG doughnut chart for Risk Target Allocation */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', margin: '2rem 0' }}>
              <svg width="140" height="140" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
                {(() => {
                  let accumulatedOffset = 0;
                  const circ = 2 * Math.PI * 50;
                  const COLORS = ['#6366f1', '#10b981', '#fbbf24', '#f43f5e', '#3b82f6'];
                  
                  return allocation.map((item, idx) => {
                    const dashLen = (item.value / 100) * circ;
                    const el = (
                      <circle 
                        key={idx}
                        cx="60" 
                        cy="60" 
                        r="50" 
                        fill="none" 
                        stroke={COLORS[idx % COLORS.length]} 
                        strokeWidth="12" 
                        strokeDasharray={`${dashLen} ${circ}`}
                        strokeDashoffset={-accumulatedOffset}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                      />
                    );
                    accumulatedOffset += dashLen;
                    return el;
                  });
                })()}
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Target</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>100%</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {allocation.map((item, idx) => {
                const COLORS = ['#6366f1', '#10b981', '#fbbf24', '#f43f5e', '#3b82f6'];
                return (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[idx % COLORS.length] }}></span>
                      <span style={{ color: 'var(--text-secondary)' }}>{item.name}</span>
                    </div>
                    <span style={{ fontWeight: 600, color: '#fff' }}>{item.value}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strategy Details in Markdown parsed style */}
          <div className="advisor-strategy-content" style={{ paddingLeft: '0.5rem', maxHeight: '420px', overflowY: 'auto' }}>
            <div dangerouslySetInnerHTML={{ 
              __html: formatMarkdownToHtml(riskProfile.investmentStrategy) 
            }} />
          </div>
        </div>
      </div>
    );
  }

  // Render Wizard Questionnaire Steps
  const curQ = QUESTIONS[step];
  const progressPercent = ((step + 1) / QUESTIONS.length) * 100;

  return (
    <div className="advisor-wizard">
      <header className="section-header" style={{ justifyContent: 'center', textAlign: 'center', flexDirection: 'column' }}>
        <h2 className="section-title">AI Financial Advisor</h2>
        <p className="section-subtitle">Complete this questionnaire for an evolutionary investment strategy</p>
      </header>

      <div className="card" style={{ padding: '2rem' }}>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          <span>Step {step + 1} of {QUESTIONS.length}</span>
          <span>{progressPercent.toFixed(0)}% Complete</span>
        </div>

        <h3 className="wizard-question">{curQ.question}</h3>

        <div className="wizard-options">
          {curQ.options.map((opt, idx) => (
            <button 
              key={idx}
              className={`wizard-option-btn ${assessmentInputs[curQ.key] === opt.value ? 'selected' : ''}`}
              onClick={() => handleSelectOption(curQ.key, opt.value)}
            >
              <div>
                <div style={{ fontWeight: 600, color: '#fff' }}>{opt.label}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  {opt.description}
                </div>
              </div>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.2)',
                background: assessmentInputs[curQ.key] === opt.value ? 'var(--color-primary)' : 'transparent',
                boxShadow: assessmentInputs[curQ.key] === opt.value ? '0 0 0 3px rgba(99, 102, 241, 0.25)' : 'none',
                display: 'inline-flex'
              }}></div>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={handleBack}
            disabled={step === 0}
            style={{ opacity: step === 0 ? 0.3 : 1, cursor: step === 0 ? 'not-allowed' : 'pointer' }}
          >
            Back
          </button>

          {step === QUESTIONS.length - 1 ? (
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleSubmitAssessment}
              disabled={!assessmentInputs[curQ.key] || loading}
            >
              {loading ? 'Analyzing...' : 'Generate AI Advice'}
            </button>
          ) : (
            <button 
              type="button" 
              className="btn btn-secondary"
              disabled={true}
              style={{ opacity: 0.3, cursor: 'not-allowed' }}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple Helper to Parse Core Advisor Markdown to HTML
function formatMarkdownToHtml(markdown) {
  if (!markdown) return '';
  let html = markdown;

  // Headers
  html = html.replace(/### (.*)/g, '<h3>$1</h3>');
  html = html.replace(/#### (.*)/g, '<h4>$1</h4>');
  
  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Lists
  html = html.replace(/\*\s+(.*)/g, '<li>$1</li>');
  html = html.replace(/\d+\.\s+(.*)/g, '<li>$1</li>');
  
  // Bundle list items
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1<\/ul>');
  
  return html;
}

export default App;
