from pydantic import BaseModel
from typing import Optional

class Movement(BaseModel):
    id: str
    name: str
    similarity: Optional[float] = None

m = Movement(id="1", name="Test")
print(f"Before: {m.similarity}")
m.similarity = 100.0
print(f"After: {m.similarity}")
