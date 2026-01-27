import React, { useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Movement } from '../../types';
import './Dashboard.css';
import { ISO_NUMERIC_TO_ALPHA3 } from '../../data/iso_mapping';
import worldData from '../../data/world-110m.json';

interface Props {
  movements: Movement[];
}

const GlobalMap: React.FC<Props> = ({ movements }) => {
  
  // Aggregate movements by ISO code and collect names
  const countryData = useMemo(() => {
    const data: Record<string, { count: number, names: string[] }> = {};
    
    // Debug: Check if we are receiving data
    console.log(`[GlobalMap] Received ${movements.length} movements`);

    movements.forEach(m => {
        if (m.iso) {
            const isos = m.iso.split(',').map(s => s.trim());
            isos.forEach(iso => {
                // Normalize ISO to uppercase
                const cleanIso = iso.toUpperCase();
                if (!data[cleanIso]) data[cleanIso] = { count: 0, names: [] };
                data[cleanIso].count += 1;
                if (data[cleanIso].names.length < 5) {
                    data[cleanIso].names.push(m.name);
                }
            });
        }
    });
    
    return data;
  }, [movements]);

  return (
    <div className="dashboard-card map-card">
      <div className="card-header-sm">
        <h3>Global Distribution of Movements</h3>
        <span className="subtitle">Locations where movements occurred</span>
      </div>
      
      <div className="map-container">
        {/* Simple map configuration without ZoomableGroup first to ensure visibility */}
        <ComposableMap projection="geoMercator" projectionConfig={{ scale: 120 }}>
            {/* Load geography from local JSON import */}
            <Geographies geography={worldData}>
              {({ geographies }) => {
                return geographies.map((geo) => {
                  const { name } = geo.properties;
                  const numericId = geo.id as string; // e.g. "840"
                  
                  // Convert Numeric ID to Alpha-3
                  // Pads with leading zeros if needed (e.g. 4 -> "004")
                  const paddedId = numericId ? numericId.toString().padStart(3, '0') : "";
                  const isoA3 = ISO_NUMERIC_TO_ALPHA3[paddedId];

                  // Filter out Antarctica (ATA / 010)
                  if (paddedId === "010") return null;

                  // Try to match data using the looked-up ISO Alpha-3 code
                  const matchData = isoA3 ? countryData[isoA3] : undefined;
                  
                  const hasData = !!matchData;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      // Use simpler colors: bright purple for data, dark grey for empty
                      fill={hasData ? "#8b5cf6" : "#27272a"} 
                      stroke={hasData ? "#a78bfa" : "#3f3f46"}
                      strokeWidth={0.5}
                      data-tooltip-id="map-tooltip"
                      data-tooltip-html={hasData ? `
                        <div style="font-weight:bold; margin-bottom:4px;">${name}</div>
                        <div style="font-size:0.8em; color:#ccc;">${matchData!.count} Movements</div>
                        <div style="font-size:0.7em; color:#aaa; margin-top:4px;">
                            ${matchData!.names.map(n => `• ${n}`).join('<br/>')}
                            ${matchData!.count > 5 ? '<br/>...and more' : ''}
                        </div>
                      ` : ""}
                      style={{
                        default: { outline: "none" },
                        hover: { 
                            fill: hasData ? "#a78bfa" : "#3f3f46", 
                            outline: "none", 
                            cursor: hasData ? "pointer" : "default" 
                        },
                        pressed: { outline: "none" },
                      }}
                    />
                  );
                });
              }}
            </Geographies>
        </ComposableMap>
        <ReactTooltip id="map-tooltip" style={{ backgroundColor: "#18181b", color: "#fff", zIndex: 999, opacity: 1 }} />
      </div>
    </div>
  );
};

export default GlobalMap;
