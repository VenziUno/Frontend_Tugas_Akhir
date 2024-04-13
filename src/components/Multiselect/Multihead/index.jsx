import React, { useState, useEffect } from "react";
import MultiHeadEach from "./MultiHeadEach";
import { BiChevronDown } from "react-icons/bi";
import { IoIosClose } from "react-icons/io";
import Button from "../../Buttons";
import { FaSearch } from "react-icons/fa";

export default function MultiHead({
  list,
  value,
  handleChange,
  size,
  description,
  search,
}) {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(false);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (value && value.length > 0) {
      // jika ada default value --> contoh array : [3,4]
      let obj = {};
      list.forEach((item) => {
        if (obj[item.parent_value] === undefined) {
          obj[item.parent_value] = [];
        }
        obj[item.parent_value].push({
          parentId: item.parent_value,
          parentName: item.parent_label,
          childId: item.child_value,
          childName: item.child_label,
          isChecked: value.includes(item.child_value) ? true : false,
        });
      });
      let arrGroup = [];
      Object.keys(obj).forEach((key) => {
        arrGroup.push({
          parentId: key,
          parentName: obj[key][0].parentName,
          value: obj[key],
        });
      });
      setUsers(arrGroup);
      const defaultSelected = value
        .map((val) => list.find((i) => i.child_value === val))
        .map((s) => {
          return {
            childId: s.child_value,
            childName: s.child_label,
            isChecked: true,
            parentId: s.parent_value,
            parentName: s.parent_label,
          };
        });
      setSelected(defaultSelected);
    } else {
      let obj = {};
      list.forEach((item) => {
        if (obj[item.parent_value] === undefined) {
          obj[item.parent_value] = [];
        }
        obj[item.parent_value].push({
          parentId: item.parent_value,
          parentName: item.parent_label,
          childId: item.child_value,
          childName: item.child_label,
          isChecked: false,
        });
      });
      let arrGroup = [];
      Object.keys(obj).forEach((key) => {
        arrGroup.push({
          parentId: key,
          parentName: obj[key][0].parentName,
          value: obj[key],
        });
      });
      setUsers(arrGroup);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list]);

  const changeValue = (value) => {
    // users
    const updatedData = users.map((u) => {
      if (u.parentId === value.parentId) {
        const updatedParent = u.value.map((val) =>
          val.childId === value.childId ? { ...val, isChecked: false } : val
        );
        return { ...u, value: updatedParent };
      } else {
        return u;
      }
    });
    setUsers(updatedData);
    // selected
    let dataSelected = [];
    updatedData.map((u) => {
      u.value
        .filter((val) => val.isChecked === true)
        .map((i) => {
          dataSelected.push(i);
        });
    });
    setSelected(dataSelected);
    handleChange(dataSelected);
  };

  return (
    <div className={`${size}`}>
      <button
        className="bg-white px-4 py-1 text-xs flex justify-between rounded border items-center shadow capitalize min-h-[34px] w-full cursor-default"
        onClick={(e) => {
          e.preventDefault();
          if (selected === false || selected.length === 0) {
            setOpen(!open);
          }
        }}
      >
        <div className="flex justify-start flex-wrap gap-2 w-full h-full mr-3">
          {selected === false || selected.length === 0 ? (
            <div className="py-1">{description || ""}</div>
          ) : (
            selected &&
            selected.map((value, index) => {
              return (
                <div
                  className="w-fit flex items-center bg-primary-200 rounded px-2 py-1 gap-2 z-20"
                  key={"selected" + index}
                >
                  <div>{value.childName}</div>
                  <IoIosClose
                    size={16}
                    onClick={() => changeValue(value)}
                    className="hover:cursor-pointer hover:bg-primary-100/50 rounded-full"
                  />
                </div>
              );
            })
          )}
        </div>
        <BiChevronDown
          className={`${open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
      </button>
      <div className="w-full relative">
        <div
          className={`bg-white overflow-y-auto rounded shadow
            ${
              open
                ? `max-h-[250px] mt-2 mb-2 shadow border absolute z-30 w-full`
                : "hidden"
            }`}
        >
          {/* searching */}
          {search ? (
            <div className="flex rounded-full m-2 border px-2 text-xs capitalize sticky top-0 bg-white bg-opacity-80 opacity-90">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.toLowerCase())}
                className="rounded-full w-full outline-none px-2"
                placeholder={"Search . . ."}
                autoFocus
              />
              <Button type="icon" variant="icon">
                <FaSearch />
              </Button>
            </div>
          ) : (
            <></>
          )}

          {users.length > 0 &&
            users.map((parent, index) => {
              return (
                <MultiHeadEach
                  key={"parent" + index}
                  parent={parent}
                  users={users}
                  setUsers={setUsers}
                  handleChange={handleChange}
                  setSelected={setSelected}
                  search={search}
                  inputValue={inputValue}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}