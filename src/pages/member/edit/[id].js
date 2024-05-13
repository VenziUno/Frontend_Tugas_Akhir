import React, { useState, useEffect } from "react";
import Button from "@/components/button";
import Layout from "@/components/layout";
import Label from "@/components/label";
import InputFields from "@/components/inputFields";
import { useAppContext } from "@/hooks/useAppContext";
import { useFetcher } from "@/hooks/useFetcher";
import { useRouter } from "next/router";
import axios from "axios";
import Selects from "@/components/selects";
import ImageUploader from "@/components/imageUploader";
import TextArea from "@/components/textArea";

const EditRole = ({ id }) => {
  const { member, basic } = useAppContext();
  const { form, setForm, resetForm } = member;
  const { notification, setNotification, handleShowNotification } = basic;
  const router = useRouter();
  const [ipConfig, setIpconfig] = useState("");
  const [classValue, setClassValue] = useState();
  const [gender, setGender] = useState();

  const pilihan_classValue = [
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

  const pilihan_gender = [
    { label: "Laki-Laki", value: "L" },
    { label: "Perempuan", value: "P" },
  ];

  const {
    res: resConfigRFID,
    isLoading: isLoadingConfigRFID,
    isError: isErrorConfigRFID,
  } = useFetcher("configrfid");

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
    setForm({ ...form, rfid: "" });
    fetchDataAndUpdate();
  };

  const handleCheck = () => {
    if (form.code === "" || form.name === "" || form.classValue === null) {
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

  const handleSubmitEdit = async () => {
    if (handleCheck()) {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.post(
          `${
            typeof window === "undefined"
              ? process.env.API_URL_SSR
              : process.env.API_URL
          }/api/member/${form.id}`,
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

  const { res, isLoading, isError } = useFetcher(`member/${id}`);

  useEffect(() => {
    if (res !== undefined) {
      setForm({
        id: res.data.id,
        name: res.data.name,
        nis: res.data.nis,
        email: res.data.user.email,
        rfid: res.data.rfid,
        gender: res.data.gender,
        place_of_birth: res.data.place_of_birth,
        date_of_birth: res.data.date_of_birth,
        class: res.data.class,
        address: res.data.address,
        file: res.data.file,
        portal_code: res.data.portal_code,
        notes: res.data.notes,
        status: res.data.status,
      });

      if (res.data.class !== null) {
        setClassValue({ label: res.data.class, value: res.data.class });
      }

      if (res.data.gender === "P") {
        setGender({ label: "Perempuan", value: "P" });
      } else if (res.data.gender === "L") {
        setGender({ label: "Laki-Laki", value: "L" });
      } else setGender(null);
    }
  }, [res, setForm]);

  return (
    <Layout>
      <div className="space-y-5 p-2">
        <Label label="Edit Member" type="title" />
        <div className="gap-2">
          <Label label="RFID">
            <div className="flex space-x-4">
              <InputFields
                type="text"
                style="w-full"
                placeholder="Code"
                title="Code"
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
            {classValue && <Selects
              value={classValue}
              list={pilihan_classValue}
              placeholder="Pilih Status"
              handleChange={(item) => setForm({ ...form, class: item.value })}
              search
            />}
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
              title="Email"
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
            {gender && (
              <Selects
                value={gender}
                list={pilihan_gender}
                placeholder="Pilih Gender"
                handleChange={(item) =>
                  setForm({ ...form, gender: item.value })
                }
              />
            )}
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
          {/* <Label label="Portal Code">
            <InputFields
              type="number"
              style="w-full"
              placeholder="Portal Code"
              title="Portal Code"
              value={form.portal_code}
              setValue={(e) =>
                setForm({ ...form, portal_code: e.target.value })
              }
            />
          </Label> */}
          {/* <Label label="Banner Image">
            <ImageUploader
              value={form.file}
              type="file"
              style="w-full"
              placeholder="Banner Image"
              title="Banner Image"
              onChildValueChange={(imageList) =>
                setForm({ ...form, file: imageList })
              }
            />
          </Label> */}
        </div>
        <div className="flex flex-row justify-end gap-5">
          <Button action="light" link="/member" handleClick={resetForm}>
            Back
          </Button>
          <Button
            action="primary"
            handleClick={(e) => {
              e.preventDefault();
              handleSubmitEdit();
            }}
          >
            Update
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(ctx) {
  let id = ctx.query.id;
  return { props: { id } };
}

export default EditRole;
