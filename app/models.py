from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class Character(Base):
    __tablename__ = "characters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True)
    title = Column(String(100), nullable=True)
    description = Column(Text)
    race = Column(String(50), nullable=True)
    occupation = Column(String(100), nullable=True)
    status = Column(String(50), default="Alive")  # Alive, Deceased, Unknown
    notable_traits = Column(Text, nullable=True)