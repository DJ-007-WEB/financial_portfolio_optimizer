from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import numpy as np

from ..database import get_db
from .. import models, schemas
from ..services.optimizer import optimize_portfolio
from ..services.portfolio_math import (
    portfolio_expected_return,
    portfolio_volatility,
    sharpe_ratio
)

router = APIRouter(tags=["Portfolio Optimization"])


@router.post("/portfolio/optimize")
def optimize_user_portfolio(
    request: schemas.PortfolioOptimizeRequest,
    db: Session = Depends(get_db)
):
    user_id = request.user_id
    symbols = request.symbols
    # -----------------------------
    # 1. Validate user
    # -----------------------------
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # -----------------------------
    # 2. Get risk profile
    # -----------------------------
    risk_profile = db.query(models.RiskProfile).filter(
        models.RiskProfile.user_id == user_id
    ).first()

    if not risk_profile:
        raise HTTPException(status_code=404, detail="Risk profile not found")

    risk_category = risk_profile.category

    # -----------------------------
    # 3. Run optimizer
    # -----------------------------
    result = optimize_portfolio(symbols, risk_category)

    weights_dict = result["weights"]
    strategy_used = result["strategy"]

    # Convert weights to array
    weights = np.array(list(weights_dict.values()))


    # -----------------------------
    # 4. Portfolio metrics
    # -----------------------------
    mean_returns = result["mean_returns"]
    cov_matrix = result["cov_matrix_raw"]

    expected_return = portfolio_expected_return(
        weights,mean_returns.values
    )

    volatility = portfolio_volatility(
        weights, cov_matrix.values
    )

    sharpe = sharpe_ratio(expected_return, volatility)


    # -----------------------------
    # 5. Response
    # -----------------------------
    return {
        "user_id": user_id,
        "risk_category": risk_category,
        "strategy_used": strategy_used,
        "recommended_weights": weights_dict,
        "expected_return": round(expected_return, 4),
        "expected_risk": round(volatility, 4),
        "sharpe_ratio": round(sharpe, 4)
    }

