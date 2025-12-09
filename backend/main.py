from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend is running!"}


@app.get("/users")
def get_users():
    try:
        conn = sqlite3.connect("test.db")
        cursor = conn.cursor()
        cursor.execute("SELECT id, name FROM users")
        rows = cursor.fetchall()
        conn.close()

        users = [{"id": r[0], "name": r[1]} for r in rows]
        return {"users": users}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
