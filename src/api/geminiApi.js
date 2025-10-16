import API from "../utils/api";

export const summarizeMeeting = async (transcriptText) => {
  const { data } = await API.post("/gemini/summarize", { transcriptText });
  return data;
};
