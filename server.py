import pandas as pd
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import os
from openai import OpenAI
import uvicorn
import pickle
import json
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

# Enable CORS (still good for development, though less critical in single-origin)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Global Data Storage ---
DF_CODES = pd.DataFrame()
DF_RATIONAL = pd.DataFrame()
EMBEDDINGS = None # Numpy array of embeddings
EMBEDDINGS_IDS = [] # List of IDs corresponding to embeddings row-wise

CACHE_FILE = "embeddings_cache.pkl"

# --- Global Configuration ---
EMBEDDING_MODEL = "text-embedding-3-small"
CHAT_MODEL = "gpt-4o"

def get_openai_client():
    global EMBEDDING_MODEL, CHAT_MODEL
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("Warning: OPENAI_API_KEY not set. Vector search will fail.")
        return None
    
    # Check if it's an OpenRouter key to set the correct base_url
    if api_key.startswith("sk-or-"):
        # Use OpenRouter prefixes for models
        EMBEDDING_MODEL = "openai/text-embedding-3-small"
        # Switch to Google Gemini 3 Flash Preview as requested
        CHAT_MODEL = "google/gemini-3-flash-preview" 
        return OpenAI(
            api_key=api_key,
            base_url="https://openrouter.ai/api/v1"
        )
    return OpenAI(api_key=api_key)

def normalize_id(val):
    """Normalize ID to string, removing trailing .0 if present"""
    s = str(val).strip()
    if s.endswith('.0'):
        return s[:-2]
    return s

def load_data():
    global DF_CODES, DF_RATIONAL, EMBEDDINGS, EMBEDDINGS_IDS
    try:
        print("Loading Excel data...")
        # Load Coding Data - ONLY 'Coding_clean'
        if os.path.exists('Coding_LATEST_LH.xlsx'):
            try:
                DF_CODES = pd.read_excel('Coding_LATEST_LH.xlsx', sheet_name='Coding_clean')
                print("Loaded 'Coding_clean' sheet from Coding_LATEST_LH.xlsx")
            except ValueError:
                print("Sheet 'Coding_clean' not found, falling back to first sheet.")
                DF_CODES = pd.read_excel('Coding_LATEST_LH.xlsx')

            DF_CODES.columns = [c.strip() for c in DF_CODES.columns]
            
            # Normalize Index - PREFER ORIGINAL 'index' COLUMN
            if 'index' in DF_CODES.columns:
                DF_CODES['index'] = DF_CODES['index'].astype(str).apply(normalize_id)
            elif 'no' in DF_CODES.columns:
                # Fallback if 'index' is missing
                DF_CODES['index'] = DF_CODES['no'].astype(str).apply(normalize_id)
            else:
                # Create default index if missing
                DF_CODES['index'] = DF_CODES.index.astype(str)
            
            # --- Type Conversion for Analytics ---
            # Ensure numeric columns are actually numeric for the Agent to calculate stats
            numeric_cols = ['year', '#tweets', 'Length_Days']
            for col in numeric_cols:
                if col in DF_CODES.columns:
                    DF_CODES[col] = pd.to_numeric(DF_CODES[col], errors='coerce')
        
        # Load Rationale Data - ONLY 'CodingRationale_clean'
        if os.path.exists('CodingRational_LATEST.xlsx'):
            try:
                DF_RATIONAL = pd.read_excel('CodingRational_LATEST.xlsx', sheet_name='CodingRationale_clean')
                print("Loaded 'CodingRationale_clean' sheet from CodingRational_LATEST.xlsx")
            except ValueError:
                print("Sheet 'CodingRationale_clean' not found, trying 'CodingRationale'...")
                try:
                    DF_RATIONAL = pd.read_excel('CodingRational_LATEST.xlsx', sheet_name='CodingRationale')
                except ValueError:
                    DF_RATIONAL = pd.read_excel('CodingRational_LATEST.xlsx')

            DF_RATIONAL.columns = [c.strip() for c in DF_RATIONAL.columns]
            
            # Normalize Index for Rationale - PREFER ORIGINAL 'index' COLUMN
            if 'index' in DF_RATIONAL.columns:
                DF_RATIONAL['index'] = DF_RATIONAL['index'].astype(str).apply(normalize_id)
            elif 'no' in DF_RATIONAL.columns:
                DF_RATIONAL['index'] = DF_RATIONAL['no'].astype(str).apply(normalize_id)
            else:
                print("Warning: Rationale file has neither 'index' nor 'no' column!")
            
            # --- MERGE DESCRIPTION INTO DF_CODES ---
            
            # Normalize Index for Rationale
            if 'index' in DF_RATIONAL.columns:
                DF_RATIONAL['index'] = DF_RATIONAL['index'].apply(normalize_id)
            elif 'no' in DF_RATIONAL.columns:
                DF_RATIONAL['index'] = DF_RATIONAL['no'].apply(normalize_id)
            
            # --- MERGE DESCRIPTION INTO DF_CODES (THE NUCLEAR OPTION) ---
            # Since rows are aligned by 'no', we can just merge based on 'index'
            if not DF_CODES.empty and not DF_RATIONAL.empty:
                print("Merging Rationale Description into Main Data...")
                
                # Ensure indices match for merging
                # We'll create a dictionary mapping index -> description
                desc_map = dict(zip(DF_RATIONAL['index'], DF_RATIONAL['Description']))
                
                # Map it to DF_CODES
                DF_CODES['merged_description'] = DF_CODES['index'].map(desc_map)
                
                # Fill NaNs
                DF_CODES['merged_description'] = DF_CODES['merged_description'].fillna("No rationale available.")
                
                # CRITICAL: Also update the main 'Description' column for backward compatibility 
                # (e.g. for card summaries and embedding logic relying on row['Description'])
                DF_CODES['Description'] = DF_CODES['merged_description']
                
                print("Merge complete. Added 'merged_description' and updated 'Description' column.")
        
        print("Data loaded. Checking embeddings cache...")
        
        # Load or Generate Embeddings
        if os.path.exists(CACHE_FILE):
            print("Found embeddings cache. Loading...")
            with open(CACHE_FILE, 'rb') as f:
                data = pickle.load(f)
                EMBEDDINGS = data['vectors']
                EMBEDDINGS_IDS = data['ids']
            print(f"Loaded {len(EMBEDDINGS_IDS)} embeddings.")
        else:
            print("No cache found. Generating embeddings... (This may take a while)")
            generate_embeddings()
            
    except Exception as e:
        print(f"Error loading data: {e}")

