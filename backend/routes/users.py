# backend/routes/users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud
from ..database import get_db

router = APIRouter(tags=["Users"])

@router.post("/users", response_model=schemas.UserOut)
def create_user(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    return crud.create_user(db, user_in)

@router.get("/users", response_model=list[schemas.UserOut])
def list_users(db: Session = Depends(get_db)):
    return crud.list_users(db)
