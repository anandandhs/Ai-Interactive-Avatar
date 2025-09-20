"use client";

import React, {useState} from "react";
import InteractiveAvatar from "@/components/InteractiveAvatar";

export default function ResumeBuilder() {
  return (
    <>
      <div
        className="flex-1 overflow-hidden"
        style={{
          backgroundColor: "#0d151c",
          padding: "var(--space-6) var(--space-8)",
          height: "calc(100vh - 5rem)", // Account for navbar
          maxHeight: "calc(100vh - 5rem)",
        }}
      >
        <div
          className="w-full h-full flex flex-column overflow-hidden"
          style={{
            backgroundColor: "var(--bg-secondary)",
            height: "100%",
            maxHeight: "100%",
          }}
        >
          <div
            className="w-full max-w-7xl flex flex-column mx-auto h-full overflow-hidden"
            style={{
              height: "100%",
              maxHeight: "100%",
            }}
          >
            <div
              className="w-full h-full overflow-hidden"
              style={{height: "100%", maxHeight: "100%"}}
            >
              <InteractiveAvatar page={2} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
