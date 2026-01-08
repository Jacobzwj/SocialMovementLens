import pandas as pd

try:
    df = pd.read_excel('Coding_LATEST_LH.xlsx', sheet_name='Coding_clean')
    print("Columns:", df.columns.tolist())
    
    # Check Area and ISO columns
    if 'area' in df.columns and 'ISO' in df.columns:
        print("\nSample Data (First 20 rows):")
        print(df[['protest_name', 'area', 'ISO']].head(20))
        
        # Check for unique values in ISO to see if they look like country codes
        print("\nUnique ISO values:")
        print(df['ISO'].unique())
        
        # Check for missing ISOs
        missing_iso = df[df['ISO'].isna()]
        print(f"\nRows with missing ISO: {len(missing_iso)}")
        if not missing_iso.empty:
            print(missing_iso[['protest_name', 'area']].head())
            
    else:
        print("Columns 'area' or 'ISO' not found.")

except Exception as e:
    print(f"Error: {e}")
