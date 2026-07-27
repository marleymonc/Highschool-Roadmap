import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Brain,
  MessageSquare,
  Send,
  Loader2,
  CheckCircle2,
  Flame,
  Bot,
  User,
  Lightbulb,
  Zap,
  Target,
  ArrowRight,
} from 'lucide-react';
import { StudentProfile, AiSuggestion } from '../types';

interface SmartSuggestionsViewProps {
  profile: StudentProfile;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export const SmartSuggestionsView: React.FC<SmartSuggestionsViewProps> = ({ profile }) => {
  const [suggestions, setSuggestions] = useState<AiSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionsFetched, setSuggestionsFetched] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: `Hello ${profile.studentName}! I am IvyPrep AI, your personalized high school & college admissions counselor. Ask me anything about course selection, SAT/ACT timing, summer programs, or building a standout passion project for Grade ${profile.currentGrade}!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleFetchSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const res = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentGrade: profile.currentGrade,
          targetCollegeTier: profile.targetCollegeTier,
          targetMajor: profile.targetMajor,
          activities: profile.activities,
        }),
      });

      if (!res.ok) throw new Error('Failed to fetch suggestions');
      const data = await res.json();
      setSuggestions(data.suggestions || []);
      setSuggestionsFetched(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isSending) return;

    const userText = chatInput.trim();
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsSending(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
          studentContext: {
            currentGrade: profile.currentGrade,
            targetCollegeTier: profile.targetCollegeTier,
            targetMajor: profile.targetMajor,
            unweightedGpa: profile.unweightedGpa,
            satScore: profile.satScore,
            activitiesCount: profile.activities.length,
          },
        }),
      });

      if (!res.ok) throw new Error('Chat response error');
      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Sorry, I could not generate a response.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'bot',
        text: 'Apologies, I encountered an issue connecting to the AI server. Please check your internet connection and try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-semibold border border-pink-200 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              AI Strategic Counselor
            </span>
            <span className="text-xs text-slate-500">Grade {profile.currentGrade} Recommendations</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">
            Smart Suggestions & AI Counselor
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Get personalized action items for {profile.targetCollegeTier} and chat with IvyPrep AI.
          </p>
        </div>

        <button
          onClick={handleFetchSuggestions}
          disabled={loadingSuggestions}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 shrink-0"
        >
          {loadingSuggestions ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating Suggestions...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              Generate Fresh AI Recommendations
            </>
          )}
        </button>
      </div>

      {/* AI Recommendations Cards Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-base">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <span>Tailored Strategic Recommendations</span>
        </div>

        {!suggestionsFetched && !loadingSuggestions && (
          <div className="p-8 text-center rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
            <Brain className="w-10 h-10 mx-auto text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-700">Click above to generate Grade {profile.currentGrade} AI Recommendations</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Our AI evaluates what competitive admissions committees look for in {profile.targetMajor || 'your major'} for {profile.targetCollegeTier}.
            </p>
            <button
              onClick={handleFetchSuggestions}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-md hover:bg-indigo-500"
            >
              Generate Recommendations Now
            </button>
          </div>
        )}

        {loadingSuggestions && (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3">
            <Loader2 className="w-8 h-8 mx-auto text-indigo-600 animate-spin" />
            <p className="text-xs text-slate-600 font-medium">Analyzing profile against admissions rubric...</p>
          </div>
        )}

        {suggestionsFetched && suggestions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-indigo-300 transition-all shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100">
                    {item.category}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-200">
                    {item.impactLevel} Impact
                  </span>
                </div>

                <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.reason}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Counselor Chatbot Interface */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
        {/* Chat Header */}
        <div className="bg-slate-900 text-white p-4 px-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Ask IvyPrep AI Counselor</h3>
              <p className="text-[11px] text-slate-400">Instant advice on GPA, SAT, APs, essays, and extracurriculars</p>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Live AI Assistant
          </span>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-amber-300 border border-slate-800'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none space-y-2'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                <div
                  className={`text-[10px] text-right mt-1 ${
                    m.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex items-center gap-2 text-slate-400 text-xs italic">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
              <span>IvyPrep AI is typing strategic response...</span>
            </div>
          )}
        </div>

        {/* Quick Sample Questions Prompt Row */}
        <div className="p-2.5 bg-slate-100 border-t border-slate-200 overflow-x-auto flex items-center gap-2 scrollbar-none text-[11px]">
          <span className="text-slate-500 font-semibold text-[10px] shrink-0">Sample Questions:</span>
          <button
            onClick={() => {
              setChatInput('Is 4 AP classes enough for top engineering schools?');
            }}
            className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 whitespace-nowrap"
          >
            "Is 4 AP classes enough for Top 20?"
          </button>
          <button
            onClick={() => {
              setChatInput('How do I build a passion project in CS/Engineering as a high schooler?');
            }}
            className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 whitespace-nowrap"
          >
            "How to build a CS passion project?"
          </button>
          <button
            onClick={() => {
              setChatInput('Should I retake a 1480 SAT for Stanford or MIT?');
            }}
            className="px-2.5 py-1 bg-white hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 whitespace-nowrap"
          >
            "Should I retake a 1480 SAT?"
          </button>
        </div>

        {/* Chat Input Bar */}
        <form onSubmit={handleSendChatMessage} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Ask IvyPrep AI counselor anything about college planning..."
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || isSending}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
