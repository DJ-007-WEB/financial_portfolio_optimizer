# backend/routes/risk.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud
from ..database import get_db

router = APIRouter(tags=["Risk Profile"])

# Risk scoring logic
def score_profile(rp: schemas.RiskProfileIn):
    total = rp.q1 + rp.q2 + rp.q3 + rp.q4 + rp.q5 + rp.q6 + rp.q7 + rp.q8 + rp.q9 + rp.q10

    if total <= 30:
        cat = "Conservative"
    elif total <= 60:
        cat = "Moderate"
    else:
        cat = "Aggressive"

    return total, cat

@router.post("/risk_profile", response_model=schemas.RiskProfileOut)
def create_risk_profile(rp: schemas.RiskProfileIn, db: Session = Depends(get_db)):
    # check if user exists
    user = crud.get_user(db, rp.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    score, category = score_profile(rp)
    return crud.create_or_update_risk_profile(db, rp, score, category)

@router.get("/risk_profile/{user_id}", response_model=schemas.RiskProfileOut)
def get_user_risk(user_id: int, db: Session = Depends(get_db)):
    rp = crud.get_risk_profile_by_user(db, user_id)
    if not rp:
        raise HTTPException(status_code=404, detail="Risk profile not found")

    return rp
