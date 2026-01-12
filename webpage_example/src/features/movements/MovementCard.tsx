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

  // Helper to truncate text for display cards (not for rationales)
  const truncate = (text: string, limit: number = 40) => {
    if (!text || text.length <= limit) return text;
    return text.substring(0, limit) + '...';
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

                {/* Wikipedia Link */}
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
        
        {/* Expanded Stats Grid (FACTUAL DATA) */}
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
            
            {/* Empty slot for alignment */}
            <div className="stat-item empty-stat"></div>
        </div>

        {/* --- New Details Section (INTERPRETATIVE) --- */}
        <div className="details-expanded">
            {/* Column 1: Profile */}
            <div className="details-col">
                <span className="col-header">Movement Profile</span>
                <div className="detail-row"><span className="label">Kind:</span> <span className="val">{truncate(movement.kind, 50)}</span></div>
                <div className="detail-row"><span className="label">Grassroots:</span> <span className="val">{truncate(movement.grassroots, 50)}</span></div>
                <div className="detail-row"><span className="label">SMO Leaders:</span> <span className="val">{truncate(movement.smo_leader, 50)}</span></div>
                <div className="detail-row"><span className="label">Participants:</span> <span className="val">{truncate(movement.key_participants, 50)}</span></div>
                <div className="detail-row"><span className="label">Offline:</span> <span className="val">{truncate(movement.offline_presence, 50)}</span></div>
            </div>

            {/* Column 2: Consequences */}
            <div className="details-col">
                <span className="col-header">Consequences</span>

                {/* 1. Casualties (First Row) */}
                {(movement.injuries !== '0' || movement.deaths !== '0' || movement.arrests !== '0') && (
                    <div className="detail-row" style={{ marginBottom: 12 }}>
                        <span className="label" style={{color: '#f87171'}}>Casualties:</span>
                        <div className="casualty-list-v2">
                            {/* Deaths */}
                            {movement.deaths !== '0' && (
                                <div className="cas-row">
                                    <span className="cas-icon">💀</span>
                                    <span className="cas-label">Deaths:</span>
                                    <span className="cas-val">{movement.deaths}</span>
                                    {movement.police_deaths !== '0' && <span className="cas-sub">(Police: {movement.police_deaths})</span>}
                                </div>
                            )}
                            
                            {/* Injuries */}
                            {movement.injuries !== '0' && (
                                <div className="cas-row">
                                    <span className="cas-icon">🤕</span>
                                    <span className="cas-label">Injuries:</span>
                                    <span className="cas-val">{movement.injuries}</span>
                                    {movement.police_injuries !== '0' && <span className="cas-sub">(Police: {movement.police_injuries})</span>}
                                </div>
                            )}

                            {/* Arrests */}
                            {movement.arrests !== '0' && (
                                <div className="cas-row">
                                    <span className="cas-icon">⛓️</span>
                                    <span className="cas-label">Arrested:</span>
                                    <span className="cas-val">{movement.arrests}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                {/* 2. State Response (Second Row) */}
                <div className="detail-row" style={{ marginBottom: 8 }}>
                    <span className="label">State Resp:</span>
                    <div className="response-grid">
                        <span className={`resp-tag ${movement.state_accommodation.toLowerCase() === 'yes' ? 'active' : ''}`}>Accommodation</span>
                        <span className={`resp-tag ${movement.state_distraction.toLowerCase() === 'yes' ? 'active' : ''}`}>Distraction</span>
                        <span className={`resp-tag ${movement.state_repression.toLowerCase() === 'yes' ? 'active' : ''}`}>Repression</span>
                        <span className={`resp-tag ${movement.state_ignore.toLowerCase() === 'yes' ? 'active' : ''}`}>Ignore</span>
                    </div>
                </div>

                {/* 3. Outcome (Third Row) */}
                <div className="detail-row">
                    <span className="label">Outcome:</span> 
                    <span className="val" style={{ fontWeight: 600, color: '#f4f4f5' }}>{truncate(movement.outcome_raw, 60)}</span>
                </div>
            </div>
        </div>

        <div className="actions-row">
            <div className="tags-group">
          {movement.tags.map(tag => (
            <span key={tag} className="tag-v2">{tag}</span>
          ))}
        </div>

            <div className="buttons-group">
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
          <h4>Coding Decisions & Justifications (Audit Trail)</h4>
          
          <div className="rationales-grid">
            {movement.rationales ? (
                Object.entries(movement.rationales).map(([key, val]) => (
                    <div key={key} className="rationale-item-v2">
                        <span className="rat-label">{key}:</span>
                        <span className="rat-val">{val}</span>
                    </div>
                ))
            ) : (
                <p className="rat-text">{movement.rationale_text || "No detailed rationales available."}</p>
            )}
            
            {/* Fallback to main description if not in structured list */}
            {(!movement.rationales || Object.keys(movement.rationales).length === 0) && (
                 <div className="rationale-item-v2">
                    <span className="rat-label">General Description:</span>
                    <span className="rat-val">{movement.rationale_text}</span>
                 </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovementCard;
