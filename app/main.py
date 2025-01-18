from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List
from . import models, database, schemas  
from fastapi.responses import FileResponse

# Create the app instance first
app = FastAPI(title="Lore Organizer")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files - this line is important!
app.mount("/static", StaticFiles(directory="static"), name="static")

# Routes
@app.get("/")
async def read_root():
    return FileResponse('static/index.html')

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

# Dependency to get database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# API Endpoints
@app.post("/characters/", response_model=schemas.Character)
async def create_character(
    character: schemas.CharacterCreate,
    db: Session = Depends(get_db)
):
    db_character = models.Character(**character.dict())
    db.add(db_character)
    db.commit()
    db.refresh(db_character)
    return db_character

@app.get("/characters/", response_model=List[schemas.Character])
async def get_characters(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    characters = db.query(models.Character).offset(skip).limit(limit).all()
    return characters

@app.get("/characters/{character_id}", response_model=schemas.Character)
async def get_character(
    character_id: int,
    db: Session = Depends(get_db)
):
    character = db.query(models.Character).filter(models.Character.id == character_id).first()
    if character is None:
        raise HTTPException(status_code=404, detail="Character not found")
    return character

@app.put("/characters/{character_id}", response_model=schemas.Character)
async def update_character(
    character_id: int,
    character: schemas.CharacterUpdate,
    db: Session = Depends(get_db)
):
    db_character = db.query(models.Character).filter(models.Character.id == character_id).first()
    if db_character is None:
        raise HTTPException(status_code=404, detail="Character not found")
    
    for key, value in character.dict(exclude_unset=True).items():
        setattr(db_character, key, value)
    
    db.commit()
    db.refresh(db_character)
    return db_character

@app.delete("/characters/{character_id}")
async def delete_character(
    character_id: int,
    db: Session = Depends(get_db)
):
    character = db.query(models.Character).filter(models.Character.id == character_id).first()
    if character is None:
        raise HTTPException(status_code=404, detail="Character not found")
    
    db.delete(character)
    db.commit()
    return {"message": "Character deleted successfully"}