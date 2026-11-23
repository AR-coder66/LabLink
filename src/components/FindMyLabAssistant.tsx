import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Equipment } from '../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Cpu, 
  MapPin, 
  CalendarPlus, 
  CheckCircle2, 
  ArrowRight,
  Lightbulb,
  Clock,
  Compass
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendedEquipment?: Equipment[];
  suggestedSteps?: string[];
}

interface FindMyLabAssistantProps {
  onSelectBooking: (equipment: Equipment) => void;
}

const SAMPLE_PROMPTS = [
  "I want to build an AI-powered autonomous robot with vision.",
  "I need to train a 7B LLM with high-resolution LoRA weights.",
  "Fabricate custom carbon fiber mounting brackets for a micro-UAV.",
  "Test high-frequency 5G RF signals up to 20 GHz."
];

export const FindMyLabAssistant: React.FC<FindMyLabAssistantProps> = ({ onSelectBooking }) => {
  const { equipmentList } = useApp();
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'assistant',
      text: "Hello! I am your **LabLink Campus AI Assistant**. Tell me about your academic thesis, capstone project, or competition build in plain English. I'll recommend the optimal lab facilities, verified equipment, and compatible time windows for you.",
      timestamp: 'Just now'
    }
  ]);

  // Deterministic Semantic Recommendation Engine
  const generateRecommendations = (prompt: string): { text: string; equipment: Equipment[]; steps: string[] } => {
    const p = prompt.toLowerCase();
    let matches: Equipment[] = [];
    let steps: string[] = [];
    let analysis = '';

    if (p.includes('robot') || p.includes('autonomous') || p.includes('quadruped') || p.includes('kuka') || p.includes('lidar')) {
      matches = equipmentList.filter(e => 
        e.id === 'eq-9' || e.id === 'eq-2' || e.id === 'eq-5' || e.id === 'eq-14'
      );
      analysis = "For autonomous robotics with perception, you need low-latency edge AI compute paired with real-world kinematics testing rigs. The Unitree Quadruped and Jetson AGX Orin will handle real-time spatial SLAM and obstacle classification.";
      steps = [
        "Phase 1: Reserve NVIDIA Jetson AGX Orin for camera driver & ROS2 model inference pipeline.",
        "Phase 2: Reserve Autonomous Systems Arena for Unitree Go2 Quadruped locomotion testing.",
        "Phase 3: Coordinate with Prof. Julian Vance for sensor mount 3D prints in FabLab Bay 3."
      ];
    } else if (p.includes('ai') || p.includes('llm') || p.includes('model') || p.includes('gpu') || p.includes('train') || p.includes('deep learning')) {
      matches = equipmentList.filter(e => 
        e.id === 'eq-1' || e.id === 'eq-8' || e.id === 'eq-15'
      );
      analysis = "For high-performance deep learning and model distillation, 80GB+ VRAM high-bandwidth nodes are critical. We've mapped the NVIDIA HGX H100 8-GPU supernode for heavy multi-GPU distributed training and the Dual RTX 6000 Ada workstation for validation.";
      steps = [
        "Phase 1: Prepare Docker container with FlashAttention-2 and PyTorch 2.4.",
        "Phase 2: Book H100 Supernode slot in Alan Turing Center (off-peak recommended for uninterrupted jobs).",
        "Phase 3: Verify model inference latency using Google Coral Edge TPU rack."
      ];
    } else if (p.includes('print') || p.includes('carbon') || p.includes('material') || p.includes('uav') || p.includes('mechanical') || p.includes('cnc')) {
      matches = equipmentList.filter(e => 
        e.id === 'eq-10' || e.id === 'eq-3' || e.id === 'eq-16' || e.id === 'eq-7'
      );
      analysis = "For physical fabrication and load-bearing structures, Markforged Continuous Carbon Fiber gives aluminum-equivalent tensile yield without machining delays. The Instron 5969 can verify stress curves.";
      steps = [
        "Phase 1: Submit STL / STEP files to Markforged Eiger slicer with continuous fiber routing.",
        "Phase 2: Book SLA resin printer for micro-tolerance visual assemblies.",
        "Phase 3: Run destructive tensile test on Instron 5969 to validate 12G load capacity."
      ];
    } else if (p.includes('rf') || p.includes('signal') || p.includes('wireless') || p.includes('5g') || p.includes('iot') || p.includes('lora')) {
      matches = equipmentList.filter(e => 
        e.id === 'eq-4' || e.id === 'eq-6' || e.id === 'eq-13'
      );
      analysis = "For high-frequency telecommunications and software-defined radio, the Keysight 26.5 GHz Signal Analyzer and NI USRP X310 provide full-band spectrum capture and packet demodulation.";
      steps = [
        "Phase 1: Calibrate Keysight spectrum analyzer with 3.5 GHz differential probes.",
        "Phase 2: Deploy USRP X310 SDR with GNU Radio companion test scripts.",
        "Phase 3: Verify LoRaWAN campus sensor matrix telemetry on Channel 8."
      ];
    } else {
      // General Fallback
      matches = equipmentList.slice(0, 3);
      analysis = `Analyzed your project requirement: "${prompt}". Based on campus laboratory load and multidisciplinary crossover, we recommend these core university resources:`;
      steps = [
        "Phase 1: Book introductory familiarization slot with laboratory supervisor.",
        "Phase 2: Link project proposal in LabLink to unlock priority scoring."
      ];
    }

    return {
      text: analysis,
      equipment: matches,
      steps
    };
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    // Realistic AI thinking delay
    setTimeout(() => {
      const rec = generateRecommendations(query);
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: rec.text,
        timestamp: 'Just now',
        recommendedEquipment: rec.equipment,
        suggestedSteps: rec.steps
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsThinking(false);
    }, 700);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet to-primary flex items-center justify-center text-white shadow-glow-violet">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white">Find My Lab AI Assistant</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet/20 text-violet-light border border-violet/30 font-mono font-medium">
                Campus Knowledge Base
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Natural language project mapper: translates ideas into equipment pipelines & time slots
            </p>
          </div>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber" /> Try asking:
        </span>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs px-3 py-1.5 rounded-full bg-surface-secondary/70 hover:bg-surface-hover text-slate-300 hover:text-white border border-surface-border transition-colors text-left"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="rounded-3xl bg-surface border border-surface-border overflow-hidden shadow-2xl flex flex-col h-[600px]">
        
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-xl bg-violet/20 border border-violet/40 flex items-center justify-center text-violet-light shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-2xl space-y-4 ${isUser ? 'items-end' : 'items-start'}`}>
                  
                  {/* Text bubble */}
                  <div
                    className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-surface-card border border-surface-border text-slate-200 rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Suggested Implementation Steps */}
                  {msg.suggestedSteps && msg.suggestedSteps.length > 0 && (
                    <div className="p-4 rounded-2xl bg-surface-secondary/70 border border-surface-border space-y-2">
                      <span className="text-[11px] font-mono text-primary-light uppercase tracking-wider flex items-center gap-1.5 font-bold">
                        <Compass className="w-3.5 h-3.5" /> Generated Project Resource Plan:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-300">
                        {msg.suggestedSteps.map((step, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommended Equipment Cards */}
                  {msg.recommendedEquipment && msg.recommendedEquipment.length > 0 && (
                    <div className="space-y-2.5">
                      <span className="text-[11px] font-mono text-emerald-light uppercase tracking-wider flex items-center gap-1.5 font-bold">
                        <Cpu className="w-3.5 h-3.5" /> Matched Laboratory Equipment:
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {msg.recommendedEquipment.map((eq) => (
                          <div
                            key={eq.id}
                            className="p-3.5 rounded-xl bg-surface-secondary border border-surface-border hover:border-primary/40 transition-all flex flex-col justify-between"
                          >
                            <div className="flex gap-3">
                              <img
                                src={eq.image}
                                alt={eq.name}
                                className="w-14 h-14 rounded-lg object-cover border border-surface-border"
                              />
                              <div className="min-w-0 flex-1">
                                <span className="text-[10px] font-mono text-primary px-1.5 py-0.5 rounded bg-primary/10">
                                  {eq.resourceId}
                                </span>
                                <h4 className="text-xs font-bold text-white truncate mt-1">
                                  {eq.name}
                                </h4>
                                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                  {eq.location}
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 pt-2.5 border-t border-surface-border/50 flex items-center justify-between text-[11px]">
                              <span className="text-slate-400">Max {eq.maxBookingHours}h slot</span>
                              <button
                                onClick={() => onSelectBooking(eq)}
                                className="px-3 py-1 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold transition-colors flex items-center gap-1 shadow-sm"
                              >
                                <CalendarPlus className="w-3 h-3" /> Book Now
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className="text-[10px] text-slate-500 block px-1">
                    {msg.timestamp}
                  </span>

                </div>

                {isUser && (
                  <div className="w-9 h-9 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary-light shrink-0">
                    <span className="text-xs font-bold font-mono">YOU</span>
                  </div>
                )}
              </div>
            );
          })}

          {isThinking && (
            <div className="flex gap-3 items-center text-xs text-slate-400 italic">
              <div className="w-8 h-8 rounded-xl bg-violet/20 flex items-center justify-center text-violet-light animate-spin">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>LabLink AI is scanning 8 department catalogs and cross-referencing availability...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-surface-card border-t border-surface-border flex items-center gap-3">
          <input
            type="text"
            placeholder="Type your project idea (e.g. 'Build an autonomous orchard inspection drone')..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-3 rounded-2xl bg-surface border border-surface-border text-white text-sm placeholder-slate-500 focus:outline-none focus:border-violet transition-colors"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-primary to-violet hover:opacity-90 disabled:opacity-40 text-white font-semibold text-sm transition-all flex items-center gap-2 shadow-glow-blue"
          >
            <span>Ask</span>
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

