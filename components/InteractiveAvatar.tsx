import {
  AvatarQuality,
  StreamingEvents,
  VoiceChatTransport,
  VoiceEmotion,
  StartAvatarRequest,
  STTProvider,
  ElevenLabsModel,
} from "@heygen/streaming-avatar";
import { useEffect, useRef, useState } from "react";
import { useMemoizedFn, useUnmount } from "ahooks";
import { useRouter } from "next/navigation";
import { Toast } from "primereact/toast";

import { AvatarVideo } from "./AvatarSession/AvatarVideo";
import { useStreamingAvatarSession } from "./logic/useStreamingAvatarSession";
import { AvatarControls } from "./AvatarSession/AvatarControls";
import { useVoiceChat } from "./logic/useVoiceChat";
import {
  StreamingAvatarProvider,
  StreamingAvatarSessionState,
  useInterrupt,
} from "./logic";
import { LoadingIcon } from "./Icons";
import { MessageHistory } from "./AvatarSession/MessageHistory";
import Avatar from "../public/Svg/home_avatar.svg";
import BackgroundImage from "../public/Svg/background_image.svg";
import Mic from "../public/Svg/mic.svg";
import Speaker from "../public/Svg/speaker.svg";
import style from "../styles/commonStyle.module.css";
import { useMessageHistory } from "../components/logic/index";
import { FloatingChatInterface } from "./FloatingChatInterface";

import { AVATARS, STT_LANGUAGE_LIST } from "@/app/lib/constants";
import Image from "next/image";
import clsx from "clsx";
import { InputText } from "primereact/inputtext";
import SendIcon from "../public/Svg/send.svg";
import AppButton from "./UI/CommonUI/AppButton";
import { useAuthContext } from "./Prividers/AuthProvider";
import {
  getKnowlededgeBase,
  getRequiredAvatar,
} from "@/app/lib/genericFunctions";

const DEFAULT_CONFIG: StartAvatarRequest = {
  quality: AvatarQuality.Low,
  avatarName: AVATARS[0].avatar_id,
  knowledgeId: undefined,
  voice: {
    rate: 1.5,
    emotion: VoiceEmotion.EXCITED,
    model: ElevenLabsModel.eleven_flash_v2_5,
  },
  language: "en",
  voiceChatTransport: VoiceChatTransport.WEBSOCKET,
  sttSettings: {
    provider: STTProvider.DEEPGRAM,
  },
};

