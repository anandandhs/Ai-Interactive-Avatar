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

import { AvatarVideo } from "./AvatarSession/AvatarVideo";
import { useStreamingAvatarSession } from "./logic/useStreamingAvatarSession";
import { AvatarControls } from "./AvatarSession/AvatarControls";
import { useVoiceChat } from "./logic/useVoiceChat";
import { StreamingAvatarProvider, StreamingAvatarSessionState } from "./logic";
import { LoadingIcon } from "./Icons";
import { MessageHistory } from "./AvatarSession/MessageHistory";
import { useAuth } from "./logic/useAuth";

import { AVATARS } from "@/app/lib/constants";

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

function InteractiveAvatar() {
  const { initAvatar, startAvatar, stopAvatar, sessionState, stream } =
    useStreamingAvatarSession();
  const { startVoiceChat } = useVoiceChat();
  const { user } = useAuth();

  const mediaStream = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (user) {
      const predefinedConfig = {
        quality: AvatarQuality.Low,
        avatarName: "Pedro_CasualLook_public",
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
        knowledgeId: "",
        knowledgeBase: `Start every conversation with a warm and professional greeting. Example: 'Hi ${user.displayName}, welcome back! I'm Zara, your virtual career assistant. Let’s explore new job opportunities together.'\n\nPERSONA:\nZara is a virtual career assistant embedded in a student or job-seeker platform. She tracks job trends and opportunities based on the user's saved preferences, resume content, or career interests. When a user logs in, Zara delivers personalized job suggestions, gently nudges engagement, and offers assistance in applying or updating their resume accordingly. Always address the user by their logged-in user name.\n\nKNOWLEDGE BASE:\nZara helps the user with suggesting job opportunities based on their location and skills. She offers personalized job discovery, updates after inactivity, resume assistance, and actionable job suggestions.\n\nUse this list:\nHVAC Service Technician – Precision Cooling Systems\nHVAC Installer – NorthStar Mechanical\nCommercial HVAC Maintenance Specialist – TexAir Co.\nHVAC Controls Technician – EnergyLogic\nResidential HVAC Lead – CoolFlow Services\n…and more.\n\nINSTRUCTIONS:\n1. Greet the user personally using their name.\n2. If returning after a break, say something like: 'It’s been a while — how have you been?'\n3. Mention new job matches (e.g., 'I've found 8 new HVAC jobs in Dallas that match your skills.').\n4. Display 3–5 sample job titles.\n5. Ask if the user wants to see the full list or update their resume.\n6. Offer to help optimize their resume (e.g., focus on certifications like EPA 608, or installation experience).\n7. End each interaction with a helpful follow-up like: 'Would you like more job suggestions or resume help now?'`,
      };
      startSessionV2(true, predefinedConfig);
    }
  }, [user]);

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
          console.log("Avatar started talking", e);
        });
        avatar.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
          console.log("Avatar stopped talking", e);
        });
        avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
          console.log("Stream disconnected");
        });
        avatar.on(StreamingEvents.STREAM_READY, (event) => {
          console.log(">>>>> Stream ready:", event.detail);
        });
        avatar.on(StreamingEvents.USER_START, (event) => {
          console.log(">>>>> User started talking:", event);
        });
        avatar.on(StreamingEvents.USER_STOP, (event) => {
          console.log(">>>>> User stopped talking:", event);
        });
        avatar.on(StreamingEvents.USER_END_MESSAGE, (event) => {
          console.log(">>>>> User end message:", event);
        });
        avatar.on(StreamingEvents.USER_TALKING_MESSAGE, (event) => {
          console.log(">>>>> User talking message:", event);
        });
        avatar.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (event) => {
          console.log(">>>>> Avatar talking message:", event);
        });
        avatar.on(StreamingEvents.AVATAR_END_MESSAGE, (event) => {
          console.log(">>>>> Avatar end message:", event);
        });

        // Create a personalized config with user's display name
        const personalizedConfig = { ...config };

        console.log("User data:", user);
        console.log("Personalized config:", personalizedConfig);

        // Add user's display name to the knowledge base for personalization
        if (user?.displayName) {
          const personalizedPrompt = personalizedConfig.knowledgeBase
            ? `${personalizedConfig.knowledgeBase}\n\nThe user you are speaking with is named ${user.displayName}. Please address them by their name when appropriate.`
            : `You are an AI avatar assistant. The user you are speaking with is named ${user.displayName}. Please address them by their name when appropriate and provide helpful, friendly responses.`;

          personalizedConfig.knowledgeBase = personalizedPrompt;
          console.log(
            "Personalized avatar config with user display name:",
            user.displayName
          );
        } else if (user?.username) {
          // Fallback to username if displayName is not available
          const personalizedPrompt = personalizedConfig.knowledgeBase
            ? `${personalizedConfig.knowledgeBase}\n\nThe user you are speaking with is named ${user.username}. Please address them by their name when appropriate.`
            : `You are an AI avatar assistant. The user you are speaking with is named ${user.username}. Please address them by their name when appropriate and provide helpful, friendly responses.`;

          personalizedConfig.knowledgeBase = personalizedPrompt;
          console.log(
            "Personalized avatar config with username:",
            user.username
          );
        }

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
    stopAvatar();
  });

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
      };
    }
  }, [mediaStream, stream]);

  return (
    <div
      className="w-full h-full flex avatar-layout-horizontal"
      style={{
        gap: "var(--space-6)",
        height: "100%", // Use full height of parent container
        maxHeight: "100%", // Prevent expansion beyond parent
        overflow: "hidden", // Prevent content from overflowing
      }}
    >
      {/* Left Side - Avatar Video and Controls (60%) */}
      <div
        className="flex flex-column overflow-hidden surface-card avatar-video-section"
        style={{
          width: "60%",
          backgroundColor: "var(--bg-primary)",
          border: "1px solid var(--border-light)",
          borderRadius: "var(--radius-2xl)",
          boxShadow: "var(--shadow-lg)",
          height: "100%",
          maxHeight: "100%", // Prevent expansion
          minHeight: "0", // Allow shrinking
        }}
      >
        {/* Avatar Display Area */}
        <div
          className="relative flex-1 overflow-hidden flex flex-column align-items-center justify-content-center"
          style={{
            backgroundColor: "var(--bg-tertiary)",
            borderRadius: "var(--radius-2xl) var(--radius-2xl) 0 0",
            minHeight: "0", // Allow flex shrinking
          }}
        >
          {sessionState !== StreamingAvatarSessionState.INACTIVE ? (
            <AvatarVideo ref={mediaStream} />
          ) : (
            <div className="w-full h-full flex align-items-center justify-content-center">
              <>{"Initializing your avatar..."}</>
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
            backgroundColor: "var(--bg-primary)",
            padding: "var(--space-6)",
            gap: "var(--space-4)",
            flexShrink: 0, // Prevent controls from shrinking
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

      {/* Right Side - Conversation History (40%) */}
      <div
        className="flex flex-column avatar-conversation-section"
        style={{
          width: "40%",
          height: "100%",
          maxHeight: "100%", // Prevent expansion
          minHeight: "0", // Allow shrinking
        }}
      >
        {sessionState === StreamingAvatarSessionState.CONNECTED ? (
          <MessageHistory />
        ) : (
          <div
            className="flex flex-column align-items-center justify-content-center surface-card h-full"
            style={{
              backgroundColor: "var(--bg-primary)",
              border: "1px solid var(--border-light)",
              borderRadius: "var(--radius-2xl)",
              boxShadow: "var(--shadow-lg)",
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
              style={{ color: "var(--text-primary)" }}
            >
              Conversation
            </h3>
            <p
              className="text-body-medium text-center"
              style={{
                color: "var(--text-secondary)",
                maxWidth: "20rem",
                lineHeight: "var(--line-height-relaxed)",
              }}
            >
              Start a conversation with your avatar to see the chat history here
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InteractiveAvatarWrapper() {
  return (
    <StreamingAvatarProvider basePath={process.env.NEXT_PUBLIC_BASE_API_URL}>
      <InteractiveAvatar />
    </StreamingAvatarProvider>
  );
}
