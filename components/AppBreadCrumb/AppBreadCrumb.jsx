"use client";

import { BreadCrumb } from "primereact/breadcrumb";

export default function AppBreadCrumb({ items, home }) {
  return (
    <BreadCrumb
      className="border-none breadcrumb-list"
      model={items}
      home={home}
    />
  );
}
