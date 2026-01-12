import pandas as pd

def check_excel_columns():
    try:
        # Load the two Excel files
        df_codes = pd.read_excel("Coding_LATEST_LH.xlsx")
        df_rationale = pd.read_excel("CodingRational_LATEST.xlsx")

        print("=== Coding_LATEST_LH.xlsx Columns ===")
        print(df_codes.columns.tolist())
        print(f"\nTotal Columns: {len(df_codes.columns)}")

        print("\n=== CodingRational_LATEST.xlsx Columns ===")
        print(df_rationale.columns.tolist())
        print(f"\nTotal Columns: {len(df_rationale.columns)}")

        # Check for intersection
        common_cols = set(df_codes.columns).intersection(set(df_rationale.columns))
        print(f"\n=== Common Columns ({len(common_cols)}) ===")
        print(sorted(list(common_cols)))

        # Check for potential mapping (e.g., matching prefixes)
        print("\n=== Sample Data for comparison (First Row) ===")
        print("--- Coding File (First 5 cols) ---")
        print(df_codes.iloc[0].head().to_dict())
        print("--- Rationale File (First 5 cols) ---")
        print(df_rationale.iloc[0].head().to_dict())

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_excel_columns()
