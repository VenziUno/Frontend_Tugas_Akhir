import React, { useState, useEffect, use } from "react";
import { BiChevronDown } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import Button from "../button";
import { GiSettingsKnobs } from "react-icons/gi";

export default function MultiSelect({
  list,
  size,
  search,
  allselect,
  handleValue,
  value,
  filter,
  type,
  style,
  label,
}) {
  switch (type) {
    case "filter":
      style = "";
      break;
    default:
      style = "border-slate-400 border shadow px-2 py-1";
      break;
  }

  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [valueData, setValueData] = useState(null);

  useEffect(() => {
    if (value && value.length > 0) {
      const tempUser = list.map((d) => {
        return {
          ...d,
          isChecked: value.includes(d.value) ? true : false,
        };
      });
      setUsers(tempUser);
      const select = tempUser.filter((x) => x.isChecked === true);
      setSelected(select);
    } else {
      setUsers(list);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    if (name === "allSelect") {
      const tempUser = users.map((user) => {
        return { ...user, isChecked: checked };
      });
      setUsers(tempUser);
      const select = tempUser.filter((x) => x.isChecked === true);
      setSelected(select);
      if (handleValue) {
        handleValue(select);
      }
    } else {
      const tempUser = users.map((user) =>
        user.name === name ? { ...user, isChecked: checked } : user
      );
      setUsers(tempUser);
      const select = tempUser.filter((x) => x.isChecked === true);
      setSelected(select);
      if (handleValue) {
        handleValue(select);
      }
    }
  };

  const changeValue = (name) => {
    const tempUser = users.map((user) =>
      user.name === name ? { ...user, isChecked: false || null } : user
    );
    setUsers(tempUser);
    const select = tempUser.filter((x) => x.isChecked === true);
    setSelected(select);
    if (handleValue) {
      handleValue(select);
    }
  };

  return (
    <div className={`${size}`}>
      <div>
        <div
          className={`bg-white gap-2  text-xs flex justify-between rounded items-center capitalize ${style}`}
          onClick={(e) => {
            e.preventDefault();
            if (selected === false || selected.length === 0) {
              setOpen(!open);
            }
          }}
        >
          {filter ? (
            <GiSettingsKnobs className=" text-primary-800 px-2" size="32" />
          ) : (
            <div className="flex justify-between overflow-auto w-full items-center gap-2">
              {label ? (
                <>
                  <div
                    className={`py-2 ${label ? "text-lg font-semibold" : ""}`}
                  >
                    {label}
                  </div>
                </>
              ) : (
                <>
                  {selected === false || selected.length === 0 ? (
                    <div
                      className={`py-2 ${label ? "text-lg font-semibold" : ""}`}
                    >
                      Selected
                    </div>
                  ) : (
                    selected &&
                    selected.map((value, index) => {
                      return (
                        <div
                          key={index}
                          className="w-full flex  px-2 items-center space-x-2 bg-primary-200 rounded py-1"
                        >
                          <div>{value.name}</div>
                          <IoIosClose
                            size={24}
                            onClick={() => changeValue(value.name)}
                            className="hover:cursor-pointer hover:bg-primary-100/50 rounded-full"
                          />
                        </div>
                      );
                    })
                  )}
                </>
              )}
              <BiChevronDown
                className={`${open && "rotate-180"}`}
                onClick={() => setOpen(!open)}
                size={24}
              />
            </div>
          )}
        </div>
        <div className={`w-full ${label ? "" : " relative"}`}>
          <div
            className={`bg-white scrollbar-thin scrollbar-thumb-primary-300 scrollbar-track-primary-100 scrollbar-thumb-rounded scrollbar-track-rounded hover:scrollbar-thumb-primary-300 overflow-y-auto rounded
            ${
              open
                ? `max-h-[250px] mt-2 mb-2 ${
                    label ? "" : "shadow border absolute right-0 z-10 "
                  }  ${size}`
                : "hidden"
            }`}
          >
            {users.length > 5 && search ? (
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
            ) : null}

            {allselect ? (
              <div>
                <div className="flex gap-2 p-2 m-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="allSelect"
                    checked={!users.some((user) => user?.isChecked !== true)}
                    onChange={handleChange}
                  />
                  <div className="text-xs">All Select</div>
                </div>
                {users.map((user, index) => (
                  <div
                    className={`rounded ml-8 m-2 py-2 px-2 text-xs hover:bg-gray-200 capitalize space-x-2 flex align-middle
                    ${
                      search
                        ? user.name.toLowerCase().startsWith(inputValue)
                          ? "block"
                          : "hidden"
                        : ""
                    }
                    `}
                    key={"usernames" + index}
                  >
                    <input
                      type="checkbox"
                      name={user.name}
                      checked={user?.isChecked || false}
                      onChange={handleChange}
                    />
                    <label
                      className={`form-check-label ms-2
                    `}
                    >
                      {user.name}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {users.map((user, index) => {
                  return (
                    <div
                      className={`rounded m-2 py-2 px-2 text-xs hover:bg-gray-200 capitalize space-x-2 flex align-middle
                    ${
                      search
                        ? user.name.toLowerCase().includes(inputValue)
                          ? "block"
                          : "hidden"
                        : ""
                    }
                    `}
                      key={"username" + index}
                    >
                      <input
                        type="checkbox"
                        name={user.name}
                        checked={user?.isChecked || false}
                        onChange={handleChange}
                      />
                      <label>{user.name}</label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
