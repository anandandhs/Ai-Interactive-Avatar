import {useMemo} from "react";

import Mail from "../../public/Svg/mail.svg";
import BlueMail from "../../public/Svg/blue_mail.svg";
import Password from "../../public/Svg/password.svg";
import BluePassword from "../../public/Svg/blue_password.svg";
import Settings from "../../public/Svg/settings.svg";
import BlueSettings from "../../public/Svg/blue_settings.svg";
import AiChat from "../../public/Svg/aiChat.svg";
import BlueAiChat from "../../public/Svg/blue_AiChat.svg";
import Dasboard from "../../public/Svg/dashboard.svg";
import BlueDasboard from "../../public/Svg/blue_dashboard.svg";
import ChatClose from "../../public/Svg/chatClose.svg";
import BlueChatClose from "../../public/Svg/blue_chat_close.svg";
import ChatOpen from "../../public/Svg/chatOpen.svg";
import BlueChatOpen from "../../public/Svg/blue_chat_open.svg";
import Home from "../../public/Svg/home.svg";
import BlueHome from "../../public/Svg/blue_home.svg";
import Resume from "../../public/Svg/resume.svg";
import BlueResume from "../../public/Svg/blue_resume.svg";
import JobMatch from "../../public/Svg/job_match.svg";
import BlueJobMatch from "../../public/Svg/blue_job_match.svg";
import Interview from "../../public/Svg/interview.svg";
import BlueInterview from "../../public/Svg/blue_interview.svg";
import Skills from "../../public/Svg/skills.svg";
import BlueSkills from "../../public/Svg/blue_skills.svg";
import SettingsIcon from "../../public/Svg/setting_icon.svg";
import BlueSettingsIcon from "../../public/Svg/blue_setting_icon.svg";
import NotiIcon from "../../public/Svg/noti_icon.svg";
import BlueNotiIcon from "../../public/Svg/blue_noti.svg";
import Assignment from "../../public/Svg/assignment.svg";
import BlueAssignment from "../../public/Svg/blue_assignments.svg";
import ExportArrow from "../../public/Svg/openChat.svg";
import BlueExportArrow from "../../public/Svg/blue_open_chat.svg";
import TexasWhite from "../../public/Svg/texasBandW.svg";
import OncreativWhite from "../../public/Svg/OnCreativ_White.svg";

export const useThemeIcons = () => {
  const themeIcons = useMemo(() => {
    const isOnCreativTheme = process.env.NEXT_PUBLIC_THEME === "oncreativ";
    console.log("oncreativ", isOnCreativTheme);
    return {
      mailIcon: isOnCreativTheme ? BlueMail : Mail,
      passwordIcon: isOnCreativTheme ? BluePassword : Password,
      settingsIcon: isOnCreativTheme ? BlueSettings : Settings,
      dashboardIcon: isOnCreativTheme ? BlueDasboard : Dasboard,
      aiChatIcon: isOnCreativTheme ? BlueAiChat : AiChat,
      chatCloseIcon: isOnCreativTheme ? BlueChatClose : ChatClose,
      chatOpenIcon: isOnCreativTheme ? BlueChatOpen : ChatOpen,
      homeIcon: isOnCreativTheme ? BlueHome : Home,
      resumeIcon: isOnCreativTheme ? BlueResume : Resume,
      jobMatchIcon: isOnCreativTheme ? BlueJobMatch : JobMatch,
      interviewIcon: isOnCreativTheme ? BlueInterview : Interview,
      skillsIcon: isOnCreativTheme ? BlueSkills : Skills,
      settingsideIcon: isOnCreativTheme ? BlueSettingsIcon : SettingsIcon,
      notiIcon: isOnCreativTheme ? BlueNotiIcon : NotiIcon,
      assignmentIcon: isOnCreativTheme ? BlueAssignment : Assignment,
      exportIcon: isOnCreativTheme ? BlueExportArrow : ExportArrow,
      whiteLogoIcon: isOnCreativTheme ? OncreativWhite : TexasWhite,
    };
  }, []);

  return themeIcons;
};
