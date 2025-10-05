import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type MicPermissionState = "granted" | "denied" | "prompt" | "unsupported";

export type AudioDevice = {
  deviceId: string;
  label: string;
};

const DEFAULT_CONSTRAINTS: MediaStreamConstraints = {
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  video: false,
};

export function useMicrophone() {
  const [permission, setPermission] = useState<MicPermissionState>("prompt");
  const [devices, setDevices] = useState<AudioDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initialised, setInitialised] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  const isSupported = typeof navigator !== "undefined" && !!navigator.mediaDevices;

  const effectiveConstraints = useMemo(() => {
    if (selectedDeviceId) {
      return {
        audio: {
          ...((DEFAULT_CONSTRAINTS.audio as MediaTrackConstraints) || {}),
          deviceId: { exact: selectedDeviceId },
        },
        video: false,
      } as MediaStreamConstraints;
    }
    return DEFAULT_CONSTRAINTS;
  }, [selectedDeviceId]);

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => {
      try {
        t.stop();
      } catch {}
    });
  }, []);

  const refreshDevices = useCallback(async () => {
    if (!isSupported) return;
    try {
      const all = await navigator.mediaDevices.enumerateDevices();
      const audioIns = all
        .filter((d) => d.kind === "audioinput")
        .map((d) => ({ deviceId: d.deviceId, label: d.label || "Microphone" }));
      setDevices(audioIns);
      if (!selectedDeviceId && audioIns.length > 0) {
        setSelectedDeviceId(audioIns[0].deviceId);
      }
    } catch (e) {
      console.warn("Failed to enumerate devices", e);
    }
  }, [isSupported, selectedDeviceId]);

  const queryPermission = useCallback(async () => {
    if (!isSupported) {
      setPermission("unsupported");
      return "unsupported" as MicPermissionState;
    }
    try {
      // Not all browsers support Permissions API for microphone
      // @ts-ignore
      if (navigator.permissions && navigator.permissions.query) {
        // @ts-ignore
        const status = await navigator.permissions.query({ name: "microphone" as any });
        const state = status.state as MicPermissionState;
        setPermission(state);
        return state;
      }
      // Fallback: try a minimal getUserMedia call to infer permission state
      await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      setPermission("granted");
      return "granted";
    } catch (err: any) {
      const msg = err?.name === "NotAllowedError" ? "denied" : "prompt";
      setPermission(msg as MicPermissionState);
      return msg as MicPermissionState;
    }
  }, [isSupported]);

  const ensurePermission = useCallback(async () => {
    setError(null);
    const state = await queryPermission();
    if (state === "granted") return true;

    if (!isSupported) {
      setError("Microphone not supported by this browser");
      return false;
    }

    try {
      const tmp = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      // Stop immediately to just warm up the permission without keeping the device busy
      tmp.getTracks().forEach((t) => t.stop());
      setPermission("granted");
      await refreshDevices();
      return true;
    } catch (e: any) {
      setError(e?.message || "Microphone permission denied");
      setPermission("denied");
      return false;
    }
  }, [isSupported, queryPermission, refreshDevices]);

  const getStream = useCallback(async () => {
    setError(null);
    if (!isSupported) {
      setError("MediaDevices API not supported");
      return null;
    }

    // Reuse existing active stream
    if (streamRef.current && streamRef.current.getAudioTracks().some((t) => t.readyState === "live")) {
      return streamRef.current;
    }

    try {
      const ms = await navigator.mediaDevices.getUserMedia(effectiveConstraints);
      streamRef.current = ms;
      return ms;
    } catch (e: any) {
      setError(e?.message || "Unable to access the microphone");
      return null;
    }
  }, [effectiveConstraints, isSupported]);

  const releaseStream = useCallback(() => {
    stopTracks();
    streamRef.current = null;
  }, [stopTracks]);

  useEffect(() => {
    if (!isSupported) return;

    const handleDeviceChange = async () => {
      await refreshDevices();
      // If current selected device disappeared, switch to default
      if (
        selectedDeviceId &&
        !devices.some((d) => d.deviceId === selectedDeviceId)
      ) {
        setSelectedDeviceId(devices[0]?.deviceId || null);
        // Currently we do not auto-reacquire a new stream here because the SDK manages input.
        // We only ensure the permission and device list are up to date.
      }
    };

    navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", handleDeviceChange);
    };
  }, [devices, isSupported, refreshDevices, selectedDeviceId]);

  useEffect(() => {
    if (initialised) return;
    setInitialised(true);
    // Initial device list population (label population requires prior permission)
    refreshDevices();
  }, [initialised, refreshDevices]);

  return {
    isSupported,
    permission,
    devices,
    selectedDeviceId,
    setSelectedDeviceId,
    error,
    ensurePermission,
    getStream,
    releaseStream,
  };
}
