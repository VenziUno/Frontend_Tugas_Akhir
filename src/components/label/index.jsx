import React from "react";

const Label = ({ children, label, type, typeStyle, childrenStyle , style}) => {

  switch (type){
    case "title":
      style="text-3xl";
      break;
    default:
      style="";
      break;
  }

  return (
    <div className={`flex flex-col ${typeStyle}`}>
      <div className={`font-bold ${typeStyle} ${style}`}>{label}</div>
      <div className={`${childrenStyle}`}>{children}</div>
    </div>
  );
};

export default Label;
