"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SimpleBarChart() {
  const data = [
    { name: "Electrical Systems", blue: 30 },
    { name: "Refrigiration Cycle", blue: 20 },
    { name: "Thermostat Installation", blue: 5 },
  ];
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" />
        <Tooltip />
        <Bar dataKey="blue" fill="#1B84FF" />
        <Bar dataKey="green" fill="#28a745" />
      </BarChart>
    </ResponsiveContainer>
  );
}
