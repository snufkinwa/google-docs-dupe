<template>
  <div>
    <taleweaver-toolbar></taleweaver-toolbar>
    <taleweaver :initial-doc="initialDoc" :config="config"></taleweaver>
  </div>
</template>

<script lang="ts">
import type { IConfig } from "@taleweaver/core";
import type { IResolvedFont } from "@taleweaver/core/dist/tw/render/service";
import sample from "../editor/littleRedRidingHood";

export default defineComponent({
  mounted() {
    const editor = this.$taleweaver.editor;
    console.log(editor);
  },
  data() {
    return {
      initialDoc: sample,
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
