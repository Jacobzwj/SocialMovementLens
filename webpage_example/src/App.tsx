
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

const SUGGESTED_QUERIES = [
  "#OscarsSoWhite",
  "Anti-Austerity",
  "Refugees",
  "2014",
  "Europe",
  "Feminism",
  "种族相关的"
];

function App() {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState(''); // Store the query only after search is triggered
  const [results, setResults] = useState<Movement[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Initial load
  useEffect(() => {
    executeSearch('');
  }, []);

  const executeSearch = async (searchTerm: string) => {
    setIsSearching(true);
    setResults([]); 
    setSubmittedQuery(searchTerm);
    try {
        const res = await fetch(getApiUrl(`/api/search?q=${searchTerm}`));
        const data = await res.json();
        setResults(data);
    } catch (err) {
        console.error(err);
    } finally {
        setIsSearching(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(query);
  };

  const handleQuickSearch = (suggestion: string) => {
    setQuery(suggestion);
    executeSearch(suggestion);
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
          <div className="meta-tag">AI Agent-Powered Research Engine</div>
          <h1>Social Movement <span className="gradient-text">Lens</span></h1>
          <p>Embedding-powered semantic search for global activism. Combining human coding with autonomous AI Agent insights.</p>
          
          <form className="search-box" onSubmit={handleSearch}>
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder="Search movements, hashtags, topics, years (multilingual supported)..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              {isSearching ? <div className="spinner"></div> : 'Query Data'}
            </button>
          </form>

          {/* Quick Suggestions */}
          <div className="suggestion-chips">
            <span className="suggestion-label">Try searching:</span>
            {SUGGESTED_QUERIES.map((q) => (
              <button 
                key={q} 
                className="chip"
                onClick={() => handleQuickSearch(q)}
              >
                {q}
              </button>
            ))}
          </div>
        </section>

        {/* Main Grid Layout */}
        <div className="main-grid-layout">
            
            {/* Left Column: Dashboard + Results */}
            <div className="left-column">
                
                {/* Unified Results Header (Now controls both Visuals and List) */}
                <div className="section-header">
                    <div className="title-group">
                        <Activity size={20} className="text-accent" />
                        <h2>
                            {submittedQuery ? (
                                <>Visualizing Results for: <span className="highlight-query">{submittedQuery}</span></>
                            ) : (
                                <>Visualizing Results for: <span className="highlight-query">Top 20 Movements by Twitter Impact (Default)</span></>
                            )}
                        </h2>
                        <span className="count-badge">{results.length} Found</span>
                    </div>
                </div>

                {/* Top Section: 2x2 Dashboard Grid */}
                <section className="dashboard-grid-2x2">
                    <GlobalMap movements={results} />
                    <TimelineChart movements={results} />
                    <CategoryBarChart movements={results} />
                    <RegimeChart movements={results} />
                </section>

                {/* Bottom Row: Results List */}
                <section className="results-panel">
                    {/* Inner header removed since we have the top one now, 
                        but we keep a subtle label for the list itself if needed, 
                        or just keep it clean. Let's keep a minimal label. */}
                    <div className="panel-header-minimal">
                        <h3>
                            {submittedQuery ? (
                                <>Detailed Movement Records for: <span className="highlight-query">{submittedQuery}</span></>
                            ) : (
                                <>Detailed Movement Records for: <span className="highlight-query">Top 20 Movements by Twitter Impact (Default)</span></>
                            )}
                        </h3>
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

        {/* Funding & Acknowledgements Section */}
        <section className="footer-info-section">
            <div className="footer-info-content">
                <div className="footer-column">
                    <h3>Funding</h3>
                    <p>This work was supported by the Hong Kong Research Grants Council under GRF: 14601723 (PI: Hai Liang, <a href="mailto:hailiang@cuhk.edu.hk" style={{ color: '#3b82f6', textDecoration: 'none' }}>hailiang@cuhk.edu.hk</a>).</p>
                </div>
                <div className="footer-column">
                    <h3>Acknowledgements</h3>
                    <p>We would like to thank Nathan L.T. Tsang and Wangjiang Zhang for their assistance with data collection, as well as Sidi Huang, Yingdan Lu, Yilang Peng, and Cindy Shen for refining the coding scheme and performing manual coding and checking.</p>
                </div>
            </div>
        </section>

      </main>
    </div>
  );
}

export default App;
