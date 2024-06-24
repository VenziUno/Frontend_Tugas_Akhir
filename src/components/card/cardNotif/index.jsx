import React from "react";
import Button from "@/components/button";
import { AiOutlineClose } from "react-icons/ai";
import { ImNotification } from "react-icons/im";
import { useAppContext } from "@/hooks/useAppContext";
import { useRouter } from "next/router";
import axios from "axios";

export default function CardNotif({ type, title, mulcts }) {
  const { user, basic } = useAppContext();
  const { setShowLogout, deleteItem, setDeleteItem, mulct, setMulct } = user;
  const location = useRouter();
  const path = location.asPath;
  const query = location.query.page || 1;
  const { form, setform, notification, setNotification, handleShowNotification } = basic;

  function formatDate(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (type === "logout") {
      const token = sessionStorage.getItem("token");
      if (token) {
        try {
          const res = await axios.post(
            `${typeof window === "undefined" ? process.env.API_URL_SSR : process.env.API_URL}/api/logout`,
            { token: token },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          sessionStorage.clear();
          setShowLogout(false);
          location.push("/");
        } catch (error) {
          setNotification({
            show: true,
            type: "Danger",
            message: error.message,
          });
        }
      }
    } else if (type === "delete") {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.delete(deleteItem.url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const remainingItems = deleteItem.data - 1; // assuming one item is deleted
        const maxItemsOnCurrentPage = 5; // assuming 5 items per page
        const newCurrentPage = remainingItems <= (query - 1) * maxItemsOnCurrentPage ? query - 1 : query;

        if (newCurrentPage > 0) {
          location.push(`${location.pathname}?page=${newCurrentPage}`);
        } else {
          location.reload();
        }

        setDeleteItem({
          show: false,
          url: null,
          data: 0,
        });

        setNotification({
          show: true,
          type: "Success",
          message: res.data.message,
        });
      } catch (error) {
        setNotification({
          show: true,
          type: "Danger",
          message: error.message,
        });
        location.reload();
      }
    } else if (type === "mulct") {
      try {
        const returned_date = new Date();
        form.returned_date = formatDate(returned_date);
        form.mulct = mulcts;
        const token = sessionStorage.getItem("token");
        const res = await axios.post(
          mulct.url,
          form,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setNotification({
          show: true,
          type: "Success",
          message: res.data.message,
        });
        setMulct({
          show: false,
          url: null,
        });
        location.reload();
      } catch (error) {
        setNotification({
          show: true,
          type: "Danger",
          message: error.message,
        });
      }
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if (type === "logout") {
      setShowLogout(false);
    } else if (type === "delete") {
      setDeleteItem({
        show: false,
        url: null,
      });
    } else if (type === "mulct") {
      setMulct({
        show: false,
        url: null,
      });
    }
  };

  if (!deleteItem.show && !mulct.show && !setShowLogout) return null; // Ensure the card is hidden when not needed

  return (
    <div className="absolute z-50 flex justify-center align-middle items-center w-full h-screen ">
      <div className="bg-white w-96 py-4 border border-slate-400 shadow flex flex-col items-center justify-center rounded-xl space-y-3 m-2">
        {type ? null : (
          <div className="w-full flex justify-end px-5">
            <Button type="icon" link={path + "/dashboard"}>
              <AiOutlineClose />
            </Button>
          </div>
        )}
        <ImNotification size={96} className="text-danger-base" />
        <div className="text-center">
          <div className="text-2xl">
            {type
              ? title || "Are you sure you want to Delete this data?"
              : "Data Deleted!"}
          </div>
        </div>
        <div className="w-full flex justify-center items-center px-16">
          {type ? (
            <div className="w-full flex justify-evenly">
              <Button action="light" handleClick={(e) => handleConfirm(e)}>
                {{
                  logout: "Logout",
                  delete: "Delete",
                  mulct: "Mulct",
                }[type] || ""}
              </Button>
              <Button handleClick={(e) => handleCancel(e)}>Cancel</Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
