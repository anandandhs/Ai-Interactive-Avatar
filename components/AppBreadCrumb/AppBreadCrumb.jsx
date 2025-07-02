"use client";

import { BreadCrumb } from "primereact/breadcrumb";
import { useEffect, useState } from "react";

export default function AppBreadCrumb({ items, home }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  return (
    <BreadCrumb
      className="border-none breadcrumb-list custom-breadcrumb"
      model={items}
      home={home}
      separatorIcon={<i className="pi pi-angle-right"></i>}
    />
  );
}
