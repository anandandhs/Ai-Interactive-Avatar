import {useMemo} from "react";

import Mail from "../../public/Svg/mail.svg";
import BlueMail from "../../public/Svg/blue_mail.svg";
import RedMail from "../../public/Svg/red_mail.svg";
import Password from "../../public/Svg/password.svg";
import BluePassword from "../../public/Svg/blue_password.svg";
import RedPassword from "../../public/Svg/red_password.svg";
import Settings from "../../public/Svg/settings.svg";
import BlueSettings from "../../public/Svg/blue_settings.svg";
import RedSettings from "../../public/Svg/red_settings.svg";
import AiChat from "../../public/Svg/aiChat.svg";
import BlueAiChat from "../../public/Svg/blue_AiChat.svg";
import RedAiChat from "../../public/Svg/red_ai_chat.svg";
import Dasboard from "../../public/Svg/dashboard.svg";
import BlueDasboard from "../../public/Svg/blue_dashboard.svg";
import RedDasboard from "../../public/Svg/red_dashboard.svg";
import ChatClose from "../../public/Svg/chatClose.svg";
import BlueChatClose from "../../public/Svg/blue_chat_close.svg";
import RedChatClose from "../../public/Svg/red_chat_close.svg";
import ChatOpen from "../../public/Svg/chatOpen.svg";
import BlueChatOpen from "../../public/Svg/blue_chat_open.svg";
import RedChatOpen from "../../public/Svg/red_chat_open.svg";
import Home from "../../public/Svg/home.svg";
import BlueHome from "../../public/Svg/blue_home.svg";
import RedHome from "../../public/Svg/red_home.svg";
import Resume from "../../public/Svg/resume.svg";
import BlueResume from "../../public/Svg/blue_resume.svg";
import RedResume from "../../public/Svg/red_resume.svg";
import JobMatch from "../../public/Svg/job_match.svg";
import BlueJobMatch from "../../public/Svg/blue_job_match.svg";
import RedJobMatch from "../../public/Svg/red_job_match.svg";
import Interview from "../../public/Svg/interview.svg";
import BlueInterview from "../../public/Svg/blue_interview.svg";
import RedInterview from "../../public/Svg/red_interview.svg";
import Skills from "../../public/Svg/skills.svg";
import BlueSkills from "../../public/Svg/blue_skills.svg";
import RedSkills from "../../public/Svg/red_skill.svg";
import SettingsIcon from "../../public/Svg/setting_icon.svg";
import BlueSettingsIcon from "../../public/Svg/blue_setting_icon.svg";
import RedSettingsIcon from "../../public/Svg/red_settings_icon.svg";
import NotiIcon from "../../public/Svg/noti_icon.svg";
import BlueNotiIcon from "../../public/Svg/blue_noti.svg";
import RedNotiIcon from "../../public/Svg/red_noti.svg";
import Assignment from "../../public/Svg/assignment.svg";
import BlueAssignment from "../../public/Svg/blue_assignments.svg";
import RedAssignment from "../../public/Svg/red_assignment.svg";
import ExportArrow from "../../public/Svg/openChat.svg";
import BlueExportArrow from "../../public/Svg/blue_open_chat.svg";
import RedExportArrow from "../../public/Svg/red_open_chat.svg";
import TexasWhite from "../../public/Svg/texasBandW.svg";
import OncreativWhite from "../../public/Svg/OnCreativ_White.svg";
import VictorWhite from "../../public/Svg/victor_white.svg";
import Eye from "../../public/Svg/eye.svg";
import BlueEye from "../../public/Svg/blue_eye.svg";
import RedEye from "../../public/Svg/red_eye.svg";
import Back from "../../public/Svg/back_icon.svg";
import BlueBack from "../../public/Svg/blue_back.svg";
import RedBack from "../../public/Svg/red_back.svg";
import LoginRightRectangle from "../../public/Svg/loginRightRectangle.svg";
import RedLoginRightRectangle from "../../public/Svg/red_right_rectangle.svg";
import LoginLeftRectangle from "../../public/Svg/loginLeftRectangle.svg";
import RedLoginLeftRectangle from "../../public/Svg/red_left_rectangle.svg";

export const useThemeIcons = () => {
  const themeIcons = useMemo(() => {
    const isOnCreativTheme = process.env.NEXT_PUBLIC_THEME === "oncreativ";
    const isVictorValleyTheme =
      process.env.NEXT_PUBLIC_THEME === "victorvalley";
    console.log("oncreativ", isOnCreativTheme);
    return {
      mailIcon: isOnCreativTheme
        ? BlueMail
        : isVictorValleyTheme
        ? RedMail
        : Mail,
      passwordIcon: isOnCreativTheme
        ? BluePassword
        : isVictorValleyTheme
        ? RedPassword
        : Password,
      settingsIcon: isOnCreativTheme
        ? BlueSettings
        : isVictorValleyTheme
        ? RedSettings
        : Settings,
      dashboardIcon: isOnCreativTheme
        ? BlueDasboard
        : isVictorValleyTheme
        ? RedDasboard
        : Dasboard,
      aiChatIcon: isOnCreativTheme
        ? BlueAiChat
        : isVictorValleyTheme
        ? RedAiChat
        : AiChat,
      chatCloseIcon: isOnCreativTheme
        ? BlueChatClose
        : isVictorValleyTheme
        ? RedChatClose
        : ChatClose,
      chatOpenIcon: isOnCreativTheme
        ? BlueChatOpen
        : isVictorValleyTheme
        ? RedChatOpen
        : ChatOpen,
      homeIcon: isOnCreativTheme
        ? BlueHome
        : isVictorValleyTheme
        ? RedHome
        : Home,
      resumeIcon: isOnCreativTheme
        ? BlueResume
        : isVictorValleyTheme
        ? RedResume
        : Resume,
      jobMatchIcon: isOnCreativTheme
        ? BlueJobMatch
        : isVictorValleyTheme
        ? RedJobMatch
        : JobMatch,
      interviewIcon: isOnCreativTheme
        ? BlueInterview
        : isVictorValleyTheme
        ? RedInterview
        : Interview,
      skillsIcon: isOnCreativTheme
        ? BlueSkills
        : isVictorValleyTheme
        ? RedSkills
        : Skills,
      settingsideIcon: isOnCreativTheme
        ? BlueSettingsIcon
        : isVictorValleyTheme
        ? RedSettingsIcon
        : SettingsIcon,
      notiIcon: isOnCreativTheme
        ? BlueNotiIcon
        : isVictorValleyTheme
        ? RedNotiIcon
        : NotiIcon,
      assignmentIcon: isOnCreativTheme
        ? BlueAssignment
        : isVictorValleyTheme
        ? RedAssignment
        : Assignment,
      exportIcon: isOnCreativTheme
        ? BlueExportArrow
        : isVictorValleyTheme
        ? RedExportArrow
        : ExportArrow,
      whiteLogoIcon: isOnCreativTheme
        ? OncreativWhite
        : isVictorValleyTheme
        ? VictorWhite
        : TexasWhite,
      eyeIcon: isOnCreativTheme ? BlueEye : isVictorValleyTheme ? RedEye : Eye,
      backIcon: isOnCreativTheme
        ? BlueBack
        : isVictorValleyTheme
        ? RedBack
        : Back,
      RectangleLeftImage: isVictorValleyTheme
        ? RedLoginLeftRectangle
        : LoginLeftRectangle,
      RectangleRightImage: isVictorValleyTheme
        ? RedLoginRightRectangle
        : LoginRightRectangle,
    };
  }, []);

  return themeIcons;
};
