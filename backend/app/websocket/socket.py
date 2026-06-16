from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.websocket.manager import manager
import json

router = APIRouter()

@router.websocket("/ws/{workspace_id}/{username}")
async def websocket_endpoint(websocket: WebSocket, workspace_id: int, username: str):
    await manager.connect(websocket)
    manager.add_user(username)
    await manager.broadcast(json.dumps({
        "type": "users",
        "users": manager.online_users
    }))
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"workspace:{workspace_id}:{data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        manager.remove_user(username)
        await manager.broadcast(json.dumps({
            "type": "users",
            "users": manager.online_users
        }))