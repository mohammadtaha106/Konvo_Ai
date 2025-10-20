import API from "../utils/api";

export const summarizeMeeting = async (transcriptText, meetingId) => {
  const { data } = await API.post("/gemini/summarize", { transcriptText , meetingId  });
  return data;
};
