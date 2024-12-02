import { Taleweaver, type IConfig } from "@taleweaver/core";
import type { IResolvedFont } from "@taleweaver/core/dist/tw/render/service";
import { parse, type INode } from "@taleweaver/core/dist/tw/util/serialize";

export interface TaleweaverProps {
  config?: IConfig["tw.core"];
  initialDoc: INode;
}

export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      taleweaver: {
        editor: null as Taleweaver | null,
        font: null as null | IResolvedFont,
        setEditor({ config, initialDoc }: TaleweaverProps): Taleweaver {
          const mergedConfig: IConfig = {};
          if (config) {
            mergedConfig["tw.core"] = config;
          }
          const doc = parse(initialDoc, mergedConfig);
          const editor = new Taleweaver(doc, mergedConfig);
          this.editor = editor;

          this.editor
            .getServiceRegistry()
            .getService("cursor")
            .onDidUpdate((event) => this.refreshFont());
          this.editor
            .getServiceRegistry()
            .getService("render")
            .onDidUpdateRenderState((event) => this.refreshFont());
          this.refreshFont();

          return editor;
        },
        refreshFont() {
          if (!this.editor)
            return console.warn("No editor found, cannot refresh font");
          // ---- Resolve Font ---- //
          const cursorService = this.editor
            .getServiceRegistry()
            .getService("cursor");
          const renderService = this.editor
            .getServiceRegistry()
            .getService("render");
          const { anchor, head } = cursorService.getCursor();
          this.font = renderService.resolveFont(
            Math.min(anchor, head),
            Math.max(anchor, head)
          );
          console.log("refreshed font", this.font);
        },
      },
    },
  };
});
