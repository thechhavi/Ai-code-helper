from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class CodeRequest(BaseModel):
    code: str
    language: str
    action: str

class ContactRequest(BaseModel):
    name: str
    email: str
    message: str

class HistoryResponse(BaseModel):
    id: int
    code: str
    response: str
    language: str
    action: str
    timestamp: datetime

    class Config:
        from_attributes = True
