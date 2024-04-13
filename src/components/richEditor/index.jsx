import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

const RichEditor = ({ onChange }) => {
  const editorRef = useRef(null);
  const handleEditorChange = (content, editor) => {
    if (onChange) {
      onChange(content); 
    }
  };
  return (
    <React.Fragment>
      <Editor
        apiKey={"x7nrsk0h1tm1rmvzd31ktuhv71fgumfqcr7xd7z9wf5a2td5"}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue="<p></p>"
        init={{
          height: 300,
          menubar: true,
          plugins: [
            'advlist', 'anchor', 'autolink', 'help', 'image', 'link', 'lists',
            'searchreplace', 'table', 'wordcount'
          ],  
          toolbar: 'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
        onEditorChange={handleEditorChange}
      />
    </React.Fragment>
  );
};

export default RichEditor;
