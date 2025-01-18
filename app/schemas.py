from pydantic import BaseModel, Field
from typing import Optional

# Base Character schema with shared attributes
class CharacterBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    title: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    race: Optional[str] = Field(None, max_length=50)
    occupation: Optional[str] = Field(None, max_length=100)
    status: Optional[str] = Field("Alive", max_length=50)  # Default to "Alive"
    notable_traits: Optional[str] = None

# Schema for creating a Character
class CharacterCreate(CharacterBase):
    pass

# Schema for updating a Character
class CharacterUpdate(CharacterBase):
    name: Optional[str] = Field(None, min_length=1, max_length=100)

# Schema for returning a Character (includes id)
class Character(CharacterBase):
    id: int

    class Config:
        from_attributes = True  # Allows the model to read from ORM objects