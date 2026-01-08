
import React, { useState, useEffect } from 'react';
import { Search, Database, Activity, Info, FileStack, ShieldAlert } from 'lucide-react';
import MovementCard from './features/movements/MovementCard';
import ChatInterface from './features/ai/ChatInterface';
import GlobalMap from './features/dashboard/GlobalMap';
import TimelineChart from './features/dashboard/TimelineChart';
import CategoryBarChart from './features/dashboard/CategoryBarChart';
import RegimeChart from './features/dashboard/RegimeChart';
import { Movement } from './types';
import { getApiUrl } from './config';
import './App.css';
import './features/dashboard/Dashboard.css';

function App() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState(''); // Store the query only after search is triggered
  const [results, setResults] = useState<Movement[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Initial load
  useEffect(() => {
    handleSearch(new Event('submit') as any);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setResults([]); // Clear previous results to prevent AI from analyzing old data with new query
    setSubmittedQuery(query); // Update the query for AI only on submit
    try {
        const res = await fetch(getApiUrl(`/api/search?q=${query}`));
        const data = await res.json();
        setResults(data);
    } catch (err) {
        console.error(err);
    } finally {
        setIsSearching(false);
    }
  };

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="logo">
          <Database className="logo-icon" />
          <span>SocialMovement<span className="accent">Lens</span></span>
        </div>
        <div className="spacer"></div>
        <div className="nav-info">
          <FileStack size={16} />
          <span>Live Data Connected</span>
        </div>
      </header>

      <main className="main-content">
        <section className="hero-section">
          <div className="meta-tag">AI-Powered Research Engine</div>
          <h1>Social Movement <span className="gradient-text">Lens</span></h1>
          <p>Embedding-powered semantic search for global activism. Combining human coding with AI insights.</p>
          
          <form className="search-box" onSubmit={handleSearch}>
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by movement names, tags, or coding themes..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              {isSearching ? <div className="spinner"></div> : 'Query Data'}
            </button>
          </form>
        </section>

        {/* Main Grid Layout */}
        <div className="main-grid-layout">
            
            {/* Left Column: Dashboard + Results */}
            <div className="left-column">
                
                {/* Top Section: 2x2 Dashboard Grid */}
                <section className="dashboard-grid-2x2">
                    <GlobalMap movements={results} />
                    <TimelineChart movements={results} />
                    <CategoryBarChart movements={results} />
                    <RegimeChart movements={results} />
                </section>

                {/* Bottom Row: Results List */}
                <section className="results-panel">
            <div className="panel-header">
              <div className="title-group">
                <Activity size={18} />
                <h2>Verified Movements</h2>
                <span className="count-badge">{results.length} Indexed</span>
              </div>
            </div>
            <div className="scroll-area">
              {results.map(movement => (
                <MovementCard key={movement.id} movement={movement} />
              ))}
              {results.length === 0 && (
                <div className="empty-state">
                  <Info size={40} />
                  <p>No coded movements match this specific cross-reference.</p>
                </div>
              )}
            </div>
                </section>
          </div>

            {/* Right Column: AI Chat (Full Height) */}
            <aside className="right-column ai-panel" style={{ alignSelf: 'start' }}>
            <ChatInterface activeQuery={submittedQuery} results={results} />
          </aside>

        </div>
      </main>
      
      <footer className="footer">
        <div className="status-dot"></div>
        <span>Data Version: 2.4.0 (Synchronized)</span>
        <div className="spacer"></div>
        <span>Built for Social Intelligence Research</span>
      </footer>
    </div>
  );
}

export default App;
