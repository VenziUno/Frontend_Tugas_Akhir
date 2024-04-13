import React from "react";

const TextArea = ({ placeholder, style, value, setValue, disabled }) => {
  switch (disabled) {
    case true:
      style = "bg-gray-200";
      placeholder = null;
      break;
  }
  return (
    <textarea
      value={value}
      disabled={disabled}
      onChange={(e) => setValue(e)}
      placeholder={placeholder}
      className={`w-full border border-slate-400 shadow bg-white max-h-96 h-40 p-2 rounded outline-none inline-flex ${style}`}
    />
  );
};

export default TextArea;
