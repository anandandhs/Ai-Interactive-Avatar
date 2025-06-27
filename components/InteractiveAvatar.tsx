import {
  AvatarQuality,
  StreamingEvents,
  VoiceChatTransport,
  VoiceEmotion,
  StartAvatarRequest,
  STTProvider,
  ElevenLabsModel,
} from "@heygen/streaming-avatar";
import {useEffect, useRef, useState} from "react";
import {useMemoizedFn, useUnmount} from "ahooks";

import {AvatarVideo} from "./AvatarSession/AvatarVideo";
import {useStreamingAvatarSession} from "./logic/useStreamingAvatarSession";
import {AvatarControls} from "./AvatarSession/AvatarControls";
import {useVoiceChat} from "./logic/useVoiceChat";
import {StreamingAvatarProvider, StreamingAvatarSessionState} from "./logic";
import {LoadingIcon} from "./Icons";
import {MessageHistory} from "./AvatarSession/MessageHistory";
import {useAuth} from "./logic/useAuth";
import Avatar from "../public/Svg/home_avatar.svg";
import BackgroundImage from "../public/Svg/background_image.svg";
import Mic from "../public/Svg/mic.svg";
import Speaker from "../public/Svg/speaker.svg";
import style from "../styles/commonStyle.module.css";

import {AVATARS} from "@/app/lib/constants";
import Image from "next/image";
import clsx from "clsx";
import {InputText} from "primereact/inputtext";
import SendIcon from "../public/Svg/send.svg";
import AppButton from "./UI/CommonUI/AppButton";

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
  const {initAvatar, startAvatar, stopAvatar, sessionState, stream} =
    useStreamingAvatarSession();
  const {startVoiceChat} = useVoiceChat();
  const {user} = useAuth();

  const mediaStream = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (user) {
      const predefinedConfig = {
        quality: AvatarQuality.Low,
        avatarName:
          user.username == "irwin.spinello@papyrrus.com"
            ? AVATARS[0].avatar_id
            : AVATARS[1].avatar_id,
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
        knowledgeBase:
          user.username == "irwin.spinello@papyrrus.com"
            ? JSON.stringify({
                PERSONA:
                  "Zara is a virtual academic assistant designed to help students stay on track with their coursework. She interacts formally but supportively, encouraging task completion while maintaining a respectful, professional tone. Always address users by their logged in username.",
                PRIMARY_USE_CASES: {
                  Automated_Assignment_Alerts:
                    "Inform users of pending assignments immediately upon login",
                  Task_Breakdown:
                    "List each assignment with due dates and provide brief descriptions",
                  Time_Management:
                    "Offer to help schedule reminders or suggest the next assignment to work on",
                  Follow_up_Prompts:
                    "Gently remind users in later sessions if they postpone assignments",
                },
                DIALOGUE_TEMPLATES: {
                  opening_intro: `Welcome back, ${user.displayName}! It's time to embark on another productive session as we navigate your upcoming assignments together.`,
                  return_after_absence:
                    "Good day. Welcome back. I hope you've been well. I noticed it has been a few days since your last visit.",
                  assignment_alert:
                    "You currently have {count} pending assignments this week. Please review the details below:\n\n{assignment_list}\n\nWould you like to begin working on one of them now, or should I remind you later today?",
                  postpone_response:
                    "Understood. I will send you a reminder in {reminder_time}. Please be mindful of approaching deadlines to stay on track with your progress.",
                  start_assignment_response:
                    "Excellent choice. Starting this module now will give you ample time to review and refine your summary before submission. Launching {module_name} now...",
                  exit_reminder:
                    "Thank you. I've saved your progress. You still have the {pending_assignment} pending, due {due_date}. I'll remind you again tomorrow. Have a productive day.",
                },
                RESPONSE_RULES: [
                  "ALWAYS address user by their logged-in username",
                  "Present assignments in clear format: [Assignment Name] - [Due Date]",
                  "Offer concrete next-step options (start now/schedule reminder)",
                  "Maintain formal but supportive tone",
                  "Track assignment completion status",
                  "Provide specific timeframes for reminders",
                ],
                ASSIGNMENT_FORMAT: [
                  "Resume Building – Module 2: Writing a Professional Summary\n Due: Friday, June 28th",
                  "Interview Skills Quiz – Practice Assessment\n Due: Sunday, June 30th",
                ],
                REMINDER_OPTIONS: {
                  default_reminder_delay: "4 hours",
                  follow_up_times: ["later today", "tomorrow", "in two days"],
                },
              })
            : JSON.stringify({
                PERSONA:
                  "Zara is a virtual career assistant embedded in a student or job-seeker platform. She tracks job trends and opportunities based on the user's saved preferences, resume content, or career interests. When a user logs in, Zara delivers personalized job suggestions, gently nudges engagement, and offers assistance in applying or updating their resume accordingly. Always address the user by their logged in user name.",
                PRIMARY_USE_CASES: {
                  Personalized_Job_Discovery:
                    "Notify users about new job listings that align with their profile (e.g., industry, location, skill set)",
                  "Re-engagement_After_Inactivity":
                    "Provide warm check-in and updates on new opportunities when users return after absence",
                  Resume_Readiness_Prompt:
                    "Offer to review or update user's resume to match current job listings",
                  Actionable_Job_Suggestions:
                    "Provide summarized job titles with options to save, track, or apply",
                },
                DIALOGUE_EXAMPLES: [
                  {
                    context: "User returns after absence",
                    lines: [
                      "Hello, it's good to see you again. It's been a while — how have you been?",
                      "During your time away, I've found 8 new HVAC job opportunities in the Dallas area that closely match your skills and preferences.",
                      "Sample Opportunities:",
                      "HVAC Service Technician – Precision Cooling Systems",
                      "HVAC Installer – NorthStar Mechanical",
                      "Would you like to view the full list, or have me tailor your resume for one of these positions?",
                    ],
                  },
                ],
                RESPONSE_RULES: [
                  "ALWAYS address user by their logged-in username",
                  "Prioritize recent job opportunities matching user's profile",
                  "Suggest resume updates when relevant to new opportunities",
                  "Provide clear next-step options after presenting information",
                ],
                JOB_SUGGESTION_TEMPLATE: {
                  opening: `Welcome back, ${user.displayName} It's great to see you again—are you ready to uncover some exciting new job opportunities tailored just for you?`,
                  reengagement:
                    "Hello, it's good to see you again. It's been a while — how have you been?",
                  opportunity_announcement:
                    "During your time away, I've found {count} new {industry} job opportunities in the {location} area that closely match your skills and preferences.",
                },
              }),
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
        const personalizedConfig = {...config};

        console.log("User data:", user);
        console.log("Personalized config:", personalizedConfig);

        // Add user's display name to the knowledge base for personalization
        // if (user?.displayName) {
        //   const personalizedPrompt = personalizedConfig.knowledgeBase
        //     ? `${personalizedConfig.knowledgeBase}\n\nThe user you are speaking with is named ${user.displayName}. Please address them by their name when appropriate.`
        //     : `You are an AI avatar assistant. The user you are speaking with is named ${user.displayName}. Please address them by their name when appropriate and provide helpful, friendly responses.`;

        //   personalizedConfig.knowledgeBase = personalizedPrompt;
        //   console.log(
        //     "Personalized avatar config with user display name:",
        //     user.displayName
        //   );
        // }
        // else if (user?.username) {
        //   // Fallback to username if displayName is not available
        //   const personalizedPrompt = personalizedConfig.knowledgeBase
        //     ? `${personalizedConfig.knowledgeBase}\n\nThe user you are speaking with is named ${user.username}. Please address them by their name when appropriate.`
        //     : `You are an AI avatar assistant. The user you are speaking with is named ${user.username}. Please address them by their name when appropriate and provide helpful, friendly responses.`;

        //   personalizedConfig.knowledgeBase = personalizedPrompt;
        //   console.log(
        //     "Personalized avatar config with username:",
        //     user.username
        //   );
        // }

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
    <div className={style.homeBlur}>
      {sessionState === StreamingAvatarSessionState.INACTIVE && (
        <div
          className="flex justify-content-center align-items-center absolute z-1 top-0 left-0 bottom-0 right-0"
          style={{backgroundColor: "#fff"}}
        >
          <div className="loader"></div>
        </div>
      )}
      <Image
        src={BackgroundImage}
        alt="Background_image"
        className={style.blurImage}
      />

      <div className={clsx("flex", style.chatCard)}>
        {/* Left Side - Avatar Video and Controls (60%) */}
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
                style={{color: "var(--gray-400)"}}
              />
              <h3 className="text-heading-medium text-center text-white">
                Conversation
              </h3>
              <p
                className="text-body-medium text-center text-white text-light"
                style={{
                  maxWidth: "20rem",
                  lineHeight: "var(--line-height-relaxed)",
                }}
              >
                Start a conversation with your avatar to see the chat history
                here
              </p>
            </div>
          )}
        </div>

        {/* Right Side - Conversation History (60%) */}
        <div
          className={clsx(
            "flex flex-column overflow-hidden surface-card avatar-video-section",
            style.chatRightContainer
          )}
          style={{
            width: "65%",
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border-light)",

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
              backgroundColor: "transparent",
              borderRadius: "var(--radius-2xl) var(--radius-2xl) 0 0",
              minHeight: "0", // Allow flex shrinking
            }}
          >
            {sessionState !== StreamingAvatarSessionState.INACTIVE ? (
              <AvatarVideo ref={mediaStream} />
            ) : (
              <div className="w-full h-full flex align-items-center justify-content-center text-white">
                <>{"Initializing your avatar..."}</>
                {/* <AvatarConfig config={config} onConfigChange={setConfig} /> */}
              </div>
            )}

            {/* Status Indicator */}
            <div
              className="absolute top-0 right-0 m-4 flex align-items-center"
              style={{gap: "var(--space-2)"}}
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
                style={{gap: "var(--space-3)"}}
              >
                <LoadingIcon />
                <span
                  className="text-body-medium"
                  style={{color: "var(--text-secondary)"}}
                >
                  Initializing your avatar...
                </span>
              </div>
            )}
          </div>
        </div>
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
