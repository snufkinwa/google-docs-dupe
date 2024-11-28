<script lang="ts">
    import { docContent } from "$lib/stores/store"; 
   /** TODO: Make toolbar work and add different things that will change 
    * the text area 
   */
   
   /**
     * Save the document content to a local file.
     */
    function saveFile() {
        const content = $docContent;
        const blob = new Blob([content], { type: "text/plain" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "document.txt";
        link.click();
    }
  
    /**
     * Open a local file and load its content into the editor.
     * @param event - File input change event
     */
    function openFile(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target?.result as string;
                docContent.set(text); 
            };
            reader.readAsText(input.files[0]);
        }
    }
  </script>

<div class="toolbar">
    <div class="menu">
        <button>File</button>
        <div class="dropdown">
            <button on:click={saveFile}>Save</button>
            <label for="file-upload">Open</label>
            <input id="file-upload" type="file" on:change={openFile} accept=".txt" hidden />
        </div>
    </div>
    <div class="menu">
        <button>Edit</button>
        <div class="dropdown">
            <button>Undo</button>
            <button>Redo</button>
        </div>
    </div>
  </div>

  
  <style>
    /* Toolbar styles */
    .toolbar {
        display: flex;
        gap: 10px;
        background: #f1f1f1;
        padding: 10px;
        border-bottom: 1px solid #ccc;
    }
  
    .menu {
        position: relative;
    }
  
    .menu button {
        background: #007bff;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 5px;
        cursor: pointer;
    }
  
    .menu button:hover {
        background: #0056b3;
    }
  
    .menu .dropdown {
        display: none;
        position: absolute;
        top: 100%;
        left: 0;
        background: white;
        border: 1px solid #ccc;
        padding: 5px 10px;
        z-index: 10;
        border-radius: 5px;
    }
  
    .menu:hover .dropdown {
        display: block;
    }
  
    .menu .dropdown button,
    .menu .dropdown label {
        background: none;
        color: black;
        border: none;
        cursor: pointer;
        padding: 5px 0;
        text-align: left;
        width: 100%;
    }
  
    .menu .dropdown button:hover,
    .menu .dropdown label:hover {
        background: #f1f1f1;
    }
  </style>
  

  