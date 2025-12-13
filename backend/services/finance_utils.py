import numpy as np

def compute_daily_returns(df):
    return df["close"].pct_change().dropna()

def compute_volatility(df):
    returns = compute_daily_returns(df)
    return float(returns.std() * np.sqrt(252))

def compute_mean_return(df):
    returns = compute_daily_returns(df)
    return float(returns.mean() * 252)
