<template>
  <div class="main-container">
    <!--Top Menu Bar-->
    <div class="top-menu">
      <div class="title-section">
        <img src="../assets/docs.png" alt="Logo" class="logo" />
        <div class="title-menu">
          <input v-model="documentTitle" class="document-title" type="text" />
          <div class="menu-bar">
            <button>File</button>
            <button>Edit</button>
            <button>View</button>
            <button>Insert</button>
            <button>Format</button>
            <button>Tools</button>
            <button>Help</button>
          </div>
        </div>
      </div>
    </div>

    <!--Formatting Toolbar-->
    <div class="formatting-toolbar">
      <taleweaver-toolbar />
    </div>

    <!--Editor Container-->
    <div class="editor-wrapper">
      <taleweaver :initial-doc="initialDoc" :config="config"></taleweaver>
    </div>
  </div>
</template>

<script lang="ts">
import type { IConfig } from "@taleweaver/core";
import type { IResolvedFont } from "@taleweaver/core/dist/tw/render/service";
import sample from "../editor/littleRedRidingHood";
import resume from "../editor/resume";

export default defineComponent({
  mounted() {
    const editor = this.$taleweaver.editor;
    console.log(editor);
  },
  data() {
    return {
      documentTitle: "Untitled document",
      initialDoc: resume,
      config: {
        page: {
          width: 816,
          height: 1056,
          paddingTop: 60,
          paddingBottom: 60,
          paddingLeft: 60,
          paddingRight: 60,
        },
      } as IConfig["tw.core"],
      font: null as null | IResolvedFont,
    };
  },
});
</script>

<style lang="scss">
.main-container {
  height: 98vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-menu {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 4px 8px;
  height: 68px;
}

.title-section {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  position: relative;
}

.title-menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  z-index: 2;
}

.menu-bar {
  display: flex;
  gap: 4px;
  position: relative;
  z-index: 2;
}

.menu-bar button {
  padding: 4px 8px;
  border: none;
  background: none;
  font-size: 14px;
  color: #5f6368;
  border-radius: 4px;

  &:hover {
    background-color: #f1f3f4;
  }
}

.document-title {
  font-size: 18px;
  border: none;
  background-color: #fbfbfb;
  padding: 2px 6px;
  border-radius: 4px;
  margin-bottom: 2px;
  position: relative;
  z-index: 3;

  &:hover {
    background-color: #f1f3f4;
    border: 1px #001d35 solid;
    margin-bottom: 0;
  }
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 4px;
}

.formatting-toolbar {
  display: flex;
  align-items: center;
  gap: 80px;
  padding: 4px 8px;
  height: 46px;
}

.editor-wrapper {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
  margin-top: 10px;
  background-color: #f8f9fa;
  display: flex;
  justify-content: center;
}

.document-container {
  width: 850px;
  background: white;
  min-height: 1100px;
  padding: 72px 96px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
  margin-top: 20px;
}
</style>
