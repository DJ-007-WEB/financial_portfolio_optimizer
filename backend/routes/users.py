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


@router.post("/auth/login", response_model=schemas.UserOut)
def login_user(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = crud.verify_user(db, payload.user_id, payload.password)
    return user