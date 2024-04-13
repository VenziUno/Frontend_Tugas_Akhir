import { useAppContext } from "@/hooks/useAppContext";
import Image from "next/image";
import React, { useState } from "react";

const ImageUploader = ({ type, value, onChildValueChange, style, title }) => {
  const [image, setImage] = useState(null);
  const { member, basic } = useAppContext();
  const {notification, setNotification, handleShowNotification } = basic;

  const handleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      if (selectedFile.type === "image/jpeg" || selectedFile.type === "image/png" || selectedFile.type === "image/jpg") {
        onChildValueChange(selectedFile);
        setImage(URL.createObjectURL(selectedFile));
      } else {
        setNotification({
          show: true,
          type: "Warning",
          message: "Please select a valid image file (JPEG or PNG).",
        });
        setImage("/public/download.png");
      }
    }
  };
  return (
    <React.Fragment>
      <label>
        <Image
          src={
            image != null
              ? image
              : value ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1WfzUrvX8yEaaPL4msLzB9Lfz4-n4M1_VQf1kbfOmkA&s"
          }
          alt="upload"
          width={100}
          height={100}
          className="w-44 h-44 rounded object-scale-down"
        ></Image>
        <input
          autoComplete="off"
          type={type}
          onChange={handleChange}
          className={`flex border border-slate-400 bg-white shadow rounded px-2 text-base py-2 outline-none ${style} hidden`}
          title={title}
        />
      </label>
    </React.Fragment>
  );
};

export default ImageUploader;
