import React from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineInfoCircle,
  AiOutlineWarning,
} from "react-icons/ai";
import { RiErrorWarningLine } from "react-icons/ri";

const Notifikasi = ({ type, style, title, description, icon }) => {
  switch (type) {
    case "Info":
      style = "bg-info-base";
      title = "Info";
      break;
    case "Success":
      style = "bg-success-base";
      title = "Success";
      break;
    case "Warning":
      style = "bg-warning-base";
      title = "Warning";
      break;
    case "Danger":
      style = "bg-danger-base";
      title = "Danger";
      break;
  }

  return (
    <div className="absolute top-4 right-4 border rounded border-slate-400 z-50 flex">
      <div className={`${style} font-bold rounded-l p-4`}>
        <AiOutlineInfoCircle className="text-white" />
      </div>
      <div
        className={`border rounded-r bg-white px-4 py-3`}
      >
        <div>
          {title} | {description}
        </div>
      </div>
    </div>
  );
};

export default Notifikasi;
