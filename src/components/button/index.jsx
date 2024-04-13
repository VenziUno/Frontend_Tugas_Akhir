import React from "react";
import Link from "next/link";

const Button = ({
  children,
  action,
  title,
  style,
  link,
  handleClick,
  width,
}) => {
  switch (action) {
    case "light":
      style = "hover:underline border border-slate-400 rounded";
      break;
    case "info":
      style = "bg-info-base hover:bg-info-hover shadow rounded";
      break;
    case "danger":
      style = "bg-danger-base hover:bg-danger-hover shadow rounded";
      break;
    case "success":
      style = "bg-success-base hover:bg-success-hover shadow rounded";
      break;
    case "warning":
      style = "bg-warning-base hover:bg-warning-hover shadow rounded";
      break;
    default:
      style = "bg-primary-500 hover:bg-primary-700 text-black shadow rounded";
      break;
  }

  return link ? (
    <Link href={link || ""} legacyBehavior>
      <button
        className={`px-4 py-2 font-bold text-base inherit ${style} ${width}`}
        title={title}
        onClick={handleClick}
      >
        {children}
      </button>
    </Link>
  ) : (
    <button
      className={`px-4 py-2 font-bold text-base inherit ${style} ${width}`}
      title={title}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default Button;
