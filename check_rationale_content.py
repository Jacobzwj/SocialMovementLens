import pandas as pd

def check_content_diff():
    try:
        df_codes = pd.read_excel("Coding_LATEST_LH.xlsx")
        df_rationale = pd.read_excel("CodingRational_LATEST.xlsx")

        target_cols = ['SMO_Leaders', 'Grassroots_mobilization', 'Kind_Movement', 'Outcome']

        print(f"{'Column':<25} | {'Code Value (File 1)':<30} | {'Rationale Text (File 2)':<50}")
        print("-" * 110)

        for col in target_cols:
            if col in df_codes.columns and col in df_rationale.columns:
                val_code = str(df_codes[col].iloc[0])[:30]
                val_rat = str(df_rationale[col].iloc[0])[:50].replace('\n', ' ')
                print(f"{col:<25} | {val_code:<30} | {val_rat:<50}...")
            else:
                print(f"{col:<25} | Not found in one of the files")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_content_diff()