def generate_embeddings():
    global EMBEDDINGS, EMBEDDINGS_IDS
    client = get_openai_client()
    if not client:
        return

    if DF_CODES.empty:
        return

    vectors = []
    ids = []
    
    # Iterate through DF_CODES
    print(f"Processing {len(DF_CODES)} movements for embedding...")
    
    # Batch processing to be safe, though simple loop is fine for <10k rows
    for _, row in DF_CODES.iterrows():
        idx = str(row.get('index', ''))
        name = str(row.get('protest_name', ''))
        # Description is NOT in Coding_clean, so we initialize it as empty here
        # and rely on the Rationale join below to populate it.
        desc = "" 
        theme = str(row.get('Theme_social', ''))
        
        # Try to find rationale
        rationale_text = ""
        if not DF_RATIONAL.empty:
            match = DF_RATIONAL[DF_RATIONAL['index'] == idx]
            if not match.empty:
                # In the new sheet structure, Description is in the Rationale table
                desc = str(match.iloc[0].get('Description', ''))
                # If there are other columns in Rationale we want to add as context, do it here
                # For now, we use Description as both the main description and context source
                rationale_text = desc 
        
        # Additional context columns from Coding_clean
        query_val = str(row.get('query', ''))
        article = str(row.get('Article_Title', ''))
        keywords = str(row.get('keywords_processed', ''))

        # Construct Rich Text
        # Format: "Movement: ... Description: ... Theme: ... Query: ... Article: ... Keywords: ..."
        rich_text = f"Movement: {name}. Description: {desc}. Theme: {theme}. Query: {query_val}. Article: {article}. Keywords: {keywords}."
        
        try:
            # Call OpenAI API
            res = client.embeddings.create(
                input=rich_text,
                model=EMBEDDING_MODEL
            )
            vec = res.data[0].embedding
            vectors.append(vec)
            ids.append(idx)
        except Exception as e:
            print(f"Error embedding row {idx}: {e}")

    # Convert to numpy array
    if vectors:
        EMBEDDINGS = np.array(vectors)
        EMBEDDINGS_IDS = ids
        
        # Save to cache
        with open(CACHE_FILE, 'wb') as f:
            pickle.dump({'vectors': EMBEDDINGS, 'ids': EMBEDDINGS_IDS}, f)
        print("Embeddings generated and saved.")