function InteractiveAvatar({ page }: { page: number }) {
  const { initAvatar, startAvatar, stopAvatar, sessionState, stream } =
    useStreamingAvatarSession();
  const { interrupt } = useInterrupt();
  const { startVoiceChat } = useVoiceChat();
  const auth = useAuthContext();
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const currentAvatarMessage = useRef<string>("");
  const currentUserMessage = useRef<string>("");
  const userRequestedNavigation = useRef<string | null>(null);
  const isAvatarTalking = useRef<boolean>(false);

  const mediaStream = useRef<HTMLVideoElement>(null);

  // Function to check if user requested navigation
  const checkUserNavigationRequest = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    console.log("👤 User said:", lowerCaseMessage);

    // Check if user requested specific navigation based on knowledge base support pathways
    if (
      lowerCaseMessage.includes("resume builder") ||
      lowerCaseMessage.includes("resume") ||
      lowerCaseMessage.includes("career advising") ||
      lowerCaseMessage.includes("career development") ||
      lowerCaseMessage.includes("career advice")
    ) {
      userRequestedNavigation.current = "resume-builder";
      console.log("🎯 User requested: Resume Builder & Career Advising");
    } else if (
      lowerCaseMessage.includes("admission guidance") ||
      lowerCaseMessage.includes("admission") ||
      lowerCaseMessage.includes("academic planning") ||
      lowerCaseMessage.includes("course admission") ||
      lowerCaseMessage.includes("enrollment")
    ) {
      userRequestedNavigation.current = "course-admission";
      console.log("🎯 User requested: Admission Guidance");
    } else if (lowerCaseMessage.includes("dashboard")) {
      userRequestedNavigation.current = "dashboard";
      console.log("🎯 User requested: Dashboard");
    } else {
      userRequestedNavigation.current = null;
      console.log("❌ No navigation request detected in user message");
    }
  };

  // Function to check if avatar confirmed navigation and execute it
  const checkAvatarNavigationConfirmation = (avatarMessage: string) => {
    const lowerCaseMessage = avatarMessage.toLowerCase();
    console.log("🤖 Avatar said:", lowerCaseMessage);
    console.log(
      "🎯 User previously requested:",
      userRequestedNavigation.current
    );

    // Only proceed if user previously requested navigation
    if (!userRequestedNavigation.current) {
      console.log("❌ No pending navigation request from user");
      return;
    }

    // Enhanced confirmation phrases based on knowledge base templates
    const confirmationPhrases = [
      "taking you to",
      "navigating to",
      "redirecting to",
      "going to",
      "heading to",
      "excellent choice",
      "great choice",
      "perfect",
      "sounds good",
      "let's get started",
      "let's begin",
      "i'll help you with",
      "let me guide you",
    ];

    const hasConfirmation = confirmationPhrases.some((phrase) =>
      lowerCaseMessage.includes(phrase)
    );

    // Enhanced service keywords based on knowledge base support pathways
    const serviceKeywords: Record<string, string[]> = {
      "resume-builder": [
        "resume",
        "career",
        "career development",
        "career advising",
        "resume builder",
      ],
      "course-admission": [
        "admission",
        "course",
        "academic planning",
        "admission guidance",
        "enrollment",
      ],
      dashboard: ["dashboard", "home", "main"],
    };

    const requestedService = userRequestedNavigation.current;
    const mentionsService =
      requestedService &&
      serviceKeywords[requestedService]?.some((keyword: string) =>
        lowerCaseMessage.includes(keyword)
      );

    if (hasConfirmation && mentionsService) {
      console.log(
        "✅ Avatar confirmed navigation - waiting for avatar to finish talking..."
      );

      // Wait for avatar to completely finish talking before navigating
      const executeNavigation = () => {
        if (isAvatarTalking.current) {
          console.log("⏳ Avatar still talking, waiting...");
          setTimeout(executeNavigation, 500); // Check again in 500ms
          return;
        }

        console.log(
          "🚀 Avatar finished talking, proceeding with navigation..."
        );

        const routes: Record<string, string> = {
          "resume-builder": "/resume-builder",
          "course-admission": "/course-admission",
          dashboard: "/dashboard",
        };

        const routeName: Record<string, string> = {
          "resume-builder": "Resume Builder & Career Advising",
          "course-admission": "Admission Guidance",
          dashboard: "Dashboard",
        };

        // Show toast notification
        toast.current?.show({
          severity: "success",
          summary: "Navigation Confirmed",
          detail: `Taking you to ${routeName[requestedService]}...`,
          life: 6000,
        });

        // Navigate after avatar completely finishes
        setTimeout(() => {
          interrupt();
          stopAvatar();
          router.push(routes[requestedService]);
          // Reset the navigation request
          userRequestedNavigation.current = null;
        }, 6000);
      };

      // Start checking if avatar finished talking
      executeNavigation();
    } else {
      console.log(
        "❌ Avatar did not confirm navigation or mention the service"
      );
      // Reset navigation request if avatar doesn't confirm
      userRequestedNavigation.current = null;
    }
  };

  const [currentAvatarId, setCurrentAvatarId] = useState<string>(
    AVATARS[0].avatar_id
  );

  useEffect(() => {
    if (auth?.user) {
      const currentAvatarId = getRequiredAvatar(
        auth?.user.username || "",
        auth?.user.username == "jason.padilla@papyrrus.com" ? page + 3 : page
      );
      setCurrentAvatarId(currentAvatarId);

      const predefinedConfig = {
        quality: AvatarQuality.Low,
        avatarName: currentAvatarId,
        voice: {
          rate: 0.8,
          emotion: VoiceEmotion.EXCITED,
          model:
            auth?.user.username == "jason.padilla@papyrrus.com" ||
            auth?.user.username == "percy.veltman@papyrrus.com"
              ? ElevenLabsModel.eleven_multilingual_v2
              : ElevenLabsModel.eleven_flash_v2_5,
          ...(auth?.user.username == "jason.padilla@papyrrus.com" && {
            voiceId:
              currentAvatarId === AVATARS[3].avatar_id
                ? "e85822bd14e144e8b6fe73da2fb1085c"
                : currentAvatarId === AVATARS[4].avatar_id
                ? "a557ea37036844748016d4cee181c322"
                : "72cbcf091d9d48998ce10d7b5c2d569e",
          }),
          ...(auth?.user?.username === "percy.veltman@papyrrus.com" && {
            voiceId: "e85822bd14e144e8b6fe73da2fb1085c",
          }),
          ...(auth?.user?.username === "irwin.spinello@papyrrus.com" && {
            voiceId:
              currentAvatarId === AVATARS[0].avatar_id
                ? "d41b5163f39044129d06aca88d7a8f4f"
                : currentAvatarId === AVATARS[1].avatar_id
                ? "808a781f0c8e43dcb89636df6040143c" //male voice
                : "207e0fdec4e645d287803503706e107d",
          }),
        },
        language:
          auth?.user.username == "jason.padilla@papyrrus.com" ||
          auth?.user.username == "percy.veltman@papyrrus.com"
            ? "es"
            : "en",
        voiceChatTransport: VoiceChatTransport.WEBSOCKET,
        sttSettings: {
          provider: STTProvider.DEEPGRAM,
        },
        activityIdleTimeout: 3600, // comment this after demo
        knowledgeId: "",
        knowledgeBase: getKnowlededgeBase(
          auth.user.username || "",
          page,
          auth.user.displayName || "",
          currentAvatarId
        ),
      };

      console.log("Predefined Config:", predefinedConfig);

      //startSessionV2(true, predefinedConfig);
    }
  }, [auth]);

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      const token = await response.text();

      console.log("Access Token:", token); // Log the token to verify

      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw error;
    }
  }

  const startSessionV2 = useMemoizedFn(
    async (isVoiceChat: boolean, config: StartAvatarRequest) => {
      try {
        const newToken = await fetchAccessToken();
        const avatar = initAvatar(newToken);

        avatar.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
          console.log("🗣️ Avatar started talking", e);
          // Reset the message accumulator when avatar starts a new message
          currentAvatarMessage.current = "";
          isAvatarTalking.current = true;
        });
        avatar.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
          console.log("🤐 Avatar stopped talking", e);
          isAvatarTalking.current = false;
        });
        avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
          console.log("Stream disconnected");
        });
        avatar.on(StreamingEvents.STREAM_READY, (event) => {
          console.log(">>>>> Stream ready:", event.detail);
        });
        avatar.on(StreamingEvents.USER_START, (event) => {
          console.log(">>>>> User started talking:", event);
          // Reset the user message accumulator when user starts a new message
          currentUserMessage.current = "";
        });
        avatar.on(StreamingEvents.USER_STOP, (event) => {
          console.log(">>>>> User stopped talking:", event);
        });
        avatar.on(StreamingEvents.USER_END_MESSAGE, (event) => {
          console.log(">>>>> User end message:", event);

          // Use the accumulated user message content
          const userMessageContent = currentUserMessage.current;
          console.log("User message content:", userMessageContent);

          if (
            userMessageContent &&
            (auth?.user?.username == "jason.padilla@papyrrus.com" ||
              auth?.user?.username == "irwin.spinello@papyrrus.com") &&
            page == 1
          ) {
            checkUserNavigationRequest(userMessageContent);
          }

          // Reset the user message accumulator for the next message
          currentUserMessage.current = "";
        });
        avatar.on(StreamingEvents.USER_TALKING_MESSAGE, (event) => {
          console.log(">>>>> User talking message:", event);

          // Accumulate the user's message content as they speak
          if (event?.detail?.message) {
            currentUserMessage.current += event.detail.message;
          }
        });
        avatar.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (event) => {
          console.log(">>>>> Avatar talking message:", event);

          // Accumulate the avatar's message content as it speaks
          if (event?.detail?.message) {
            currentAvatarMessage.current += event.detail.message;
          }
        });
        avatar.on(StreamingEvents.AVATAR_END_MESSAGE, (event) => {
          console.log(">>>>> Avatar end message event:", event);
          console.log(">>>>> Event detail:", event?.detail);

          // Use the accumulated message content from AVATAR_TALKING_MESSAGE
          const finalMessageContent = currentAvatarMessage.current;
          console.log(
            "Final accumulated message content:",
            finalMessageContent
          );

          if (
            finalMessageContent &&
            (auth?.user?.username == "jason.padilla@papyrrus.com" ||
              auth?.user?.username == "irwin.spinello@papyrrus.com") &&
            page == 1
          ) {
            // Check if avatar confirmed navigation
            checkAvatarNavigationConfirmation(finalMessageContent);
          }

          // Reset the accumulated message for the next avatar response
          currentAvatarMessage.current = "";
        });

        // Create a personalized config with user's display name
        const personalizedConfig = { ...config };

        await startAvatar(personalizedConfig);

        if (isVoiceChat) {
          await startVoiceChat();
        }
      } catch (error) {
        console.error("Error starting avatar session:", error);
      }
    }
  );

  useUnmount(() => {
    interrupt();
    stopAvatar();
  });

  useEffect(() => {
    if (stream && mediaStream.current) {
      clsx;
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
      };
    }
  }, [mediaStream, stream]);

  // Expose test functions to global scope for manual testing
  // useEffect(() => {
  //   (window as any).testUserRequest = (userMessage: string) => {
  //     console.log("🧪 Testing user request:", userMessage);
  //     checkUserNavigationRequest(userMessage);
  //   };

  //   (window as any).testAvatarConfirmation = (avatarMessage: string) => {
  //     console.log("🧪 Testing avatar confirmation:", avatarMessage);
  //     checkAvatarNavigationConfirmation(avatarMessage);
  //   };

  //   (window as any).testFullFlow = (
  //     userMessage: string,
  //     avatarMessage: string
  //   ) => {
  //     console.log("🧪 Testing full navigation flow:");
  //     console.log("1. User says:", userMessage);
  //     checkUserNavigationRequest(userMessage);
  //     console.log("2. Avatar responds:", avatarMessage);
  //     // Simulate avatar not talking for test
  //     isAvatarTalking.current = false;
  //     checkAvatarNavigationConfirmation(avatarMessage);
  //   };

  //   (window as any).checkAvatarTalkingStatus = () => {
  //     console.log("🎤 Avatar talking status:", isAvatarTalking.current);
  //     console.log(
  //       "🎯 Pending navigation request:",
  //       userRequestedNavigation.current
  //     );
  //   };

  //   return () => {
  //     delete (window as any).testUserRequest;
  //     delete (window as any).testAvatarConfirmation;
  //     delete (window as any).testFullFlow;
  //     delete (window as any).checkAvatarTalkingStatus;
  //   };
  // }, []);

  return (
    <div className={style.homeBlur}>
      <Toast ref={toast} />
      {/* {sessionState === StreamingAvatarSessionState.INACTIVE && (
        <div
          className="flex justify-content-center align-items-center absolute z-1 top-0 left-0 bottom-0 right-0"
          style={{backgroundColor: "#fff"}}
        >
          <div className="loader"></div>
        </div>
      )} */}

      <div className={clsx("flex gap-4", style.chatCard)}>
        {/* Left Side - Avatar Video and Controls (60%) */}
        <div
          className={clsx(
            "flex flex-column shadow-none overflow-hidden p-0 surface-card avatar-video-section",
            style.chatRightContainer
          )}
          style={{
            width: "65%",
            backgroundColor: "#fff",
            border: "1px solid #5151511a",
            height: "100%",
            maxHeight: "100%", // Prevent expansion
            minHeight: "0", // Allow shrinking
          }}
        >
          {/* Avatar Display Area */}
          <div
            className="relative overflow-hidden flex flex-column align-items-center justify-content-center"
            style={{
              backgroundColor: "transparent",
              borderRadius: "var(--radius-2xl) var(--radius-2xl) 0 0",
              minHeight: "0", // Allow flex shrinking
              flex: "1 1 0", // Allow growing and shrinking but start from 0
              maxHeight: "calc(100% - 80px)", // Reserve space for controls (80px)
            }}
          >
            {sessionState !== StreamingAvatarSessionState.INACTIVE ? (
              <AvatarVideo ref={mediaStream} page={page} />
            ) : (
              <div
                className="w-full h-full flex align-items-center justify-content-center"
                style={{ color: "#515151" }}
              >
                <div className="loader"></div>
                {/* <>{"Initializing your avatar..."}</> */}
                {/* <AvatarConfig config={config} onConfigChange={setConfig} /> */}
              </div>
            )}

            {/* Status Indicator */}
            <div
              className="absolute top-0 right-0 m-4 flex align-items-center"
              style={{ gap: "var(--space-2)" }}
            >
              <div
                className="w-3 h-3 border-round-full"
                style={{
                  backgroundColor:
                    sessionState === StreamingAvatarSessionState.CONNECTED
                      ? "var(--success-color)"
                      : sessionState === StreamingAvatarSessionState.INACTIVE
                      ? "var(--gray-400)"
                      : "var(--warning-color)",
                  boxShadow: "var(--shadow-sm)",
                }}
              />
              <span
                className="text-caption font-medium"
                style={{
                  color: "var(--text-secondary)",
                  backgroundColor: "var(--bg-primary)",
                  padding: "var(--space-1) var(--space-2)",
                  borderRadius: "var(--radius-md)",
                  boxShadow: "var(--shadow-sm)",
                }}
              >
                {sessionState === StreamingAvatarSessionState.CONNECTED
                  ? "Connected"
                  : sessionState === StreamingAvatarSessionState.INACTIVE
                  ? "Ready"
                  : "Connecting..."}
              </span>
            </div>
          </div>

          {/* Controls Area */}
          <div
            className="flex flex-column align-items-center justify-content-center w-full"
            style={{
              borderTop: "1px solid var(--border-light)",
              backgroundColor: "transparent",
              gap: "var(--space-4)",
              flexShrink: 0, // Prevent controls from shrinking
              minHeight: "80px", // Ensure minimum height for controls
              height: "80px", // Fixed height for controls area
            }}
          >
            {sessionState === StreamingAvatarSessionState.CONNECTED ? (
              <AvatarControls />
            ) : sessionState === StreamingAvatarSessionState.INACTIVE ? (
              <></>
            ) : (
              // <div
              //   className="flex flex-column align-items-center"
              //   style={{ gap: "var(--space-4)" }}
              // >
              //   <h3
              //     className="text-heading-small text-center"
              //     style={{ color: "var(--text-primary)" }}
              //   >
              //     Choose Your Interaction Mode
              //   </h3>
              //   <div
              //     className="flex flex-wrap justify-content-center"
              //     style={{ gap: "var(--space-4)" }}
              //   >
              //     <Button
              //       onClick={() => startSessionV2(true)}
              //       className="p-button-lg"
              //       icon="pi pi-microphone"
              //       style={{
              //         padding: "var(--space-4) var(--space-6)",
              //         minWidth: "10rem",
              //         flex: "1 1 auto",
              //       }}
              //     >
              //       Voice Chat
              //     </Button>
              //     <Button
              //       onClick={() => startSessionV2(false)}
              //       className="p-button-secondary p-button-lg"
              //       icon="pi pi-comments"
              //       style={{
              //         padding: "var(--space-4) var(--space-6)",
              //         minWidth: "10rem",
              //         flex: "1 1 auto",
              //       }}
              //     >
              //       Text Chat
              //     </Button>
              //   </div>
              //   <p
              //     className="text-body-small text-center"
              //     style={{
              //       color: "var(--text-secondary)",
              //       maxWidth: "24rem",
              //       lineHeight: "var(--line-height-relaxed)",
              //     }}
              //   >
              //     Start a conversation with your AI avatar using voice or text.
              //     Configure your preferences above before starting.
              //   </p>
              // </div>
              <div
                className="flex flex-column align-items-center"
                style={{ gap: "var(--space-3)" }}
              >
                <LoadingIcon />
                <span
                  className="text-body-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Initializing your avatar...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Conversation History (60%) */}
        <div className={style.conversationContainer}>
          {sessionState === StreamingAvatarSessionState.CONNECTED ? (
            <MessageHistory />
          ) : (
            <div
              className="flex flex-column align-items-center justify-content-center  h-full"
              style={{
                backgroundColor: "transparent",
                border: "none",
                padding: "var(--space-8)",
                gap: "var(--space-4)",
              }}
            >
              <i
                className="pi pi-comments text-6xl"
                style={{ color: "var(--gray-400)" }}
              />
              <h3
                className="text-heading-medium text-center"
                style={{ color: "#515151" }}
              >
                Conversation
              </h3>
              <p
                className="text-body-medium text-center text-light"
                style={{
                  maxWidth: "20rem",
                  lineHeight: "var(--line-height-relaxed)",
                  color: "#515151",
                }}
              >
                Start a conversation with your avatar to see the chat history
                here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Chat Interface */}
      {(auth?.user?.username === "jason.padilla@papyrrus.com" ||
        auth?.user?.username === "irwin.spinello@papyrrus.com") && (
        <FloatingChatInterface
          sessionState={sessionState}
          page={page}
          currentAvatarId={currentAvatarId}
        />
      )}
    </div>
  );
}

export default function InteractiveAvatarWrapper({ page }: { page: number }) {
  return (
    <StreamingAvatarProvider basePath={process.env.NEXT_PUBLIC_BASE_API_URL}>
      <InteractiveAvatar page={page} />
    </StreamingAvatarProvider>
  );
}
