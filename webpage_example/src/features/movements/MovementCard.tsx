import React, { useState, useEffect } from 'react';
import { 
    Calendar, MapPin, TrendingUp, FileText, ChevronDown, ChevronUp, 
    UserCheck, ShieldCheck, Zap, Twitter, Star, MessageSquare, 
    Clock, Repeat, Users, ExternalLink, BookOpen 
} from 'lucide-react';
import { Movement, Rationale } from '../../types';
import './MovementCard.css';

interface Props {
  movement: Movement;
}

const MovementCard: React.FC<Props> = ({ movement }) => {
  const [showCoding, setShowCoding] = useState(false);
  // REMOVED: const [rationales, setRationales] = useState<Rationale[]>([]);
  // REMOVED: const [loading, setLoading] = useState(false);

  /* REMOVED: useEffect for fetching rationales - data is now pre-loaded
  useEffect(() => {
    if (showCoding && rationales.length === 0) { ... }
  }, [showCoding, movement.id, rationales.length]);
  */

  // Calculate similarity color
  const getSimColor = (score: number) => {
    if (score >= 40) return '#10b981';
    if (score >= 25) return '#3b82f6';
    return '#a1a1aa';
  };

  // Helper to generate stars
  const renderStars = (rating: number) => {
      return [...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            fill={i < rating ? "#eab308" : "none"} 
            stroke={i < rating ? "#eab308" : "#52525b"} 
            style={{ marginRight: 2 }}
          />
      ));
  };

  // Process Twitter Query: Take only the first term
  const rawQuery = movement.twitter_query || movement.hashtag || "";
  // Split by comma or space to get the first tag/term
  const firstTerm = rawQuery.split(/[\s,]+/)[0].replace(/['"]+/g, '');
  
  const twitterLink = rawQuery 
    ? (rawQuery.startsWith('http') 
        ? rawQuery 
        : `https://twitter.com/search?q=${encodeURIComponent(rawQuery)}`)
    : null;

  return (
    <div className={`movement-card-v2 ${showCoding ? 'expanded' : ''}`}>
      <div className="card-primary">
        <div className="card-header">
          <div>
            <div className="header-top-row">
                {/* REMOVED: Redundant Type Badge */}
                
                {movement.similarity !== undefined && (
                    <div className="similarity-badge tooltip-container" 
                         data-tooltip="Semantic Match Score (Vector Similarity)"
                         style={{ borderColor: getSimColor(movement.similarity), color: getSimColor(movement.similarity) }}>
                        <Zap size={10} fill={getSimColor(movement.similarity)} />
                        <span>{movement.similarity}% Match</span>
                    </div>
                )}
            </div>
            
            <h3 className="movement-name">{movement.name}</h3>
            
            <div className="links-row">
                {/* Twitter Link */}
                {twitterLink && (
                    <a href={twitterLink} target="_blank" rel="noopener noreferrer" className="twitter-link" title="Search on Twitter">
                        <Twitter size={12} />
                        <span>{firstTerm}</span>
                        <ExternalLink size={10} />
                    </a>
                )}

                {/* Wikipedia Link (Moved here) */}
                {movement.wikipedia && (
                    <a href={movement.wikipedia} target="_blank" rel="noopener noreferrer" className="wiki-link" title="Read on Wikipedia">
                        <BookOpen size={12} />
                        <span>Wiki</span>
                        <ExternalLink size={10} />
                    </a>
                )}
            </div>
          </div>

          {/* Impact Score as Stars */}
          <div className="impact-stars-container">
            <div className="stars-row">
                {renderStars(movement.star_rating)}
            </div>
            <span className="score-label">Twitter Impact ({movement.twitter_penetration || 'N/A'})</span>
          </div>
        </div>
        
        {/* Expanded Stats Grid with Tooltips */}
        <div className="stats-grid">
            {/* Row 1 */}
            <div className="stat-item tooltip-container" data-tooltip="Start Year">
                <Calendar size={14} className="stat-icon"/> 
                <span className="stat-val">{movement.year}</span>
            </div>
            <div className="stat-item tooltip-container" data-tooltip="Geographic Region (ISO Code)">
                <MapPin size={14} className="stat-icon"/> 
                <span className="stat-val">{movement.region} ({movement.iso || 'Global'})</span>
            </div>
            <div className="stat-item tooltip-container" data-tooltip="Total Tweet Volume">
                <MessageSquare size={14} className="stat-icon"/> 
                <span className="stat-val">{movement.tweets_count} Tweets</span>
            </div>

            {/* Row 2 */}
            <div className="stat-item tooltip-container" data-tooltip="Duration in Days">
                <Clock size={14} className="stat-icon"/> 
                <span className="stat-val">
                    {movement.length_days && movement.length_days.toLowerCase().includes('ongoing') 
                        ? 'Ongoing' 
                        : `${movement.length_days} Days`}
                </span>
            </div>
            <div className="stat-item tooltip-container" data-tooltip="Reoccurrence Frequency">
                <Repeat size={14} className="stat-icon"/> 
                <span className="stat-val">
                    {(!movement.reoccurrence || movement.reoccurrence.toLowerCase() === 'no') 
                        ? 'Once' 
                        : movement.reoccurrence}
                </span>
            </div>
            
            {/* REMOVED: Outcome from Grid */}
            <div className="stat-item empty-stat">
                {/* Placeholder to keep grid aligned if needed, or CSS grid will handle it. 
                    Actually CSS grid 3 cols will leave a hole if we have 5 items. 
                    Let's just remove it and let the grid flow. */}
            </div>
        </div>

        {/* --- New Details Section --- */}
        <div className="details-expanded">
            {/* Column 1: Profile */}
            <div className="details-col">
                <span className="col-header">Movement Profile</span>
                <div className="detail-row"><span className="label">Kind:</span> <span className="val">{movement.kind}</span></div>
                <div className="detail-row"><span className="label">Grassroots:</span> <span className="val">{movement.grassroots}</span></div>
                <div className="detail-row"><span className="label">SMO Leaders:</span> <span className="val">{movement.smo_leader}</span></div>
                <div className="detail-row"><span className="label">Participants:</span> <span className="val">{movement.key_participants}</span></div>
                <div className="detail-row"><span className="label">Offline:</span> <span className="val">{movement.offline_presence}</span></div>
            </div>

            {/* Column 2: Consequences */}
            <div className="details-col">
                <span className="col-header">Consequences</span>
                
                {/* Outcome - Highlighted */}
                <div className="detail-row" style={{ marginBottom: 8 }}>
                    <span className="label">Outcome:</span> 
                    <span className="val" style={{ fontWeight: 600, color: '#f4f4f5' }}>{movement.outcome_raw}</span>
                </div>

                {/* State Response */}
                <div className="detail-row">
                    <span className="label">State Resp:</span>
                    <div className="response-grid">
                        <span className={`resp-tag ${movement.state_accommodation.toLowerCase() === 'yes' ? 'active' : ''}`}>Accommodation</span>
                        <span className={`resp-tag ${movement.state_distraction.toLowerCase() === 'yes' ? 'active' : ''}`}>Distraction</span>
                        <span className={`resp-tag ${movement.state_repression.toLowerCase() === 'yes' ? 'active' : ''}`}>Repression</span>
                        <span className={`resp-tag ${movement.state_ignore.toLowerCase() === 'yes' ? 'active' : ''}`}>Ignore</span>
                    </div>
                </div>

                {/* Casualties (Moved here) */}
                {(movement.injuries !== '0' || movement.deaths !== '0' || movement.arrests !== '0') && (
                    <div className="detail-row" style={{ marginTop: 8 }}>
                        <span className="label">Casualties:</span>
                        <div className="casualty-list">
                            {movement.injuries !== '0' && <span className="cas-tag">🤕 {movement.injuries} Injured</span>}
                            {movement.deaths !== '0' && <span className="cas-tag">💀 {movement.deaths} Deaths</span>}
                            {movement.arrests !== '0' && <span className="cas-tag">⛓️ {movement.arrests} Arrested</span>}
                        </div>
                    </div>
                )}
            </div>
        </div>

        <div className="actions-row">
            <div className="tags-group">
          {movement.tags.map(tag => (
            <span key={tag} className="tag-v2">{tag}</span>
          ))}
        </div>

            <div className="buttons-group">
                {/* Wiki Button Removed from here */}
        <button className="coding-trigger" onClick={() => setShowCoding(!showCoding)}>
          <FileText size={14} />
                    <span>Rationales</span>
          {showCoding ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
            </div>
        </div>
        
        {/* Reference Footer */}
        <div className="card-footer-ref">
            <span className="ref-label">Source:</span> {movement.reference}
        </div>
      </div>

      {showCoding && (
        <div className="coding-details">
          <h4>Analytical Documentation (Audit Trail)</h4>
          
          {/* Direct rendering of pre-merged rationale text */}
          {movement.rationale_text && movement.rationale_text !== "No rationale available." ? (
            <div className="rationales-list">
                <div className="rationale-item">
                  <div className="rat-header">
                    <span className="rat-dim">Qualitative Analysis</span>
                    <span className="rat-conf">Confidence: 95%</span>
                  </div>
                  <p className="rat-text">{movement.rationale_text}</p>
                  <div className="rat-meta">
                    <span className="rat-coder"><UserCheck size={12}/> Expert Coder</span>
                    <span className="rat-source"><ShieldCheck size={12}/> Research Data</span>
                  </div>
                </div>
            </div>
          ) : (
            <div className="empty-coding">Detailed rationales for this entry are pending peer review.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MovementCard;
