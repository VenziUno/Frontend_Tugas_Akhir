import Button from "@/components/button";
import InputFields from "@/components/inputFields";
import Label from "@/components/label";
import Layout from "@/components/layout";
import React, { useEffect, useState } from "react";
import { useAppContext } from "@/hooks/useAppContext";
import { useFetcher } from "@/hooks/useFetcher";
import { useRouter } from "next/router";
import axios from "axios";
import Selects from "@/components/selects";
import ImageUploader from "@/components/imageUploader";
import TextArea from "@/components/textArea";

export default function AddMember() {
  const { member, basic } = useAppContext();
  const {
    form,
    setForm,
    resetForm,
    notification,
    setNotification,
    handleShowNotification,
  } = basic;
  const router = useRouter();

  const fetchDataAndUpdate = async () => {
    try {
      const response = await axios.get("https://wezady.my.id/api/public/rfiddata");
      const data = response.data.data;
      setForm({ ...form, rfid: data[0].rfid_data});
    } catch (error) {
      setForm({ ...form, rfid: "" });
    }
  };

  const handleRefreshClick = () => {
    fetchDataAndUpdate();
  };

  const handleCheck = () => {
    if (
      form.id === "" ||
      form.name === "" ||
      form.nis === "" ||
      form.rfid === "" ||
      form.gender === "" ||
      form.email === "" ||
      form.place_of_birth === "" ||
      form.date_of_birth === "" ||
      form.class === "" ||
      form.address === "" 
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

  const pilihan_status = [
    { label: "Paud", value: "Paud" },
    { label: "TK", value: "TK" },
    { label: "I", value: "1" },
    { label: "II", value: "2" },
    { label: "III", value: "3" },
    { label: "IV", value: "4" },
    { label: "V", value: "5" },
    { label: "VI", value: "6" },
    { label: "VII", value: "7" },
    { label: "VIII", value: "8" },
    { label: "IX", value: "9" },
  ];

  const gender = [
    { label: "Laki-Laki", value: "L" },
    { label: "Perempuan", value: "P" },
  ];

  const {
    res: resCode,
    isLoading: isLoadingCode,
    isError: isErrorCode,
  } = useFetcher(`member/code`);

  useEffect(() => {
    if (resCode) {
      const { code, status } = resCode;
      if (status) {
        setForm({ ...form, id: code });
      }
    }
  }, [resCode, setForm]);

  const handleSubmitAdd = async () => {
    if (handleCheck()) {
      try {
        form.status = 1;
        const token = sessionStorage.getItem("token");
        const res = await axios.post(
          `${
            typeof window === "undefined"
              ? process.env.API_URL_SSR
              : process.env.API_URL
          }/api/member`,
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
        router.push("/member");
      } catch (error) {
        resetForm();
        setNotification({
          show: true,
          type: "Danger",
          message: error.message,
        });
        router.push("/member");
      }
    }
  };

  return (
    <Layout>
      <div className="space-y-5 p-2">
        <Label label="Add Member" type="title" />
        <div className="gap-2">
          <Label label="RFID">
            <div className="flex space-x-4">
              <InputFields
                type="text"
                style="w-full"
                placeholder="RFID"
                title="RFID"
                value={form.rfid}
                setValue={(e) => setForm({ ...form, rfid: e.target.value })}
              />
              <Button action="info" handleClick={handleRefreshClick}>
                Clear
              </Button>
            </div>
          </Label>
          <Label label="Name">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Name"
              title="Name"
              value={form.name}
              setValue={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Label>
          <Label label="Class">
            <Selects
              value={form.class}
              list={pilihan_status}
              placeholder="Pilih Class"
              handleChange={(item) => setForm({ ...form, class: item.value })}
            />
          </Label>
          <div className="grid grid-cols-4 gap-4">
          <Label label="NIS">
            <InputFields
              type="number"
              style="w-full"
              placeholder="NIS"
              title="NIS"
              value={form.nis}
              setValue={(e) => setForm({ ...form, nis: e.target.value })}
            />
          </Label>
          <Label label="Email">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Email"
              title="email"
              value={form.email}
              setValue={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Label>
          <Label label="Phone">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Phone"
              title="Phone"
              value={form.notes}
              setValue={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </Label>
          <Label label="Gender">
            <Selects
              list={gender}
              placeholder="Pilih Gender"
              handleChange={(item) => setForm({ ...form, gender: item.value })}
            />
          </Label>
          </div>
          <div className="grid grid-cols-2 gap-4">
          <Label label="Place of Birth">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Place of Birth"
              title="Place of Birth"
              value={form.place_of_birth}
              setValue={(e) =>
                setForm({ ...form, place_of_birth: e.target.value })
              }
            />
          </Label>
          <Label label="Date of Birth">
            <InputFields
              type="date"
              style="w-full"
              placeholder="Date of Birth"
              title="Date of Birth"
              value={form.date_of_birth}
              setValue={(e) =>
                setForm({ ...form, date_of_birth: e.target.value })
              }
            />
          </Label>
          </div>
          <Label label="Address">
            <TextArea
              type="text"
              style="w-full"
              placeholder="Address"
              title="Address"
              value={form.address}
              setValue={(e) => setForm({ ...form, address: e.target.value })}
            />
          </Label>
          {/* <Label label="Photo">
            <ImageUploader
              type="file"
              style="w-full"
              placeholder="Photo"
              title="Photo"
              onChildValueChange={(imageList) =>
                  {
                    setForm({ ...form, file: imageList })
                  }
              }
            />
          </Label> */}
        </div>
        <div className="flex flex-row justify-end gap-4">
          <Button action="light" link="/member" handleClick={resetForm}>
            Cancel
          </Button>
          <Button action="primary" handleClick={handleSubmitAdd}>
            Save
          </Button>
        </div>
      </div>
    </Layout>
  );
}