# Initial Load
load_data()

# --- Models ---
class Movement(BaseModel):
    id: str
    name: str
    hashtag: str
    year: str
    region: str
    iso: str
    scale: str
    type: str
    regime: str
    description: str
    outcome: str
    impactScore: int # Kept for backward compatibility if needed, or repurposed
    digitalMaturity: int
    centralization: str
    tags: List[str]
    similarity: Optional[float] = None
    
    # --- New Fields ---
    twitter_query: str      # For Twitter Link
    tweets_count: str       # #tweets
    key_participants: str   # Key_Participants
    reoccurrence: str       # Reoccurrence
    length_days: str        # Length_Days
    wikipedia: str          # Wikipedia URL
    twitter_penetration: str # Raw value for display
    star_rating: int        # 1-5 stars based on penetration
    offline_presence: str   # New: Offline column
    rationale_text: str     # Pre-merged rationale text
    rationales: dict[str, str] = {} # Structured rationales for specific fields
    
    # --- Expanded Fields for Card V2 ---
    smo_leader: str
    grassroots: str
    kind: str
    outcome_raw: str
    state_accommodation: str
    state_distraction: str
    state_repression: str
    state_ignore: str
    injuries: str
    police_injuries: str
    deaths: str
    police_deaths: str
    arrests: str
    reference: str

class Rationale(BaseModel):
    movementId: str
    dimension: str
    rationale: str
    confidenceScore: float
    coderId: str
    evidenceSource: str

class ChatRequest(BaseModel):
    query: str
    context_movements: List[str] # Now used as the "Current Screen Context"

# --- Helpers ---
def clean_nan(val, default=""):
    if pd.isna(val) or str(val).lower() == 'nan':
        return default
    return str(val)

