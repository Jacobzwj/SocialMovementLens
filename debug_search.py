import pandas as pd
import os
import sys

# Mocking the cleanup functions from server.py
def clean_nan(val, default=""):
    if pd.isna(val) or val == "" or str(val).lower() == "nan":
        return default
    return str(val).strip()

def format_float_to_int(val, default=""):
    s = clean_nan(val, default)
    try:
        if s.endswith('.0'):
            return s[:-2]
        return str(int(float(s)))
    except:
        return s

# Load data (simulating server load)
try:
    DF_CODES = pd.read_excel("Coding_LATEST_LH.xlsx", sheet_name="Coding_clean")
    print(f"Data loaded. Shape: {DF_CODES.shape}")
    print("Columns:", DF_CODES.columns.tolist())
except Exception as e:
    print(f"Error loading data: {e}")
    sys.exit(1)

# Inspect where '#OscarsSoWhite' might be
term = "#OscarsSoWhite"
term_clean = "OscarsSoWhite"
found_cols = []

print(f"\nScanning for '{term_clean}' in all columns...")
for col in DF_CODES.columns:
    try:
        matches = DF_CODES[col].astype(str).str.contains(term_clean, case=False, na=False)
        if matches.any():
            count = matches.sum()
            print(f"Found {count} matches in column: '{col}'")
            found_cols.append(col)
            # Print a sample
            print(f"  Sample: {DF_CODES.loc[matches, col].iloc[0]}")
    except Exception as e:
        pass

if not found_cols:
    print(f"WARNING: '{term_clean}' not found in ANY column!")
else:
    print(f"'{term_clean}' found in columns: {found_cols}")

# Simulate the Server Keyword Search Logic
print("\n--- Simulating Server Keyword Search ---")
query = term.lower()
# Current columns in server.py
search_cols = ['protest_name', 'Description', 'Theme_social', 'protest_name_v2']
valid_cols = [c for c in search_cols if c in DF_CODES.columns]

print(f"Searching in columns: {valid_cols}")

mask = pd.Series(False, index=DF_CODES.index)
for col in valid_cols:
    mask |= DF_CODES[col].astype(str).str.lower().str.contains(query, na=False)

results = DF_CODES[mask]
print(f"Results found: {len(results)}")

if len(results) > 0:
    print("Top match:", results.iloc[0].get('protest_name', 'No Name'))
else:
    print("No results found using current server logic.")
    
    # Suggest fix
    if found_cols:
        print(f"\nSUGGESTION: Add {found_cols} to 'search_cols' in server.py")
