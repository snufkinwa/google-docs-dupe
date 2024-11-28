<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Toolbar from "$lib/components/Toolbar.svelte";
  import { writable } from "svelte/store";

  interface UpdateMessage {
      type: "update";
      content: string;
  }

  export const docContent = writable<string>("");

  let socket: WebSocket | null = null;

  onMount(() => {
      socket = new WebSocket("ws://localhost:8080/ws");

      socket.onmessage = (event: MessageEvent) => {
          try {
              const message: UpdateMessage = JSON.parse(event.data);

              if (message.type === "update") {
                  docContent.set(message.content); 
              } else {
                  console.error("Unknown message type:", message);
              }
          } catch (err) {
              console.error("Error parsing WebSocket message:", err);
          }
      };

  
      socket.onerror = (error: Event) => {
          console.error("WebSocket error:", error);
      };

      onDestroy(() => {
          if (socket && socket.readyState === WebSocket.OPEN) {
              socket.close();
          }
      });
  });

  /**
   * Function to send updated document content to the backend
   * @param newContent - The new content of the document
   */
  function updateDocument(newContent: string): void {
      if (socket && socket.readyState === WebSocket.OPEN) {
          const message: UpdateMessage = { type: "update", content: newContent };
          socket.send(JSON.stringify(message));
      } else {
          console.error("WebSocket is not connected");
      }
  }
</script>

<main>
  <Toolbar />
  <!-- svelte-ignore element_invalid_self_closing_tag -->
  <textarea
      bind:value={$docContent}
      on:input={(e) => updateDocument((e.target as HTMLTextAreaElement).value)}
  />
</main>


<style>
  textarea {
      width: 100%;
      height: calc(100vh - 60px);
      font-size: 16px;
      padding: 10px;
      border-radius: 5px;
      outline: none;
  }

  textarea:focus {
      border-color: #007bff;
  }
</style>
