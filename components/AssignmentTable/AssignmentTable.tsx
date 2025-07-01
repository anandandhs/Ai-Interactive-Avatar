"use client";

import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import clsx from "clsx";
import style from "../../styles/commonStyle.module.css";
import Image from "next/image";
import Eye from "../../public/Svg/eye.svg";

export default function AssignmentTable() {
  const mockRow = [
    {
      name: "Safety Procedure Quiz",
      class: "Introduction to HVAC",
      date: "05/21/25 03:30 PM",
      action: "view",
    },
    {
      name: "HVAC Systems Overview",
      class: "Basic Electricity for HVAC",
      date: "05/21/25 03:30 PM",
      action: "view",
    },
  ];

  const actionTemplate = () => {
    return (
      <>
        <Image src={Eye} alt="eye" />
      </>
    );
  };

  const mockColumn = [
    { header: "Assignment Name", field: "name" },
    { header: "Class", field: "class" },
    { header: "Due", field: "date" },
    { header: "Action", field: "action", body: actionTemplate },
  ];

  const tableHeader = () => {
    return (
      <div className={clsx("flex justify-content-between", style.tableHead)}>
        <h3>Pending Assignments</h3>
        <p>
          Total Assignment Due: <strong>12</strong>
        </p>
      </div>
    );
  };

  return (
    <DataTable
      header={tableHeader()}
      value={mockRow}
      showGridlines
      className="custom-table"
      style={{ width: "60%" }}
    >
      {mockColumn.map((col, index) => (
        <Column
          key={index}
          field={col.field}
          header={col.header}
          body={col.body}
        />
      ))}
    </DataTable>
  );
}
