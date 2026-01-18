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
