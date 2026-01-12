import pandas as pd

def debug_specific_cols():
    try:
        df_codes = pd.read_excel("Coding_LATEST_LH.xlsx")
        df_rational = pd.read_excel("CodingRational_LATEST.xlsx")

        # Normalize indices to ensure matching
        df_codes['index'] = df_codes['index'].astype(str).str.replace(r'\.0$', '', regex=True)
        df_rational['index'] = df_rational['index'].astype(str).str.replace(r'\.0$', '', regex=True)

        target_id = "118" # Refugees Welcome
        
        row_c = df_codes[df_codes['index'] == target_id]
        row_r = df_rational[df_rational['index'] == target_id]

        if row_c.empty or row_r.empty:
            print("Row 118 not found")
            return

        cols_to_check = [
            'Grassroots_mobilization', 
            'Outcome', 
            'Kind_Movement', 
            'State_response_accomendation',
            'Key_Participants'
        ]

        print(f"=== Debugging Movement ID: {target_id} ===")
        for col in cols_to_check:
            val_c = row_c.iloc[0].get(col, "N/A")
            val_r = row_r.iloc[0].get(col, "N/A")
            
            print(f"\n[{col}]")
            print(f"CODE:      {str(val_c)[:60]}...")
            print(f"RATIONALE: {str(val_r)[:100]}...")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    debug_specific_cols()
