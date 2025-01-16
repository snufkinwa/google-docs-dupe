import { ref, onUnmounted } from "vue";
import { useUser } from "vue-clerk";
import { EditorState, Transaction } from "prosemirror-state";

interface WebSocketMessage {
  type_: string;
  doc_id: string;
  content: any; // ProseMirror JSON representation
  version: number;
  steps?: any[]; // Optional step-based updates
}

export function useDocumentWebSocket(docId: string, editorState: EditorState) {
  const { user } = useUser();
  const socket = ref<WebSocket | null>(null);
  const isConnected = ref(false);
  const currentVersion = ref(0); // Track the document version

  const connectWebSocket = (): void => {
    if (!user.value || socket.value?.readyState === WebSocket.OPEN) return;

    socket.value = new WebSocket(`ws://127.0.0.1:8080/ws/${docId}`);

    socket.value.onopen = (): void => {
      isConnected.value = true;

      // Initialize the document
      try {
        const content = generateContent("Start typing here...");

        const initMessage: WebSocketMessage = {
          type_: "init",
          doc_id: docId,
          content,
          version: currentVersion.value,
        };

        socket.value?.send(JSON.stringify(initMessage));
        console.log("Sent init message:", initMessage);
      } catch (error) {
        console.error("Failed to send init message:", error);
      }
    };

    socket.value.onmessage = (event: MessageEvent): void => {
      const message: WebSocketMessage = JSON.parse(event.data);

      if (message.type_ === "update") {
        console.log("Received update:", message);
        currentVersion.value = message.version;
        applyChangesToDocument(message.content);
      }
    };

    socket.value.onclose = (): void => {
      isConnected.value = false;
      console.warn("WebSocket connection closed. Reconnecting...");
      setTimeout(connectWebSocket, 3000);
    };

    socket.value.onerror = (error: Event): void => {
      console.error("WebSocket error:", error);
      isConnected.value = false;
    };
  };

  const updateDocument = (tr: Transaction): void => {
    if (socket.value && isConnected.value) {
      const steps = generateSteps(tr); // Serialize transaction changes

      const updateMessage: WebSocketMessage = {
        type_: "update",
        doc_id: docId,
        content: editorState.doc.toJSON(), // Serialize current document
        version: ++currentVersion.value, // Increment version
        steps,
      };

      socket.value.send(JSON.stringify(updateMessage));
    } else {
      console.error("WebSocket is not connected!");
    }
  };

  const disconnectWebSocket = (): void => {
    if (socket.value && isConnected.value) {
      socket.value.close();
      socket.value = null;
      isConnected.value = false;
    }
  };

  const generateContent = (text: string): any => {
    return {
      doc: {
        type_: "doc",
        content: [
          {
            type_: "paragraph",
            content: [
              {
                type_: "text",
                text,
              },
            ],
          },
        ],
      },
    };
  };

  const applyChangesToDocument = (content: any): void => {
    console.log("Applying changes to document:", content);

    // Deserialize the new document
    const newDoc = editorState.schema.nodeFromJSON(content);

    // Create a transaction to apply the new content
    const tr = editorState.tr.replaceWith(
      0,
      editorState.doc.content.size,
      newDoc.content
    );

    // Apply the transaction
    editorState.applyTransaction(tr);
  };

  const generateSteps = (tr: Transaction): any[] => {
    const steps: any[] = [];
    tr.steps.forEach((step, index) => {
      steps.push({
        stepType: step.constructor.name, // Use the step type
        args: step.toJSON(), // Serialize the step details
      });
    });
    console.log("Generated steps:", steps);
    return steps;
  };

  onUnmounted((): void => {
    disconnectWebSocket();
  });

  return {
    socket,
    isConnected,
    connectWebSocket,
    disconnectWebSocket,
    updateDocument,
  };
}
