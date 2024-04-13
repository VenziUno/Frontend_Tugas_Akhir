import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useBasicProvider } from "../useBasicProvider";

export const useBookDetailProvider = () => {
  const { notification, setNotification, handleShowNotification } =
    useBasicProvider();

  const router = useRouter();

  const [form, setForm] = useState({
    id: "",
    title: "",
    author: "",
    publisher: "",
    publication: "",
    publication_year: "",
    current_stock: "",
    file: null,
    book_categories_id: "",
    book_catalogs_id: "",
    status: null,
    current_stock: null,
  });

  const resetForm = () => {
    setForm({
      id: "",
      title: "",
      author: "",
      publisher: "",
      publication: "",
      publication_year: "",
      file: null,
      book_categories_id: "",
      book_catalogs_id: "",
      status: null,
      current_stock: null,
    });
  };

  const handleCheck = () => {
    if (
      id === "" ||
      title === "" ||
      author === "" ||
      publication === "" ||
      publisher === "" ||
      publication_year === "" ||
      file === null ||
      book_categories_id === "" ||
      status === null ||
      current_stock === ""
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
          }/api/bookcategory/${id}`,
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
