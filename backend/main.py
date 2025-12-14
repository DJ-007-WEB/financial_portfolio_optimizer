# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# make sure database & models are imported so tables are created
from .database import Base, engine
from . import models

# import routers
from .routes import users, risk, market, wallet, portfolio

# create DB tables from models
Base.metadata.create_all(bind=engine) 


app = FastAPI(title="Portfolio Optimizer (Dev)")

# allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# include routers (they define /users and /risk_profile endpoints)
app.include_router(users.router)
app.include_router(risk.router)
app.include_router(market.router)
app.include_router(wallet.router)
app.include_router(portfolio.router)

@app.get("/")
def root():
    return {"message": "Backend is running!"}
