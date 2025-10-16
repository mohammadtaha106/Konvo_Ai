import React, { useCallback, useState, useContext, useState as useReactState } from "react";
import { Video, Sparkles, Zap, Brain, MessageSquare, Users } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { createMeeting } from "../api/meetingApi";
import MeetingDrawer from "../components/MeetingDrawer";


function Homepage() {
 
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useReactState(false);

  const generateRoomId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
};
const handleCreateMeeting = useCallback(async () => {
  if (!user) {
    alert("Please login first to create a meeting!");
    navigate("/login");
    return;
  }

  const randomId = generateRoomId();

  try {
    setLoading(true);
    await createMeeting(randomId);
    window.location.href = `/room/${randomId}`;
  } catch (error) {
    console.error("Error creating meeting:", error);
    alert("Failed to create meeting.");
  } finally {
    setLoading(false);
  }
}, [user, navigate]);


  return (<>
  {(user)&& <MeetingDrawer/> }
   
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.15),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.15),transparent_50%)]"></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* ✅ Navbar */}
        <nav className="px-8 py-6 flex items-center justify-between border-b border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Video className="w-8 h-8 text-blue-400" />
              <div className="absolute -inset-1 bg-blue-500/20 blur-xl rounded-full"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              konvo.ai
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <a href="#features" className="text-gray-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#about" className="text-gray-400 hover:text-white transition-colors">
              About
            </a>

            {/* ✅ Login / Logout Button */}
            {user ? (
              <button
                onClick={logout}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 transition"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90 transition"
              >
                Login
              </button>
            )}
          </div>
        </nav>

        {/* ✅ Main Section */}
        <main className="flex-1 flex items-center justify-center px-8">
          <div className="max-w-4xl w-full space-y-12">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm mb-4">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Video Conferencing</span>
              </div>

              <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                  Video Meetings,
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Reimagined with AI
                </span>
              </h1>

              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Experience seamless video conferencing with intelligent meeting summaries, real-time transcription,
                and AI-powered insights. Join or create a room instantly.
              </p>
            </div>

            <div className="max-w-md mx-auto space-y-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <button
  onClick={handleCreateMeeting}
  disabled={loading}
  className="relative w-full px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all hover:scale-[1.02] active:scale-[0.98] group overflow-hidden"
>
  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
  <span className="relative flex items-center justify-center gap-2">
    {loading ? "Creating..." : "Create Instant Meeting"}
    <Zap className="w-5 h-5" />
  </span>
</button>

              </div>

             
            </div>

            {/* ✅ Features Section same */}
            <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
              <div className="group p-6 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent hover:border-blue-500/30 transition-all hover:scale-[1.02]">
                <div className="relative w-12 h-12 mb-4">
                  <Brain className="w-12 h-12 text-blue-400 relative z-10" />
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full group-hover:bg-blue-500/30 transition-all"></div>
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Summaries</h3>
                <p className="text-gray-400 text-sm">
                  Get intelligent meeting summaries with key points, action items, and insights automatically generated.
                </p>
              </div>

              <div className="group p-6 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent hover:border-purple-500/30 transition-all hover:scale-[1.02]">
                <div className="relative w-12 h-12 mb-4">
                  <MessageSquare className="w-12 h-12 text-purple-400 relative z-10" />
                  <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full group-hover:bg-purple-500/30 transition-all"></div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Live Transcription</h3>
                <p className="text-gray-400 text-sm">
                  Real-time speech-to-text transcription with speaker identification and searchable transcripts.
                </p>
              </div>

              <div className="group p-6 rounded-xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent hover:border-pink-500/30 transition-all hover:scale-[1.02]">
                <div className="relative w-12 h-12 mb-4">
                  <Users className="w-12 h-12 text-pink-400 relative z-10" />
                  <div className="absolute inset-0 bg-pink-500/20 blur-xl rounded-full group-hover:bg-pink-500/30 transition-all"></div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Seamless Collaboration</h3>
                <p className="text-gray-400 text-sm">
                  HD video, crystal-clear audio, and instant room joining for effortless team collaboration.
                </p>
              </div>
            </div>
          </div>
        </main>

        <footer className="px-8 py-6 border-t border-white/10 backdrop-blur-sm text-center text-gray-500 text-sm">
          <p>© 2025 konvo.ai - AI-Powered Video Conferencing</p>
        </footer>
      </div>
    </div>
    </>
  );
}

export default Homepage;
