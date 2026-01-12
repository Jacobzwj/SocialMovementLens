import pandas as pd
import numpy as np

def find_meaningful_rationales():
    try:
        df_codes = pd.read_excel("Coding_LATEST_LH.xlsx")
        df_rational = pd.read_excel("CodingRational_LATEST.xlsx")

        # Normalize indices
        df_codes['index'] = df_codes['index'].astype(str).str.replace(r'\.0$', '', regex=True)
        df_rational['index'] = df_rational['index'].astype(str).str.replace(r'\.0$', '', regex=True)

        common_cols = set(df_codes.columns).intersection(set(df_rational.columns))
        ignored_cols = {'no', 'index', 'protest_name', 'protest_name_v2', 'Description', 'check', 'ISO', 'area'}
        
        candidates = sorted(list(common_cols - ignored_cols))
        
        print(f"Comparing {len(candidates)} columns for substantive differences...")
        print("-" * 60)
        
        meaningful_rationales = []
        
        # Take a sample of rows (intersection of indices)
        common_indices = set(df_codes['index']).intersection(set(df_rational['index']))
        sample_indices = list(common_indices)[:10] 
        
        for col in candidates:
            diff_count = 0
            total_checked = 0
            
            for idx in sample_indices:
                code_row = df_codes[df_codes['index'] == idx]
                rat_row = df_rational[df_rational['index'] == idx]
                
                if code_row.empty or rat_row.empty: continue
                
                val_code = str(code_row.iloc[0].get(col, '')).strip()
                val_rat = str(rat_row.iloc[0].get(col, '')).strip()
                
                # Simple heuristic: if rationale is significantly longer than code, or completely different text
                if val_code != val_rat and len(val_rat) > 10:
                    diff_count += 1
                total_checked += 1
            
            if total_checked > 0 and (diff_count / total_checked) > 0.5:
                meaningful_rationales.append(col)
                print(f"[FOUND] {col}: Code='{val_code[:20]}...' vs Rationale='{val_rat[:20]}...'")

        print("-" * 60)
        print("Recommended columns for Rationale Display:")
        print(meaningful_rationales)

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    find_meaningful_rationales()
