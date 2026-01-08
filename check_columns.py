import pandas as pd

try:
    print("Checking column names in clean sheets...")
    
    if pd.ExcelFile('Coding_LATEST_LH.xlsx').sheet_names:
        df_c = pd.read_excel('Coding_LATEST_LH.xlsx', sheet_name='Coding_clean')
        print(f"\n[Coding_clean] Columns ({len(df_c)} rows):")
        print(df_c.columns.tolist())
        
    if pd.ExcelFile('CodingRational_LATEST.xlsx').sheet_names:
        # Check specifically for CodingRationale_clean first
        xl_rat = pd.ExcelFile('CodingRational_LATEST.xlsx')
        target_sheet = 'CodingRationale_clean'
        if target_sheet not in xl_rat.sheet_names:
             print(f"\nWarning: '{target_sheet}' not found in CodingRational_LATEST.xlsx. Available: {xl_rat.sheet_names}")
             target_sheet = xl_rat.sheet_names[0] # Fallback to check first sheet
        
        df_r = pd.read_excel('CodingRational_LATEST.xlsx', sheet_name=target_sheet)
        print(f"\n[{target_sheet}] Columns ({len(df_r)} rows):")
        print(df_r.columns.tolist())

except Exception as e:
    print(f"Error: {e}")
