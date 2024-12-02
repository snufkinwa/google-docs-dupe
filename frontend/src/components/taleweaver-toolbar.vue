<template>
  <div class="toolbar">
    <div class="box">
      <button @click="onBoldClick">B</button>
      <button @click="onItalicClick">I</button>
      <button @click="onUnderlineClick">U</button>
      <button @click="onStrikeThroughClick">S</button>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  methods: {
    async onBoldClick() {
      if (!this.$taleweaver.editor) return console.log("No Taleweaver");
      const commandService = this.$taleweaver.editor
        .getServiceRegistry()
        .getService("command");

      const font = this.$taleweaver.font;

      if (!commandService || !font) return console.log("No command service");

      await commandService.executeCommand(
        "tw.state.applyAttribute",
        "text",
        "text",
        "weight",
        font.weight && font.weight > 400 ? 400 : 700
      );
    },
    async onItalicClick() {
      if (!this.$taleweaver.editor) return console.log("No Taleweaver");

      const commandService = this.$taleweaver.editor
        .getServiceRegistry()
        .getService("command");

      const font = this.$taleweaver.font;

      if (!commandService || !font) return console.log("No command service");

      await commandService.executeCommand(
        "tw.state.applyAttribute",
        "text",
        "text",
        "italic",
        !font.italic
      );
    },
    async onUnderlineClick() {
      if (!this.$taleweaver.editor) return console.log("No Taleweaver");

      const commandService = this.$taleweaver.editor
        .getServiceRegistry()
        .getService("command");

      const font = this.$taleweaver.font;

      if (!commandService || !font) return console.log("No command service");

      await commandService.executeCommand(
        "tw.state.applyAttribute",
        "text",
        "text",
        "underline",
        !font.underline
      );
    },
    async onStrikeThroughClick() {
      if (!this.$taleweaver.editor) return console.log("No Taleweaver");

      const commandService = this.$taleweaver.editor
        .getServiceRegistry()
        .getService("command");

      const font = this.$taleweaver.font;

      if (!commandService || !font) return console.log("No command service");

      await commandService.executeCommand(
        "tw.state.applyAttribute",
        "text",
        "text",
        "strikethrough",
        !font.strikethrough
      );
    },
  },
});
</script>

<style lang="scss">
.toolbar {
  position: sticky;
  top: 0;
  // Add padding to the y-axis to prevent the toolbar from overlapping the
  padding-top: 10px;
  padding-bottom: 10px;

  // Add padding to the x-axis to prevent the toolbar from overlapping the
  padding-left: 10px;
  padding-right: 10px;

  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.09);
  z-index: 10;
}

.toolbar .box {
  display: flex;

  // Set the y margin to auto
  // to center the toolbar vertically
  margin-top: auto;
  margin-bottom: auto;

  // Set the x margin to auto
  // to center the toolbar horizontally
  margin-left: auto;
  margin-right: auto;

  width: 816;
}
</style>
