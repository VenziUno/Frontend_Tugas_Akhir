import React, { useEffect, useState } from "react";
import Selects from "@/components/selects";
import Button from "@/components/button";

const HeadAuthorization = ({
  handleCheckAll,
  selectOptions,
  handleChangeRole,
  handleUpdateAuthorization,
}) => {
  return (
    <div className="flex justify-between py-4 px-4">
      <div className="flex gap-4">
        <Selects
          list={selectOptions}
          placeholder={"Master Administrator"}
          size={"w-60"}
          value={{ label: "Master Administrator", value: "RU001" }}
          handleChange={(item) => handleChangeRole(item)}
        />
        <Button handleClick={() => handleUpdateAuthorization()}>Update</Button>
      </div>
      <div className="flex font-semibold text-xl justify-center items-center gap-4">
        <Button handleClick={() => handleCheckAll()}>Tandai Semua</Button>
      </div>
    </div>
  );
};

export default HeadAuthorization;
