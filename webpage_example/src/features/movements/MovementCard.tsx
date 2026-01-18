import React, { useState, useEffect } from 'react';
import { 
    Calendar, MapPin, TrendingUp, FileText, ChevronDown, ChevronUp, 
    UserCheck, ShieldCheck, Zap, Twitter, Star, MessageSquare, 
    Clock, Repeat, Users, ExternalLink, BookOpen, Landmark 
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

  // Helper to render text with clickable links
  const renderTextWithLinks = (text: string) => {
    if (!text) return text;
    
    // Regular expression to find URLs (http/https)
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
        if (part.match(urlRegex)) {
            return (
                <a 
                    key={index} 
                    href={part} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ color: '#3b82f6', textDecoration: 'underline', wordBreak: 'break-all' }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {part}
                </a>
            );
        }
        return part;
    });
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

  // Predefined Topics
  const ALL_TOPICS = ['Political', 'Economic', 'Environmental', 'Social', 'Others'];

  // Helper to get active state responses
  const getActiveStateResponses = () => {
      const responses = [];
      if (movement.state_accommodation.toLowerCase() === 'yes') responses.push('Accommodation');
      if (movement.state_distraction.toLowerCase() === 'yes') responses.push('Distraction');
      if (movement.state_repression.toLowerCase() === 'yes') responses.push('Repression');
      if (movement.state_ignore.toLowerCase() === 'yes') responses.push('Ignore');
      return responses;
  };

  const activeStateResponses = getActiveStateResponses();

  return (
    <div className={`movement-card-v2 ${showCoding ? 'expanded' : ''}`}>
      <div className="card-primary">
        <div className="card-header">
          <div>
            <div className="header-top-row">
                {movement.similarity !== undefined && (
                    <div className="similarity-badge tooltip-container tooltip-right" 
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
            <span className="score-label">Twitter Penetration ({movement.twitter_penetration || 'N/A'})</span>
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
                <span className="stat-val">
                    {Number(movement.tweets_count).toLocaleString()} Tweets
                </span>
            </div>

            {/* Row 2 */}
            <div className="stat-item tooltip-container" data-tooltip="Length of the movement (#days ongoing/unclear) - make a judgment based on a one-year length.">
                <Clock size={14} className="stat-icon"/> 
                <span className="stat-val">
                    {movement.length_days && movement.length_days.toLowerCase().includes('ongoing') 
                        ? 'Ongoing' 
                        : `${movement.length_days} Days`}
                </span>
            </div>
            <div className="stat-item tooltip-container" data-tooltip="Reoccurrence of the movement (yes/no): whether the movement happened in this specific year or in prior years.">
                <Repeat size={14} className="stat-icon"/> 
                <span className="stat-val" style={{ textTransform: 'capitalize' }}>
                    {(!movement.reoccurrence || movement.reoccurrence.toLowerCase() === 'no') 
                        ? 'Once' 
                        : movement.reoccurrence}
                </span>
            </div>
            
            <div className="stat-item tooltip-container" data-tooltip="Regime democracy (if local or national): Democracy, Semi-democracy, or Authoritarian.">
                <Landmark size={14} className="stat-icon"/> 
                <span className="stat-val" style={{ textTransform: 'capitalize' }}>
                    {movement.regime ? movement.regime.charAt(0).toUpperCase() + movement.regime.slice(1) : ''}
                </span>
            </div>
        </div>

        {/* --- New Details Section (INTERPRETATIVE) --- */}
        <div className="details-expanded">
            {/* Column 1: Profile */}
            <div className="details-col">
                <span className="col-header">Movement Profile</span>
                
                {/* Topic Badges (Active Only) */}
                <div className="detail-row tooltip-container" data-tooltip="Theme of the movement. Political: targeting a political entity; Economic: targeting an economic issue; Environmental: targets an environmental issue; Social: targeting social issues; Others.">
                    <span className="label">Topic:</span>
                    <div className="topic-grid">
                        {movement.tags.length > 0 ? (
                            movement.tags.map(tag => (
                                <span key={tag} className="topic-tag active">
                                    {tag}
                                </span>
                            ))
                        ) : (
                            <span className="val">General</span>
                        )}
                    </div>
                </div>

                <div className="detail-row tooltip-container" data-tooltip="Movement type: What kind of online movement is it? (Election campaign / Non-election campaign / Protest/demonstration/rally / Others)."><span className="label">Kind:</span> <span className="val">{truncate(movement.kind, 50)}</span></div>
                <div className="detail-row tooltip-container" data-tooltip="Grassroots Mobilization: A significant proportion was driven by grassroots mobilization. It is often characterized by its bottom-up approach, meaning it starts with ordinary people rather than being driven by elites, large organizations, or formal institutions."><span className="label">Grassroots:</span> <span className="val">{truncate(movement.grassroots, 50)}</span></div>
                <div className="detail-row tooltip-container" data-tooltip="SMO Leaders (yes/no): whether containing a recognized leader or organization. Yes means the movement established specialized SMOs or pre-existing figures played leading roles."><span className="label">SMO Leaders:</span> <span className="val">{truncate(movement.smo_leader, 50)}</span></div>
                <div className="detail-row tooltip-container" data-tooltip="Key participants: determining the key participants who organize or facilitate the mobilization (general public/young/women/racial minority/LGBTQIA2+/etc.)."><span className="label">Participants:</span> <span className="val">{truncate(movement.key_participants, 50)}</span></div>
                <div className="detail-row tooltip-container" data-tooltip="Offline manifestations (yes/no): whether the movement included offline activities (gatherings, demonstrations, petitions, etc.)."><span className="label">Offline:</span> <span className="val">{truncate(movement.offline_presence, 50)}</span></div>
            </div>

            {/* Column 2: Consequences */}
            <div className="details-col">
                <span className="col-header">Consequences</span>

                {/* 1. Casualties (First Row) - Always show, with fallback */}
                <div className="detail-row tooltip-container" data-tooltip="Number of injuries, deaths, and arrested: make judgment based on a one-year length (adding multiple waves together), determined by the peak size." style={{ marginBottom: 12 }}>
                    <span className="label" style={{color: '#f87171'}}>Casualties:</span>
                    {(movement.injuries !== '0' || movement.deaths !== '0' || movement.arrests !== '0') ? (
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
                                    <span className="cas-icon">🏥</span>
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
                    ) : (
                        <span className="val" style={{color: '#71717a', fontStyle: 'italic', fontSize: '0.8rem'}}>No data</span>
                    )}
                </div>
                
                {/* 2. State Response (Active Only) */}
                <div className="detail-row tooltip-container" data-tooltip="State response: Accommodation (state made changes), Distraction (distracted attention), Repression (coercive actions), or Ignore (did not take any actions)." style={{ marginBottom: 8 }}>
                    <span className="label">State Resp:</span>
                    <div className="response-grid">
                        {activeStateResponses.length > 0 ? (
                            activeStateResponses.map(resp => (
                                <span key={resp} className="resp-tag active">{resp}</span>
                            ))
                        ) : (
                            <span className="val">None</span>
                        )}
                    </div>
                </div>

                {/* 3. Outcomes (Third Row) */}
                <div className="detail-row tooltip-container" data-tooltip="Political outcomes of the movement: Regime change, Major policy change, Policy revision, Other reactions (non-policy change), or Fail.">
                    <span className="label">Political Outcome:</span> 
                    <span className="val">{truncate(movement.outcome_raw, 60)}</span>
                </div>
                
                <div className="detail-row tooltip-container" data-tooltip="Long-term outcomes: Continue (continual change in the direction brought about/demanded), Contraction (repression/contraction in opposite direction), or No (no identified long-term change).">
                    <span className="label">Long-term Outcome:</span> 
                    <span className="val">{truncate(movement.longterm_outcome, 60)}</span>
                </div>
            </div>
        </div>

        <div className="actions-row">
            <div className="tags-group">
                {/* Topic tags moved to Profile section */}
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
            <span className="ref-label">Key Reference:</span> {movement.reference}
        </div>
      </div>

      {showCoding && (
        <div className="coding-details">
          <h4>Coding Decisions & Justifications</h4>
          
          <div className="rationales-grid">
            {movement.rationales ? (
                Object.entries(movement.rationales).map(([key, val]) => (
                    <div key={key} className="rationale-item-v2">
                        <span className="rat-label">{key}:</span>
                        <span className="rat-val">{renderTextWithLinks(val)}</span>
                    </div>
                ))
            ) : (
                <p className="rat-text">{renderTextWithLinks(movement.rationale_text || "No detailed rationales available.")}</p>
            )}
            
            {/* Fallback to main description if not in structured list */}
            {(!movement.rationales || Object.keys(movement.rationales).length === 0) && (
                 <div className="rationale-item-v2">
                    <span className="rat-label">General Description:</span>
                    <span className="rat-val">{renderTextWithLinks(movement.rationale_text)}</span>
                 </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovementCard;
