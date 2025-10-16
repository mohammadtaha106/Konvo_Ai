import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from "react-router-dom";
import React, { useEffect, useRef } from "react";

import { uploadRecording } from "../api/recordingApi";

const Roompage = () => {
  const { roomid } = useParams();
  const meetingRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  useEffect(() => {
    const initMeeting = async () => {
      try {
        const appID = 72940895;
        const serverSecret = import.meta.env.VITE_SERVER_SECRET;
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomid,
          Date.now().toString(),
          "User"
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);

        // ✅ Join Room
        zp.joinRoom({
          container: meetingRef.current,
          sharedLinks: [
            {
              name: "Copy Link",
              url: `${import.meta.env.VITE_BASE_URL}/room/${roomid}`,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall,
          },
          screenSharingConfig: {
            resolution: ZegoUIKitPrebuilt.ScreenSharingResolution_720P,
          },
          onJoinRoom: async () => {
            // ✅ Ask permission for mic
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
              startRecording(stream);
            } catch (err) {
              console.error("Mic permission denied:", err);
            }
          },
          onLeaveRoom: async () => {
            stopRecording();
          },
        });
      } catch (err) {
        console.error("Error joining room:", err);
      }
    };

    initMeeting();
  }, [roomid]);

  // 🎙 Start Recording
  const startRecording = (stream) => {
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", blob);
      formData.append("meetingId", roomid);

            try {
        const res = await uploadRecording(formData);
        console.log("✅ Uploaded successfully:", res);
      }catch (error) {
        console.error("❌ Error uploading recording:", error);
      }
    };

    recorder.start();
    console.log("🎙 Recording started...");
  };

  // ⏹ Stop Recording
  const stopRecording = () => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      console.log("🛑 Recording stopped...");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div ref={meetingRef} style={{ width: "100%", height: "100vh" }}></div>
    </div>
  );
};

export default Roompage;
