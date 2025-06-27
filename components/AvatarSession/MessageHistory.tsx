import React, {useEffect, useRef} from "react";

import {useMessageHistory, MessageSender} from "../logic";

export const MessageHistory: React.FC = () => {
  const {messages} = useMessageHistory();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container || messages.length === 0) return;

    container.scrollTop = container.scrollHeight;
  }, [messages]);

  return (
    <div
      className="w-full h-full flex flex-column"
      style={{
        backgroundColor: "transparent",
      }}
    >
      <div
        className="flex align-items-center justify-content-between"
        style={{
          padding:
            "var(--space-6) var(--space-6) var(--space-4) var(--space-6)",
          borderBottom: "1px solid var(--border-light)",
          flexShrink: 0,
        }}
      >
        <h3 className="text-white text-2xl font-bold relative z-1  pb-2">
          Conversation History
        </h3>
        <span className="text-caption" style={{color: "var(--text-secondary)"}}>
          {messages.length} {messages.length === 1 ? "message" : "messages"}
        </span>
      </div>

      <div
        ref={containerRef}
        className="overflow-y-auto flex flex-column flex-1"
        style={{
          color: "var(--text-primary)",
          padding: "var(--space-6)",
          gap: "var(--space-4)",
          minHeight: "0", // Allow flex shrinking
        }}
      >
        {messages.length === 0 ? (
          <div
            className="flex flex-column align-items-center justify-content-center"
            style={{
              padding: "var(--space-8)",
              gap: "var(--space-3)",
            }}
          >
            <i
              className="pi pi-comments text-4xl"
              style={{color: "var(--gray-400)"}}
            />
            <p className="text-body-medium text-center text-white text-light">
              Your conversation will appear here
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === MessageSender.CLIENT
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
              style={{
                animation: `fadeIn 0.3s ease-in-out ${index * 0.1}s both`,
              }}
            >
              <div
                className={`flex flex-column ${
                  message.sender === MessageSender.CLIENT
                    ? "align-items-end"
                    : "align-items-start"
                }`}
                style={{
                  maxWidth: "70%",
                  gap: "var(--space-1)",
                }}
              >
                <div
                  className="flex align-items-center"
                  style={{gap: "var(--space-2)"}}
                >
                  <div
                    className="w-2 h-2 border-round-full"
                    style={{
                      backgroundColor:
                        message.sender === MessageSender.CLIENT
                          ? "var(--primary-color)"
                          : "var(--success-color)",
                    }}
                  />
                  <span
                    className="text-caption font-medium"
                    style={{
                      color: "#fff",
                      fontWeight: "300",
                    }}
                  >
                    {message.sender === MessageSender.AVATAR
                      ? "AI Avatar"
                      : "You"}
                  </span>
                </div>

                <div
                  className="p-3 border-round-lg"
                  style={{
                    backgroundColor:
                      message.sender === MessageSender.CLIENT
                        ? "#182427"
                        : "#3b3a32",
                    color:
                      message.sender === MessageSender.CLIENT ? "#fff" : "#fff",
                    border:
                      message.sender === MessageSender.CLIENT
                        ? "1px solid #FFFFFF1A"
                        : "1px solid #FFFFFF1A",
                    boxShadow: "var(--shadow-sm)",
                    fontSize: "var(--font-size-base)",
                    lineHeight: "var(--line-height-relaxed)",
                    wordBreak: "break-word",
                  }}
                >
                  {message.content}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
