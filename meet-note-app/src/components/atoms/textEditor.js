import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const TextEditor = ({ data, onChange }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={data}
      config={{
        toolbar: [
          "undo", // Deshacer
          "redo", // Rehacer
          "|",
          "heading", // Títulos
          "|",
          "bold", // Negrita
          "italic", // Cursiva
          "bulletedList", // Lista con viñetas
          "numberedList", // Lista enumerada
          "|",
        ],
      }}
      onChange={(event, editor) => {
        const newData = editor.getData();
        onChange(newData);
      }}
    />
  );
};

export default TextEditor;
