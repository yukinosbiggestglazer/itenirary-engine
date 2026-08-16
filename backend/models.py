from pydantic import BaseModel

class PipelineRequest(BaseModel):
    cities : dict[str, list[str]]