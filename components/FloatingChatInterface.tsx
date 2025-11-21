import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { MessageHistory } from "./AvatarSession/MessageHistory";
import { useMessageHistory, MessageSender, useInterrupt } from "./logic";
import { useTextChat } from "./logic/useTextChat";
import { StreamingAvatarSessionState } from "./logic";
import { useStreamingAvatarSession } from "./logic/useStreamingAvatarSession";
import clsx from "clsx";
import Image from "next/image";
import { useRouter } from "next/navigation";

import styles from "./UI/CommonUI/CommonUI.module.css";
import { useAuthContext } from "./Prividers/AuthProvider";
import { AVATARS } from "@/app/lib/constants";
import { useThemeIcons } from "./logic/useThemeIcon";
import { useSelectedAvatarLanguage } from "./logic/useSelectedAvatarLanguage";

// AI Assistant profiles
const AI_ASSISTANTS = [
  {
    id: "Katya_Black_Suit_public",
    name: "Katya",
    role: "Recepitionist",
    description:
      "Hi, I’m Katya, your virtual receptionist here to assist you with general inquiries and assistance.",
    avatar: "/Svg/katyaIcon.svg",
    specialties: ["Admissions", "Program Information", "Application Process"],
    color: "#1B84FF",
  },
  {
    id: "Thaddeus_Black_Suit_public",
    name: "Thaddeus",
    role: "Career Advisor",
    description:
      "Hi, I’m Thaeddus, your virtual assistant here to help you with all your admission-related queries.",
    avatar: "/Svg/thaddeusIcon.svg",
    specialties: ["Career Planning", "Resume Building", "Job Search"],
    color: "#4CAF50",
  },
  {
    id: "Amina_Black_Suit_public",
    name: "Amina",
    role: "Representative",
    description:
      "Hi, I’m Amina, your virtual assistant and dedicated guide for all things admissions.",
    avatar: "/Svg/aminaIcon.svg",
    specialties: ["Financial Aid", "Scholarships", "Payment Plans"],
    color: "#FF9800",
  },
];

const AI_ASSISTANTS_SPANISH = [
  {
    id: "Marianne_Black_Suit_public",
    name: "Marianne",
    role: "Recepcionista",
    description:
      "Hola, soy Mariaane, tu recepcionista virtual. Estoy aquí para ayudarte con tus preguntas y brindarte el apoyo que necesitas.",
    avatar: "/Svg/marianneIcon.svg",
    specialties: ["Admissions", "Program Information", "Application Process"],
    color: "#1B84FF",
  },
  {
    id: "Alessandra_Black_Suit_public",
    name: "Alessandra",
    role: "Asesora Académica",
    description:
      "Hola, soy Alessandra, tu asesora virtual. Estoy aquí para guiarte en tu recorrido académico y responder cualquier pregunta que tengas durante el proceso.",
    avatar: "/Svg/alessandraIcon.svg",
    specialties: ["Career Planning", "Resume Building", "Job Search"],
    color: "#4CAF50",
  },
  {
    id: "Pedro_Black_Suit_public",
    name: "Pedro",
    role: "Representante",
    description:
      "Hola, soy Pedro, tu asistente virtual aquí para guiarte a través del proceso de admisión y responder tus preguntas.",
    avatar: "/Svg/pedroIcon.svg",
    specialties: ["Financial Aid", "Scholarships", "Payment Plans"],
    color: "#FF9800",
  },
];

const AI_ASSISTANTS_BILINGUAL_ENGLISH = [
  {
    id: "Katya_Black_Suit_public",
    name: "Katya",
    role: "Receptionist",
    description:
      "Hi, I’m Katya, your virtual receptionist here to assist you with general inquiries and assistance.",
    avatar: "/Svg/katyaIcon.svg",
    specialties: ["Admissions", "Program Information", "Application Process"],
    color: "#1B84FF",
  },
  {
    id: "Marianne_Black_Suit_public",
    name: "Marianne",
    role: "Representative",
    description:
      "Hi, I’m Marianne, your virtual assistant here to guide you through the admissions process and answer your questions.",
    avatar: "/Svg/marianneIcon.svg",
    specialties: ["Financial Aid", "Scholarships", "Payment Plans"],
    color: "#FF9800",
  },
];

