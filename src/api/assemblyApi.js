import API from "../utils/api";

export const transcribeAudio = async (audioUrl,meetingId) => {
  const { data } = await API.post("/assembly/transcribe", { audioUrl, meetingId  });
  return data;
};
