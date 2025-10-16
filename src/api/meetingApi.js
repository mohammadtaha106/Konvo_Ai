import API from "../utils/api";

import { useQuery } from "@tanstack/react-query";

export const createMeeting = async (meetingId) => {
  const { data } = await API.post("/recordings/meeting", { meetingId });
  return data;
};

export const getMeetings = async () => {
  const { data } = await API.get("/recordings");
  return data;
};

export const useMeetings = () => {
  return useQuery({
    queryKey: ["meetings"], 
    queryFn: getMeetings,   
    refetchInterval: 10000,
  });
};