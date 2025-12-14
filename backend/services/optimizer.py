import numpy as np
import pandas as pd
from typing import List, Dict

from .portfolio_math import (
    calculate_daily_returns,
    calculate_mean_returns,
    calculate_covariance_matrix,
)
from .data_pipeline import load_symbol


# ------------------------------------------------
# 1. LOAD PRICE DATA
# ------------------------------------------------
def load_price_matrix(symbols: List[str]) -> pd.DataFrame:
    """
    Creates a DataFrame where each column is a symbol's closing prices.
    """
    price_data = {}

    for symbol in symbols:
        df = load_symbol(symbol)
        price_data[symbol.upper()] = df["close"].values

    return pd.DataFrame(price_data)


# ------------------------------------------------
# 2. EQUAL WEIGHT STRATEGY
# ------------------------------------------------
def equal_weight_strategy(symbols: List[str]) -> Dict[str, float]:
    n = len(symbols)
    return {symbol: 1 / n for symbol in symbols}


# ------------------------------------------------
# 3. VOLATILITY-BASED STRATEGY
# ------------------------------------------------
def volatility_weighted_strategy(returns_df: pd.DataFrame) -> Dict[str, float]:
    vol = returns_df.std()
    inv_vol = 1 / vol
    weights = inv_vol / inv_vol.sum()
    return weights.to_dict()


# ------------------------------------------------
# 4. INVERSE VARIANCE PORTFOLIO (IVP)
# ------------------------------------------------
def inverse_variance_strategy(cov_matrix: pd.DataFrame) -> Dict[str, float]:
    variances = np.diag(cov_matrix)
    inv_var = 1 / variances
    weights = inv_var / inv_var.sum()
    return dict(zip(cov_matrix.columns, weights))


# ------------------------------------------------
# 5. RETURN-BASED STRATEGY
# ------------------------------------------------
def return_weighted_strategy(mean_returns: pd.Series) -> Dict[str, float]:
    positive_returns = mean_returns.clip(lower=0)
    weights = positive_returns / positive_returns.sum()
    return weights.to_dict()


# ------------------------------------------------
# 6. MAIN OPTIMIZER
# ------------------------------------------------
def optimize_portfolio(
    symbols: List[str],
    risk_category: str
) -> Dict:
    """
    Chooses an optimization strategy based on user risk profile.
    """

    # Load prices
    price_df = load_price_matrix(symbols)

    # Calculate returns & stats
    returns_df = calculate_daily_returns(price_df)
    mean_returns = calculate_mean_returns(returns_df)
    cov_matrix = calculate_covariance_matrix(returns_df)

    risk_category = risk_category.lower()

    # Choose strategy
    if risk_category == "conservative":
        weights = inverse_variance_strategy(cov_matrix)
        strategy = "inverse_variance"

    elif risk_category == "moderate":
        weights = volatility_weighted_strategy(returns_df)
        strategy = "volatility_weighted"

    elif risk_category == "aggressive":
        weights = return_weighted_strategy(mean_returns)
        strategy = "return_weighted"

    else:
        weights = equal_weight_strategy(symbols)
        strategy = "equal_weight"

    # Normalize weights (safety)
    total = sum(weights.values())
    weights = {k: v / total for k, v in weights.items()}

    return {
        "strategy": strategy,
        "weights": weights,
        "mean_returns": mean_returns,
        "cov_matrix_raw": cov_matrix,
    }
