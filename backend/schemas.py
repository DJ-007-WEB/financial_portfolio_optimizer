# backend/schemas.py
from pydantic import BaseModel, Field
from typing import Optional,List
from datetime import datetime

# ---------- User schemas ----------
class UserCreate(BaseModel):
    name: str = Field(..., example="Dhairya")

class UserOut(BaseModel):
    id: int
    name: str
    class Config:
        orm_mode = True

# ---------- Risk profile input ----------
class RiskProfileIn(BaseModel):
    user_id: int
    q1: int
    q2: int
    q3: int
    q4: int
    q5: int
    q6: int
    q7: int
    q8: int
    q9: int
    q10: int

class RiskProfileOut(BaseModel):
    id: int
    user_id: int
    score: int
    category: str
    class Config:
        orm_mode = True


# -------------------------
# WALLET SCHEMAS
# -------------------------
class WalletBase(BaseModel):
    balance: float


class WalletCreate(BaseModel):
    amount: float


class WalletResponse(BaseModel):
    id: int
    user_id: int
    balance: float

    class Config:
        orm_mode = True


# -------------------------
# TRANSACTION SCHEMAS
# -------------------------
class TransactionBase(BaseModel):
    symbol: str
    quantity: float
    price: Optional[float] = None  # auto-filled from market data


class TransactionCreate(TransactionBase):
    direction: str  # BUY or SELL


class TransactionResponse(BaseModel):
    id: int
    user_id: int
    wallet_id: int
    symbol: str
    quantity: float
    price: float
    direction: str
    timestamp: datetime

    class Config:
        orm_mode = True


# -------------------------
# HOLDINGS (WHAT USER OWNS)
# -------------------------
class HoldingItem(BaseModel):
    symbol: str
    quantity: float
    avg_buy_price: float


class HoldingsResponse(BaseModel):
    user_id: int
    holdings: List[HoldingItem]