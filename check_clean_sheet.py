import pandas as pd

def check_clean_sheet():
    try:
        # Load specifically the 'Coding_clean' sheet
        df_clean = pd.read_excel("Coding_LATEST_LH.xlsx", sheet_name="Coding_clean")
        
        # Load rationale file for comparison
        df_rat = pd.read_excel("CodingRational_LATEST.xlsx") # Default sheet

        # Normalize indices
        id_col = 'index' if 'index' in df_clean.columns else 'no'
        df_clean[id_col] = df_clean[id_col].astype(str).str.replace(r'\.0$', '', regex=True)
        
        df_rat['index'] = df_rat['index'].astype(str).str.replace(r'\.0$', '', regex=True)

        target_id = "118"
        row_c = df_clean[df_clean[id_col] == target_id]
        row_r = df_rat[df_rat['index'] == target_id]
        
        print(f"=== Comparing Sheet 'Coding_clean' vs Rationale File (ID: {target_id}) ===")
        
        cols = ['Grassroots_mobilization', 'Kind_Movement', 'Outcome', 'SMO_Leaders']
        
        for col in cols:
            val_clean = str(row_c.iloc[0].get(col, "N/A")).strip() if not row_c.empty else "N/A"
            val_rat = str(row_r.iloc[0].get(col, "N/A")).strip() if not row_r.empty else "N/A"
            
            print(f"\n[Column: {col}]")
            print(f"  CLEAN: {val_clean[:50]}...")
            print(f"  RAT:   {val_rat[:50]}...")
            print(f"  SAME?  {val_clean == val_rat}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_clean_sheet()
