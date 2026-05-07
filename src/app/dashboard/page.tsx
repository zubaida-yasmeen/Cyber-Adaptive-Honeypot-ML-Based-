"use client";

import { useEffect, useState, useCallback } from "react";
import { BrainCircuit, LayoutDashboard, History, Settings, LogOut, Fingerprint, Network } from "lucide-react";
import { explainThreatDecision } from "@/ai/flows/explain-threat-decision";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DashboardView, PCAMapView, ClusteringView, QLearningView, MLParamsView, type HistoricalEvent } from "@/components/DashboardViews";

type ActiveView = "dashboard" | "pca" | "clustering" | "qlearning" | "params";

export default function Dashboard() {
  const [activeView, setActiveView] = useState<ActiveView>("dashboard");
  const [currentPredict, setCurrentPredict] = useState<any>(null);
  const [history, setHistory] = useState<HistoricalEvent[]>([]);
  const [explanation, setExplanation] = useState<string>("");
  const [isExplaining, setIsExplaining] = useState(false);
  const [isLive, setIsLive] = useState(true);

  const handleExplain = useCallback(async (data: any) => {
    setIsExplaining(true);
    try {
      const result = await explainThreatDecision({
        frequency: data.input.frequency,
        payload_size: data.input.payload_size,
        special_chars: data.input.special_chars,
        path_type: data.input.path_type,
        predicted_class: data.predicted_class,
        cluster: data.cluster,
        recommended_action: data.recommended_action
      });
      setExplanation(result.explanation);
    } catch (err) {
      setExplanation("Could not generate AI explanation at this time.");
    } finally {
      setIsExplaining(false);
    }
  }, []);

  const fetchPrediction = useCallback(async () => {
    try {
      const res = await fetch('/api/predict');
      const data = await res.json();
      setCurrentPredict(data);
      
      const newEvent: HistoricalEvent = {
        id: Math.random().toString(36).substring(7),
        time: new Date().toLocaleTimeString(),
        score: data.threat_score,
        class: data.predicted_class,
        action: data.recommended_action,
        payload: data.input.payload_size
      };

      setHistory(prev => [newEvent, ...prev].slice(0, 15));

      if (data.predicted_class !== 'Normal') {
        handleExplain(data);
      } else {
        setExplanation("System operational. Baseline traffic patterns verified by 4 multi-class models.");
      }
    } catch (e) {
      console.error("Fetch error", e);
    }
  }, [handleExplain]);

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(fetchPrediction, 4000);
    return () => clearInterval(interval);
  }, [isLive, fetchPrediction]);

  const getNavStyle = (view: ActiveView) => 
    activeView === view 
      ? "w-full justify-start gap-3 bg-primary/10 text-primary border-l-2 border-l-primary rounded-none transition-all duration-300" 
      : "w-full justify-start gap-3 text-muted-foreground hover:text-foreground transition-all duration-300";

  return (
    <div className="flex h-screen overflow-hidden bg-background relative">
      <div className="scanline" />
      
      {/* Sidebar */}
      <aside className="w-64 border-r bg-card/40 flex flex-col relative z-20">
        <div className="p-8">
          <div className="flex items-center gap-3 text-primary mb-2">
            <BrainCircuit className="w-9 h-9 glow-primary p-1 rounded-lg bg-primary/10" />
            <span className="font-headline font-bold text-xl tracking-tighter">CyberNode</span>
          </div>
          <p className="text-[10px] text-muted-foreground font-code uppercase tracking-[0.25em]">ML-Adaptive Honeypot</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Button 
            variant={activeView === "dashboard" ? "secondary" : "ghost"} 
            className={getNavStyle("dashboard")}
            onClick={() => setActiveView("dashboard")}
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Button>
          <Button 
            variant={activeView === "pca" ? "secondary" : "ghost"} 
            className={getNavStyle("pca")}
            onClick={() => setActiveView("pca")}
          >
            <Fingerprint className="w-4 h-4" />
            Traffic PCA Map
          </Button>
          <Button 
            variant={activeView === "clustering" ? "secondary" : "ghost"} 
            className={getNavStyle("clustering")}
            onClick={() => setActiveView("clustering")}
          >
            <Network className="w-4 h-4" />
            Clustering Model
          </Button>
          <Button 
            variant={activeView === "qlearning" ? "secondary" : "ghost"} 
            className={getNavStyle("qlearning")}
            onClick={() => setActiveView("qlearning")}
          >
            <History className="w-4 h-4" />
            Q-Learning Logs
          </Button>
          <Button 
            variant={activeView === "params" ? "secondary" : "ghost"} 
            className={getNavStyle("params")}
            onClick={() => setActiveView("params")}
          >
            <Settings className="w-4 h-4" />
            ML Parameters
          </Button>
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-muted/40 rounded-xl p-4 border mb-6">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="text-muted-foreground">Backend Hub</span>
              <span className="text-green-400 flex items-center gap-1.5 font-bold">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                ONLINE
              </span>
            </div>
            <div className="space-y-1.5">
              <div className="text-[9px] text-muted-foreground font-code flex justify-between">
                <span>SCALER:</span> <span className="text-accent">STANDARD</span>
              </div>
              <div className="text-[9px] text-muted-foreground font-code flex justify-between">
                <span>REDUCTION:</span> <span className="text-accent">PCA (2D)</span>
              </div>
              <div className="text-[9px] text-muted-foreground font-code flex justify-between">
                <span>PIPELINE:</span> <span className="text-accent">MULTI-CLASSIFIER</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="w-4 h-4" />
            System Shutdown
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 space-y-8">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/40 bg-clip-text text-transparent animate-in slide-in-from-left-4 duration-500">
              {activeView === "dashboard" && "Threat Intelligence Hub"}
              {activeView === "pca" && "Traffic Map Visualization"}
              {activeView === "clustering" && "Traffic Clustering"}
              {activeView === "qlearning" && "Adaptive Policy Engine"}
              {activeView === "params" && "ML Pipeline Config"}
            </h1>
            <p className="text-muted-foreground text-sm font-medium animate-in slide-in-from-left-4 duration-700">Real-time explainable ML analysis for adaptive network response.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-muted/30 border border-white/5 transition-all duration-300">
              <div className={cn("w-2.5 h-2.5 rounded-full transition-all duration-500", isLive ? "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" : "bg-red-400")} />
              <span className="text-xs font-bold tracking-widest uppercase">{isLive ? "Live Stream" : "System Paused"}</span>
            </div>
            <Button onClick={() => setIsLive(!isLive)} variant={isLive ? "outline" : "default"} size="sm" className="px-6 rounded-full font-bold transition-all duration-300 transform hover:scale-105 active:scale-95">
              {isLive ? "Pause Sensors" : "Resume Analysis"}
            </Button>
          </div>
        </header>

        <div className="relative transition-all duration-500">
          {activeView === "dashboard" && (
            <DashboardView 
              currentPredict={currentPredict} 
              history={history} 
              explanation={explanation} 
              isExplaining={isExplaining} 
            />
          )}
          {activeView === "pca" && <PCAMapView currentPredict={currentPredict} />}
          {activeView === "clustering" && <ClusteringView />}
          {activeView === "qlearning" && <QLearningView />}
          {activeView === "params" && <MLParamsView />}
        </div>
      </main>
    </div>
  );
}