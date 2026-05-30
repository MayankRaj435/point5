// src/components/blog/BlogEditor.tsx

import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

import Image from "@tiptap/extension-image";

interface Props {
  content: string;

  onChange: (value: string) => void;
}

export const BlogEditor = ({ content, onChange }: Props) => {
  const editor = useEditor({
    extensions: [StarterKit, Image],

    content,

    editorProps: {
      attributes: {
        class:
          "min-h-[600px] outline-none text-white/80 leading-relaxed px-7 py-6",
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden">
      {/* TOOLBAR */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 p-4">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-2 rounded-xl text-sm transition ${
            editor.isActive("bold")
              ? "bg-white text-black"
              : "bg-white/5 text-white/70"
          }`}
        >
          Bold
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-2 rounded-xl text-sm transition ${
            editor.isActive("italic")
              ? "bg-white text-black"
              : "bg-white/5 text-white/70"
          }`}
        >
          Italic
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }
          className={`px-3 py-2 rounded-xl text-sm transition ${
            editor.isActive("heading", { level: 2 })
              ? "bg-white text-black"
              : "bg-white/5 text-white/70"
          }`}
        >
          H2
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="px-3 py-2 rounded-xl text-sm bg-white/5 text-white/70"
        >
          List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="px-3 py-2 rounded-xl text-sm bg-white/5 text-white/70"
        >
          Quote
        </button>
      </div>

      {/* EDITOR */}
      <EditorContent editor={editor} />
    </div>
  );
};
