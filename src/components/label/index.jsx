import React from "react";

const Label = ({ children, label, type, typeStyle , style}) => {

  switch (type){
    case "title":
      style="text-3xl";
      break;
    default:
      style="";
      break;
  }

  return (
    <div className="flex flex-col">
      <div className={`font-bold ${typeStyle} ${style}`}>{label}</div>
      <div>{children}</div>
    </div>
  );
};

export default Label;
