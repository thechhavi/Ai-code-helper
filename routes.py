from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from . import schemas
from . import db
from . import services

router = APIRouter()

@router.post("/process", response_model=schemas.HistoryResponse)
def process_code(request: schemas.CodeRequest, session: Session = Depends(db.get_db)):
    if request.action == "explain":
        ai_response = services.explain_code(request.code, request.language)
    elif request.action == "debug":
        ai_response = services.debug_code(request.code, request.language)
    elif request.action == "improve":
        ai_response = services.improve_code(request.code, request.language)
    else:
        raise HTTPException(status_code=400, detail="Invalid action")
    
    # Save to history
    history_entry = db.CodeHistory(
        code=request.code,
        response=ai_response,
        language=request.language,
        action=request.action
    )
    session.add(history_entry)
    session.commit()
    session.refresh(history_entry)
    
    return history_entry

@router.post("/contact")
def submit_contact(request: schemas.ContactRequest, session: Session = Depends(db.get_db)):
    contact_entry = db.ContactMessage(
        name=request.name,
        email=request.email,
        message=request.message
    )
    session.add(contact_entry)
    session.commit()
    return {"message": "Contact message saved successfully."}

@router.get("/history", response_model=List[schemas.HistoryResponse])
def get_history(session: Session = Depends(db.get_db)):
    history = session.query(db.CodeHistory).order_by(db.CodeHistory.timestamp.desc()).all()
    return history
