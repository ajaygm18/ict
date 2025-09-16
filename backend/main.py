"""
ICT Trading AI Agent - Main Application Entry Point
A comprehensive AI agent for ICT trading with 50+ concepts and backtesting capabilities.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.routers import strategies, backtesting, concepts

app = FastAPI(
    title="ICT Trading AI Agent",
    description="An AI agent master in ICT trading with 50+ concepts and strategies",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(concepts.router, prefix="/api/concepts", tags=["concepts"])
app.include_router(strategies.router, prefix="/api/strategies", tags=["strategies"])
app.include_router(backtesting.router, prefix="/api/backtesting", tags=["backtesting"])


@app.get("/")
async def root():
    """Welcome endpoint"""
    return {
        "message": "ICT Trading AI Agent API",
        "version": "1.0.0",
        "concepts_loaded": 50,
        "status": "running"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "agent_status": "operational"}


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )