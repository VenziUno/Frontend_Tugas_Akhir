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

const EditStatus = ({ ids }) => {
  const { role, basic } = useAppContext();
  const {
    form,
    setForm,
    resetForm,
    notification,
    setNotification,
    handleShowNotification,
  } = basic;
  const router = useRouter();
  const [status, setStatus] = useState();
  const [selectItemStatus, setSelectItemStatus] = useState([]);
  const [ItemStatus, setItemStatus] = useState(null);

  const { res: resItemStatus } = useFetcher(`itemstatus`);
  useEffect(() => {
    if (resItemStatus) {
      const data = resItemStatus.data.map((data) => ({
        label: data.name,
        value: data.id,
      }));
      setSelectItemStatus(data);
    }
  }, [resItemStatus]);

  const handleCheck = () => {
    if (form.isbn_issn === "" || form.item_statuses_id === "") {
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
          }/api/bookdetailstatus/${form.id}`,
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
  const { res, isLoading, isError } = useFetcher(
    `bookdetailstatus/show/${ids}`
  );
  useEffect(() => {
    if (res !== undefined) {
      setForm({
        id: res.data.id,
        isbn_issn: res.data.isbn_issn,
        item_statuses_id: res.data.item_statuses_id,
      });
      setItemStatus({
        value: res.data.item_status.id,
        label: res.data.item_status.name,
      });
    }
  }, [res, setForm]);

  return (
    <Layout>
      <div className="space-y-5 p-2">
        <Label label="Edit Book Detail" type="title" />
        <div className="">
          <Label label="Name">
            <InputFields
              type="text"
              style="w-full"
              placeholder="Name"
              title="Name"
              value={form.isbn_issn}
              disabled
            />
          </Label>
          <Label label="Status">
            {ItemStatus && (
              <Selects
                list={selectItemStatus}
                value={ItemStatus}
                placeholder="Pilih Status"
                handleChange={(item) =>
                  setForm({ ...form, item_statuses_id: item.value })
                }
              />
            )}
          </Label>
        </div>
        <div className="flex flex-row justify-end gap-5">
          <Button action="light" link={`/bookDetail/detail/${router.query.id}/detailStatus`} handleClick={resetForm}>
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
  let ids = ctx.query.ids;
  return { props: { ids } };
}

export default EditStatus;
