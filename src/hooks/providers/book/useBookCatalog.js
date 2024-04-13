import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useBasicProvider } from "../useBasicProvider";

export const useBookCatalogProvider = () => {
  const { notification, setNotification, handleShowNotification } = useBasicProvider();

  const router = useRouter();

  const [form, setForm] = useState({
    id: "",
    name: "",
    location: "",
    status: null
  });

  const resetForm = () => {
    setForm({
      id: "",
      name: "",
      location: "",
      status: null,
    });
  };

  const handleCheck = () => {
    if (
      form.id === "" ||
      form.name === ""
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
          }/api/bookcategory`,
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
        router.push("/book/bookCategory");
      } catch (error) {
        resetForm();
        setNotification({
          show: true,
          type: "Danger",
          message: error.message,
        });
        router.push("/book/bookcategory");
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
          }/api/bookcategory/${form.id}`,
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
        router.push("/book/bookCategory");
      } catch (error) {
        resetForm();
        setNotification({
          show: true,
          type: "Danger",
          message: error.message,
        });
        router.push("/book/bookCategory");
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