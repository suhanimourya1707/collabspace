import { useEffect, useRef } from "react"

function useWebSocket(workspaceId, username, onMessage)  {
  const ws = useRef(null)

  useEffect(() => {
    ws.current = new WebSocket(`wss://collabspace-production-90c8.up.railway.app/ws/${workspaceId}/${username}`)

    ws.current.onmessage = (event) => {
      onMessage(event.data)
    }

    ws.current.onopen = () => {
      console.log("WebSocket connected")
    }

    ws.current.onclose = () => {
      console.log("WebSocket disconnected")
    }

    return () => {
      ws.current.close()
    }
  }, [workspaceId])

  const sendMessage = (message) => {
    if (ws.current) {
      ws.current.send(message)
    }
  }

  return { sendMessage }
}

export default useWebSocket