import { ref, onUnmounted } from "vue";

interface UpdateMessage {
  type: "update";
  content: string;
}

export function useWebSocket(url: string) {
  const docContent = ref<string>("");
  const socket = ref<WebSocket | null>(null);

  const connect = () => {
    socket.value = new WebSocket(url);

    socket.value.onmessage = (event: MessageEvent) => {
      try {
        docContent.value = event.data;
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    };

    socket.value.onerror = (error: Event) => {
      console.error("WebSocket error:", error);
    };
  };

  const updateDocument = (content: string): void => {
    if (socket.value?.readyState === WebSocket.OPEN) {
      socket.value.send(content);
    } else {
      console.error("WebSocket is not connected");
    }
  };

  connect();

  onUnmounted(() => {
    if (socket.value?.readyState === WebSocket.OPEN) {
      socket.value.close();
    }
  });

  return { docContent, updateDocument };
}
