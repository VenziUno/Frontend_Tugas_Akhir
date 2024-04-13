import React, { useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import Button from "../button";

const Selects = ({
  list,
  size,
  placeholder,
  handleChange,
  value,
  search,
  disable,
}) => {
  const [selected, setSelected] = useState({
    label: value ? value.label : "",
    value: value ? value.value : "",
  });

  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <div className={`${size ? size : "w-full"}`}>
      <div
        onClick={() => setOpen(!open)}
        className={
          disable
            ? `bg-gray-200 px-4 py-2 text-xs flex items-center justify-between rounded border shadow capitalize ${
                size ? size : "w-full"
              }`
            : `bg-white w-full min-w-full space-x-4 border-slate-400 px-2 max-w-96 py-2 text-base flex items-center justify-between rounded border shadow capitalize ${
                size ? size : "w-full"
              }`
        }
      >
        <div>{selected.label ? selected.label || value : placeholder}</div>
        {disable ? (
          <BiChevronDown />
        ) : (
          <BiChevronDown className={`${open && "rotate-180"}`} />
        )}
      </div>
      {disable ? (
        <React.Fragment></React.Fragment>
      ) : (
        <div className="w-full relative">
          <ul
            className={`bg-white overflow-y-auto rounded scrollbar-thin scrollbar-thumb-primary-300 scrollbar-track-primary-100 scrollbar-thumb-rounded scrollbar-track-rounded hover:scrollbar-thumb-primary-300
        ${
          open
            ? `max-h-[250px] space-y-2 mt-2 py-2 shadow border border-slate-400 absolute z-50 ${
                size ? size : "w-full"
              }`
            : "hidden"
        }`}
          >
            {list.length > 5 && search && (
              <div className="flex rounded-full border mx-2 text-xs capitalize sticky top-2 bg-white bg-opacity-80 opacity-90">
                <input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value.toLowerCase())}
                  className={`rounded-full w-full outline-none px-4 capitalize`}
                  placeholder={"Search . . ."}
                  autoFocus
                />
                <button className="cursor-pointer px-3 py-3">
                  <FaSearch />
                </button>
              </div>
            )}
            {list.map((item) => (
              <li
                key={item.label}
                className={`px-2 py-2 text-base hover:bg-slate-400 capitalize 
            ${item.label === selected.label && "bg-gray-200"}
            ${
              search
                ? item.label.toLowerCase().includes(inputValue)
                  ? "block"
                  : "hidden"
                : ""
            }
            `}
                onClick={() => {
                  if (item.label !== selected.label) {
                    setSelected(item);
                    setOpen(false);
                    if (handleChange) {
                      handleChange(item);
                    }
                  }
                }}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Selects;
