import Button from "@/components/button";
import InputFields from "@/components/inputFields";
import Label from "@/components/label";
import Notifikasi from "@/components/notification";
import { useAppContext } from "@/hooks/useAppContext";
import axios from "axios";
import Link from "next/link";
import { router } from "next/router";
import React, { useEffect, useState } from "react";

export default function Login() {
  const [account, setAccount] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const { member, basic } = useAppContext();
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const {
    form,
    setForm,
    resetForm,
    notification,
    setNotification,
    handleShowNotification,
  } = basic;
  useEffect(() => {
    if (notification.show) {
      handleShowNotification();
    }
  }, [handleShowNotification, notification]);
  const [popUp, setPopUp] = useState(false);
  const handlePopUp = () => {
    setPopUp(!popUp);
  };

  const handleApi = () => {
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
        email: account.email,
        password: account.password,
      })
      .then((res) => {
        sessionStorage.setItem("token", res.data.authorisation.token);
        sessionStorage.setItem("role", res.data.user.role_id);
        sessionStorage.setItem("name", res.data.user.name);
        if (res.data.user.role_id !== "RU003") {
          router.push("/dashboard");
        } else {
          sessionStorage.setItem("member", res.data.member.id);
          router.push("/historyTransaksiMember");
        }
      })
      .catch((error) => {
        setNotification({
          show: true,
          type: "Danger",
          message: error.response.data.message,
        });
      });
  };

  const handleCheck = () => {
    if (form.nis === "" || form.date_of_birth === "") {
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

  const handleChangePassword = async () => {
    if (handleCheck()) {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.post(
          `${
            typeof window === "undefined"
              ? process.env.API_URL_SSR
              : process.env.API_URL
          }/api/public/member/${form.nis}`,
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
        router.back();
      } catch (error) {
        resetForm();
        setNotification({
          show: true,
          type: "Danger",
          message: error.message,
        });
        router.back();
      }
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      sessionStorage.clear();
      window.location.href = "/";
    }
  });

  return (
    <div className="bg-primary-base">
      {notification.show && (
        <Notifikasi
          type={notification.type}
          description={notification.message}
        />
      )}
      <div className="flex items-center justify-center h-screen m-auto">
        <div className="w-full bg-white rounded-lg shadow max-w-md px-6 py-6 space-y-2">
          <Label label="Sign in to your account" type="title" />
          <div className="space-y-4">
            <Label label="Email">
              <InputFields
                type="email"
                style="w-full"
                placeholder="Enter Your Email"
                value={account.email}
                setValue={(e) =>
                  setAccount({ ...account, email: e.target.value })
                }
              />
            </Label>
            <Label label="Password">
              <InputFields
                type="password"
                style="w-full"
                placeholder="* * * * * * * *"
                icon="eye"
                value={account.password}
                setValue={(e) =>
                  setAccount({ ...account, password: e.target.value })
                }
              />
            </Label>
            <div className="flex gap-2">
              <Button
                style="w-full"
                action="light"
                width="w-full"
                handleClick={handlePopUp}
              >
                Forget Password ?
              </Button>
              <Button style="w-full" width="w-full" handleClick={handleApi}>
                Sign In
              </Button>
              {popUp ? (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40 flex justify-center items-center">
                  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full bg-white rounded-lg shadow max-w-md px-6 py-6 space-y-2 z-50">
                    <div className="p-8 space-y-2">
                      <Label label="NIS">
                        <InputFields
                          type="NIS"
                          style="w-full"
                          placeholder="Enter Your NIS"
                          value={form.nis}
                          setValue={(e) =>
                            setForm({
                              ...form,
                              nis: e.target.value,
                            })
                          }
                        />
                      </Label>
                      <Label label="Date">
                        <InputFields
                          type="date"
                          style="w-full"
                          value={form.date_of_birth}
                          setValue={(e) =>
                            setForm({
                              ...form,
                              date_of_birth: e.target.value,
                            })
                          }
                        />
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          style="w-full"
                          action="light"
                          width="w-full"
                          handleClick={handlePopUp}
                        >
                          Cancel
                        </Button>
                        <Button
                          style="w-full"
                          width="w-full"
                          handleClick={handleChangePassword}
                        >
                          Reset Password
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="text-center font-bold px-1">
              &copy; {currentYear} Sekolah Kalam Kudus 2 Batam. All rights reserved          
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
