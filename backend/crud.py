# backend/crud.py
from sqlalchemy.orm import Session
from . import models, schemas
from fastapi import HTTPException
from .services.data_pipeline import load_symbol
import hashlib
import re

# ---------- User ----------
def create_user(db: Session, user_in: schemas.UserCreate):
    # Validate user_id pattern: lowercase letters, at least one digit, one special char, 5-20 chars
    pattern = r"^(?=.*[0-9])(?=.*[!@#$%^&*._-])(?=.*[a-z])[a-z0-9!@#$%^&*._-]{5,20}$"
    if not re.match(pattern, user_in.user_id):
        raise HTTPException(status_code=400, detail="Invalid user_id format")

    existing = db.query(models.User).filter(models.User.user_id == user_in.user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="User ID already exists")

    password_hash = hashlib.sha256(user_in.password.encode()).hexdigest()
    user = models.User(user_id=user_in.user_id, name=user_in.name, password_hash=password_hash)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_code(db: Session, user_code: str):
    return db.query(models.User).filter(models.User.user_id == user_code).first()

def list_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()


def verify_user(db: Session, user_id: int, password: str):
    user = get_user_by_code(db, user_id)
    if not user or not user.password_hash:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    incoming = hashlib.sha256(password.encode()).hexdigest()
    if incoming != user.password_hash:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return user

# ---------- Risk Profile ----------
def create_or_update_risk_profile(db: Session, rp_in: schemas.RiskProfileIn, score: int, category: str):
    # either create new or update existing for given user
    rp = db.query(models.RiskProfile).filter(models.RiskProfile.user_id == rp_in.user_id).first()
    if rp:
        rp.score = score
        rp.category = category
    else:
        rp = models.RiskProfile(user_id=rp_in.user_id, score=score, category=category)
        db.add(rp)
    db.commit()
    db.refresh(rp)
    return rp

def get_risk_profile_by_user(db: Session, user_id: int):
    return db.query(models.RiskProfile).filter(models.RiskProfile.user_id == user_id).first()


# -----------------------------
# WALLET CRUD
# -----------------------------
def get_wallet(db: Session, user_id: int):
    wallet = db.query(models.Wallet).filter(models.Wallet.user_id == user_id).first()
    return wallet


def create_wallet(db: Session, user_id: int):
    # Create wallet only if missing
    wallet = get_wallet(db, user_id)
    if wallet:
        return wallet

    wallet = models.Wallet(user_id=user_id, balance=0.0)
    db.add(wallet)
    db.commit()
    db.refresh(wallet)
    return wallet


def deposit(db: Session, user_id: int, amount: float):
    wallet = get_wallet(db, user_id)
    if not wallet:
        wallet = create_wallet(db, user_id)

    if amount <= 0:
        raise HTTPException(status_code=400, detail="Deposit amount must be positive")

    wallet.balance += amount
    db.commit()
    db.refresh(wallet)
    return wallet


# -----------------------------
# TRANSACTIONS CRUD
# -----------------------------
def record_transaction(db: Session, user_id: int, wallet_id: int, symbol: str, qty: float, price: float, direction: str):
    tx = models.Transaction(
        user_id=user_id,
        wallet_id=wallet_id,
        symbol=symbol.upper(),
        quantity=qty,
        price=price,
        direction=direction.upper()
    )
    db.add(tx)
    db.commit()
    db.refresh(tx)
    return tx


# -----------------------------
# BUY OPERATION
# -----------------------------
def buy_asset(db: Session, user_id: int, symbol: str, qty: float):
    wallet = get_wallet(db, user_id)
    if not wallet:
        wallet = create_wallet(db, user_id)

    if qty <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be greater than 0")

    # Load last price
    df = load_symbol(symbol)
    last_price = float(df.iloc[-1]["close"])
    cost = qty * last_price

    if wallet.balance < cost:
        raise HTTPException(status_code=400, detail="Not enough balance to buy")

    # Deduct cost
    wallet.balance -= cost
    db.commit()
    db.refresh(wallet)

    # Record transaction
    tx = record_transaction(db, user_id, wallet.id, symbol, qty, last_price, "BUY")
    return tx


# -----------------------------
# SELL OPERATION
# -----------------------------
def sell_asset(db: Session, user_id: int, symbol: str, qty: float):
    wallet = get_wallet(db, user_id)
    if not wallet:
        raise HTTPException(status_code=404, detail="Wallet not found")

    if qty <= 0:
        raise HTTPException(status_code=400, detail="Quantity must be > 0")

    # Check if user holds this asset
    holdings = calculate_holdings(db, user_id)
    if symbol.upper() not in holdings:
        raise HTTPException(status_code=400, detail="User does not own this asset")

    if holdings[symbol.upper()] < qty:
        raise HTTPException(status_code=400, detail="Not enough quantity to sell")

    # Get price
    df = load_symbol(symbol)
    last_price = float(df.iloc[-1]["close"])
    revenue = qty * last_price

    # Add balance
    wallet.balance += revenue
    db.commit()
    db.refresh(wallet)

    # Record transaction
    tx = record_transaction(db, user_id, wallet.id, symbol, qty, last_price, "SELL")
    return tx


# -----------------------------
# HOLDINGS CALCULATION
# -----------------------------
def calculate_holdings(db: Session, user_id: int):
    """
    Returns: dict { "RELIANCE": total_quantity, ... }
    """
    txs = db.query(models.Transaction).filter(models.Transaction.user_id == user_id).all()

    holdings = {}

    for tx in txs:
        symbol = tx.symbol.upper()
        qty = tx.quantity if tx.direction == "BUY" else -tx.quantity

        holdings[symbol] = holdings.get(symbol, 0) + qty

    # Remove assets with zero qty
    holdings = {s: q for s, q in holdings.items() if q > 0}

    return holdings