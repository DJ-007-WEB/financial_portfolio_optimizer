import os
import pandas as pd

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def load_symbol(symbol: str) -> pd.DataFrame:
    """
    Loads a CSV from backend/data and normalizes column names.
    """
    file_path = os.path.join(DATA_DIR, f"{symbol.upper()}.csv")

    if not os.path.exists(file_path):
        raise FileNotFoundError(f"No data found for symbol {symbol}")

    df = pd.read_csv(file_path)

    # Normalize to lowercase
    df.columns = df.columns.str.lower()

    # Ensure required columns exist
    required_cols = {"date", "open", "high", "low", "close", "volume"}
    if not required_cols.issubset(set(df.columns)):
        raise ValueError(f"Missing required columns in CSV: {df.columns}")

    # Convert date column
    df["date"] = pd.to_datetime(df["date"])

    return df
