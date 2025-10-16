import API from "../utils/api";

export const transcribeAudio = async (audioUrl) => {
  const { data } = await API.post("/assembly/transcribe", { audioUrl });
  return data;
};
