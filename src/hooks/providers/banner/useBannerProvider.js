import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useBasicProvider } from "../useBasicProvider";

export const useBannerProvider = () => {
  const { notification, setNotification, handleShowNotification } = useBasicProvider();

  const router = useRouter();

  const [form, setForm] = useState({
    id: "",
    title: "",
    description: "",
    file: "",
    status: null,
  });

  const resetForm = () => {
    setForm({
      id: "",
      title: "",
      description: "",
      file: "",
      status: null,
    });
  };

  const handleCheck = () => {
    if (
      form.id === "" ||
      form.title === "" ||
      form.description === "" ||
      form.file === "" ||
      form.status === 0
    ) {
      setNotification({
        show: true,
        type: "Warning",
        message: "Please fill in all fields.",
      });
      return false;
    } else {
      return true;
    }
  };

  const handleSubmitAdd = async () => {
    if (handleCheck()) {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.post(
          `${
            typeof window === "undefined"
              ? process.env.API_URL_SSR
              : process.env.API_URL
          }/api/banner`,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resetForm();
        setNotification({
          show: true,
          type: "Success",
          message: res.data.message,
        });
        router.push("/banner");
      } catch (error) {
        resetForm();
        setNotification({
          show: true,
          type: "Danger",
          message: error.message,
        });
        router.push("/banner");
      }
    }
  };

  const handleSubmitEdit = async () => {
    if (handleCheck()) {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.post(
          `${
            typeof window === "undefined"
              ? process.env.API_URL_SSR
              : process.env.API_URL
          }/api/banner/${form.id}`,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resetForm();
        setNotification({
          show: true,
          type: "Success",
          message: "Edit data success !",
        });
        router.push("/banner");
      } catch (error) {
        resetForm();
        setNotification({
          show: true,
          type: "Danger",
          message: error.message,
        });
        router.push("/banner");
      }
    }
  };

  return {
    form,
    setForm,
    resetForm,
    handleSubmitAdd,
    handleSubmitEdit,
  };
};