from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str
    language: str
    action: str

@app.get("/")
def home():
    return {"status": "OK"}

@app.post("/api/process")
def process_code(data: CodeRequest):
    return {
        "response": f"Your {data.action} request received for {data.language}"
    }

@app.get("/api/history")
def history():
    return []

@app.post("/api/contact")
def contact():
    return {"message": "Success"}