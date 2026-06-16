import { useEffect, useRef } from "react"

function useWebSocket(workspaceId, username, onMessage)  {
  const ws = useRef(null)

  useEffect(() => {
    ws.current = new WebSocket(`ws://127.0.0.1:8000/ws/${workspaceId}/${username}`)

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