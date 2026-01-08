import pandas as pd

try:
    df = pd.read_excel('Coding_LATEST_LH.xlsx', sheet_name='Coding_clean')
    if 'Regime_Democracy' in df.columns:
        print("Unique Regime values:")
        print(df['Regime_Democracy'].unique())
        print("\nValue counts:")
        print(df['Regime_Democracy'].value_counts())
    else:
        print("Column 'Regime_Democracy' not found.")
except Exception as e:
    print(f"Error: {e}")
