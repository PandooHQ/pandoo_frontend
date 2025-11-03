/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SerializedEditorState } from 'lexical';

export function createInitialEditorState(
  description?: string,
  imageUrl?: string
): SerializedEditorState {
  const children: any[] = [];

  if (description && description.trim() !== '') {
    const parser = new DOMParser();
    const doc = parser.parseFromString(description, 'text/html');
    
    const bodyElements = Array.from(doc.body.children);
    
    if (bodyElements.length > 0) {
      bodyElements.forEach((element) => {
        const textContent = element.textContent || '';
        if (textContent.trim()) {
          children.push({
            children: [
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: textContent,
                type: "text",
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
          });
        }
      });
    } else {
      const textContent = doc.body.textContent || '';
      if (textContent.trim()) {
        children.push({
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: textContent,
              type: "text",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          type: "paragraph",
          version: 1,
        });
      }
    }
  }

  if (imageUrl && imageUrl.trim() !== '') {
    children.push({
      children: [
        {
          type: "image",
          src: imageUrl,
          altText: "imagen",
          maxWidth: 500,
          width: 0,
          height: 0,
          showCaption: false,
          caption: {
            editorState: {
              root: {
                children: [],
                direction: null,
                format: "",
                indent: 0,
                type: "root",
                version: 1,
              },
            },
          },
          version: 1,
        },
      ],
      direction: null,
      format: "",
      indent: 0,
      type: "paragraph",
      version: 1,
    });
  }

  if (children.length === 0) {
    children.push({
      children: [
        {
          detail: 0,
          format: 0,
          mode: "normal",
          style: "",
          text: "",
          type: "text",
          version: 1,
        },
      ],
      direction: "ltr",
      format: "",
      indent: 0,
      type: "paragraph",
      version: 1,
    });
  }

  return {
    root: {
      children,
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  };
}