def map_row_to_movement(row) -> Movement:
    # Use normalized index if available, else fall back to raw
    idx = str(row.get('index', row.get('no', '0')))
    
    # Debug regime
    # print(f"Row {idx} Regime: {row.get('Regime_Democracy')}")
    
    # Try to get year from 'year' column first
    year_val = row.get('year')
    if pd.isna(year_val) or str(year_val).lower() == 'nan':
         # Fallback to Timeline if year is missing, though unlikely in clean sheet
        year_val = row.get('Timeline')
    
    year = clean_nan(year_val, "2010s")
    # If year looks like a float (e.g. 2011.0), convert to int str
    try:
        if '.' in year:
            year = str(int(float(year)))
    except:
        pass

    partic = str(row.get('Number_Participants', '0'))
    score = 50
    if 'million' in partic.lower(): score = 90
    elif 'thousand' in partic.lower(): score = 70
    
    tags = []
    if clean_nan(row.get('Theme_political')) != 'no': tags.append('Political')
    if clean_nan(row.get('Theme_environmental')) != 'no': tags.append('Environmental')
    if clean_nan(row.get('Theme_social')) != 'no': tags.append('Social')
    
    tw_pen = clean_nan(row.get('Twitter_Penetration'), '0')
    maturity = 5
    star_rating = 1
    
    # Logic to parse Twitter Penetration (which seems to be Impact/Volume now)
    # Expected formats: "20%", "298 MILLION", "50000", "50k"
    try:
        val_str = str(tw_pen).lower().replace(',', '')
        val = 0.0
        
        if '%' in val_str:
            # Percentage case (keep logic just in case)
            val = float(val_str.replace('%', '').strip())
            # Map 0-100% to 1-5
            if val < 10: star_rating = 1
            elif val < 30: star_rating = 2
            elif val < 50: star_rating = 3
            elif val < 70: star_rating = 4
            else: star_rating = 5
        else:
            # Volume case (Million, Billion, etc.)
            mult = 1
            if 'billion' in val_str or 'b' in val_str: mult = 1000000000
            elif 'million' in val_str or 'm' in val_str: mult = 1000000
            elif 'thousand' in val_str or 'k' in val_str: mult = 1000
            
            # Extract number
            import re
            nums = re.findall(r"[-+]?\d*\.\d+|\d+", val_str)
            if nums:
                val = float(nums[0]) * mult
                
                # Star Thresholds for Volume (Adjust as needed)
                # 1: < 100k
                # 2: 100k - 1M
                # 3: 1M - 10M
                # 4: 10M - 100M
                # 5: > 100M
                if val < 100000: star_rating = 1
                elif val < 1000000: star_rating = 2
                elif val < 10000000: star_rating = 3
                elif val < 100000000: star_rating = 4
                else: star_rating = 5
            else:
                # Fallback if no number found
                star_rating = 1
    except Exception as e:
        print(f"Error parsing star rating for {tw_pen}: {e}")
        star_rating = 1

    # --- RATIONALE LOOKUP ---
    # Find matching row in DF_RATIONAL based on Index
    rationales_found = {}
    rat_row = None
    if not DF_RATIONAL.empty:
        matches = DF_RATIONAL[DF_RATIONAL['index'] == idx]
        if not matches.empty:
            rat_row = matches.iloc[0]

    # Helper to check if rationale is substantive (different from code)
    def get_rationale_if_diff(col_name_code, col_name_rat=None):
        if not col_name_rat: col_name_rat = col_name_code
        
        val_code = clean_nan(row.get(col_name_code), "N/A").strip()
        val_rat = "N/A"
        
        if rat_row is not None:
            val_rat = clean_nan(rat_row.get(col_name_rat), "N/A").strip()
            
        # If Rationale is just "N/A" or empty, skip
        if val_rat in ["N/A", "", "nan", "None"]:
            return None
            
        # If Code is "N/A" but Rationale has content, show Rationale
        if val_code in ["N/A", "", "nan", "None"] and val_rat:
            return val_rat

        # If Code matches Rationale exactly (case insensitive), SKIP (User Request)
        if val_code.lower() == val_rat.lower():
            return None
            
        # Also skip if Rationale is just "yes"/"no" and matches code
        if val_rat.lower() in ['yes', 'no'] and val_code.lower() in ['yes', 'no']:
            return None

        return val_rat

    # Populate Rationales
    # Only add to dict if get_rationale_if_diff returns a value
    
    r_kind = get_rationale_if_diff('Kind_Movement')
    if r_kind: rationales_found["Kind"] = r_kind
    
    r_grass = get_rationale_if_diff('Grassroots_mobilization') # Note: Check spelling in files
    if not r_grass: r_grass = get_rationale_if_diff('Grassroots_Mobilization')
    if r_grass: rationales_found["Grassroots"] = r_grass
    
    r_smo = get_rationale_if_diff('SMO_Leaders')
    if r_smo: rationales_found["SMO Leaders"] = r_smo
    
    r_part = get_rationale_if_diff('Key_Participants')
    if r_part: rationales_found["Participants"] = r_part
    
    r_off = get_rationale_if_diff('Offline')
    if r_off: rationales_found["Offline"] = r_off
    
    r_out = get_rationale_if_diff('Outcome')
    if r_out: rationales_found["Outcome"] = r_out

    # --- Casualties & Arrests Rationales ---
    r_inj = get_rationale_if_diff('Injuries_total')
    if r_inj: rationales_found["Injuries"] = r_inj
    
    r_pol_inj = get_rationale_if_diff('Police_injuries')
    if r_pol_inj: rationales_found["Police Injuries"] = r_pol_inj
    
    r_dth = get_rationale_if_diff('Deaths_total')
    if r_dth: rationales_found["Deaths"] = r_dth
    
    r_pol_dth = get_rationale_if_diff('Police_deaths')
    if r_pol_dth: rationales_found["Police Deaths"] = r_pol_dth
    
    r_arr = get_rationale_if_diff('Arrested')
    if r_arr: rationales_found["Arrests"] = r_arr
    
    # --- Facts Rationales ---
    r_reoc = get_rationale_if_diff('Reoccurrence')
    if r_reoc: rationales_found["Reoccurrence"] = r_reoc

    # State Responses are tricky, usually just "yes/no" in both?
    # Let's check accommodation
    r_acc = get_rationale_if_diff('State_response_accomendation')
    if r_acc: rationales_found["State Accommodation"] = r_acc

    # If no specific rationales found, fallback to merged description if available
    final_rationale_text = clean_nan(row.get('merged_description'), "No rationale available.")
    
    # If we have specific rationales, we might not need the generic text, 
    # but let's keep it as a fallback in the UI
            
    return Movement(
        id=idx,
        name=clean_nan(row.get('protest_name'), "Unknown"),
        hashtag=clean_nan(row.get('protest_name_v2'), "#Activism"),
        year=year,
        region=clean_nan(row.get('area'), "Global"),
        iso=clean_nan(row.get('ISO'), ""),
        scale=clean_nan(row.get('Number_Participants'), "Unknown"),
        type=tags[0] if tags else "General",
        regime=clean_nan(row.get('Regime_Democracy'), "Unknown"),
        description=clean_nan(row.get('Description'))[:300] + "...",
        outcome=clean_nan(row.get('Outcome'), "Ongoing"),
        impactScore=score,
        digitalMaturity=max(1, min(10, maturity)),
        centralization="Decentralized" if "grassroots" in clean_nan(row.get('Grassroots_mobilization')).lower() else "Mixed",
        tags=tags,
        
        # New Fields Mapping
        twitter_query=clean_nan(row.get('query'), ""),
        tweets_count=clean_nan(row.get('#tweets'), "N/A"),
        key_participants=clean_nan(row.get('Key_Participants'), "General Public"),
        reoccurrence=clean_nan(row.get('Reoccurrence'), "Once"),
        length_days=clean_nan(row.get('Length_Days'), "Unknown"),
        wikipedia=clean_nan(row.get('Wikipedia'), ""),
        twitter_penetration=tw_pen,
        star_rating=star_rating,
        offline_presence=clean_nan(row.get('Offline'), "Unknown"),
        rationale_text=final_rationale_text,
        
        # --- Structured Rationales (Justification) ---
        rationales=rationales_found,

        # --- Expanded Fields ---
        smo_leader=clean_nan(row.get('SMO_Leaders'), "Unknown"),
        grassroots=clean_nan(row.get('Grassroots_Mobilization'), "Unknown"),
        kind=clean_nan(row.get('Kind_Movement'), "General"),
        outcome_raw=clean_nan(row.get('Outcome'), "Ongoing"),
        state_accommodation=clean_nan(row.get('State_response_accomendation'), "No"),
        state_distraction=clean_nan(row.get('State_response_distraction'), "No"),
        state_repression=clean_nan(row.get('State_response_repression'), "No"),
        state_ignore=clean_nan(row.get('State_response_ignore'), "No"),
        injuries=clean_nan(row.get('Injuries_total'), "0"),
        police_injuries=clean_nan(row.get('Police_injuries'), "0"),
        deaths=clean_nan(row.get('Deaths_total'), "0"),
        police_deaths=clean_nan(row.get('Police_deaths'), "0"),
        arrests=clean_nan(row.get('Arrested'), "0"),
        reference=f"{clean_nan(row.get('Authors'), 'Unknown Author')} ({clean_nan(row.get('Publication_Year'), 'n.d.')}). {clean_nan(row.get('Article_Title'), 'Title Unavailable')}."
    )

