"use client";

import React from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
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
    {
      name: "Safety Procedure Quiz",
      class: "Introduction to HVAC",
      date: "05/21/25 03:30 PM",
      action: "view",
    },
  ];

  const actionTemplate = () => {
    return (
      <div className="text-center">
        <Image src={Eye} alt="eye" />
      </div>
    );
  };

  const mockColumn = [
    {header: "Assignment Name", field: "name", width: "30%"},
    {header: "Class", field: "class", width: "30%"},
    {header: "Due", field: "date", width: "30%"},
    {header: "Action", field: "action", body: actionTemplate, width: "10%"},
  ];

  const tableHeader = () => {
    return (
      <div className={clsx("flex justify-content-between", style.tableHead)}>
        <h3>Pending Assignments</h3>

        <p className="font-semibold">
          Total Assignment Due: <span className="font-bold">12</span>
        </p>
      </div>
    );
  };

  return (
    <div style={{width: "60%"}}>
      <DataTable
        header={tableHeader()}
        value={mockRow}
        showGridlines
        className="custom-table"
        // style={{width: "60%"}}
      >
        {mockColumn.map((col, index) => (
          <Column
            key={index}
            field={col.field}
            header={col.header}
            body={col.body}
            style={{width: col.width}}
          />
        ))}
      </DataTable>
    </div>
  );
}
