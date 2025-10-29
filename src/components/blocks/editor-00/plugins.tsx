import { useState } from "react";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

import { ContentEditable } from "@/components/editor/editor-ui/content-editable";
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin";
import { FontFamilyToolbarPlugin } from "@/components/editor/plugins/toolbar/font-family-toolbar-plugin";
import { FontSizeToolbarPlugin } from "@/components/editor/plugins/toolbar/font-size-toolbar-plugin";
import { BlockInsertPlugin } from "@/components/editor/plugins/toolbar/block-insert-plugin";
import { InsertImage } from "@/components/editor/plugins/toolbar/block-insert/insert-image";
import { CodeLanguageToolbarPlugin } from "@/components/editor/plugins/toolbar/code-language-toolbar-plugin";
import { FontFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/font-format-toolbar-plugin";
import { ImagesPlugin } from "@/components/editor/plugins/images-plugin";
import { ImagePickerPlugin } from "@/components/editor/plugins/picker/image-picker-plugin";
import { ComponentPickerMenuPlugin } from "@/components/editor/plugins/component-picker-menu-plugin";

export function Plugins() {
  const [, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem);
    }
  };

  return (
    <div className="relative">
      <ToolbarPlugin>
        {({ blockType }) => (
          <div className="vertical-align-middle sticky top-0 z-10 flex items-center gap-2 overflow-auto border-b p-1">
            {blockType === "code" ? (
              <CodeLanguageToolbarPlugin />
            ) : (
              <>
                <FontFamilyToolbarPlugin />
                <FontSizeToolbarPlugin />
                <FontFormatToolbarPlugin />
                <BlockInsertPlugin>
                  <InsertImage />
                </BlockInsertPlugin>
              </>
            )}
          </div>
        )}
      </ToolbarPlugin>
      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="h-36">
              <div className="" ref={onRef}>
                <ContentEditable placeholder={"Escribe aqui ..."} />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ImagesPlugin />
        <ComponentPickerMenuPlugin
          baseOptions={[
            ImagePickerPlugin(),
          ]}
        />
      </div>
    </div>
  );
}
