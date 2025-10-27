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
import { useTextChat } from "./logic/useTextChat";
import FullScreen from "../public/Svg/full-screen.svg";
import ExitScreen from "../public/Svg/exit-screen.svg";
import { useSelectedAvatarLanguage } from "./logic/useSelectedAvatarLanguage";

function InteractiveAvatar({ page }: { page: number }) {
  const { initAvatar, startAvatar, stopAvatar, sessionState, stream } =
    useStreamingAvatarSession();
  const { interrupt } = useInterrupt();
  const auth = useAuthContext();
  const router = useRouter();
  const toast = useRef<Toast>(null);
  const { startVoiceChat } = useVoiceChat(toast);
  const { sendMessage } = useTextChat();
  const currentAvatarMessage = useRef<string>("");
  const currentUserMessage = useRef<string>("");
  const userRequestedNavigation = useRef<string | null>(null);
  const isAvatarTalking = useRef<boolean>(false);
  const isStreamReady = useRef<boolean>(false);
  const greetingSent = useRef<boolean>(false);
  const selectedLanguageRef = useRef<string>("en");
  const [currentModel, setCurrentModel] = useState<ElevenLabsModel>(
    ElevenLabsModel.eleven_flash_v2_5
  );
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState<boolean>(false);

  const { selectedLanguage, setSelectedLanguage } = useSelectedAvatarLanguage();

  // Keep ref in sync with state
  useEffect(() => {
    selectedLanguageRef.current = selectedLanguage;
  }, [selectedLanguage]);

  const mediaStream = useRef<HTMLVideoElement>(null);

  // Function to check if user requested navigation
  const checkUserNavigationRequest = (userMessage: string) => {
    const lowerCaseMessage = userMessage.toLowerCase();
    console.log("👤 User said:", lowerCaseMessage);

    // Check if user requested specific navigation based on knowledge base support pathways
    const advisingKeywords = [
      "major change",
      "major change inquiries",
      "course selection",
      "course selection help",
      "degree requirements",
      "academic advising",
      "advising",
      "change major",
      "change my major",
      "program change",
      "academic support",
      // Job-related keywords for john.keating@papyrrus.com (English)
      "i am looking for a job",
      "looking for a job",
      "job coach",
      "job postings",
      "job offers",
      "job search",
      "career advice",
      "employment",
      "work opportunities",
      "resume help",
      "interview preparation",
      "I’m looking for a job",
      "Can you help me find work",
      "Show me job openings",
      "Are there any vacancies right now",
      "I need to find a job quickly",
      "Do you have job listings",
      "Find me jobs near me",
      "Are there jobs available without experience",
      "I want to change jobs",
      "I’m searching for employment opportunities",
      "Do you have part-time jobs",
      "I’m looking for a full-time job",
      "Any entry-level jobs available",
      "Are there internships",
      "Looking for student jobs",
      "I need a job with no experience required",
      "Are there jobs with growth opportunities",
      "i need a job",

      // Spanish
      "cambio de carrera",
      "cambio de especialización",
      "selección de cursos",
      "ayuda con cursos",
      "requisitos de grado",
      "asesoría académica",
      "consejería",
      "cambiar de carrera",
      "cambiar mi especialización",
      "cambio de programa",
      "apoyo académico",
      "orientación académica",
      "carrera",
      "profesión",
      "carrera técnica",
      "escuela técnica",
      "politécnico",
      "escuela técnica",
      "politécnico",
      "desarrollo profesional",
      "desarrollo de carrera",
      "asesoramiento académico",
      "orientación académica",
      "orientación profesional",
      "orientación vocacional",
      "asesor académico",
      "creador de CV",
      "creador de hoja de vida",
      "creador de curriculum vitae",
      "currículum vitae",
      "CV",
      "hoja de vida",
      "recepcionista",
      // Job-related keywords for john.keating@papyrrus.com (Spanish)
      "estoy buscando trabajo",
      "buscando trabajo",
      "asesor laboral",
      "ofertas de empleo",
      "ofertas de trabajo",
      "búsqueda de empleo",
      "consejo profesional",
      "oportunidades laborales",
      "ayuda con currículum",
      "preparación para entrevistas",

      "Estoy buscando trabajo",
      "Busco trabajo",
      "Estoy buscando empleo",
      "Busco empleo",
      "¿Me puedes ayudar a encontrar empleo?",
      "Muéstrame ofertas de trabajo",
      "Muestra ofertas de trabajo",
      "¿Dónde hay vacantes disponibles?",
      "Quiero conseguir un trabajo lo antes posible",
      "¿Tienen listados de empleos?",
      "Enséñame trabajos cerca de mí",
      "¿Hay empleos disponibles sin experiencia?",
      "Estoy buscando un nuevo puesto de trabajo",
      "Necesito encontrar empleo",
      "¿Hay empleos de medio tiempo?",
      "Busco un trabajo de tiempo completo",
      "Necesito un trabajo para principiantes",
      "¿Tienen pasantías o prácticas?",
      "Estoy buscando un empleo para estudiantes",
      "¿Hay trabajos sin requisitos de experiencia?",
      "Quiero un puesto con posibilidades de crecer",
    ];

    const admissionKeywords = [
      "application",
      "application questions",
      "enrollment",
      "enrollment process",
      "deadline",
      "deadline inquiries",
      "admissions",
      "admission guidance",
      "apply",
      "registration",
      "hvac",
      "hvac training",
      "hvac certification",
      "hvac technician",
      "hvac program",
      "hvac classes",
      "hvac training options",
      "heating ventilation air conditioning",
      // Spanish
      "solicitud",
      "preguntas sobre aplicación",
      "inscripción",
      "proceso de inscripción",
      "fecha límite",
      "consulta de plazos",
      "admisiones",
      "orientación para admisión",
      "aplicar",
      "registro",
      "climatización",
      "formación en climatización",
      "certificación hvac",
      "técnico en climatización",
      "programa de hvac",
      "clases de climatización",
      "opciones de formación en hvac",
      "calefacción ventilación aire acondicionado",
      "admisión",
      "aire acondicionado",
      "refrigeración",
      "técnico",
    ];

    if (advisingKeywords.some((kw) => lowerCaseMessage.includes(kw))) {
      userRequestedNavigation.current = "resume-builder";
      console.log("🎯 User requested: Resume Builder & Career Advising");
      console.log(
        "🎯 Matching keywords:",
        advisingKeywords.filter((kw) => lowerCaseMessage.includes(kw))
      );
    } else if (admissionKeywords.some((kw) => lowerCaseMessage.includes(kw))) {
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

  // Add a flag to prevent duplicate navigation
  const navigationInProgress = useRef(false);

  // Add a flag to track if this is the avatar's first message (introduction)
  const isAvatarIntroduction = useRef(true);

  // Function to check if avatar message contains navigation keywords (fallback detection)
  const checkAvatarNavigationRequest = (avatarMessage: string) => {
    const lowerCaseMessage = avatarMessage.toLowerCase();
    console.log(
      "🤖 Avatar said (checking for navigation keywords):",
      lowerCaseMessage
    );

    // Check if this is the avatar's introduction message
    if (isAvatarIntroduction.current) {
      console.log(
        "👋 This is avatar's introduction message, skipping navigation detection to prevent auto-navigation on first message"
      );
      isAvatarIntroduction.current = false; // Mark introduction as complete
      return;
    }

    // Check if navigation is already in progress
    if (navigationInProgress.current) {
      console.log(
        "⏭️ Navigation already in progress, skipping avatar keyword detection"
      );
      return;
    }

    // Use the same keywords as user navigation detection
    const advisingKeywords = [
      "major change",
      "major change inquiries",
      "course selection",
      "course selection help",
      "degree requirements",
      "academic advising",
      "advising",
      "change major",
      "change my major",
      "program change",
      "academic support",
      // Spanish
      "cambio de carrera",
      "cambio de especialización",
      "selección de cursos",
      "ayuda con cursos",
      "requisitos de grado",
      "asesoría académica",
      "consejería",
      "cambiar de carrera",
      "cambiar mi especialización",
      "cambio de programa",
      "apoyo académico",
      "orientación académica",
      "carrera",
      "profesión",
      "carrera técnica",
      "escuela técnica",
      "politécnico",
      "desarrollo profesional",
    ];

    const admissionKeywords = [
      "application",
      "application questions",
      "enrollment",
      "enrollment process",
      "deadline",
      "deadline inquiries",
      "admissions",
      "admission guidance",
      "apply",
      "registration",
      "hvac",
      "hvac training",
      "hvac certification",
      "hvac technician",
      "hvac program",
      "hvac classes",
      "hvac training options",
      "heating ventilation air conditioning",
      // Spanish
      "solicitud",
      "preguntas sobre aplicación",
      "inscripción",
      "proceso de inscripción",
      "fecha límite",
      "consulta de plazos",
      "admisiones",
      "orientación para admisión",
      "aplicar",
      "registro",
      "climatización",
      "formación en climatización",
      "certificación hvac",
      "técnico en climatización",
      "programa de hvac",
      "clases de climatización",
      "opciones de formación en hvac",
      "calefacción ventilación aire acondicionado",
      "admisión",
      "aire acondicionado",
      "refrigeración",
      "técnico",
    ];

    if (advisingKeywords.some((kw) => lowerCaseMessage.includes(kw))) {
      userRequestedNavigation.current = "resume-builder";
      console.log(
        "🎯 Avatar mentioned: Resume Builder & Career Advising - setting navigation request"
      );

      // Since avatar already mentioned the service, we can proceed with navigation
      // after avatar stops talking
      const serviceConfig = {
        route: "/resume-builder",
        name: "Resume Builder & Career Advising",
        keywords: ["resume", "career", "advising", "academic planning"],
      };

      const checkTalkingStatus = () => {
        if (isAvatarTalking.current) {
          console.log("🗣️ Avatar still speaking...");
          setTimeout(checkTalkingStatus, 300);
        } else {
          console.log(
            "🚀 Avatar finished speaking - navigating based on avatar keywords!"
          );
          executeNavigation(serviceConfig);
        }
      };

      checkTalkingStatus();
    } else if (admissionKeywords.some((kw) => lowerCaseMessage.includes(kw))) {
      userRequestedNavigation.current = "course-admission";
      console.log(
        "🎯 Avatar mentioned: Admission Guidance - setting navigation request"
      );

      // Since avatar already mentioned the service, we can proceed with navigation
      // after avatar stops talking
      const serviceConfig = {
        route: "/course-admission",
        name: "Admission Guidance",
        keywords: ["admission", "enrollment", "application", "hvac"],
      };

      const checkTalkingStatus = () => {
        if (isAvatarTalking.current) {
          console.log("🗣️ Avatar still speaking...");
          setTimeout(checkTalkingStatus, 300);
        } else {
          console.log(
            "🚀 Avatar finished speaking - navigating based on avatar keywords!"
          );
          executeNavigation(serviceConfig);
        }
      };

      checkTalkingStatus();
    } else if (lowerCaseMessage.includes("dashboard")) {
      userRequestedNavigation.current = "dashboard";
      console.log(
        "🎯 Avatar mentioned: Dashboard - setting navigation request"
      );

      // Since avatar already mentioned the service, we can proceed with navigation
      // after avatar stops talking
      const serviceConfig = {
        route: "/dashboard",
        name: "Dashboard",
        keywords: ["dashboard", "home", "main menu"],
      };

      const checkTalkingStatus = () => {
        if (isAvatarTalking.current) {
          console.log("🗣️ Avatar still speaking...");
          setTimeout(checkTalkingStatus, 300);
        } else {
          console.log(
            "🚀 Avatar finished speaking - navigating based on avatar keywords!"
          );
          executeNavigation(serviceConfig);
        }
      };

      checkTalkingStatus();
    } else {
      console.log("❌ No navigation keywords detected in avatar message");
    }
  };

  // Function to check if avatar confirmed navigation and execute it
  // Graceful avatar session cleanup function
  const stopAvatarGracefully = async () => {
    try {
      // Only interrupt if avatar is currently talking
      if (isAvatarTalking.current) {
        console.log("🛑 Interrupting avatar speech...");
        interrupt();
        // Wait a bit for interrupt to take effect
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Check if session is still active before stopping
      if (sessionState !== StreamingAvatarSessionState.INACTIVE) {
        console.log("🔌 Stopping avatar session...");
        await stopAvatar();
      } else {
        console.log("ℹ️ Avatar session already inactive");
      }
    } catch (error) {
      console.error("Error during graceful avatar stop:", error);
      // Re-throw to let caller handle
      throw error;
    }
  };

  // const checkAvatarNavigationConfirmation = (avatarMessage: string) => {
  //   const lowerCaseMessage = avatarMessage.toLowerCase();
  //   console.log("🤖 Avatar said:", lowerCaseMessage);
  //   console.log(
  //     "🎯 User previously requested:",
  //     userRequestedNavigation.current
  //   );

  //   // Only proceed if user previously requested navigation
  //   if (!userRequestedNavigation.current) {
  //     console.log("❌ No pending navigation request from user");
  //     return;
  //   }

  //   // Enhanced confirmation phrases based on knowledge base templates
  //   const confirmationPhrases = [
  //     "taking you to",
  //     "navigating to",
  //     "redirecting to",
  //     "going to",
  //     "heading to",
  //     "excellent choice",
  //     "great choice",
  //     "perfect",
  //     "sounds good",
  //     "let's get started",
  //     "let's begin",
  //     "i'll help you with",
  //     "let me guide you",
  //     "Connecting you with",
  //     "Routing you to",
  //     "Let me connect you with",
  //   ];

  //   const hasConfirmation = confirmationPhrases.some((phrase) =>
  //     lowerCaseMessage.includes(phrase)
  //   );

  //   // Enhanced service keywords based on knowledge base support pathways
  //   const serviceKeywords: Record<string, string[]> = {
  //     "resume-builder": [
  //       // "resume",
  //       // "career",
  //       // "career development",
  //       // "career advising",
  //       // "resume builder",
  //       // "advising",
  //       // "academic advising",
  //       // "academic planning",
  //       "major change",
  //       "major change inquiries",
  //       "course selection",
  //       "course selection help",
  //       "degree requirements",
  //       "academic advising",
  //       "advising",
  //       "change major",
  //       "program change",
  //       "academic support",
  //     ],
  //     "course-admission": [
  //       // "admission",
  //       // "course",
  //       // "academic planning",
  //       // "admission guidance",
  //       // "enrollment",
  //       "application",
  //       "application questions",
  //       "enrollment",
  //       "enrollment process",
  //       "deadline",
  //       "deadline inquiries",
  //       "admissions",
  //       "admission guidance",
  //       "apply",
  //       "registration",
  //     ],
  //     dashboard: ["dashboard", "home", "main"],
  //   };

  //   const requestedService = userRequestedNavigation.current;
  //   const mentionsService =
  //     requestedService &&
  //     serviceKeywords[requestedService]?.some((keyword: string) =>
  //       lowerCaseMessage.includes(keyword)
  //     );

  //   if (hasConfirmation && mentionsService) {
  //     console.log(
  //       "✅ Avatar confirmed navigation - waiting for avatar to finish talking..."
  //     );

  //     // Wait for avatar to completely finish talking before navigating
  //     const executeNavigation = () => {
  //       if (isAvatarTalking.current) {
  //         console.log("⏳ Avatar still talking, waiting...");
  //         setTimeout(executeNavigation, 500); // Check again in 500ms
  //         return;
  //       }

  //       console.log(
  //         "🚀 Avatar finished talking, proceeding with navigation..."
  //       );

  //       const routes: Record<string, string> = {
  //         "resume-builder": "/resume-builder",
  //         "course-admission": "/course-admission",
  //         dashboard: "/dashboard",
  //       };

  //       const routeName: Record<string, string> = {
  //         "resume-builder": "Resume Builder & Career Advising",
  //         "course-admission": "Admission Guidance",
  //         dashboard: "Dashboard",
  //       };

  //       // Show toast notification
  //       toast.current?.show({
  //         severity: "success",
  //         summary: "Navigation Confirmed",
  //         detail: `Taking you to ${routeName[requestedService]}...`,
  //         life: 6000,
  //       });

  //       // Navigate after avatar completely finishes
  //       setTimeout(async () => {
  //         try {
  //           // Gracefully stop the avatar session
  //           await stopAvatarGracefully();
  //           router.push(routes[requestedService]);
  //           // Reset the navigation request
  //           userRequestedNavigation.current = null;
  //         } catch (error) {
  //           console.error("Error during navigation cleanup:", error);
  //           // Still navigate even if cleanup fails
  //           router.push(routes[requestedService]);
  //           userRequestedNavigation.current = null;
  //         }
  //       }, 6000);
  //     };

  //     // Start checking if avatar finished talking
  //     executeNavigation();
  //   } else {
  //     console.log(
  //       "❌ Avatar did not confirm navigation or mention the service"
  //     );
  //     // Reset navigation request if avatar doesn't confirm
  //     userRequestedNavigation.current = null;
  //   }
  // };

  const checkAvatarNavigationConfirmation = (avatarMessage: string) => {
    const lowerCaseMessage = avatarMessage.toLowerCase();
    console.log("🤖 Avatar said:", avatarMessage); // Keep original for debugging
    console.log("🤖 Avatar said (lowercase):", lowerCaseMessage);
    console.log(
      "🤖 Current userRequestedNavigation:",
      userRequestedNavigation.current
    );
    console.log("🤖 Navigation in progress:", navigationInProgress.current);

    // Only proceed if user previously requested navigation and no navigation is in progress
    if (!userRequestedNavigation.current || navigationInProgress.current) {
      console.log(
        "❌ No pending navigation request or navigation already in progress"
      );
      return;
    }

    // Unified confirmation phrases
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
      "connecting you with",
      "routing you to",
      "let me connect you with",
      "i will connect you with",
      "i will connect you",
      "i'll connect you with",
      "connecting you with",
      "connect you with",
      "right this way",
      "follow me",
      "i'll take you to",
      "here we go",
      "transferring you",
      "taking you over to",
      // Spanish phrases
      "llevándote a",
      "dirigiéndote a",
      "redirigiéndote a",
      "yendo a",
      "encaminándote a",
      "excelente elección",
      "gran elección",
      "perfecto",
      "suena bien",
      "empecemos",
      "comencemos",
      "te ayudaré con",
      "déjame guiarte",
      "conectándote con",
      "encaminándote a",
      "déjame conectarte con",
      "por aquí",
      "sígueme",
      "te llevaré a",
      "aquí vamos",
      "transfiriéndote",
      "llevándote hacia",
      "vamos a",
      "perfecto, vamos a",
      "muy bien, vamos a",
      "estupendo, vamos a",
      "de acuerdo, vamos a",
      "ahora te llevo a",
      "permíteme llevarte a",
      "te redirijo a",
      "te guiaré a",
      "te acompañaré a",
    ];

    // Service mapping to actual routes
    const serviceMap: Record<
      string,
      { route: string; name: string; keywords: string[] }
    > = {
      "resume-builder": {
        route: "/resume-builder",
        name: "Advising",
        keywords: [
          "advising",
          "academic advising",
          "academic planning",
          "career",
          "career development",
          "career advising",
          "job coach",
          "job coaching",
          "employment",
          "job search",
          "resume",
          "cv",
          "curriculum vitae",
          // Spanish equivalents
          "asesoramiento",
          "asesoría académica",
          "planificación académica",
          "carrera",
          "desarrollo profesional",
          "orientación profesional",
          "consejería",
          "asesoría de carrera",
          "plan de estudios",
          "orientación vocacional",
          "orientación académica",
          "asesoría educativa",
          "asesor laboral",
          "entrenador laboral",
          "empleo",
          "búsqueda de empleo",
          "currículum",
          "hoja de vida",
        ],
      },
      "course-admission": {
        route: "/course-admission",
        name: "Admission",
        keywords: [
          "admission",
          "course",
          "academic planning",
          "admission guidance",
          "enrollment",
          "HVAC training",
          "HVAC",
          // Spanish equivalents
          "admisión",
          "inscripción",
          "matrícula", // Alternate for enrollment
          "curso",
          "asignatura", // Alternate for course (more academic)
          "planificación académica",
          "orientación para admisión",
          "guía de admisión",
          "formación en HVAC",
          "climatización", // Common term for HVAC in Spanish
          "calefacción y aire acondicionado", // Full translation
          "curso de climatización",
          "certificación HVAC",
          "técnico en climatización",
          "programa HVAC",
          "capacitación en HVAC",
          "sistema de climatización",
        ],
      },
      dashboard: {
        route: "/dashboard",
        name: "Dashboard",
        keywords: ["dashboard", "home", "main menu"],
      },
    };

    const requestedService = userRequestedNavigation.current;
    const serviceConfig = serviceMap[requestedService];

    if (!serviceConfig) {
      console.log("⚠️ Unknown service requested:", requestedService);
      userRequestedNavigation.current = null;
      return;
    }

    // Check for confirmation
    const hasConfirmation = confirmationPhrases.some((phrase) =>
      lowerCaseMessage.includes(phrase)
    );

    // Check if service is mentioned (case-insensitive)
    const mentionsService = serviceConfig.keywords.some((keyword) =>
      lowerCaseMessage.includes(keyword.toLowerCase())
    );

    console.log(
      `🔍 Confirmation: ${hasConfirmation}, Mentions Service: ${mentionsService}`
    );
    console.log("🔍 Avatar message (lowercase):", lowerCaseMessage);
    console.log("🔍 Requested service:", requestedService);
    console.log("🔍 Service keywords:", serviceConfig.keywords);
    console.log(
      "🔍 Confirmation phrases that match:",
      confirmationPhrases.filter((phrase) => lowerCaseMessage.includes(phrase))
    );
    console.log(
      "🔍 Service keywords that match:",
      serviceConfig.keywords.filter((keyword) =>
        lowerCaseMessage.includes(keyword.toLowerCase())
      )
    );

    // More flexible condition: either confirmation phrase OR service mention
    if (hasConfirmation || mentionsService) {
      console.log("✅ Navigation confirmed - preparing transition...");

      // // Immediate visual feedback
      // toast.current?.show({
      //   severity: "info",
      //   summary: "Preparing Navigation",
      //   detail: `Almost ready for ${serviceConfig.name}...`,
      //   life: 3000,
      // });

      // Wait for avatar to stop talking
      const checkTalkingStatus = () => {
        if (isAvatarTalking.current) {
          console.log("🗣️ Avatar still speaking...");
          setTimeout(checkTalkingStatus, 300);
        } else {
          console.log("🚀 Avatar finished speaking - navigating!");
          executeNavigation(serviceConfig);
        }
      };

      checkTalkingStatus();
    } else {
      console.log("❌ No navigation confirmation detected");
      userRequestedNavigation.current = null;
    }
  };

  // Navigation executor
  const executeNavigation = (serviceConfig: {
    route: string;
    name: string;
  }) => {
    console.log("🚀 executeNavigation called for:", serviceConfig.name);
    console.log(
      "🚀 navigationInProgress.current:",
      navigationInProgress.current
    );

    // Check if navigation is already in progress to prevent duplicate execution
    if (navigationInProgress.current) {
      console.log(
        "⚠️ Navigation already in progress, skipping duplicate execution"
      );
      return;
    }

    // Set flag immediately to prevent duplicate calls
    navigationInProgress.current = true;

    // Final confirmation toast
    toast.current?.show({
      severity: "success",
      summary: "Navigation Confirmed",
      detail: `Transferring the chat to ${serviceConfig.name}...`,
      life: 4000,
    });

    // Stop avatar and navigate
    setTimeout(async () => {
      try {
        await stopAvatarGracefully();
        router.push(serviceConfig.route);
      } catch (error) {
        console.error("Navigation error:", error);
        router.push(serviceConfig.route); // Navigate anyway
      } finally {
        userRequestedNavigation.current = null;
        navigationInProgress.current = false;
      }
    }, 4000);
  };

  const [currentAvatarId, setCurrentAvatarId] = useState<string>(
    AVATARS[0].avatar_id
  );

  // Function to restart avatar with new configuration
  const restartAvatarWithNewConfig = async (
    newModel: ElevenLabsModel,
    newLanguage: string
  ) => {
    if (!auth?.user) return;

    try {
      console.log("🔄 Starting avatar restart process...");

      // Reset greeting flags for new session
      isStreamReady.current = false;
      greetingSent.current = false;

      // Stop current avatar session gracefully and wait for it to complete
      console.log("🛑 Stopping current avatar session...");
      await stopAvatarGracefully();
      console.log("✅ Avatar session stopped successfully");

      // Wait for state updates to propagate and cleanup to complete
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update the model and language - this will trigger the main useEffect
      // which will start a new session with the updated configuration
      console.log(
        `🔄 Updating language to: ${newLanguage}, model to: ${newModel}`
      );
      setCurrentModel(newModel);
      setSelectedLanguage(newLanguage);

      // Show success toast
      toast.current?.show({
        severity: "success",
        summary: "Configuration Updated",
        detail: `Switching to ${
          newLanguage === "en" ? "English" : "Spanish"
        } language...`,
        life: 3000,
      });
    } catch (error) {
      console.error("Error restarting avatar with new config:", error);
      toast.current?.show({
        severity: "error",
        summary: "Configuration Update Failed",
        detail: "Failed to update avatar configuration. Please try again.",
        life: 5000,
      });
    }
  };

  const lastConfigRef = useRef<StartAvatarRequest | null>(null);

  useEffect(() => {
    if (auth?.user) {
      const currentAvatarId = getRequiredAvatar(
        auth?.user?.username.toLowerCase() || "",
        auth?.user?.username.toLowerCase() == "jason.padilla@papyrrus.com"
          ? page + 3
          : page
      );
      setCurrentAvatarId(currentAvatarId);

      // Initialize model and language for john.keating@papyrrus.com (only once)
      if (
        auth?.user?.username?.toLowerCase() === "john.keating@papyrrus.com" &&
        !isInitialized
      ) {
        console.log(
          "🔧 Initializing john.keating@papyrrus.com with default settings"
        );
        setCurrentModel(ElevenLabsModel.eleven_flash_v2_5); // Default to flash model
        setIsInitialized(true);
      }

      const predefinedConfig = {
        quality: AvatarQuality.Low,
        avatarName: currentAvatarId,
        voice: {
          rate: 0.8,
          emotion: VoiceEmotion.EXCITED,
          model:
            auth?.user?.username?.toLowerCase() === "john.keating@papyrrus.com"
              ? currentModel // Use current model for john.keating
              : auth?.user?.username?.toLowerCase() ==
                    "jason.padilla@papyrrus.com" ||
                  auth?.user?.username?.toLowerCase() ==
                    "percy.veltman@papyrrus.com"
                ? ElevenLabsModel.eleven_multilingual_v2
                : ElevenLabsModel.eleven_flash_v2_5,
          ...(auth?.user?.username?.toLowerCase() ==
            "jason.padilla@papyrrus.com" && {
            voiceId:
              currentAvatarId === AVATARS[3].avatar_id
                ? "e85822bd14e144e8b6fe73da2fb1085c"
                : currentAvatarId === AVATARS[4].avatar_id
                  ? "a557ea37036844748016d4cee181c322"
                  : "72cbcf091d9d48998ce10d7b5c2d569e",
          }),
          ...(auth?.user?.username?.toLowerCase() ===
            "percy.veltman@papyrrus.com" && {
            voiceId: "e85822bd14e144e8b6fe73da2fb1085c",
          }),
          ...(auth?.user?.username?.toLowerCase() ===
            "erica.romaguera@papyrrus.com" && {
            voiceId: "e85822bd14e144e8b6fe73da2fb1085c",
          }),
          ...(auth?.user?.username?.toLowerCase() ===
            "irwin.spinello@papyrrus.com" && {
            voiceId:
              currentAvatarId === AVATARS[0].avatar_id
                ? "d41b5163f39044129d06aca88d7a8f4f"
                : currentAvatarId === AVATARS[1].avatar_id
                  ? "808a781f0c8e43dcb89636df6040143c" //male voice
                  : "207e0fdec4e645d287803503706e107d",
          }),
          ...(auth?.user?.username?.toLowerCase() ===
            "john.keating@papyrrus.com" &&
            currentAvatarId === AVATARS[0].avatar_id &&
            selectedLanguage === "es" && {
              voiceId: "cbb56828d798491e9f601a5415415e25",
            }),
          ...(auth?.user?.username?.toLowerCase() ===
            "john.keating@papyrrus.com" &&
            currentAvatarId === AVATARS[3].avatar_id &&
            selectedLanguage === "es" && {
              voiceId: "1a9bfb4ec9bc43d59ab64a4e66fe467c",
            }),
        },
        language:
          auth?.user?.username?.toLowerCase() === "john.keating@papyrrus.com"
            ? selectedLanguage // Use current language for john.keating
            : auth?.user?.username?.toLowerCase() ==
                  "jason.padilla@papyrrus.com" ||
                auth?.user?.username?.toLowerCase() ==
                  "percy.veltman@papyrrus.com"
              ? "es"
              : "en",
        voiceChatTransport: VoiceChatTransport.WEBSOCKET,
        sttSettings: {
          provider: STTProvider.DEEPGRAM,
        },
        activityIdleTimeout: 3600, // comment this after demo
        knowledgeId:
          auth?.user?.username?.toLowerCase() != "john.keating@papyrrus.com"
            ? ""
            : selectedLanguage === "en" &&
                currentAvatarId === AVATARS[0].avatar_id
              ? "02ef215a87ca49f1bb05fb7833bf8afe"
              : selectedLanguage === "en" &&
                  currentAvatarId === AVATARS[3].avatar_id
                ? "10d1db10e297474386646f8611eea248"
                : selectedLanguage === "es" &&
                    currentAvatarId === AVATARS[0].avatar_id
                  ? "826c4781815548e98a9059daffbf84e6"
                  : "d873e488c23e4475b3bddbaef90016c6",
        knowledgeBase:
          auth?.user?.username?.toLowerCase() != "john.keating@papyrrus.com"
            ? getKnowlededgeBase(
                auth?.user?.username?.toLowerCase() || "",
                page,
                auth.user.displayName || "",
                currentAvatarId
              )
            : "",
      } as StartAvatarRequest;

      // Only start session if inactive and config changed
      if (
        sessionState === StreamingAvatarSessionState.INACTIVE &&
        JSON.stringify(predefinedConfig) !==
          JSON.stringify(lastConfigRef.current)
      ) {
        // Reset greeting flags for new session
        isStreamReady.current = false;
        greetingSent.current = false;

        lastConfigRef.current = predefinedConfig;
        startSessionV2(true, predefinedConfig);
      }
    }
  }, [auth, sessionState, selectedLanguage, currentAvatarId, currentModel]);

  // Send greeting when stream is ready
  useEffect(() => {
    if (
      sessionState === StreamingAvatarSessionState.CONNECTED &&
      isStreamReady.current &&
      !greetingSent.current
    ) {
      console.log(
        "👋 Stream is ready, sending greeting message in language:",
        selectedLanguage
      );
      greetingSent.current = true;

      if (selectedLanguage === "es") {
        sendMessage(`Hola, me llamo ${auth?.user?.displayName}`);
      } else {
        sendMessage(`Hi, my name is ${auth?.user?.displayName}`);
      }
    }
  }, [sessionState, selectedLanguage, auth?.user?.displayName, sendMessage]);

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
          // Reset stream ready flag when disconnected
          isStreamReady.current = false;
          greetingSent.current = false;
        });
        avatar.on(StreamingEvents.STREAM_READY, (event) => {
          console.log(">>>>> Stream ready:", event.detail);
          // Mark stream as ready and trigger greeting
          isStreamReady.current = true;

          // Send greeting after a small delay to ensure everything is initialized
          setTimeout(() => {
            if (!greetingSent.current && auth?.user?.displayName) {
              const currentLang = selectedLanguageRef.current;
              console.log(
                "👋 Stream ready event - sending greeting in language:",
                currentLang
              );
              greetingSent.current = true;

              if (currentLang === "es") {
                sendMessage(`Hola, me llamo ${auth?.user?.displayName}`);
              } else {
                sendMessage(`Hi, my name is ${auth?.user?.displayName}`);
              }
            }
          }, 500); // Small delay to ensure avatar is fully ready
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
            (auth?.user?.username?.toLowerCase() ==
              "jason.padilla@papyrrus.com" ||
              auth?.user?.username?.toLocaleLowerCase() ==
                "irwin.spinello@papyrrus.com" ||
              auth?.user?.username?.toLowerCase() ==
                "john.keating@papyrrus.com") &&
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
            finalMessageContent,
            currentAvatarMessage.current
          );

          if (
            (finalMessageContent &&
              (auth?.user?.username?.toLowerCase() ==
                "jason.padilla@papyrrus.com" ||
                auth?.user?.username?.toLowerCase() ==
                  "irwin.spinello@papyrrus.com")) ||
            (auth?.user?.username?.toLowerCase() ==
              "john.keating@papyrrus.com" &&
              page == 1)
          ) {
            // Check if there was a user navigation request first
            if (userRequestedNavigation.current) {
              // User already requested navigation, check if avatar confirmed it
              console.log(
                "🔄 User navigation request exists, checking avatar confirmation"
              );
              checkAvatarNavigationConfirmation(finalMessageContent);
            } else {
              // No user navigation request, check if avatar message contains navigation keywords (fallback detection)
              console.log(
                "🔍 No user navigation request, checking avatar for navigation keywords"
              );
              checkAvatarNavigationRequest(finalMessageContent);
            }
          }

          // Reset the accumulated message for the next avatar response
          currentAvatarMessage.current = "";
        });

        // Create a personalized config with user's display name
        const personalizedConfig = { ...config };

        // Reset introduction flag for new session
        isAvatarIntroduction.current = true;
        console.log("🔄 Reset avatar introduction flag for new session");

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
    // Use graceful cleanup on component unmount
    stopAvatarGracefully().catch((error) => {
      console.error("Error during component unmount cleanup:", error);
    });
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
            style.chatRightDarkContainer
          )}
          style={{
            width: fullScreen ? "100%" : "75%",
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
              <AvatarVideo
                ref={mediaStream}
                page={page}
                fullScreen={fullScreen}
              />
            ) : (
              <div
                className="w-full h-full flex align-items-center justify-content-center"
                style={{ color: "var(--text-primary-color)" }}
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
                  // color: "--text-secondary-color",
                  color: "#fff",
                  // backgroundColor: "var(--bg-primary)",
                  backgroundColor: "transparent",
                  border: "1px solid #ffffff4d",
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
              {!fullScreen && (
                <Image
                  src={FullScreen}
                  alt="Full Screen"
                  className="cursor-pointer"
                  onClick={() => setFullScreen(true)}
                />
              )}

              {fullScreen && (
                <Image
                  src={ExitScreen}
                  alt="Exit Full Screen"
                  className="cursor-pointer"
                  onClick={() => setFullScreen(false)}
                />
              )}
            </div>
          </div>

          {/* Controls Area */}
          <div
            className="flex flex-column align-items-center justify-content-center w-full"
            style={{
              borderTop: "1px solid #ffffff4d ",
              backgroundColor: "transparent",
              gap: "var(--space-4)",
              flexShrink: 0, // Prevent controls from shrinking
              minHeight: "80px", // Ensure minimum height for controls
              height: "80px", // Fixed height for controls area
            }}
          >
            {sessionState === StreamingAvatarSessionState.CONNECTED ? (
              <AvatarControls
                currentModel={currentModel}
                onModelChange={restartAvatarWithNewConfig}
                toastRef={toast}
              />
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
                  style={{ color: "--text-secondary-color" }}
                >
                  Initializing your avatar...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side - Conversation History (60%) */}
        <div
          className={style.conversationDarkContainer}
          style={{ display: fullScreen ? "none" : "block" }}
        >
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
                style={{ color: "var(--text-primary-color)" }}
              />
              <h3
                className="text-heading-medium text-center"
                style={{ color: "var(--text-primary-color)" }}
              >
                Conversation
              </h3>
              <p
                className="text-body-medium text-center text-light"
                style={{
                  maxWidth: "20rem",
                  lineHeight: "var(--line-height-relaxed)",
                  color: "var(--text-primary-color)",
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
      {auth?.user?.username?.toLowerCase() === "jason.padilla@papyrrus.com" ||
        auth?.user?.username?.toLowerCase() === "irwin.spinello@papyrrus.com" ||
        (auth?.user?.username?.toLowerCase() ===
          "john.keating@papyrrus.com" && (
          <FloatingChatInterface
            sessionState={sessionState}
            page={page}
            currentAvatarId={currentAvatarId}
          />
        ))}
    </div>
  );
}

export default function InteractiveAvatarWrapper({ page }: { page: number }) {
  return <InteractiveAvatar page={page} />;
}