def generate_full_context_csv():
    """Generates a CSV-like string of the ENTIRE database."""
    if DF_CODES.empty: return "Database is empty."
    
    context = "--- FULL DATABASE START ---\n"
    context += "ID|Name|Year|Region|Category|Tweets|Duration|Reoccurrence|Impact|Offline|Participants|Outcome|Description\n"
    
    # Sort by year for chronological consistency
    df_sorted = DF_CODES.sort_values(by='year', ascending=False)
    
    for _, row in df_sorted.iterrows():
        # Extract fields
        idx = str(row.get('index', ''))
        name = str(row.get('protest_name', 'Unknown')).replace('|', '/') # Escape delimiter
        year = str(row.get('year', 'Unknown'))
        region = str(row.get('area', 'Global'))
        
        # Tags
        tags = []
        if str(row.get('Theme_political')).lower() != 'no': tags.append('Political')
        if str(row.get('Theme_environmental')).lower() != 'no': tags.append('Environmental')
        if str(row.get('Theme_social')).lower() != 'no': tags.append('Social')
        category = ",".join(tags)
        
        tweets = str(row.get('#tweets', '0'))
        duration = str(row.get('Length_Days', 'Unknown'))
        reoccur = str(row.get('Reoccurrence', 'No'))
        impact = str(row.get('Twitter_Penetration', 'N/A'))
        offline = str(row.get('Offline', 'No'))
        parts = str(row.get('Key_Participants', 'General')).replace('|', '/')
        outcome = str(row.get('Outcome', 'Ongoing')).replace('|', '/')
        
        # Truncate description slightly to keep it sane
        desc = str(row.get('Description', ''))[:500].replace('\n', ' ').replace('|', '/')
        
        line = f"{idx}|{name}|{year}|{region}|{category}|{tweets}|{duration}|{reoccur}|{impact}|{offline}|{parts}|{outcome}|{desc}\n"
        context += line
        
    context += "--- FULL DATABASE END ---\n"
    return context

