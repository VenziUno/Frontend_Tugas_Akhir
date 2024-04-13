import React from "react";
import { SketchPicker } from "react-color";
import { HiXMark } from "react-icons/hi2";

const ColorPicker = ({
  choosenColor,
  handleChangeColor,
  handleClosePicker,
}) => {
  return (
    <div className="absolute top-0 left-36">
      <SketchPicker
        color={choosenColor}
        onChange={(color, event) => handleChangeColor(color, event)}
        className="relative"
      />
      <button
        onClick={handleClosePicker}
        className="absolute -top-3 -right-3 bg-white border shadow-sm w-6 h-6 rounded-full flex justify-center items-center"
      >
        <HiXMark size={14} />
      </button>
    </div>
  );
};

export default ColorPicker;