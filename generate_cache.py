import pandas as pd
import numpy as np
import os
import pickle
from openai import OpenAI

# --- Configuration ---
# 使用 OpenRouter 和 Google Gemini 3 Flash Preview (因其免费且快速)
# 注意：Embedding 还是用 OpenAI 的 text-embedding-3-small
API_KEY = "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"
EMBEDDING_MODEL = "openai/text-embedding-3-small"
CACHE_FILE = "embeddings_cache.pkl"

def normalize_id(val):
    s = str(val).strip()
    if s.endswith('.0'):
        return s[:-2]
    return s

def main():
    print("--- Starting Embedding Generation ---")
    
    # 1. Load Data
    print("Loading Excel data...")
    df_codes = pd.DataFrame()
    df_rational = pd.DataFrame()
    
    try:
        # Load Codes
        if os.path.exists('Coding_LATEST_LH.xlsx'):
            df_codes = pd.read_excel('Coding_LATEST_LH.xlsx', sheet_name='Coding_clean')
            print(f"Loaded {len(df_codes)} rows from Coding_clean")
            
            # Normalize Index
            if 'index' in df_codes.columns:
                df_codes['index'] = df_codes['index'].astype(str).apply(normalize_id)
            elif 'no' in df_codes.columns:
                df_codes['index'] = df_codes['no'].astype(str).apply(normalize_id)
            else:
                df_codes['index'] = df_codes.index.astype(str)

        # Load Rationales (for Descriptions)
        if os.path.exists('CodingRational_LATEST.xlsx'):
            try:
                df_rational = pd.read_excel('CodingRational_LATEST.xlsx', sheet_name='CodingRationale_clean')
            except:
                df_rational = pd.read_excel('CodingRational_LATEST.xlsx')
                
            print(f"Loaded {len(df_rational)} rows from Rationale")
            
            if 'index' in df_rational.columns:
                df_rational['index'] = df_rational['index'].astype(str).apply(normalize_id)
            elif 'no' in df_rational.columns:
                df_rational['index'] = df_rational['no'].astype(str).apply(normalize_id)

    except Exception as e:
        print(f"Error reading Excel files: {e}")
        return

    if df_codes.empty:
        print("DF_CODES is empty. Aborting.")
        return

    # 2. Setup Client
    client = OpenAI(
        api_key=API_KEY,
        base_url="https://openrouter.ai/api/v1"
    )

    vectors = []
    ids = []
    
    print("Generating embeddings via OpenRouter...")
    
    # 3. Iterate and Embed
    for i, row in df_codes.iterrows():
        idx = str(row.get('index', ''))
        name = str(row.get('protest_name', ''))
        theme = str(row.get('Theme_social', ''))
        query_val = str(row.get('query', ''))
        article = str(row.get('Article_Title', ''))
        keywords = str(row.get('keywords_processed', ''))
        
        # Get Description from Rationale if available
        desc = ""
        if not df_rational.empty:
            match = df_rational[df_rational['index'] == idx]
            if not match.empty:
                desc = str(match.iloc[0].get('Description', ''))
        
        # Construct Text
        rich_text = f"Movement: {name}. Description: {desc}. Theme: {theme}. Query: {query_val}. Article: {article}. Keywords: {keywords}."
        
        try:
            res = client.embeddings.create(
                input=rich_text,
                model=EMBEDDING_MODEL
            )
            vec = res.data[0].embedding
            vectors.append(vec)
            ids.append(idx)
            
            if i % 10 == 0:
                print(f"Processed {i}/{len(df_codes)}")
                
        except Exception as e:
            print(f"Error embedding row {idx}: {e}")

    # 4. Save Cache
    if vectors:
        print(f"Saving {len(vectors)} vectors to {CACHE_FILE}...")
        with open(CACHE_FILE, 'wb') as f:
            pickle.dump({'vectors': np.array(vectors), 'ids': ids}, f)
        print("Done! You can now commit this file to GitHub.")
    else:
        print("No vectors generated.")

if __name__ == "__main__":
    main()
