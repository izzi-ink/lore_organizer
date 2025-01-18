from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.responses import HTMLResponse
from . import models, database

app = FastAPI(title="Lore Organizer")

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

# Dependency to get database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <html>
        <head>
            <title>Lore Organizer</title>
        </head>
        <body>
            <h1>Welcome to Lore Organizer!</h1>
            <p>Your digital sanctuary for world-building.</p>
        </body>
    </html>
    """

# Let's add a test endpoint to create a character
@app.post("/characters/")
async def create_character(name: str, description: str, db: Session = Depends(get_db)):
    character = models.Character(name=name, description=description)
    db.add(character)
    db.commit()
    db.refresh(character)
    return character