const AI_ASSISTANTS_BILINGUAL_SPANSIH = [
  {
    id: "Katya_Black_Suit_public",
    name: "Katya",
    role: "Recepcionista",
    description:
      "Hola, soy Katya, tu recepcionista virtual aquí para ayudarte con consultas generales y asistencia.",
    avatar: "/Svg/katyaIcon.svg",
    specialties: [
      "Admisiones",
      "Información de programas",
      "Proceso de aplicación",
    ],
    color: "#1B84FF",
  },
  {
    id: "Marianne_Black_Suit_public",
    name: "Marianne",
    role: "Representante",
    description:
      "Hola, soy Marianne, tu asistente virtual aquí para guiarte a través del proceso de admisión y responder tus preguntas.",
    avatar: "/Svg/marianneIcon.svg",
    specialties: ["Ayuda financiera", "Becas", "Planes de pago"],
    color: "#FF9800",
  },
];

interface FloatingChatInterfaceProps {
  sessionState: StreamingAvatarSessionState;
  page: number;
  currentAvatarId: string;
}

export const FloatingChatInterface: React.FC<FloatingChatInterfaceProps> = ({
  sessionState,
  page,
  currentAvatarId,
}) => {
  const auth = useAuthContext();
  const { selectedLanguage } = useSelectedAvatarLanguage();
  const aiAssistants =
    auth?.user?.username === "john.keating@papyrrus.com" &&
    selectedLanguage === "en"
      ? AI_ASSISTANTS_BILINGUAL_ENGLISH
      : auth?.user?.username === "john.keating@papyrrus.com" &&
          selectedLanguage === "es"
        ? AI_ASSISTANTS_BILINGUAL_SPANSIH
        : auth?.user?.username?.toLowerCase() === "jason.padilla@papyrrus.com"
          ? AI_ASSISTANTS_SPANISH
          : AI_ASSISTANTS;

  const [isExpanded, setIsExpanded] = useState(false);
  const [showAssistantSelection, setShowAssistantSelection] = useState(true);
  const [selectedAssistant, setSelectedAssistant] = useState<
    (typeof AI_ASSISTANTS)[0] | null
  >(null);
  const [message, setMessage] = useState("");
  const { sendMessage } = useTextChat();
  const { messages } = useMessageHistory();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [animatedMessageIds] = useState(new Set<string>());

  const { stopAvatar } = useStreamingAvatarSession();
  const { interrupt } = useInterrupt();
  const router = useRouter();
  const { chatCloseIcon, chatOpenIcon, exportIcon, whiteLogoIcon } =
    useThemeIcons();

  // Auto-scroll using MutationObserver to detect DOM changes
  // This handles all scrolling scenarios:
  // - New messages added
  // - Message content updates (streaming)
  // - Dynamic content changes
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // MutationObserver watches for any DOM changes and scrolls accordingly
    const observer = new MutationObserver(() => {
      container.scrollTop = container.scrollHeight;
    });

    observer.observe(container, {
      childList: true, // Watch for added/removed nodes
      subtree: true, // Watch all descendants
      characterData: true, // Watch for text content changes
    });

    return () => observer.disconnect();
  }, []);

  const handleSendMessage = () => {
    if (
      message.trim() &&
      sessionState === StreamingAvatarSessionState.CONNECTED
    ) {
      sendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsExpanded(!isExpanded);
    // Reset to assistant selection when opening
    if (!isExpanded) {
      setShowAssistantSelection(true);
      setSelectedAssistant(null);
    }
  };

  const handleAssistantSelect = async (
    assistant: (typeof AI_ASSISTANTS)[0]
  ) => {
    try {
      // Gracefully stop the current avatar session
      console.log("🔄 Switching avatar, stopping current session...");

      // Only stop if session is active
      if (sessionState !== StreamingAvatarSessionState.INACTIVE) {
        interrupt();
        // Wait a bit for interrupt to take effect
        await new Promise((resolve) => setTimeout(resolve, 300));

        try {
          await stopAvatar();
          console.log("✅ Avatar session stopped successfully");
        } catch (stopError) {
          console.error("⚠️ Error stopping avatar:", stopError);
          // Continue with navigation even if stop fails
        }

        // Wait a bit for cleanup to complete
        await new Promise((resolve) => setTimeout(resolve, 500));
      } else {
        console.log("ℹ️ Session already inactive, proceeding with navigation");
      }

      if (auth?.user?.username?.toLowerCase() === "john.keating@papyrrus.com") {
        if (assistant.id === AVATARS[0].avatar_id) {
          console.log("🔄 Switching avatar, navigating to home...");
          router.push("/");
          return;
        } else if (assistant.id === AVATARS[3].avatar_id) {
          router.push("/resume-builder");
          return;
        }
      }

      // Navigate to the appropriate page
      if (
        assistant.id === AVATARS[0].avatar_id ||
        assistant.id === AVATARS[3].avatar_id
      ) {
        router.push("/");
      } else if (
        assistant.id === AVATARS[1].avatar_id ||
        assistant.id === AVATARS[4].avatar_id
      ) {
        router.push("/resume-builder");
      } else {
        router.push("/course-admission");
      }
    } catch (error) {
      console.error("Error during assistant switch:", error);
      // Still navigate even if cleanup fails
      if (
        assistant.id === AVATARS[0].avatar_id ||
        assistant.id === AVATARS[3].avatar_id
      ) {
        router.push("/");
      } else if (
        assistant.id === AVATARS[1].avatar_id ||
        assistant.id === AVATARS[4].avatar_id
      ) {
        router.push("/resume-builder");
      } else {
        router.push("/course-admission");
      }
    }

    // setSelectedAssistant(assistant);
    // setShowAssistantSelection(false);
  };

  const handleBackToSelection = () => {
    setShowAssistantSelection(true);
    setSelectedAssistant(null);
  };

  if (!isExpanded) {
    // Floating button when collapsed
    return (
      <div
        className="fixed"
        style={{
          bottom: "2rem",
          right: "2rem",
          zIndex: 1000,
        }}
      >
        <Image
          src={chatCloseIcon}
          alt="Chatclose"
          width={91}
          height={82}
          className="cursor-pointer"
          style={{
            display: "block",
            margin: "0 auto",
          }}
          onClick={toggleChat}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
        {/* {messages.length > 0 && (
          <div
            className="absolute"
            style={{
              top: "-5px",
              right: "-5px",
              backgroundColor: "#1B84FF",
              color: "white",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            {messages.length > 9 ? "9+" : messages.length}
          </div>
        )} */}

        {/* <Button
          onClick={toggleChat}
          className="p-button-rounded p-button-lg"
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: "#515151",
            border: "none",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            transition: "all 0.3s ease",
            animation: "bounceIn 0.6s ease-out",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.backgroundColor = "#1B84FF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.backgroundColor = "#515151";
          }}
        >
          <i
            className="pi pi-comments"
            style={{ fontSize: "1.5rem", color: "white" }}
          />
          {messages.length > 0 && (
            <div
              className="absolute"
              style={{
                top: "-5px",
                right: "-5px",
                backgroundColor: "#1B84FF",
                color: "white",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                fontSize: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              {messages.length > 9 ? "9+" : messages.length}
            </div>
          )}
        </Button> */}
      </div>
    );
  }

  function OverlappingImages({ isSpanish }: { isSpanish: boolean }) {
    const emglishImages = [
      "/Svg/katyaIcon.svg",
      "/Svg/thaddeusIcon.svg",
      "/Svg/aminaIcon.svg",
    ];

    const spanishImages = [
      "/Svg/marianneIcon.svg",
      "/Svg/alessandraIcon.svg",
      "/Svg/pedroIcon.svg",
    ];

    const images = isSpanish ? spanishImages : emglishImages;

    return (
      <div className={styles.container}>
        <div className={styles.images}>
          {images.map((src, index) => (
            <div key={index} className={styles.circle}>
              <Image src={src} alt={`User ${index}`} width={48} height={48} />
            </div>
          ))}
        </div>
        {/* <div className={styles.dots}>
          <span></span>
          <span></span>
          <span></span>
        </div> */}
      </div>
    );
  }

  // Expanded chat interface
  return (
    <div>
      <div
        className="fixed"
        style={{
          bottom: "7.5rem",
          right: "7rem",
          width: "30.313rem",
          height: "25.875rem",
          backgroundColor: "#fff",
          border: "1px solid #5151511a",
          borderRadius: "1.875rem",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "slideInUp 0.3s ease-out",
        }}
      >
        {/* Header */}
        <div
          className="flex align-items-center justify-content-between"
          style={{
            padding: "1.719rem 2.25rem 1.156rem 1.813rem",
            borderBottom: "1px solid #5151511a",
            // backgroundColor: "var(--text-primary-color)",
            backgroundColor: "#0d151c",
          }}
        >
          <div className="flex align-items-center" style={{ gap: "0.5rem" }}>
            {/* {!showAssistantSelection && selectedAssistant && (
              <Button
                onClick={handleBackToSelection}
                className="p-button-text p-button-sm"
                style={{
                  color: "#515151",
                  padding: "0.25rem",
                  minWidth: "auto",
                  width: "2rem",
                  height: "2rem",
                  marginRight: "0.5rem",
                }}
              >
                <i className="pi pi-arrow-left" />
              </Button>
            )} */}
            <Image
              src={whiteLogoIcon}
              alt="Chat"
              width={142}
              height={35}
              style={{ display: "block", margin: "0 auto" }}
            />
            {/* <i
              className={
                showAssistantSelection ? "pi pi-users" : "pi pi-comments"
              }
              style={{ color: "#fff", fontSize: "1.2rem" }}
            /> */}
            <h3
              style={{
                color: "var(--text-primary-color)",
                margin: 0,
                fontSize: "1.1rem",
                fontWeight: "600",
              }}
            >
              {/* {showAssistantSelection
                ? "Which Agent would you like to speak with?"
                : selectedAssistant?.name || "Chat Assistant"} */}
            </h3>
            <OverlappingImages
              isSpanish={auth?.user?.username === "jason.padilla@papyrrus.com"}
            />
          </div>
          <div className="flex align-items-center" style={{ gap: "0.5rem" }}>
            {/* Status indicator */}
            {/* {!showAssistantSelection && (
              <div
                className="w-2 h-2 border-round-full"
                style={{
                  backgroundColor:
                    sessionState === StreamingAvatarSessionState.CONNECTED
                      ? "#4caf50"
                      : sessionState === StreamingAvatarSessionState.INACTIVE
                      ? "#bdbdbd"
                      : "#ff9800",
                }}
              />
            )} */}

            <i
              onClick={toggleChat}
              className="pi pi-times cursor-pointer"
              style={{
                color: "#fff",
                fontSize: "1rem",
                fontWeight: 500,
                WebkitTextStroke: "2px #fff",
              }}
            />
          </div>
        </div>

        {/* Content Area */}
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto"
          style={{
            // padding: showAssistantSelection ? "0" : "1rem",
            // backgroundColor: "#fff",
            backgroundColor: "#0d151c",
          }}
        >
          {showAssistantSelection ? (
            // Assistant Selection UI
            <div>
              <div
                style={{
                  fontWeight: "400",
                  fontSize: "1rem",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#5151510D",
                  paddingTop: "1.375rem",
                  paddingBottom: "1rem",
                  width: "100%",
                }}
              >
                {"Do you have a preferred agent you'd like to speak with?"}
              </div>
              <div>
                {aiAssistants.map((assistant, index) => {
                  const isActive = assistant.id === currentAvatarId;
                  return (
                    <div
                      key={assistant.id}
                      onClick={() => {
                        if (!isActive) {
                          handleAssistantSelect(assistant);
                        }
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        height: "6rem",
                        padding: "1.719rem 2rem 1.156rem 1.813rem",
                        backgroundColor: isActive ? "#5151511A" : "transparent",
                        borderBottom:
                          index === AI_ASSISTANTS.length - 1
                            ? "none"
                            : "1px solid #5151511a",
                        cursor: isActive ? "not-allowed" : "pointer",
                        transition: "all 0.2s ease",
                        animation: `fadeIn 0.3s ease-in-out ${index * 0.1}s both`,
                        opacity: isActive ? 0.5 : 1,
                        pointerEvents: isActive ? "none" : "auto",
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = "#5151511A";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(0, 0, 0, 0.1)";
                          const paragraph = e.currentTarget.querySelector("p");
                          if (paragraph) {
                            paragraph.style.color = "var(--text-primary-color)";
                          }
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = "transparent";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                          const paragraph = e.currentTarget.querySelector("p");
                          if (paragraph) {
                            paragraph.style.color =
                              "var(--text-secondary-color)";
                          }
                        }
                      }}
                    >
                      {/* <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      backgroundColor: assistant.color + "20",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "1rem",
                      border: `2px solid ${assistant.color}`,
                    }}
                  > */}
                      <div style={{ position: "relative" }}>
                        <Image
                          src={assistant.avatar}
                          alt={assistant.name}
                          width={30}
                          height={30}
                          style={{
                            borderRadius: "50%",
                            width: "3.875rem",
                            height: "3.875rem",
                            marginRight: "1rem",
                          }}
                        />
                        {isActive && (
                          <div
                            style={{
                              position: "absolute",
                              bottom: "0.5rem",
                              right: "1rem",
                              width: "0.75rem",
                              height: "0.75rem",
                              backgroundColor: "#08B72E",
                              borderRadius: "50%",
                              border: "2px solid #0d151c",
                            }}
                          />
                        )}
                      </div>
                      {/* </div> */}
                      <div style={{ flex: 1, marginRight: "1.5rem" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "0.25rem",
                          }}
                        >
                          <h4
                            style={{
                              margin: 0,
                              color: "var(--text-primary-color)",
                              fontSize: "1rem",
                              fontWeight: "700",
                              fontStyle: "bold",
                            }}
                          >
                            {assistant.name}
                          </h4>
                          {isActive && (
                            <span
                              style={{
                                backgroundColor: "#08B72E",
                                color: "white",
                                padding: "0.125rem 0.5rem",
                                borderRadius: "12px",
                                fontSize: "0.75rem",
                                fontWeight: "500",
                              }}
                            >
                              Active
                            </span>
                          )}
                          <span
                            style={{
                              color: "#1B84FF",
                              fontSize: "0.875rem",
                              fontWeight: "400",
                              fontStyle: "regular",
                            }}
                          >
                            {assistant.role}
                          </span>
                        </div>
                        <p
                          style={{
                            margin: "0 0 0.5rem 0",
                            color: "#fff",
                            fontSize: "0.875rem",
                            lineHeight: "1.4",
                            fontWeight: "400",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "normal",
                          }}
                        >
                          {assistant.description}
                        </p>
                        {/* <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.25rem",
                      }}
                    >
                      {assistant.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          style={{
                            backgroundColor: "#f0f0f0",
                            color: "#515151",
                            padding: "0.125rem 0.375rem",
                            borderRadius: "8px",
                            fontSize: "0.75rem",
                          }}
                        >
                          {specialty}
                        </span>
                      ))}
                    </div> */}
                      </div>
                      {/* <i
                      className="pi pi-chevron-right"
                      style={{ color: "#bdbdbd", fontSize: "1rem" }}
                    /> */}
                      <Image src={exportIcon} alt="arrowRight" />
                    </div>
                  );
                })}

                {/* <div
                  onClick={() => handleAssistantSelect(AI_ASSISTANTS[0])}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "1rem",
                    backgroundColor: "#fff",
                    border: "1px solid #5151511a",
                    borderRadius: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    animation: "fadeIn 0.3s ease-in-out 0.3s both",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f8f9fa";
                    e.currentTarget.style.borderColor = "#515151";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "#fff";
                    e.currentTarget.style.borderColor = "#5151511a";
                  }}
                >
                  <i
                    className="pi pi-question-circle"
                    style={{
                      color: "#bdbdbd",
                      fontSize: "1.5rem",
                      marginRight: "0.5rem",
                    }}
                  />
                  <span style={{ color: "#515151", fontSize: "0.9rem" }}>
                    I'm not sure
                  </span>
                  <i
                    className="pi pi-chevron-right"
                    style={{
                      color: "#bdbdbd",
                      fontSize: "1rem",
                      marginLeft: "auto",
                    }}
                  />
                </div> */}
              </div>
            </div>
          ) : (
            // Chat Messages UI
            <>
              {sessionState !== StreamingAvatarSessionState.CONNECTED ? (
                <div
                  className="flex flex-column align-items-center justify-content-center h-full"
                  style={{ gap: "1rem", color: "var(--text-primary-color)" }}
                >
                  <i
                    className="pi pi-info-circle"
                    style={{ fontSize: "2rem", color: "#bdbdbd" }}
                  />
                  <p style={{ textAlign: "center", margin: 0 }}>
                    {sessionState === StreamingAvatarSessionState.INACTIVE
                      ? "Start a conversation with your avatar to begin chatting"
                      : "Connecting to avatar..."}
                  </p>
                </div>
              ) : messages.length === 0 ? (
                <div
                  className="flex flex-column align-items-center justify-content-center h-full"
                  style={{ gap: "1rem", color: "var(--text-primary-color)" }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      backgroundColor:
                        selectedAssistant?.color + "20" || "#1B84FF20",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "0.5rem",
                      border: `2px solid ${
                        selectedAssistant?.color || "#1B84FF"
                      }`,
                    }}
                  >
                    <Image
                      src={selectedAssistant?.avatar || "/Svg/avatar.svg"}
                      alt={selectedAssistant?.name || "Assistant"}
                      width={40}
                      height={40}
                      style={{ borderRadius: "50%" }}
                    />
                  </div>
                  <h4
                    style={{
                      margin: 0,
                      color: "var(--text-primary-color)",
                      fontSize: "1.1rem",
                      fontWeight: "600",
                    }}
                  >
                    {selectedAssistant?.name}
                  </h4>
                  <p
                    style={{
                      textAlign: "center",
                      margin: 0,
                      color: "var(--text-primary-color)",
                      fontSize: "0.9rem",
                    }}
                  >
                    {selectedAssistant?.description}
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    padding: "1rem",
                  }}
                >
                  {messages.map((msg) => {
                    // Only animate messages that haven't been animated before
                    const shouldAnimate = !animatedMessageIds.has(msg.id);
                    if (shouldAnimate) {
                      animatedMessageIds.add(msg.id);
                    }
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender === MessageSender.CLIENT
                            ? "justify-content-end"
                            : "justify-content-start"
                        }`}
                        style={{
                          animation: shouldAnimate
                            ? `fadeIn 0.3s ease-in-out both`
                            : "none",
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "80%",
                            padding: "0.75rem 1rem",
                            borderRadius: "18px",
                            backgroundColor:
                              msg.sender === MessageSender.CLIENT
                                ? "#5151511A"
                                : selectedAssistant?.color + "1A" ||
                                  "#1B84FF1A",
                            color: "var(--text-primary-color)",
                            fontSize: "0.9rem",
                            lineHeight: "1.4",
                            wordBreak: "break-word",
                          }}
                        >
                          {msg.content}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Input Area - Only show when not in assistant selection */}
        {!showAssistantSelection && (
          <div
            style={{
              padding: "1rem",
              borderTop: "1px solid #5151511a",
              backgroundColor: "#f8f9fa",
              borderRadius: "0 0 20px 20px",
            }}
          >
            <div className="flex" style={{ gap: "0.5rem" }}>
              <InputText
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  sessionState === StreamingAvatarSessionState.CONNECTED
                    ? `Message ${selectedAssistant?.name || "Assistant"}...`
                    : "Connect to avatar first"
                }
                disabled={
                  sessionState !== StreamingAvatarSessionState.CONNECTED
                }
                style={{
                  flex: 1,
                  border: "1px solid #5151511a",
                  borderRadius: "25px",
                  padding: "0.75rem 1rem",
                  fontSize: "0.9rem",
                  backgroundColor: "#fff",
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={
                  !message.trim() ||
                  sessionState !== StreamingAvatarSessionState.CONNECTED
                }
                className="p-button-rounded"
                style={{
                  backgroundColor:
                    message.trim() &&
                    sessionState === StreamingAvatarSessionState.CONNECTED
                      ? selectedAssistant?.color || "var(--text-primary-color)"
                      : "#bdbdbd",
                  border: "none",
                  width: "40px",
                  height: "40px",
                  minWidth: "40px",
                }}
              >
                <i className="pi pi-send" style={{ fontSize: "0.9rem" }} />
              </Button>
            </div>
          </div>
        )}
      </div>
      <div
        className="fixed"
        style={{
          bottom: "2rem",
          right: "2rem",
          zIndex: 1000,
        }}
      >
        <Image
          src={chatOpenIcon}
          alt="ChatOpen"
          width={91}
          height={82}
          style={{
            display: "block",
            margin: "0 auto",
          }}
          onClick={toggleChat}
          className="cursor-pointer"
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        />
      </div>
    </div>
  );
};
