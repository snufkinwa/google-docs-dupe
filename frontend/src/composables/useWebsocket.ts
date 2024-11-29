import { ref, onUnmounted } from "vue";

interface UpdateMessage {
  type: "update";
  content: string;
}

export function useWebSocket(url: string) {
  const socket = ref<WebSocket | null>(null);
  const docContent = ref<string>("");

  // Initialize WebSocket
  const connect = () => {
    socket.value = new WebSocket(url);

    socket.value.onmessage = (event: MessageEvent) => {
      try {
        const message: UpdateMessage = JSON.parse(event.data);
        if (message.type === "update") {
          docContent.value = message.content;
        } else {
          console.error("Unknown message type:", message);
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    socket.value.onerror = (error: Event) => {
      console.error("WebSocket error:", error);
    };
  };

  // Send updated document content to the backend
  const updateDocument = (newContent: string): void => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      const message: UpdateMessage = { type: "update", content: newContent };
      socket.value.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  };

  // Cleanup on unmount
  onUnmounted(() => {
    if (socket.value && socket.value.readyState === WebSocket.OPEN) {
      socket.value.close();
    }
  });

  connect();

  return { docContent, updateDocument };
}
