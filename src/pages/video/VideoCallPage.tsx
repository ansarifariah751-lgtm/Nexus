import { useState } from 'react';
import {
  Video, VideoOff, Mic, MicOff, PhoneOff,
  Monitor, MessageSquare, Users, MoreVertical
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isMuted: boolean;
  isVideoOff: boolean;
}

const participants: Participant[] = [
  { id: '1', name: 'Sarah Johnson', avatar: 'SJ', isMuted: false, isVideoOff: false },
  { id: '2', name: 'Michael Rodriguez', avatar: 'MR', isMuted: true, isVideoOff: false },
  { id: '3', name: 'Jennifer Lee', avatar: 'JL', isMuted: false, isVideoOff: true },
];

export default function VideoCallPage() {
  const [callActive, setCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', sender: 'Michael Rodriguez', text: 'Hello everyone!', time: '10:01 AM' },
    { id: '2', sender: 'Jennifer Lee', text: 'Hi! Ready to start?', time: '10:02 AM' },
  ]);
  const [callDuration, setCallDuration] = useState(0);
  const [timerInterval, setTimerInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  const handleStartCall = () => {
    setCallActive(true);
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    setTimerInterval(interval);
  };

  const handleEndCall = () => {
    setCallActive(false);
    setIsMuted(false);
    setIsVideoOff(false);
    setIsScreenSharing(false);
    setCallDuration(0);
    if (timerInterval) clearInterval(timerInterval);
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    setMessages([...messages, {
      id: Date.now().toString(),
      sender: 'You',
      text: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setChatMessage('');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Video Call</h1>
        <p className="text-gray-500 mt-1">Connect face-to-face with investors and entrepreneurs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Area */}
        <div className="lg:col-span-2">
          <div className="bg-gray-900 rounded-2xl overflow-hidden relative" style={{ minHeight: '420px' }}>

            {/* Call Not Started */}
            {!callActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold mb-4">
                  MR
                </div>
                <h2 className="text-xl font-semibold mb-1">Investment Discussion</h2>
                <p className="text-gray-400 mb-8">Michael Rodriguez • Jennifer Lee</p>
                <button
                  onClick={handleStartCall}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 transition"
                >
                  <Video size={20} />
                  Start Call
                </button>
              </div>
            )}

            {/* Call Active */}
            {callActive && (
              <>
                {/* Main participant video */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {isVideoOff ? (
                    <div className="flex flex-col items-center text-white">
                      <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold mb-3">
                        MR
                      </div>
                      <p className="text-gray-300">Camera is off</p>
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-4xl font-bold mx-auto mb-3">
                          MR
                        </div>
                        <p className="text-lg font-medium">Michael Rodriguez</p>
                        <p className="text-gray-400 text-sm">Investor</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Screen share banner */}
                {isScreenSharing && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-sm px-4 py-1.5 rounded-full">
                    📺 You are sharing your screen
                  </div>
                )}

                {/* Call duration */}
                <div className="absolute top-4 left-4 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
                  🔴 {formatDuration(callDuration)}
                </div>

                {/* Self video (picture-in-picture) */}
                <div className="absolute bottom-20 right-4 w-32 h-24 bg-gray-700 rounded-xl overflow-hidden border-2 border-gray-600 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold mx-auto mb-1">
                      SJ
                    </div>
                    <p className="text-xs">You</p>
                  </div>
                </div>

                {/* Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-center gap-4">
                    {/* Mute */}
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                        isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500'
                      } text-white`}
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>

                    {/* Video toggle */}
                    <button
                      onClick={() => setIsVideoOff(!isVideoOff)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                        isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-500'
                      } text-white`}
                      title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
                    >
                      {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                    </button>

                    {/* End call */}
                    <button
                      onClick={handleEndCall}
                      className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center text-white transition"
                      title="End call"
                    >
                      <PhoneOff size={22} />
                    </button>

                    {/* Screen share */}
                    <button
                      onClick={() => setIsScreenSharing(!isScreenSharing)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                        isScreenSharing ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'
                      } text-white`}
                      title="Screen share"
                    >
                      <Monitor size={20} />
                    </button>

                    {/* Chat */}
                    <button
                      onClick={() => { setShowChat(!showChat); setShowParticipants(false); }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                        showChat ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'
                      } text-white`}
                      title="Chat"
                    >
                      <MessageSquare size={20} />
                    </button>

                    {/* Participants */}
                    <button
                      onClick={() => { setShowParticipants(!showParticipants); setShowChat(false); }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
                        showParticipants ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-600 hover:bg-gray-500'
                      } text-white`}
                      title="Participants"
                    >
                      <Users size={20} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Participant thumbnails */}
          {callActive && (
            <div className="flex gap-3 mt-3">
              {participants.map((p) => (
                <div key={p.id} className="flex-1 bg-gray-800 rounded-xl p-3 flex flex-col items-center relative">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm mb-1">
                    {p.avatar}
                  </div>
                  <p className="text-white text-xs font-medium truncate w-full text-center">{p.name.split(' ')[0]}</p>
                  <div className="flex gap-1 mt-1">
                    {p.isMuted && <span className="text-red-400"><MicOff size={12} /></span>}
                    {p.isVideoOff && <span className="text-red-400"><VideoOff size={12} /></span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Chat Panel */}
          {showChat && callActive && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col" style={{ height: '420px' }}>
              <div className="p-3 border-b border-gray-100 font-semibold text-gray-800 text-sm">
                In-call Chat
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'You' ? 'items-end' : 'items-start'}`}>
                    <p className="text-xs text-gray-400 mb-0.5">{msg.sender} · {msg.time}</p>
                    <div className={`px-3 py-2 rounded-xl text-sm max-w-[85%] ${
                      msg.sender === 'You' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-100 flex gap-2">
                <input
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type a message..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {/* Participants Panel */}
          {showParticipants && callActive && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-3 border-b border-gray-100 font-semibold text-gray-800 text-sm">
                Participants ({participants.length})
              </div>
              <div className="p-3 space-y-3">
                {participants.map((p) => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                        {p.avatar}
                      </div>
                      <p className="text-sm text-gray-800">{p.name}</p>
                    </div>
                    <div className="flex gap-1">
                      {p.isMuted && <MicOff size={14} className="text-red-400" />}
                      {p.isVideoOff && <VideoOff size={14} className="text-red-400" />}
                      {!p.isMuted && !p.isVideoOff && <span className="text-xs text-green-500">Active</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meeting Info */}
          {!showChat && !showParticipants && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 mb-3">Meeting Info</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Topic:</span> Investment Discussion</p>
                <p><span className="font-medium">Host:</span> Sarah Johnson</p>
                <p><span className="font-medium">Participants:</span> 3</p>
                <p><span className="font-medium">Status:</span>
                  <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                    callActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {callActive ? 'In Progress' : 'Not Started'}
                  </span>
                </p>
              </div>

              {!callActive && (
                <button
                  onClick={handleStartCall}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Video size={16} />
                  Join Call
                </button>
              )}

              {callActive && (
                <button
                  onClick={handleEndCall}
                  className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition flex items-center justify-center gap-2"
                >
                  <PhoneOff size={16} />
                  Leave Call
                </button>
              )}
            </div>
          )}

          {/* More options */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MoreVertical size={16} />
              Quick Actions
            </h3>
            <div className="space-y-2">
              <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition">
                📅 Schedule Follow-up Meeting
              </button>
              <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition">
                📄 Share Document
              </button>
              <button className="w-full text-left text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg transition">
                💬 Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}