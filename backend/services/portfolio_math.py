import numpy as np
import pandas as pd


# ------------------------------------------------
# 1. DAILY RETURNS
# ------------------------------------------------
def calculate_daily_returns(price_df: pd.DataFrame) -> pd.DataFrame:
    """
    Input: DataFrame with asset prices (columns = symbols)
    Output: DataFrame of daily returns
    """
    return price_df.pct_change().dropna()


# ------------------------------------------------
# 2. MEAN (EXPECTED) RETURNS
# ------------------------------------------------
def calculate_mean_returns(returns_df: pd.DataFrame, trading_days: int = 252) -> pd.Series:
    """
    Annualized mean returns
    """
    return returns_df.mean() * trading_days


# ------------------------------------------------
# 3. COVARIANCE MATRIX
# ------------------------------------------------
def calculate_covariance_matrix(returns_df: pd.DataFrame, trading_days: int = 252) -> pd.DataFrame:
    """
    Annualized covariance matrix
    """
    return returns_df.cov() * trading_days


# ------------------------------------------------
# 4. PORTFOLIO EXPECTED RETURN
# ------------------------------------------------
def portfolio_expected_return(weights: np.ndarray, mean_returns: pd.Series) -> float:
    """
    Portfolio expected return
    """
    return float(np.dot(weights, mean_returns))


# ------------------------------------------------
# 5. PORTFOLIO RISK (VOLATILITY)
# ------------------------------------------------
def portfolio_volatility(weights: np.ndarray, cov_matrix: pd.DataFrame) -> float:
    """
    Portfolio volatility (standard deviation)
    """
    return float(np.sqrt(np.dot(weights.T, np.dot(cov_matrix, weights))))


# ------------------------------------------------
# 6. SHARPE RATIO
# ------------------------------------------------
def sharpe_ratio(
    expected_return: float,
    volatility: float,
    risk_free_rate: float = 0.05
) -> float:
    """
    Risk-adjusted return
    """
    if volatility == 0:
        return 0.0
    return (expected_return - risk_free_rate) / volatility
