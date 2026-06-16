from fastapi import WebSocket
from typing import List

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.online_users: List[str] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)
    def add_user(self, username: str):
      if username not in self.online_users:
          self.online_users.append(username)

    def remove_user(self, username: str):
        if username in self.online_users:
            self.online_users.remove(username)

manager = ConnectionManager()