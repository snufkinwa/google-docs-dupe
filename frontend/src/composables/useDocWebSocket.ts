import { ref, onUnmounted } from "vue";
import { useUser } from "vue-clerk";

export function useDocumentWebSocket(docId: string) {
  const { user } = useUser();
  const socket = ref<WebSocket | null>(null);
  const isConnected = ref(false);

  const connectWebSocket = () => {
    if (!user.value || socket.value?.readyState === WebSocket.OPEN) return;

    socket.value = new WebSocket(`ws://${window.location.host}/ws/${docId}`);

    socket.value.onopen = () => {
      isConnected.value = true;
      socket.value?.send(
        JSON.stringify({
          type_: "init",
          doc_id: docId,
          content: {
            doc: { type_: "doc", content: [] },
            selection: { anchor: 0, head: 0 },
          },
          version: 0,
          steps: null,
        })
      );
    };

    socket.value.onclose = () => {
      isConnected.value = false;
      setTimeout(connectWebSocket, 3000);
    };

    socket.value.onerror = (error) => {
      console.error("WebSocket error:", error);
      isConnected.value = false;
    };
  };

  const disconnectWebSocket = () => {
    if (socket.value && isConnected.value) {
      socket.value.close();
      socket.value = null;
      isConnected.value = false;
    }
  };

  onUnmounted(() => {
    disconnectWebSocket();
  });

  return {
    socket,
    isConnected,
    connectWebSocket,
    disconnectWebSocket,
  };
}
