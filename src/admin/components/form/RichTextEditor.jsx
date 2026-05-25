import { createElement, useEffect, useId } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import clsx from "clsx";
import {
  FaAlignCenter,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaEraser,
  FaHeading,
  FaImage,
  FaItalic,
  FaLink,
  FaListOl,
  FaListUl,
  FaParagraph,
  FaQuoteRight,
  FaRedo,
  FaRemoveFormat,
  FaUnderline,
  FaUndo,
  FaUnlink,
} from "react-icons/fa";
import { normalizeContentHtml } from "../../../utils/sanitizeHtml";
import "./RichTextEditor.scss";

function MenuButton({ label, icon, active = false, disabled = false, onClick }) {
  return (
    <button
      type="button"
      className={clsx("rich-text-editor__button", { "is-active": active })}
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
    >
      {createElement(icon, { "aria-hidden": "true" })}
    </button>
  );
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  required = false,
  placeholder,
  error,
  helperText,
  span = false,
}) {
  const generatedId = useId();
  const editorId = `rich-text-editor-${generatedId}`;
  const messageId = `${editorId}-message`;
  const message = error || helperText;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Image.configure({
        allowBase64: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: normalizeContentHtml(value),
    editorProps: {
      attributes: {
        "aria-describedby": message ? messageId : undefined,
        "aria-invalid": error ? "true" : undefined,
        class: "rich-text-editor__content",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange?.(currentEditor.isEmpty ? "" : currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const currentHtml = editor.isEmpty ? "" : editor.getHTML();
    const nextHtml = normalizeContentHtml(value);

    if (currentHtml !== nextHtml) {
      editor.commands.setContent(nextHtml, false);
    }
  }, [editor, value]);

  const setLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href || "";
    const url = window.prompt("URL del enlace", previousUrl);

    if (url === null) return;

    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  };

  const setImage = () => {
    if (!editor) return;

    const url = window.prompt("URL de la imagen");
    if (!url?.trim()) return;

    editor.chain().focus().setImage({ src: url.trim() }).run();
  };

  const editorValue = value || "";

  return (
    <div
      className={clsx("rich-text-editor", {
        "full-span": span,
        "label--error": Boolean(error),
      })}
    >
      {label && (
        <label className="rich-text-editor__label" htmlFor={editorId}>
          {label}
          {required && <span className="label__required"> *</span>}
        </label>
      )}

      <div className="rich-text-editor__shell">
        <div className="rich-text-editor__toolbar" aria-label="Herramientas de edición">
          <div className="rich-text-editor__group">
            <MenuButton label="Párrafo" icon={FaParagraph} active={editor?.isActive("paragraph")} onClick={() => editor?.chain().focus().setParagraph().run()} />
            <MenuButton label="Título H2" icon={FaHeading} active={editor?.isActive("heading", { level: 2 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} />
            <MenuButton label="Título H3" icon={FaHeading} active={editor?.isActive("heading", { level: 3 })} onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} />
          </div>

          <div className="rich-text-editor__group">
            <MenuButton label="Negrita" icon={FaBold} active={editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()} />
            <MenuButton label="Cursiva" icon={FaItalic} active={editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()} />
            <MenuButton label="Subrayado" icon={FaUnderline} active={editor?.isActive("underline")} onClick={() => editor?.chain().focus().toggleUnderline().run()} />
          </div>

          <div className="rich-text-editor__group">
            <MenuButton label="Lista con viñetas" icon={FaListUl} active={editor?.isActive("bulletList")} onClick={() => editor?.chain().focus().toggleBulletList().run()} />
            <MenuButton label="Lista numerada" icon={FaListOl} active={editor?.isActive("orderedList")} onClick={() => editor?.chain().focus().toggleOrderedList().run()} />
            <MenuButton label="Cita" icon={FaQuoteRight} active={editor?.isActive("blockquote")} onClick={() => editor?.chain().focus().toggleBlockquote().run()} />
          </div>

          <div className="rich-text-editor__group">
            <MenuButton label="Alinear izquierda" icon={FaAlignLeft} active={editor?.isActive({ textAlign: "left" })} onClick={() => editor?.chain().focus().setTextAlign("left").run()} />
            <MenuButton label="Alinear centro" icon={FaAlignCenter} active={editor?.isActive({ textAlign: "center" })} onClick={() => editor?.chain().focus().setTextAlign("center").run()} />
            <MenuButton label="Alinear derecha" icon={FaAlignRight} active={editor?.isActive({ textAlign: "right" })} onClick={() => editor?.chain().focus().setTextAlign("right").run()} />
          </div>

          <div className="rich-text-editor__group">
            <MenuButton label="Insertar enlace" icon={FaLink} active={editor?.isActive("link")} onClick={setLink} />
            <MenuButton label="Quitar enlace" icon={FaUnlink} disabled={!editor?.isActive("link")} onClick={() => editor?.chain().focus().unsetLink().run()} />
            <MenuButton label="Insertar imagen por URL" icon={FaImage} onClick={setImage} />
          </div>

          <div className="rich-text-editor__group">
            <MenuButton label="Deshacer" icon={FaUndo} disabled={!editor?.can().undo()} onClick={() => editor?.chain().focus().undo().run()} />
            <MenuButton label="Rehacer" icon={FaRedo} disabled={!editor?.can().redo()} onClick={() => editor?.chain().focus().redo().run()} />
            <MenuButton label="Limpiar formato" icon={FaRemoveFormat} onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()} />
            <MenuButton label="Borrar contenido" icon={FaEraser} onClick={() => editor?.chain().focus().clearContent().run()} />
          </div>
        </div>

        <EditorContent id={editorId} editor={editor} />
      </div>

      <textarea
        className="rich-text-editor__required-control"
        value={editorValue}
        onChange={() => {}}
        required={required}
        tabIndex={-1}
        aria-hidden="true"
      />

      {message && (
        <p
          id={messageId}
          className={clsx("field-message", {
            "field-message--error": Boolean(error),
          })}
        >
          {message}
        </p>
      )}
    </div>
  );
}
