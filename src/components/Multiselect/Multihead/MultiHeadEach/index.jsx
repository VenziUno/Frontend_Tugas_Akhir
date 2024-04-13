import React, { useState, useEffect } from "react";

export default function MultiHeadEach({
  parent,
  users,
  setUsers,
  handleChange,
  setSelected,
  search,
  inputValue,
}) {
  const arr = parent.value.map((child) => child.isChecked);
  const [checkedState, setCheckedState] = useState(arr);
  const [checkedStateIndexes, setCheckedStateIndexes] = useState([]);

  useEffect(() => {
    const arr = parent.value.map((child) => child.isChecked);
    setCheckedState(arr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  useEffect(() => {
    if (search && inputValue) {
      const indexes = parent.value
        .map((val, i) =>
          val.childName.toLowerCase().includes(inputValue) ? i : false
        )
        .filter((index) => index !== false);
      setCheckedStateIndexes(indexes);
    }
  }, [inputValue, parent.value, search]);

  const handleSelect = (e, child, position) => {
    // checked
    const updatedChecked = checkedState.map((state, p) =>
      p === position ? !state : state
    );
    setCheckedState(updatedChecked);
    // users
    const updatedParent = parent.value.map((val) =>
      val.childId === child.childId
        ? { ...val, isChecked: e.target.checked }
        : val
    );
    const updatedData = users.map((u) =>
      u.parentId === parent.parentId ? { ...u, value: updatedParent } : u
    );
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

  const handleSelectAll = (e) => {
    let updatedChecked, updatedParent;
    if (search && inputValue) {
      updatedChecked = checkedState.map((state, p) =>
        checkedStateIndexes.includes(p) ? !state : state
      );
      setCheckedState(updatedChecked);
      // users
      updatedParent = parent.value.map((val) =>
        val.childName.toLowerCase().includes(inputValue)
          ? { ...val, isChecked: e.target.checked }
          : val
      );
    } else {
      // checked
      updatedChecked = new Array(parent.value.length).fill(e.target.checked);
      setCheckedState(updatedChecked);
      // users
      updatedParent = parent.value.map((val) => {
        return { ...val, isChecked: e.target.checked };
      });
    }
    const updatedData = users.map((u) =>
      u.parentId === parent.parentId ? { ...u, value: updatedParent } : u
    );
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

  const [noMatch, setNoMatch] = useState(false);
  useEffect(() => {
    if (search) {
      let resCheck = [];
      parent.value.map((child, i) => {
        const checkChild = child.childName.toLowerCase().includes(inputValue);
        resCheck.push(checkChild);
      });
      const res = resCheck.every((value) => value === false); // checked if all false = no Match = render nothing
      setNoMatch(res);
    }
  }, [parent, search, inputValue]);

  return noMatch ? (
    <></>
  ) : (
    <div className="m-2 rounded px-2 py-3 text-xs capitalize space-x-8 flex flex-col gap-2">
      <div className="flex flex-row items-center gap-2">
        <input
          type="checkbox"
          checked={
            search && inputValue
              ? checkedState.every((state, p) =>
                  checkedStateIndexes.includes(p)
                    ? checkedStateIndexes.includes(p) === state
                    : true
                )
              : checkedState.every((value) => value === true)
          }
          onChange={(e) => handleSelectAll(e)}
        />
        {parent.parentName}
      </div>
      <div className="flex flex-col gap-1.5">
        {parent.value.map((child, i) => (
          <div
            key={parent.parentId + "-child" + i}
            className={`flex flex-row items-center gap-2
            ${
              search
                ? child.childName.toLowerCase().includes(inputValue)
                  ? "block"
                  : "hidden"
                : ""
            }`}
          >
            <input
              type="checkbox"
              checked={checkedState[i]}
              onChange={(e) => handleSelect(e, child, i)}
            />
            {child.childName}
          </div>
        ))}
      </div>
    </div>
  );
}