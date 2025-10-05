import React, { useEffect, useRef, useMemo } from "react";

import { useMessageHistory, MessageSender } from "../logic";
import { ReactTyped } from "react-typed";
import { useAuthContext } from "../Prividers/AuthProvider";
import { useSelectedAvatarLanguage } from "../logic/useSelectedAvatarLanguage";

export const MessageHistory: React.FC = () => {
  const { messages } = useMessageHistory();
  const containerRef = useRef<HTMLDivElement>(null);
  const auth = useAuthContext();
  const { selectedLanguage } = useSelectedAvatarLanguage();

  // Calculate synchronized typeSpeed based on avatar speech rate
  const synchronizedTypeSpeed = useMemo(() => {
    // Avatar speech rates: 0.8 for English, 1.2 for Spanish
    const avatarSpeechRate = selectedLanguage === "es" ? 1.2 : 0.8;

    // ReactTyped typeSpeed is in milliseconds between characters, not CPM
    // For real-time caption feel, we need much faster speeds
    // Base speed: lower number = faster typing
    const baseTypeSpeed = selectedLanguage === "es" ? 25 : 35; // milliseconds per character

    // Adjust based on speech rate (inverse relationship for milliseconds)
    const adjustedSpeed = Math.round(baseTypeSpeed / avatarSpeechRate);

    // Ensure reasonable bounds (15-50ms per character)
    const finalSpeed = Math.max(15, Math.min(50, adjustedSpeed));

    // Debug log to help fine-tune the synchronization
    console.log(
      `🎯 Caption sync - Language: ${selectedLanguage}, Speech Rate: ${avatarSpeechRate}, Type Speed: ${finalSpeed}ms per char`
    );

    return finalSpeed;
  }, [selectedLanguage]);

  // Note: The synchronizedTypeSpeed is calculated to match the avatar's speech rate
  // This creates a close caption feel where text appears at roughly the same pace
  // as the avatar speaks, providing better synchronization between lip movements and text

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
          // padding:
          //   "var(--space-6) var(--space-6) var(--space-4) var(--space-6)",
          borderBottom: "1px solid #ffffff4d",
          flexShrink: 0,
        }}
      >
        <h3
          className=" text-2xl font-bold relative z-1  p-4"
          style={{ color: "var(--text-primary-color)" }}
        >
          Conversation History
        </h3>
        <span
          className="text-caption p-4"
          style={{ color: "var(--text-secondary)" }}
        >
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
              style={{ color: "var(--text-primary-color)" }}
            />
            <p
              className="text-body-medium text-center text-light"
              style={{ color: "var(--text-primary-color)" }}
            >
              Your conversation will appear here
            </p>
          </div>
        ) : (
          messages
            .filter(
              (msg) =>
                msg.content !== `Hi, my name is ${auth?.user?.displayName}` &&
                msg.content !== `Hola, me llamo ${auth?.user?.displayName}`
            )
            .map((message, index) => (
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
                    style={{ gap: "var(--space-2)" }}
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
                    className="p-3"
                    style={{
                      backgroundColor:
                        message.sender === MessageSender.CLIENT
                          ? "var(--bg-sender-color)"
                          : "var(--bg-receiver-color)",
                      color:
                        message.sender === MessageSender.CLIENT
                          ? "var(--text-primary-color)"
                          : "var(--text-primary-color)",
                      border:
                        message.sender === MessageSender.CLIENT
                          ? "1px solid #FFFFFF1A"
                          : "1px solid #FFFFFF1A",
                      boxShadow: "var(--shadow-sm)",
                      fontSize: "var(--font-size-base)",
                      lineHeight: "var(--line-height-relaxed)",
                      wordBreak: "break-word",
                      borderRadius: "1.25rem",
                    }}
                  >
                    {message.sender === MessageSender.CLIENT ? (
                      message.content
                    ) : (
                      <ReactTyped
                        strings={[message.content]}
                        typeSpeed={synchronizedTypeSpeed}
                        smartBackspace={false}
                        showCursor={false}
                        fadeOut={false}
                        fadeOutDelay={0}
                        startDelay={0}
                        backSpeed={0}
                        loop={false}
                        cursorChar=""
                      />
                    )}
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
};
