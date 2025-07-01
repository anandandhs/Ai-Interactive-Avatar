"use client";

import { BreadCrumb } from "primereact/breadcrumb";

export default function AppBreadCrumb({ items, home }) {
  return (
    <BreadCrumb
      className="border-none breadcrumb-list custom-breadcrumb"
      model={items}
      home={home}
      separatorIcon={<i className="pi pi-angle-right"></i>}
    />
  );
}
