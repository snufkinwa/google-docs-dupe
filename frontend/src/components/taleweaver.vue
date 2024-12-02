<template>
  <div class="wrapper">
    <div ref="container"></div>
  </div>
</template>

<script lang="ts">
import type { IConfig } from "@taleweaver/core";
import type { IResolvedFont } from "@taleweaver/core/dist/tw/render/service";
import type { INode } from "@taleweaver/core/dist/tw/util/serialize";

export interface TaleweaverProps {
  config?: IConfig["tw.core"];
  initialDoc: INode;
}

export default defineComponent({
  props: {
    config: {
      type: Object as PropType<TaleweaverProps["config"]>,
      default: () => ({}),
    },
    initialDoc: {
      type: Object as PropType<TaleweaverProps["initialDoc"]>,
      default: () => ({}),
    },
  },
  data() {
    return {
      font: null as null | IResolvedFont,
    };
  },
  mounted() {
    this.$taleweaver.setEditor({
      config: this.config,
      initialDoc: this.initialDoc,
    });

    if (!this.$taleweaver.editor) return console.log("No Taleweaver");

    const container = this.$refs.container as HTMLElement;
    this.$taleweaver.editor.attach(container);
  },
});
</script>

<style lang="scss">
// Required for the editor to work
* {
  box-sizing: border-box;
}

.wrapper {
  display: flex;
  justify-content: center;
}

.tw--doc--doc {
  font-family: "Source Sans Pro", sans-serif;
  display: inline-block;
  padding-bottom: 9px;
  counter-reset: page-counter;
}
.tw--page--page {
  background: rgba(255, 255, 255, 1);
  margin: 9px auto 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  position: relative;
  &::after {
    counter-increment: page-counter;
    content: "Page " counter(page-counter) "";
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    font-family: "Quicksand", sans-serif;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.45);
    pointer-events: none;
  }
  *::selection {
    background: rgba(255, 255, 255, 1);
  }
}
</style>
