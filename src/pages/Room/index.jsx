import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useParams } from "react-router-dom";
import React, { useEffect, useRef } from "react";
import { Video, Brain, Sparkles, Users, Zap, MessageSquare, Clock, CheckCircle } from "lucide-react";

const Roompage = () => {
  const { roomid } = useParams();
  const meetingRef = useRef(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const appID = 72940895;
    const serverSecret = "fd8c30a813342056fe3521af66ac9435";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomid,
      Date.now().toString(),
      "User"
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: meetingRef.current,
      sharedLinks: [
        {
          name: "Copy Link",
          url: `https://localhost:5173/room/${roomid}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
      screenSharingConfig: {
        resolution: ZegoUIKitPrebuilt.ScreenSharingResolution_720P,
      },
    });
  }, [roomid]); 
 return (
  <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
  {/* Header */}
  <div className="absolute top-0 left-0 right-0 z-[9999] bg-black/70 backdrop-blur-xl border-b border-gray-800">
    <div className="max-w-7xl mx-auto px-6 py-4 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Video className="w-7 h-7 text-blue-400 relative z-10" />
            <div className="absolute -inset-1 bg-blue-500/30 blur-md rounded-full"></div>
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent ">
            konvo.ai
          </span>
        </div>

        <div className="flex items-center gap-4 ">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-800">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-gray-200">AI Active</span>
          </div>
          <div className="px-4 py-2 rounded-xl bg-gray-900 border border-gray-700">
            <span className="text-sm font-medium text-gray-300">Room: {roomid}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Main Content */}
  <div className="pt-20 px-6 pb-6">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Video Container */}
        <div className="lg:col-span-2">
          <div
            className="bg-black rounded-2xl shadow-2xl border-2 border-white/20 overflow-hidden"
            style={{ height: "calc(100vh - 200px)" }}
          >
            <div
              ref={meetingRef}
              className="w-full h-full"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Assistant Card */}
          <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">AI Assistant</h3>
                <p className="text-sm text-gray-400">Real-time intelligence</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-br from-blue-950 to-purple-950 border border-blue-800/50">
                <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-100">Live Transcription</p>
                  <p className="text-xs text-gray-400">Converting speech to text</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-br from-purple-950 to-pink-950 border border-purple-800/50">
                <CheckCircle className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-100">Smart Summary</p>
                  <p className="text-xs text-gray-400">Key points extraction</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-br from-pink-950 to-orange-950 border border-pink-800/50">
                <CheckCircle className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-100">Action Items</p>
                  <p className="text-xs text-gray-400">Automatic task detection</p>
                </div>
              </div>
            </div>
          </div>

          {/* Premium Features */}
          <div className="bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 rounded-2xl shadow-xl p-6 text-white border border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-pink-400" />
              <h3 className="text-lg font-bold">Premium Features</h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span>AI-powered transcription</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                <span>Meeting summaries</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-pink-400" />
                <span>Screen sharing</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-300" />
                <span>HD video quality</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-300" />
                <span>Real-time collaboration</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default Roompage;
