from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from .. import crud, schemas, models

router = APIRouter(tags=["Wallet"])


# -----------------------------
# GET WALLET DETAILS + HOLDINGS
# -----------------------------
@router.get("/wallet/{user_id}", response_model=schemas.HoldingsResponse)
def get_wallet_details(user_id: int, db: Session = Depends(get_db)):
    wallet = crud.get_wallet(db, user_id)
    if not wallet:
        wallet = crud.create_wallet(db, user_id)

    holdings = crud.calculate_holdings(db, user_id)

    # Format holdings for output
    holdings_list = []
    for symbol, qty in holdings.items():
        holdings_list.append({
            "symbol": symbol,
            "quantity": qty,
            "avg_buy_price": 0  # Placeholder: we add real calculation later
        })

    return {
        "user_id": user_id,
        "holdings": holdings_list
    }


# -----------------------------
# DEPOSIT MONEY INTO WALLET
# -----------------------------
@router.post("/wallet/{user_id}/deposit", response_model=schemas.WalletResponse)
def deposit_money(user_id: int, data: schemas.WalletCreate, db: Session = Depends(get_db)):
    wallet = crud.deposit(db, user_id, data.amount)
    return {
        "id": wallet.id,
        "user_id": user_id,
        "balance": wallet.balance
    }


# -----------------------------
# BUY ASSET
# -----------------------------
@router.post("/wallet/{user_id}/buy", response_model=schemas.TransactionResponse)
def buy_asset(user_id: int, data: schemas.TransactionCreate, db: Session = Depends(get_db)):
    if data.direction.upper() != "BUY":
        raise HTTPException(status_code=400, detail="Direction must be BUY")

    tx = crud.buy_asset(db, user_id, data.symbol, data.quantity)
    return tx


# -----------------------------
# SELL ASSET
# -----------------------------
@router.post("/wallet/{user_id}/sell", response_model=schemas.TransactionResponse)
def sell_asset(user_id: int, data: schemas.TransactionCreate, db: Session = Depends(get_db)):
    if data.direction.upper() != "SELL":
        raise HTTPException(status_code=400, detail="Direction must be SELL")

    tx = crud.sell_asset(db, user_id, data.symbol, data.quantity)
    return tx