# --- Tools Definition ---
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_full_database_context",
            "description": "Retrieve the FULL database content (all 151 movements). Use this ONLY when the user asks about global statistics (e.g. 'how many total movements?'), or for movements NOT visible in the current search results. If the user asks about the 'displayed' or 'searched' movements, DO NOT use this tool.",
            "parameters": {
                "type": "object",
                "properties": {
                    "reason": {"type": "string", "description": "Why the full database is needed."}
                },
                "required": ["reason"]
            }
        }
    }
]

# --- Routes ---

@app.get("/api/search", response_model=List[Movement])
def search_movements(q: str = ""):
    if DF_CODES.empty:
        return []
    
    # --- Case 0: Empty Query -> Return Top 20 by Tweet Count (Impact) ---
    if not q or not q.strip():
        # Ensure '#tweets' is numeric, sort descending, take top 20
        # Note: '#tweets' was converted to numeric in load_data()
        try:
            top_movements = DF_CODES.sort_values(by='#tweets', ascending=False).head(20)
            return [map_row_to_movement(row) for _, row in top_movements.iterrows()]
        except Exception as e:
            print(f"Error sorting by tweets: {e}")
            # Fallback to first 20 if sort fails
            return [map_row_to_movement(row) for _, row in DF_CODES.head(20).iterrows()]

    client = get_openai_client()
    
    # Strategy: 
    # 1. If we have embeddings and API key -> Vector Search
    # 2. Else -> Fallback to keyword search
            
    if EMBEDDINGS is not None and client:
        try:
            # 1. Detect language and translate if necessary
            # Simple heuristic: if query contains non-ascii characters (likely CJK), translate it
            needs_translation = any(ord(char) > 127 for char in q)
            
            search_query = q
            if needs_translation:
                print(f"Translating query: {q}")
                try:
                    # Use LLM to translate to English for better vector matching
                    trans_response = client.chat.completions.create(
                        model=CHAT_MODEL,
                        messages=[
                            {"role": "system", "content": "Translate the following search query into English keywords for database search. Output ONLY the English translation, no other text."},
                            {"role": "user", "content": q}
                        ]
                    )
                    search_query = trans_response.choices[0].message.content.strip()
                    print(f"Translated to: {search_query}")
                except Exception as e:
                    print(f"Translation failed: {e}. Using original query.")

            # 2. Vector Search with English query
            res = client.embeddings.create(input=search_query, model=EMBEDDING_MODEL)
            q_vec = np.array(res.data[0].embedding).reshape(1, -1)
            
            # Compute cosine similarity
            # EMBEDDINGS is (N, D), q_vec is (1, D)
            scores = cosine_similarity(EMBEDDINGS, q_vec).flatten()
            
            # Get top 20 indices
            top_indices = scores.argsort()[-20:][::-1]
            
            results = []
            print(f"--- Search Results for '{q}' ---")
            for i in top_indices:
                score = scores[i]
                target_id = EMBEDDINGS_IDS[i]
                
                # Debug print
                # Find row name for debug
                debug_row = DF_CODES[DF_CODES['index'] == target_id]
                if not debug_row.empty:
                    d_name = debug_row.iloc[0].get('protest_name', 'Unknown')
                    # print(f"Candidate: {d_name}, Score: {score:.4f}")

                if score < 0.15: # Lowered global threshold to ensure recall
                    continue

                target_id = EMBEDDINGS_IDS[i]
                # Find row in DF
                row = DF_CODES[DF_CODES['index'] == target_id]
                if not row.empty:
                    mov = map_row_to_movement(row.iloc[0])
                    mov.similarity = round(float(score) * 100, 1) # Convert to percentage
                    results.append(mov)
                    
            return results
            
        except Exception as e:
            print(f"Vector search failed: {e}. Falling back to keyword.")
            pass # Fallback
            
    # Fallback Keyword Search
    query = q.lower()
    search_cols = ['protest_name', 'Description', 'Theme_social', 'protest_name_v2']
    valid_cols = [c for c in search_cols if c in DF_CODES.columns]
    mask = pd.Series(False, index=DF_CODES.index)
    for col in valid_cols:
        mask |= DF_CODES[col].astype(str).str.lower().str.contains(query, na=False)
    
    results = DF_CODES[mask].head(20)
    return [map_row_to_movement(row) for _, row in results.iterrows()]

