import pandas as pd

def diagnose_mismatch():
    print("Reading Coding_LATEST_LH.xlsx...")
    df_codes = pd.read_excel('Coding_LATEST_LH.xlsx', sheet_name='Coding_clean')
    
    print("Reading CodingRational_LATEST.xlsx...")
    try:
        df_rational = pd.read_excel('CodingRational_LATEST.xlsx', sheet_name='CodingRationale_clean')
    except:
        df_rational = pd.read_excel('CodingRational_LATEST.xlsx')

    # Normalize column names
    df_codes.columns = [c.strip() for c in df_codes.columns]
    df_rational.columns = [c.strip() for c in df_rational.columns]

    print(f"\nCodes Count: {len(df_codes)}")
    print(f"Rational Count: {len(df_rational)}")

    # Compare 'no' columns row by row
    limit = min(len(df_codes), len(df_rational))
    
    print("\n--- Comparing first mismatch ---")
    for i in range(limit):
        code_no = df_codes.iloc[i].get('no')
        rational_no = df_rational.iloc[i].get('no')
        
        # Also check names to be sure
        code_name = df_codes.iloc[i].get('protest_name')
        rational_name = df_rational.iloc[i].get('protest_name_v2')

        # Check if 'no' matches
        if str(code_no) != str(rational_no):
            print(f"MISMATCH FOUND AT ROW {i+2} (Excel Row Number)!")
            print(f"Codes Table:    no={code_no}, Name={code_name}")
            print(f"Rational Table: no={rational_no}, Name={rational_name}")
            return

        # Check if 'Name' matches roughly
        if str(code_name).strip() != str(rational_name).strip():
             print(f"POTENTIAL MISMATCH AT ROW {i+2} (Name different, ID same)!")
             print(f"Codes Table:    no={code_no}, Name={code_name}")
             print(f"Rational Table: no={rational_no}, Name={rational_name}")
             # Don't return, just warn, as names might just be spelled differently

    print("No ID mismatches found in the first N rows.")

if __name__ == "__main__":
    diagnose_mismatch()
