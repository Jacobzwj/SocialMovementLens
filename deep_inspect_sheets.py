import pandas as pd

def inspect_sheets_and_diff():
    file_codes = "Coding_LATEST_LH.xlsx"
    file_rational = "CodingRational_LATEST.xlsx"
    
    try:
        # 1. Check Sheets
        xl_codes = pd.ExcelFile(file_codes)
        print(f"Sheets in {file_codes}: {xl_codes.sheet_names}")
        
        xl_rational = pd.ExcelFile(file_rational)
        print(f"Sheets in {file_rational}: {xl_rational.sheet_names}")
        
        # 2. Load the likely primary sheets
        df_c = pd.read_excel(file_codes, sheet_name=0) # Load first sheet
        df_r = pd.read_excel(file_rational, sheet_name=0) # Load first sheet
        
        # Normalize Index
        # Assuming 'index' or 'no' is the key
        id_col_c = 'index' if 'index' in df_c.columns else 'no'
        id_col_r = 'index' if 'index' in df_r.columns else 'no'
        
        df_c[id_col_c] = df_c[id_col_c].astype(str).str.replace(r'\.0$', '', regex=True)
        df_r[id_col_r] = df_r[id_col_r].astype(str).str.replace(r'\.0$', '', regex=True)
        
        # 3. Compare content for a specific row
        target_id = "118" # Refugees Welcome
        
        row_c = df_c[df_c[id_col_c] == target_id]
        row_r = df_r[df_r[id_col_r] == target_id]
        
        if row_c.empty: print(f"ID {target_id} not found in Codes")
        if row_r.empty: print(f"ID {target_id} not found in Rationale")
        
        if not row_c.empty and not row_r.empty:
            cols_to_compare = ['Grassroots_mobilization', 'Kind_Movement', 'Outcome', 'SMO_Leaders']
            
            print(f"\n--- Comparing content for ID {target_id} ---")
            for col in cols_to_compare:
                val_c = str(row_c.iloc[0].get(col, "N/A")).strip()
                val_r = str(row_r.iloc[0].get(col, "N/A")).strip()
                
                # Check similarity
                is_same = val_c == val_r
                print(f"\nColumn: {col}")
                print(f"  Code ({len(val_c)} chars): {val_c[:50]}...")
                print(f"  Rat  ({len(val_r)} chars): {val_r[:50]}...")
                print(f"  Identical? {is_same}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    inspect_sheets_and_diff()
