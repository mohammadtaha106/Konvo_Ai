import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getMeetings } from "../api/meetingApi";
import { transcribeAudio } from "../api/assemblyApi";
import { summarizeMeeting } from "../api/geminiApi";
import {
  Video,
  FileText,
  Sparkles,
  Calendar,
  Clock,
  X,
  Loader2,
  Brain,
  CheckCircle,
  ChevronRight,
  Play,
  Pause,
  Volume2
} from "lucide-react";

const TypewriterText = ({ text, speed = 20 }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-gray-300 whitespace-pre-wrap leading-relaxed"
    >
      {displayedText}
      {currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="inline-block w-0.5 h-5 bg-blue-400 ml-1"
        />
      )}
    </motion.p>
  );
};

const MeetingDrawer = () => {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

 
  

  useEffect(() => {
    const fetchMeetings = async () => {
      setIsLoading(true);
      const data = await getMeetings();
      setMeetings(data);
      setIsLoading(false);
    };
    fetchMeetings();
  }, []);



  
  const handleViewTranscript = async (meeting) => {

    
  setSelectedMeeting(meeting);
  setIsDrawerOpen(true);
  setTranscript(meeting?.transcriptText ?? "");
  setSummary("");
  setLoadingTranscript(true);

  try {
    const res = await transcribeAudio(meeting.audioUrl, meeting.meetingId); 
    setTranscript(res.text || "No transcript available.");
  } catch (err) {
    console.error("Error in transcription:", err);
    setTranscript("Error fetching transcript.");
  } finally {
    setLoadingTranscript(false);
  }
};


const handleSummarize = async () => {
  if (!transcript || !selectedMeeting?._id) return;


  setSummary("");
  setLoadingSummary(true);
  try {
    const res = await summarizeMeeting(transcript, selectedMeeting.meetingId);
    setSummary(res.summary);
  } catch {
    setSummary("Failed to summarize.");
  } finally {
    setLoadingSummary(false);
  }
};


  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => {
      setSelectedMeeting(null);
      setTranscript("");
      setSummary("");
    }, 300);
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="fixed bottom-8 right-8 z-30 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all flex items-center gap-2"
      >
        <Video className="w-5 h-5" />
        <span>My Meetings</span>
        <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 h-[70vh] bg-gradient-to-b from-gray-900 via-black to-black border-t border-white/10 shadow-2xl z-50 overflow-hidden rounded-t-3xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_50%)]"></div>

              <div className="relative h-full flex flex-col">
                <div className="flex-shrink-0 px-8 py-6 border-b border-white/10 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Video className="w-6 h-6 text-blue-400 relative z-10" />
                        <div className="absolute -inset-2 bg-blue-500/20 blur-xl rounded-full"></div>
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Your Meetings</h2>
                        <p className="text-sm text-gray-400">View transcripts and AI summaries</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-400" />
                    </motion.button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-8 py-6">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                      <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                    </div>
                  ) : meetings?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="relative mb-4">
                        <Video className="w-16 h-16 text-gray-600" />
                        <div className="absolute -inset-2 bg-gray-600/10 blur-xl rounded-full"></div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-400 mb-2">No meetings yet</h3>
                      <p className="text-gray-500">Your meeting recordings will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {meetings?.map((meeting, index) => (
                        <motion.div
                          key={meeting._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="group relative"
                        >
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-hover:opacity-100 blur transition-opacity"></div>

                          <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="flex-shrink-0">
                                <div className="relative">
                                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                                    <Video className="w-6 h-6 text-blue-400" />
                                  </div>
                                  <div className="absolute -inset-1 bg-blue-500/20 blur-lg rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <h3 className="text-white font-semibold mb-1 truncate">
                                  Meeting {meeting.meetingId}
                                </h3>
                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{meeting.date}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{new Date(meeting.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <audio
                                  controls
                                  className="h-10 audio-player"
                                  style={{
                                    filter: 'invert(1) hue-rotate(180deg)',
                                    width: '200px'
                                  }}
                                >
                                  <source src={meeting.audioUrl} type="audio/webm" />
                                </audio>

                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleViewTranscript(meeting)}
                                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold flex items-center gap-2 shadow-lg hover:shadow-blue-500/25 transition-all"
                                >
                                  <FileText className="w-4 h-4" />
                                  View
                                </motion.button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-full md:w-[600px] bg-gradient-to-b from-gray-900 via-black to-black shadow-2xl z-[70] overflow-y-auto border-l border-white/10"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.15),transparent_50%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.15),transparent_50%)]"></div>

              <div className="relative">
                <div className="sticky top-0 bg-black/90 backdrop-blur-xl border-b border-white/10 z-10">
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
                        <FileText className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">Meeting Details</h2>
                        <p className="text-sm text-gray-400">{selectedMeeting?.meetingId}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={closeDrawer}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-400" />
                    </motion.button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent p-6">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>

                    <div className="relative">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-bold text-white">Transcript</h3>
                      </div>

                      {loadingTranscript ? (
                        <div className="flex items-center gap-3 text-blue-400">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="text-sm font-medium">Generating transcript...</span>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
                        >
                          {transcript}
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {transcript && !loadingTranscript && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSummarize}
                      disabled={loadingSummary}
                      className="w-full relative group overflow-hidden rounded-xl"
                    >
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                      <div className="relative px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl font-semibold text-white shadow-lg flex items-center justify-center gap-2">
                        {loadingSummary ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>AI is thinking...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            <span>Summarize with Konvo-AI</span>
                            <Brain className="w-5 h-5" />
                          </>
                        )}
                      </div>
                    </motion.button>
                  )}

                  <AnimatePresence>
                    {summary && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-transparent p-6"
                      >
                        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>

                        <div className="relative">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
                              <Brain className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                              AI Summary
                            </h3>
                            <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />
                          </div>

                          <TypewriterText text={summary} speed={15} />

                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-xs text-gray-500"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                            <span>Generated by Konvo-AI</span>
                            <Clock className="w-3.5 h-3.5 ml-auto" />
                            <span>Just now</span>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MeetingDrawer;
