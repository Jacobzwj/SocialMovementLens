import pandas as pd

try:
    df = pd.read_excel('Coding_LATEST_LH.xlsx', sheet_name='Coding_clean')
    
    print("\n--- Top 10 Protest Names ---")
    print(df['protest_name'].head(10).tolist())
    
    print("\n--- Unique Areas (Top 10) ---")
    print(df['area'].unique()[:10])
    
    print("\n--- Years Distribution ---")
    print(df['year'].value_counts().head(5))
    
    print("\n--- Key Participants (Sample) ---")
    print(df['Key_Participants'].dropna().sample(5).tolist())

    print("\n--- Themes (Political != 'no') Sample ---")
    print(df[df['Theme_political'] != 'no']['protest_name'].head(3).tolist())

except Exception as e:
    print(e)
