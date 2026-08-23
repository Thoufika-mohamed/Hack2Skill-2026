from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes.dashboard_routes import router as dashboard_router
from backend.routes.pollution_routes import router as pollution_router
from backend.routes.reports_routes import router as reports_router
from backend.routes.ai_routes import router as ai_router
from backend.routes.hotspot_routes import router as hotspot_router
from dotenv import load_dotenv

load_dotenv("backend/.env")


app = FastAPI(title="Hack2Skill Backend")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Hack2Skill backend is running!"}


app.include_router(dashboard_router, prefix="/api")
app.include_router(pollution_router, prefix="/api")
app.include_router(reports_router, prefix="/api")
app.include_router(ai_router, prefix="/api")
app.include_router(hotspot_router, prefix="/api")