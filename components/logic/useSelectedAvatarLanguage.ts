import { useStreamingAvatarContext } from "./context";

export const useSelectedAvatarLanguage = () => {
  const languageOptions = [
    { label: "English", value: "en" },
    { label: "Spanish", value: "es" },
  ];

  const { selectedLanguage, setSelectedLanguage } = useStreamingAvatarContext();

  return { selectedLanguage, setSelectedLanguage, languageOptions };
};
