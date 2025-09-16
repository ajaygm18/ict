"""
Concepts API Router
Handles all ICT concepts related endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from ..core.ict_agent import ICTTradingAgent

router = APIRouter()

def get_ict_agent():
    """Dependency to get ICT agent instance"""
    return ICTTradingAgent()

@router.get("/")
async def get_all_concepts(agent: ICTTradingAgent = Depends(get_ict_agent)):
    """Get all available ICT concepts"""
    return {
        "total_concepts": agent.get_concept_count(),
        "concepts": agent.get_concepts_list()
    }

@router.get("/count")
async def get_concept_count(agent: ICTTradingAgent = Depends(get_ict_agent)):
    """Get total number of implemented concepts"""
    return {"count": agent.get_concept_count()}

@router.get("/categories")
async def get_concept_categories(agent: ICTTradingAgent = Depends(get_ict_agent)):
    """Get concepts grouped by category"""
    concepts = agent.get_concepts_list()
    categories = {}
    
    for concept in concepts:
        category = concept['category']
        if category not in categories:
            categories[category] = []
        categories[category].append(concept)
    
    return {"categories": categories}

@router.get("/{concept_name}")
async def get_concept_details(concept_name: str, agent: ICTTradingAgent = Depends(get_ict_agent)):
    """Get details of a specific concept"""
    concepts = agent.get_concepts_list()
    concept = next((c for c in concepts if c['name'].lower().replace(' ', '_') == concept_name.lower()), None)
    
    if not concept:
        raise HTTPException(status_code=404, detail="Concept not found")
    
    return concept