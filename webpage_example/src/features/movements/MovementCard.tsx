import React, { useState, useEffect } from 'react';
import { 
    Calendar, MapPin, TrendingUp, FileText, ChevronDown, ChevronUp, 
    UserCheck, ShieldCheck, Zap, Twitter, Star, MessageSquare, 
    Clock, Repeat, Users, ExternalLink, BookOpen, Landmark, HelpCircle 
} from 'lucide-react';
import { Movement, Rationale } from '../../types';
import CodeSchemeModal from './CodeSchemeModal';
import './MovementCard.css';

interface Props {
  movement: Movement;
}

// Sub-component for the Help Icon with HTML Tooltip
interface HelpIconProps {
  onClick: (e: React.MouseEvent) => void;
  className?: string;
}

const CodeSchemeHelpIcon: React.FC<HelpIconProps> = ({ onClick, className }) => (
  <span className="icon-tooltip-container">
     <HelpCircle size={12} className={className} onClick={onClick} />
     <span className="custom-tooltip-content">
         Click <HelpCircle size={10} strokeWidth={2.5} style={{ display: 'inline-block', verticalAlign: 'middle', margin: '0 2px' }} /> to view Code Scheme
     </span>
  </span>
);


const MovementCard: React.FC<Props> = ({ movement }) => {
  const [showCoding, setShowCoding] = useState(false);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const openModal = (title: string, content: React.ReactNode) => {
      setModalTitle(`Code Scheme: ${title}`);
      setModalContent(content);
      setIsModalOpen(true);
  };

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

  // --- 1. SHORT TOOLTIPS (For Hover) ---
  const SHORT_REGIME = "Political Regime";
  const SHORT_SMO = "Presence of centralized social movement organizations or leaders";
  const SHORT_GRASSROOTS = "Whether mobilized through grassroots";
  const SHORT_OFFLINE = "Includes offline protests/events?";
  const SHORT_KIND = "Movement Type";
  const SHORT_TOPIC = "Thematic classification of the movement";
  const SHORT_PARTICIPANTS = "Main demographic groups involved";
  const SHORT_CASUALTIES = "Reported injuries, deaths, arrests";
  const SHORT_REOCCURRENCE = "Reoccurrence of the movement (yes/no)";
  const SHORT_LENGTH = "Duration in days";
  const SHORT_STATE_RESP = "Government reaction to protests";
  const SHORT_OUTCOME = "Immediate political results";
  const SHORT_LONGTERM = "Long-term impact";

  // --- 2. FULL DEFINITIONS (Structured JSX for Modal) ---
  
  const FULL_REGIME = (
    <div>
        <p>Regime democracy (if local or national):</p>
        <ul>
            <li><strong>Democracy</strong></li>
            <li><strong>Semi-democracy</strong></li>
            <li><strong>Authoritarian</strong></li>
        </ul>
    </div>
  );

  const FULL_SMO = (
    <div>
        <p>SMO Leaders (yes/no): whether containing a recognized leader or organization.</p>
        <ul>
            <li><strong>Yes:</strong>
                <ul>
                    <li>The movement/campaign established specialized social movement organizations.</li>
                    <li>Some pre-existing organizations/figures played leading roles in organizing the movement/campaign.</li>
                </ul>
            </li>
            <li><strong>No:</strong> none of the above.</li>
        </ul>
    </div>
  );

  const FULL_GRASSROOTS = (
    <div>
        <p><strong>Grassroots Mobilization:</strong></p>
        <ul>
            <li><strong>Yes:</strong> A significant proportion was driven by grassroots mobilization. It is often characterized by its bottom-up approach, meaning it starts with ordinary people rather than being driven by elites, large organizations, or formal institutions.</li>
            <li><strong>No:</strong> primarily top-down.</li>
        </ul>
    </div>
  );

  const FULL_OFFLINE = (
    <div>
        <p>Offline manifestations (yes/no): whether the movement included offline activities.</p>
        <ul>
            <li><strong>Yes:</strong> offline gatherings, demonstrations, petitions, activities, etc.</li>
            <li><strong>No:</strong> the movement contains no offline activities or elements and only has online manifestations.</li>
        </ul>
    </div>
  );

  const FULL_KIND = (
    <div>
        <p>Movement type: What kind of online movement is it?</p>
        <ul>
            <li><strong>Election campaign</strong></li>
            <li><strong>Non-election campaign:</strong> [online] campaigns not aiming for election goals, e.g., #OscarSoWhite, climate change petition, etc.</li>
            <li><strong>Protest/demonstration/rally:</strong> offline activities if <em>Offline manifestations</em> == yes.</li>
            <li><strong>Others:</strong> online activities that have a smaller scale or are less structured as campaigns (usually voluntary), e.g., feminism online discussion, online deliberation on a particular issue, etc.</li>
        </ul>
    </div>
  );

  const FULL_TOPIC = (
    <div>
        <p>Theme of the movement (binary coding: political or not / economic or not / social or not / environmental or not / others).</p>
        <ul>
            <li><strong>Political:</strong> the movement targeting a political entity (politicians, government agencies, parties, security forces).</li>
            <li><strong>Economic:</strong> the movement targeting an economic issue or entity (e.g., Occupy Wall Street).</li>
            <li><strong>Environmental:</strong> the movement that targets an environmental issue (e.g., climate change).</li>
            <li><strong>Social:</strong> the movement targeting other social issues, phenomena, or aspects (gender, race, entertainment, immigration, prestige, health, etc.).</li>
            <li><strong>Others:</strong> the movement that could not be categorized by the above themes.</li>
        </ul>
    </div>
  );

  const FULL_PARTICIPANTS = (
    <div>
        <p>Key participants: determining the key participants who organize or facilitate the mobilization:</p>
        <ul>
            <li>General public</li>
            <li>Young: younger generations or students</li>
            <li>Women</li>
            <li>Racial minority: African Americans, Hispanics, Asians, Pacific Islanders, etc.</li>
            <li>Religious groups</li>
            <li>LGBTQIA2+</li>
            <li>Other social groups</li>
        </ul>
    </div>
  );

  const FULL_CASUALTIES = (
    <div>
        <p>Casualties statistics (judged based on a one-year length, adding multiple waves together; copy from Wikipedia or news websites, determined by the peak size):</p>
        <ul>
            <li><strong>Number of injuries:</strong> if any.
                <ul><li>Police injuries</li></ul>
            </li>
            <li><strong>Number of deaths:</strong> if any.
                <ul><li>Police deaths</li></ul>
            </li>
            <li><strong>Number of arrested:</strong> if any.</li>
        </ul>
    </div>
  );

  const FULL_REOCCURRENCE = (
    <div>
        <p>Reoccurrence of the movement (yes/no): whether the movement happened in this specific year or in prior years.</p>
        <ul>
            <li><strong>Yes:</strong> the movement occurred in prior years (e.g., BLM).</li>
            <li><strong>No:</strong> first time occurrence.</li>
        </ul>
    </div>
  );

  const FULL_LENGTH = (
    <div>
        <p>Length of the movement (#days ongoing/unclear) - make a judgment based on a one-year length:</p>
        <ul>
            <li><strong>Number of days:</strong> calculate #days based on the start and end date of the OFFLINE activities of this movement in the specific year (e.g., BLM 2020).</li>
            <li><strong>Ongoing:</strong> if this movement continues to 2023.</li>
            <li><strong>Unclear:</strong> the #days are not able to be calculated, or the movement progress is not well documented.</li>
        </ul>
    </div>
  );

  const FULL_STATE_RESP = (
    <div>
        <p>State response (binary coding):</p>
        <ul>
            <li><strong>Accommodation:</strong> the state made changes or took actions in response to the demands of the protestors.
                <ul>
                    <li><strong>Acceptance:</strong> whether the movement/campaign was accepted by elites as a legitimate challenger OR acceptance of challenging group as a legitimate constituency representative.</li>
                    <li><strong>Advantage:</strong> whether the challenging movement received new advantages and benefits it was explicitly seeking OR success in achieving particular goals, such as passage of legislation.</li>
                </ul>
            </li>
            <li><strong>Distraction:</strong> the state distracted the attention of protestors by manipulating online attention to other issues (e.g., flooding) or distracting the locus of problem to non-government entities (e.g., enterprises).</li>
            <li><strong>Repression:</strong> the state took legitimate or illegitimate coercive actions toward the protestors (e.g., violence, arrests, crowd dispersal, shootings, or killings).
                <ul>
                    <li>Physical repression</li>
                    <li>Legal repression</li>
                </ul>
            </li>
            <li><strong>Ignore:</strong> the state ignored the demands of the protestors and did not take any actions.
                <ul>
                    <li>Ignore</li>
                    <li>Attrition</li>
                </ul>
            </li>
        </ul>
    </div>
  );

  const FULL_OUTCOME = (
    <div>
        <p>Political outcomes of the movement:</p>
        <ul>
            <li><strong>Regime change:</strong> the regime was overthrown or shifted fundamentally.</li>
            <li><strong>Major policy change:</strong> a new policy or law was created or enacted.</li>
            <li><strong>Policy revision:</strong> revisions on existing policies or laws were made.</li>
            <li><strong>Other reactions:</strong> non-policy change (e.g., Police arrested the criminal, increasing empty seats in campaigns, government responses/statements, quitting the government/party, etc.).</li>
            <li><strong>NA:</strong> only increasing awareness or symbolic benefits (measured by social media power).</li>
            <li><strong>Fail:</strong> nothing mentioned above was achieved.</li>
        </ul>
    </div>
  );

  const FULL_LONGTERM = (
    <div>
        <p>Long-term outcomes:</p>
        <ul>
            <li><strong>Continue:</strong> Continual change in the direction brought about/demanded by the movement.</li>
            <li><strong>Contraction:</strong> Repression and/or contraction in the direction opposite to what the movement demanded.</li>
            <li><strong>No:</strong> No identified long-term change.</li>
        </ul>
    </div>
  );


  return (
    <>
    <CodeSchemeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={modalTitle} 
        content={modalContent} 
    />
    
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
            <div className="stat-item">
                <div className="tooltip-container" data-tooltip={SHORT_LENGTH} style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <Clock size={14} className="stat-icon"/> 
                    <span className="stat-val">
                        {movement.length_days && movement.length_days.toLowerCase().includes('ongoing') 
                            ? 'Ongoing' 
                            : `${movement.length_days} Days`}
                    </span>
                </div>
                <CodeSchemeHelpIcon 
                    className="info-icon-stat" 
                    onClick={(e) => { e.stopPropagation(); openModal("Length", FULL_LENGTH); }} 
                />
            </div>
            <div className="stat-item">
                <div className="tooltip-container" data-tooltip={SHORT_REOCCURRENCE} style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <Repeat size={14} className="stat-icon"/> 
                    <span className="stat-val" style={{ textTransform: 'capitalize' }}>
                        {(!movement.reoccurrence || movement.reoccurrence.toLowerCase() === 'no') 
                            ? 'Once' 
                            : movement.reoccurrence}
                    </span>
                </div>
                <CodeSchemeHelpIcon 
                    className="info-icon-stat" 
                    onClick={(e) => { e.stopPropagation(); openModal("Reoccurrence", FULL_REOCCURRENCE); }} 
                />
            </div>
            
            <div className="stat-item">
                <div className="tooltip-container" data-tooltip={SHORT_REGIME} style={{display:'flex', alignItems:'center', gap:'8px'}}>
                    <Landmark size={14} className="stat-icon"/> 
                    <span className="stat-val" style={{ textTransform: 'capitalize' }}>
                        {movement.regime ? movement.regime.charAt(0).toUpperCase() + movement.regime.slice(1) : ''}
                    </span>
                </div>
                <CodeSchemeHelpIcon 
                    className="info-icon-stat" 
                    onClick={(e) => { e.stopPropagation(); openModal("Regime", FULL_REGIME); }} 
                />
            </div>
        </div>

        {/* --- New Details Section (INTERPRETATIVE) --- */}
        <div className="details-expanded">
            {/* Column 1: Profile */}
            <div className="details-col">
                <span className="col-header">Movement Profile</span>
                
                {/* Topic Badges (Active Only) */}
                <div className="detail-row" >
                    <div className="label-with-icon">
                        <span className="label tooltip-container" data-tooltip={SHORT_TOPIC}>Topic:</span>
                        <CodeSchemeHelpIcon 
                            className="info-icon" 
                            onClick={(e) => { e.stopPropagation(); openModal("Topic", FULL_TOPIC); }} 
                        />
                    </div>
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

                <div className="detail-row">
                    <div className="label-with-icon">
                        <span className="label tooltip-container" data-tooltip={SHORT_KIND}>Type:</span>
                        <CodeSchemeHelpIcon 
                            className="info-icon" 
                            onClick={(e) => { e.stopPropagation(); openModal("Type", FULL_KIND); }} 
                        />
                    </div>
                    <span className="val">{truncate(movement.kind, 50)}</span>
                </div>
                
                <div className="detail-row">
                    <div className="label-with-icon">
                        <span className="label tooltip-container" data-tooltip={SHORT_GRASSROOTS}>Grassroots:</span>
                        <CodeSchemeHelpIcon 
                            className="info-icon" 
                            onClick={(e) => { e.stopPropagation(); openModal("Grassroots", FULL_GRASSROOTS); }} 
                        />
                    </div>
                    <span className="val">{truncate(movement.grassroots, 50)}</span>
                </div>
                
                <div className="detail-row">
                    <div className="label-with-icon">
                        <span className="label tooltip-container" data-tooltip={SHORT_SMO}>SMO Leaders:</span>
                        <CodeSchemeHelpIcon 
                            className="info-icon" 
                            onClick={(e) => { e.stopPropagation(); openModal("SMO Leaders", FULL_SMO); }} 
                        />
                    </div>
                    <span className="val">{truncate(movement.smo_leader, 50)}</span>
                </div>
                
                <div className="detail-row">
                    <div className="label-with-icon">
                        <span className="label tooltip-container" data-tooltip={SHORT_PARTICIPANTS}>Participants:</span>
                        <CodeSchemeHelpIcon 
                            className="info-icon" 
                            onClick={(e) => { e.stopPropagation(); openModal("Participants", FULL_PARTICIPANTS); }} 
                        />
                    </div>
                    <span className="val">{truncate(movement.key_participants, 50)}</span>
                </div>
                
                <div className="detail-row">
                    <div className="label-with-icon">
                        <span className="label tooltip-container" data-tooltip={SHORT_OFFLINE}>Offline:</span>
                        <CodeSchemeHelpIcon 
                            className="info-icon" 
                            onClick={(e) => { e.stopPropagation(); openModal("Offline", FULL_OFFLINE); }} 
                        />
                    </div>
                    <span className="val">{truncate(movement.offline_presence, 50)}</span>
                </div>
            </div>

            {/* Column 2: Consequences */}
            <div className="details-col">
                <span className="col-header">Consequences</span>

                {/* 1. Casualties (First Row) - Always show, with fallback */}
                <div className="detail-row" style={{ marginBottom: 12 }}>
                    <div className="label-with-icon">
                        <span className="label tooltip-container" data-tooltip={SHORT_CASUALTIES} style={{color: '#f87171'}}>Casualties:</span>
                        <CodeSchemeHelpIcon 
                            className="info-icon" 
                            onClick={(e) => { e.stopPropagation(); openModal("Casualties", FULL_CASUALTIES); }} 
                        />
                    </div>
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
                <div className="detail-row" style={{ marginBottom: 8 }}>
                    <div className="label-with-icon">
                        <span className="label tooltip-container" data-tooltip={SHORT_STATE_RESP}>State Resp:</span>
                        <CodeSchemeHelpIcon 
                            className="info-icon" 
                            onClick={(e) => { e.stopPropagation(); openModal("State Response", FULL_STATE_RESP); }} 
                        />
                    </div>
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
                <div className="detail-row">
                    <div className="label-with-icon">
                        <span className="label tooltip-container" data-tooltip={SHORT_OUTCOME}>Political Outcome:</span> 
                        <CodeSchemeHelpIcon 
                            className="info-icon" 
                            onClick={(e) => { e.stopPropagation(); openModal("Political Outcome", FULL_OUTCOME); }} 
                        />
                    </div>
                    <span className="val">{truncate(movement.outcome_raw, 60)}</span>
                </div>
                
                <div className="detail-row">
                    <div className="label-with-icon">
                        <span className="label tooltip-container" data-tooltip={SHORT_LONGTERM}>Long-term Outcome:</span> 
                        <CodeSchemeHelpIcon 
                            className="info-icon" 
                            onClick={(e) => { e.stopPropagation(); openModal("Long-term Outcome", FULL_LONGTERM); }} 
                        />
                    </div>
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
    </>
  );
};

export default MovementCard;