@app.get("/api/debug_rationales")
def debug_rationales():
    """Temporary endpoint to debug Rationale data loading on Render"""
    if DF_RATIONAL.empty:
        return {"status": "error", "message": "DF_RATIONAL is empty!", "files_found": os.listdir('.')}
    
    return {
        "status": "ok",
        "count": len(DF_RATIONAL),
        "columns": DF_RATIONAL.columns.tolist(),
        "sample_ids": DF_RATIONAL['index'].head(10).tolist(),
        "sample_row": DF_RATIONAL.iloc[0].to_dict() if not DF_RATIONAL.empty else {},
        "current_dir_files": os.listdir('.')
    }

# --- DEBUG ENDPOINT (CRITICAL) ---
@app.get("/api/debug_data_match")
def debug_data_match():
    """Diagnose why Codes and Rationales are not matching"""
    report = {
        "status": "ok",
        "codes_count": len(DF_CODES),
        "rational_count": len(DF_RATIONAL),
        "codes_sample": [],
        "rational_sample": [],
        "match_test": "Not performed"
    }
    
    if not DF_CODES.empty:
        # Show ID and Name from main table
        cols = ['index', 'no', 'protest_name']
        valid_cols = [c for c in cols if c in DF_CODES.columns]
        report["codes_sample"] = DF_CODES[valid_cols].head(5).to_dict(orient='records')
        
    if not DF_RATIONAL.empty:
        # Show ID and Name from rationale table
        cols = ['index', 'no', 'protest_name_v2'] # Assuming protest_name_v2 is the name col in rational
        valid_cols = [c for c in cols if c in DF_RATIONAL.columns]
        report["rational_sample"] = DF_RATIONAL[valid_cols].head(5).to_dict(orient='records')

    # Try to find a match for the first row of Codes
    if not DF_CODES.empty and not DF_RATIONAL.empty:
        target_id = str(DF_CODES.iloc[0].get('index', ''))
        match = DF_RATIONAL[DF_RATIONAL['index'] == target_id]
        report["match_test"] = f"Searching for Code ID '{target_id}' in Rationale table... Found {len(match)} matches."

    return report

@app.get("/api/rationales", response_model=List[Rationale])
def get_rationales(id: str):
    if DF_RATIONAL.empty:
        return []
    
    # Normalize query ID
    clean_id = normalize_id(id)
    
    # DEBUG: Print what we are looking for
    print(f"--- FETCHING RATIONALES FOR ID: {clean_id} (Original: {id}) ---")
    
    # 1. Try Strict ID Match
    matches = DF_RATIONAL[DF_RATIONAL['index'] == clean_id]
    
    if not matches.empty:
        print(f"  -> Found match by ID! Name: {matches.iloc[0].get('protest_name_v2')}")
    else:
        print(f"  -> NO match by ID '{clean_id}'.")
        # Diagnostic: Check if this ID exists in Codes
        code_match = DF_CODES[DF_CODES['index'] == clean_id]
        if not code_match.empty:
            target_name = str(code_match.iloc[0].get('protest_name', '')).strip()
            print(f"  -> This ID corresponds to Code Name: '{target_name}'")
            
            # 2. Try Name Match (Fallback)
            if target_name:
                print(f"  -> Attempting Name Fallback with: '{target_name}'")
                matches = DF_RATIONAL[DF_RATIONAL['protest_name_v2'].astype(str).str.strip() == target_name]
                
                if matches.empty:
                    # Loose Match
                    matches = DF_RATIONAL[DF_RATIONAL['protest_name_v2'].astype(str).str.contains(target_name, regex=False, case=False)]
                    if not matches.empty:
                        print(f"  -> Found Loose Name match: {matches.iloc[0].get('protest_name_v2')}")
        else:
            print("  -> This ID does not even exist in DF_CODES!")

    # Debug if still empty
    if matches.empty:
        print(f"DEBUG: No rationales found for ID: {id} (clean: {clean_id})")
        
    res = []
    for _, row in matches.iterrows():
        res.append(Rationale(
            movementId=id,
            dimension="Qualitative Analysis",
            rationale=clean_nan(row.get('Description')),
            confidenceScore=0.95,
            coderId="Expert_01",
            evidenceSource="Research Data"
        ))
    return res

