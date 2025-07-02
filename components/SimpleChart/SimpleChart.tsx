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
  const rawData = [
    {name: "Electrical Systems", blue: 30},
    {name: "Refrigiration Cycle", blue: 20},
    {name: "Thermostat Installation", blue: 5},
  ];

  const data = rawData.map((item) => ({
    name: item.name,
    part1: item.blue * 0.5, // gray part
    part2: item.blue * 0.5, // blue part
  }));

  return (
    <ResponsiveContainer width="100%" height={300} className="p-3">
      <BarChart
        data={data}
        layout="vertical"
        margin={{top: 20, right: 30, left: 40, bottom: 5}}
      >
        <defs>
          <linearGradient id="gradient1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#515151" />
            <stop offset="100%" stopColor="#515151" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis
          dataKey="name"
          type="category"
          tick={{fill: "#252B41E5", fontSize: 14, fontWeight: 400}}
        />
        <Tooltip />
        <Bar dataKey="part1" stackId="a" fill="url(#gradient1)" barSize={20} />
        <Bar dataKey="part2" stackId="a" fill="#1B84FF" barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  );
}
