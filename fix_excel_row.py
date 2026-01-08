import pandas as pd
import os

def fix_excel_mismatch():
    file_path = 'CodingRational_LATEST.xlsx'
    
    print(f"Reading {file_path}...")
    try:
        # Read the file
        df = pd.read_excel(file_path, sheet_name='CodingRationale_clean')
        print(f"Original Row Count: {len(df)}")
        
        # Filter out the problematic row (no == 42)
        # Note: We convert to int just in case it's string "42"
        # Using a safer approach: keep everything where 'no' is NOT 42
        
        # Check if 'no' column exists
        if 'no' in df.columns:
            # Drop rows where 'no' is 42
            df_clean = df[df['no'] != 42]
            
            rows_dropped = len(df) - len(df_clean)
            if rows_dropped > 0:
                print(f"✅ Successfully dropped {rows_dropped} row(s) with no=42.")
                
                # Save back to Excel
                # We need to preserve the sheet name
                with pd.ExcelWriter(file_path, engine='openpyxl') as writer:
                    df_clean.to_excel(writer, sheet_name='CodingRationale_clean', index=False)
                
                print(f"💾 File saved successfully: {file_path}")
                print(f"New Row Count: {len(df_clean)}")
            else:
                print("⚠️ No row with no=42 found. Maybe it's already deleted?")
        else:
            print("❌ Error: Column 'no' not found in Excel file.")
            
    except Exception as e:
        print(f"❌ Error processing file: {e}")
        # Try to show column names to help debug
        try:
            df = pd.read_excel(file_path)
            print(f"Available columns: {df.columns.tolist()}")
        except:
            pass

if __name__ == "__main__":
    fix_excel_mismatch()
