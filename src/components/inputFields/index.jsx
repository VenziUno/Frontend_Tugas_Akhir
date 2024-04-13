import { useAppContext } from "@/hooks/useAppContext";
import React, { useState } from "react";
import {
  AiOutlineEye,
  AiOutlineSearch,
  AiOutlineEyeInvisible,
} from "react-icons/ai";

const InputFields = ({
  type,
  value,
  setValue,
  placeholder,
  disabled,
  style,
  icon,
  min,
  max,
  maxLength,
  title,
}) => {
  switch (disabled) {
    case true:
      style = "font-3xl bg-slate-300 w-full";
      break;
  }

  const { basic } = useAppContext();
  const { search, setSearch } = basic;

  const handleValue = (e) => {
    setSearch(e.target.value);
  };

  const [isActive, setIsActive] = useState(false);

  return icon ? (
    <div
      className={`flex border border-slate-400 bg-white shadow text-base py-2 outline-none ${style} rounded px-2`}
    >
      {icon == "eye" ? (
        <React.Fragment>
          {isActive ? (
            <React.Fragment>
              <input
                autoComplete="off"
                type="text"
                value={value !== undefined && value !== null ? value : ""}
                onChange={(e) => setValue(e)}
                placeholder={placeholder}
                disabled={disabled}
                title={title}
                className={`${style} outline-none`}
              />
              <button className="cursor-pointer px-2">
                <AiOutlineEye onClick={() => setIsActive(!isActive)} />
              </button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <input
                autoComplete="off"
                type={type}
                value={value !== undefined && value !== null ? value : ""}
                onChange={(e) => setValue(e)}
                placeholder={placeholder}
                disabled={disabled}
                title={title}
                className={`${style} outline-none`}
              />
              <button className="cursor-pointer px-2">
                <AiOutlineEyeInvisible
                  onClick={() => {
                    setIsActive(!isActive);
                  }}
                />
              </button>
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <button className="px-1 hover:rounded-full hover:bg-slate-400">
            <AiOutlineSearch />
          </button>
          <input
            autoComplete="off"
            type={type}
            value={search}
            onChange={handleValue}
            placeholder={placeholder}
            disabled={disabled}
            title={title}
            className={`${style} pl-1 outline-none`}
          />
        </React.Fragment>
      )}
    </div>
  ) : (
        <React.Fragment>
          <input
            autoComplete="off"
            type={type}
            value={value !== undefined && value !== null ? value : ""}
            onChange={(e) => setValue(e)}
            placeholder={placeholder}
            disabled={disabled}
            className={`flex border border-slate-400 bg-white shadow rounded px-2 text-base py-2 outline-none ${style}`}
            min={min}
            max={max}
            maxLength={maxLength}
            title={title}
          />
        </React.Fragment>
  );
};

export default InputFields;
