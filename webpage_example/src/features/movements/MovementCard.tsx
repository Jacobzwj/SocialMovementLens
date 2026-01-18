import React, { useState } from 'react';
import { 
    Calendar, MapPin, MessageSquare, 
    Clock, Repeat, Users, ExternalLink, BookOpen, Landmark, HelpCircle, 
    FileText, ChevronUp, ChevronDown, Zap, Twitter, Star 
} from 'lucide-react';
import { Movement } from '../../types';
import CodeSchemeModal from './CodeSchemeModal';
import './MovementCard.css';

interface Props {
  movement: Movement;
}

const MovementCard: React.FC<Props> = ({ movement }) => {
  const [showCoding, setShowCoding] = useState(false);
  const [activeModal, setActiveModal] = useState<{title: string, content: string} | null>(null);

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

  // --- RAW CODE SCHEME TEXTS (PRESERVED EXACTLY) ---
  
  const DEF_REGIME = `Regime democracy (if local or national)
Democracy
Semi-democracy
Authoritarian`;

  const DEF_SMO = `SMO Leaders (yes/no): whether containing a recognized leader or organization
Yes: 
The movement/campaign established specialized social movement organizations.
Some pre-existing organizations/figures played leading roles in organizing the movement/campaign.
No: none of the above`;

  const DEF_GRASSROOTS = `Grassroots Mobilization
Yes: A significant proportion was driven by grassroots mobilization. It is often characterized by its bottom-up approach, meaning it starts with ordinary people rather than being driven by elites, large organizations, or formal institutions.
No: primarily top-down.`;

  const DEF_OFFLINE = `Offline manifestations (yes/no): whether the movement included offline activities.
Yes: offline gatherings, demonstrations, petitions, activities, etc.
No: the movement contains no offline activities or elements and only has online manifestations.`;

  const DEF_KIND = `Movement type: What kind of online movement is it? (election campaign/non-election campaign/others)
Election campaign
Non-election campaign: [online] campaigns not aiming for election goals, e.g., #OscarSoWhite, climate change petition, etc. 
Protest/demonstration/rally: offline activities if 8 == yes
Others: online activities that have a smaller scale or are less structured as campaigns (usually voluntary), e.g., feminism online discussion, online deliberation on a particular issue, etc.`;

  const DEF_TOPIC = `Theme of the movement (binary coding:  political or not/economic or not/social or not/environmental or not/others)
Political: the movement targeting a political entity (politicians, government agencies, parties, security forces)
Economic: the movement targeting an economic issue or entity (e.g., Occupy Wall Street)
Environmental: the movement that targets an environmental issue (e.g., climate change)
Social: the movement targeting other social issues, phenomena, or aspects (gender, race, entertainment, immigration, prestige, health, etc.)
Others: the movement that could not be categorized by the above themes`;

  const DEF_PARTICIPANTS = `Key participants (general public/young/women/racial minority/LGBTQIA2+): determining the key participants who organize or facilitate the mobilization:
General public
Young: younger generations or students
Women
Racial minority: African Americans, Hispanics, Asians, Pacific Islanders, etc.
Religious groups
LGBTQIA2+
Other social groups`;

  const DEF_CASUALTIES = `Number of injuries, if any (copy from Wikipedia or news websites, determined by the peak size) - make judgment based on a one-year length (adding multiple waves together)
Police injuries
Number of deaths, if any (copy from Wikipedia or news websites, determined by the peak size) - make judgment based on a one-year length (adding multiple waves together)
Police deaths
Number of arrested, if any (copy from Wikipedia or news websites, determined by the peak size) - make judgment based on a one-year length (adding multiple waves together)`;

  const DEF_REOCCURRENCE = `Reoccurrence of the movement (yes/no): whether the movement happened in this specific year or in prior years.
Yes: the movement occurred in prior years (e.g., BLM)
No`;

  const DEF_LENGTH = `Length of the movement (#days ongoing/unclear) - make a judgment based on a one-year length (adding multiple waves together)
Number of days: calculate #days based on the start and end date of the OFFLINE activities of this movement in the specific year (e.g., BLM 2020)
Ongoing: if this movement continues to 2023
Unclear: the #days are not able to be calculated, or the movement progress is not well documented.`;

  const DEF_STATE_RESP = `State response (binary coding: accommodation or not/distraction or not/repression or not/ignore or not):
Accommodation: the state made changes or took actions in response to the demands of the protestors
Acceptance: whether the movement/campaign was accepted by elites as a legitimate challenger OR acceptance of challenging group as a legitimate constituency representative. 
Advantage: whether the challenging movement received new advantages and benefits it was explicitly seeking OR success in achieving particular goals, such as passage of legislation.
Distraction: the state distracted the attention of protestors by manipulating online attention to other issues (e.g., flooding) or distracting the locus of problem to non-government entities (e.g., enterprises)
Repression: the state took legitimate or illegitimate coercive actions toward the protestors (e.g., violence, arrests, crowd dispersal, shootings, or killings)
Physical repression
Legal repression
Ignore: the state ignored the demands of the protestors and did not take any actions.
Ignore
Attrition`;

  const DEF_OUTCOME = `Political outcomes of the movement (regime change/major policy change/policy revision/fail):
Regime change: the regime was overthrown or shifted fundamentally.
Major policy change: a new policy or law was created or enacted.
Policy revision: revisions on existing policies or laws were made.
Other reactions: non-policy change (e.g., Police arrested the criminal, increasing empty seats in campaigns, government responses/statements, quitting the government/party, etc.)
NA: only increasing awareness or symbolic benefits (measured by social media power)
Fail: nothing mentioned above was achieved.`;

  const DEF_LONGTERM = `Long-term outcomes:
Continue: Continual change in the direction brought about/demanded by the movement.
Contraction: Repression and/or contraction in the direction opposite to what the movement demanded.
No: No identified long-term change`;

  const openModal = (title: string, content: string) => {
    setActiveModal({ title, content });
  };

  return (
    <>
    <CodeSchemeModal 
        isOpen={!!activeModal}
        title={activeModal?.title || ''}
        content={activeModal?.content || ''}
        onClose={() => setActiveModal(null)}
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
            <div className="stat-item">
                <Calendar size={14} className="stat-icon"/> 
                <span className="stat-val">{movement.year}</span>
            </div>
            <div className="stat-item">
                <MapPin size={14} className="stat-icon"/> 
                <span className="stat-val">{movement.region} ({movement.iso || 'Global'})</span>
            </div>
            <div className="stat-item">
                <MessageSquare size={14} className="stat-icon"/> 
                <span className="stat-val">
                    {Number(movement.tweets_count).toLocaleString()} Tweets
                </span>
            </div>

            {/* Row 2 */}
            <div className="stat-item">
                <Clock size={14} className="stat-icon"/> 
                <span className="stat-val">
                    {movement.length_days && movement.length_days.toLowerCase().includes('ongoing') 
                        ? 'Ongoing' 
                        : `${movement.length_days} Days`}
                </span>
                <HelpCircle size={12} className="info-icon" onClick={() => openModal('Length of the Movement', DEF_LENGTH)} />
            </div>
            <div className="stat-item">
                <Repeat size={14} className="stat-icon"/> 
                <span className="stat-val" style={{ textTransform: 'capitalize' }}>
                    {(!movement.reoccurrence || movement.reoccurrence.toLowerCase() === 'no') 
                        ? 'Once' 
                        : movement.reoccurrence}
                </span>
                <HelpCircle size={12} className="info-icon" onClick={() => openModal('Reoccurrence', DEF_REOCCURRENCE)} />
            </div>
            
            <div className="stat-item">
                <Landmark size={14} className="stat-icon"/> 
                <span className="stat-val" style={{ textTransform: 'capitalize' }}>
                    {movement.regime ? movement.regime.charAt(0).toUpperCase() + movement.regime.slice(1) : ''}
                </span>
                <HelpCircle size={12} className="info-icon" onClick={() => openModal('Regime Democracy', DEF_REGIME)} />
            </div>
        </div>

        {/* --- New Details Section (INTERPRETATIVE) --- */}
        <div className="details-expanded">
            {/* Column 1: Profile */}
            <div className="details-col">
                <span className="col-header">Movement Profile</span>
                
                {/* Topic Badges (Active Only) */}
                <div className="detail-row">
                    <span className="label">
                        Topic
                        <HelpCircle size={12} className="info-icon-label" onClick={() => openModal('Theme of the Movement', DEF_TOPIC)} />
                        :
                    </span>
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
                    <span className="label">
                        Kind
                        <HelpCircle size={12} className="info-icon-label" onClick={() => openModal('Movement Type', DEF_KIND)} />
                        :
                    </span> 
                    <span className="val">{truncate(movement.kind, 50)}</span>
                </div>
                <div className="detail-row">
                    <span className="label">
                        Grassroots
                        <HelpCircle size={12} className="info-icon-label" onClick={() => openModal('Grassroots Mobilization', DEF_GRASSROOTS)} />
                        :
                    </span> 
                    <span className="val">{truncate(movement.grassroots, 50)}</span>
                </div>
                <div className="detail-row">
                    <span className="label">
                        SMO Leaders
                        <HelpCircle size={12} className="info-icon-label" onClick={() => openModal('SMO Leaders', DEF_SMO)} />
                        :
                    </span> 
                    <span className="val">{truncate(movement.smo_leader, 50)}</span>
                </div>
                <div className="detail-row">
                    <span className="label">
                        Participants
                        <HelpCircle size={12} className="info-icon-label" onClick={() => openModal('Key Participants', DEF_PARTICIPANTS)} />
                        :
                    </span> 
                    <span className="val">{truncate(movement.key_participants, 50)}</span>
                </div>
                <div className="detail-row">
                    <span className="label">
                        Offline
                        <HelpCircle size={12} className="info-icon-label" onClick={() => openModal('Offline Manifestations', DEF_OFFLINE)} />
                        :
                    </span> 
                    <span className="val">{truncate(movement.offline_presence, 50)}</span>
                </div>
            </div>

            {/* Column 2: Consequences */}
            <div className="details-col">
                <span className="col-header">Consequences</span>

                {/* 1. Casualties (First Row) - Always show, with fallback */}
                <div className="detail-row" style={{ marginBottom: 12 }}>
                    <span className="label" style={{color: '#f87171'}}>
                        Casualties
                        <HelpCircle size={12} className="info-icon-label" style={{ color: '#f87171' }} onClick={() => openModal('Casualties', DEF_CASUALTIES)} />
                        :
                    </span>
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
                    <span className="label">
                        State Resp
                        <HelpCircle size={12} className="info-icon-label" onClick={() => openModal('State Response', DEF_STATE_RESP)} />
                        :
                    </span>
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
                    <span className="label">
                        Political Outcome
                        <HelpCircle size={12} className="info-icon-label" onClick={() => openModal('Political Outcomes', DEF_OUTCOME)} />
                        :
                    </span> 
                    <span className="val">{truncate(movement.outcome_raw, 60)}</span>
                </div>
                
                <div className="detail-row">
                    <span className="label">
                        Long-term Outcome
                        <HelpCircle size={12} className="info-icon-label" onClick={() => openModal('Long-term Outcomes', DEF_LONGTERM)} />
                        :
                    </span> 
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
