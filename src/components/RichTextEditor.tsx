"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

type RichTextEditorProps = {
  name: string;
  initialContent?: string;
};

export default function RichTextEditor({
  name,
  initialContent = "",
}: RichTextEditorProps) {
  const [html, setHtml] = useState(initialContent);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        // Default extension behavior forces target="_blank" on every link,
        // which is wrong for internal blog links (e.g. /blog/other-post) —
        // those should navigate in the same tab like any normal link.
        HTMLAttributes: { target: null, rel: "noopener noreferrer" },
      }),
    ],
    content: initialContent,
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-neutral max-w-none min-h-[240px] rounded-b-md border border-t-0 border-neutral-300 px-4 py-3 focus:outline-none",
      },
    },
  });

  return (
    <div>
      {editor && (
        <div className="flex flex-wrap gap-1 rounded-t-md border border-neutral-300 bg-neutral-50 p-2">
          <ToolbarButton
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
            label="Bold"
          />
          <ToolbarButton
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            label="Italic"
          />
          <ToolbarButton
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
            label="Strike"
          />
          <ToolbarButton
            active={editor.isActive("link")}
            onClick={() => {
              if (editor.isActive("link")) {
                editor.chain().focus().extendMarkRange("link").unsetLink().run();
                return;
              }
              const url = window.prompt(
                "Link URL (e.g. https://... or /blog/naslov-objave za interni link):",
                "https://"
              );
              if (!url) return;
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
            }}
            label="Link"
          />
          <ToolbarButton
            active={editor.isActive("heading", { level: 2 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            label="H2"
          />
          <ToolbarButton
            active={editor.isActive("heading", { level: 3 })}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            label="H3"
          />
          <ToolbarButton
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            label="• List"
          />
          <ToolbarButton
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            label="1. List"
          />
          <ToolbarButton
            active={editor.isActive("blockquote")}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            label="Quote"
          />
          <ToolbarButton
            active={editor.isActive("codeBlock")}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            label="Code"
          />
        </div>
      )}
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}

function ToolbarButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded px-2 py-1 text-sm ${
        active
          ? "bg-[var(--brand-yellow)] text-[var(--brand-text)]"
          : "bg-white text-neutral-700 hover:bg-neutral-200"
      }`}
    >
      {label}
    </button>
  );
}