@app.post("/api/chat")
def chat_with_ai(req: ChatRequest):
    client = get_openai_client()
    if not client:
        raise HTTPException(status_code=500, detail="OpenAI API Key not set")
    
    # --- HYBRID AGENTIC STRATEGY (Function Calling) ---
    
    # 1. Prepare Current Screen Context (Lightweight)
    current_screen_context = "--- CURRENT SEARCH RESULTS (VISIBLE TO USER) ---\n"
    if req.context_movements:
        current_screen_context += "\n".join(req.context_movements[:30]) # Limit to top 30 to stay lean
    else:
        current_screen_context += "No specific movements currently displayed."
    current_screen_context += "\n--- END OF SEARCH RESULTS ---\n"
    
    system_prompt = """You are an expert Social Movement Research Agent.
    
    You have access to two sources of information:
    1. **Current Search Results**: The movements currently displayed on the user's screen (provided in context).
    2. **Full Database**: The entire dataset of 151 movements (accessible via the `get_full_database_context` tool).
    
    **YOUR STRATEGY:**
    - **First Priority**: Answer the user's question using ONLY the `Current Search Results` if possible. This is faster and more relevant for questions like "Which of these..." or "How many movements did I find?".
    - **Second Priority**: If the user asks about Global Statistics (e.g. "Total movements in database", "Global tweet count"), or asks for a movement NOT in the current list, YOU MUST CALL the `get_full_database_context` tool.
    
    **CRITICAL RULES:**
    - **Context Awareness**: The `Current Search Results` list IS the user's screen. If a movement is NOT in that list, you MUST say "It is not currently displayed in your search results".
    - **No Hallucination**: Do NOT claim a movement is present in the search results just because you know it exists in the database. 
    - **Clarification**: If the user asks "Do you have BLM?", check the Current Results first. If not there, call the tool to check the Full Database, and answer: "It is NOT in your current search results, BUT it exists in the full database as..."
    - **Privacy**: **NEVER** mention internal movement IDs (e.g., "ID 248", "ID: 12") in your response to the user. Refer to movements by their **Name** only.
    """
    
    messages = [
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": f"{current_screen_context}\n\nUser Question: {req.query}"}
    ]
    
    try:
        # First Call: Let AI decide if it needs the full database
        response = client.chat.completions.create(
            model=CHAT_MODEL,
            messages=messages,
            tools=tools,
            tool_choice="auto"
        )
        
        response_message = response.choices[0].message
        
        # Check for tool calls
        if response_message.tool_calls:
            # Append the assistant's thought process
            messages.append(response_message)
            
            for tool_call in response_message.tool_calls:
                func_name = tool_call.function.name
                
                if func_name == "get_full_database_context":
                    print("Agent decided to load FULL database context.")
                    full_data = generate_full_context_csv()
                    
                    # Feed the full data back as tool output
                    messages.append({
                        "tool_call_id": tool_call.id,
                        "role": "tool",
                        "name": func_name,
                        "content": full_data
                    })
            
            # Second Call: AI answers with the full context now available
            final_res = client.chat.completions.create(
                model=CHAT_MODEL,
                messages=messages
            )
            return {"response": final_res.choices[0].message.content}
            
        else:
            # No tool called -> Answered based on screen context
            return {"response": response_message.content}
            
    except Exception as e:
        print(f"Chat Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# --- Serve Frontend (Last Route) ---
# Mount the built React app static files
# Make sure to run 'npm run build' in webpage_example first!
if os.path.exists("webpage_example/dist"):
    app.mount("/assets", StaticFiles(directory="webpage_example/dist/assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        # Allow API calls to pass through
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API endpoint not found")
            
        # Serve index.html for any other route (Client-side routing)
        file_path = "webpage_example/dist/index.html"
        if os.path.exists(file_path):
            return FileResponse(file_path)
        return "React build not found. Please run 'npm run build' in webpage_example folder."
else:
    print("Warning: 'webpage_example/dist' not found. Frontend will not be served.")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
