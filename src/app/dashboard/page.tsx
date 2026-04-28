"use client";

import { useEffect, useState, useCallback } from "react";
import { Activity, Shield, Terminal, BrainCircuit, Network, LayoutDashboard, History, Settings, LogOut, Info, AlertTriangle, Fingerprint } from "lucide-react";
import { AdaptiveControls } from "@/components/AdaptiveControls";
import { ThreatScoreChart } from "@/components/ThreatScoreChart";
import { ModelConsensus } from "@/components/ModelConsensus";
import { explainThreatDecision } from "@/ai/flows/explain-threat-decision";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface HistoricalEvent {
  time: string;
  score: number;
  class: string;
  action: string;
  payload: number;
}

export default function Dashboard() {
  const [currentPredict, setCurrentPredict] = useState<any>(null);
  const [history, setHistory] = useState<HistoricalEvent[]>([]);
  const [explanation, setExplanation] = useState<string>("");
  const [isExplaining, setIsExplaining] = useState(false);
  const [isLive, setIsLive] = useState(true);

  const fetchPrediction = useCallback(async () => {
    try {
      const res = await fetch('/api/predict');
      const data = await res.json();
      setCurrentPredict(data);
      
      const newEvent: HistoricalEvent = {
        time: new Date().toLocaleTimeString(),
        score: data.threat_score,
        class: data.predicted_class,
        action: data.recommended_action,
        payload: data.input.payload_size
      };

      setHistory(prev => [newEvent, ...prev].slice(0, 15));

      // Auto-explain for suspicious/attack
      if (data.predicted_class !== 'Normal') {
        handleExplain(data);
      } else {
        setExplanation("System operational. Baseline traffic patterns verified by 4 multi-class models.");
      }
    } catch (e) {
      console.error("Fetch error", e);
    }
  }, []);

  const handleExplain = async (data: any) => {
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
  };

  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(fetchPrediction, 4000);
    return () => clearInterval(interval);
  }, [isLive, fetchPrediction]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
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
          <Button variant="secondary" className="w-full justify-start gap-3 bg-primary/10 text-primary border-l-2 border-l-primary rounded-none">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
            <Fingerprint className="w-4 h-4" />
            Traffic PCA Map
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
            <Network className="w-4 h-4" />
            Clustering Model
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
            <History className="w-4 h-4" />
            Q-Learning Logs
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
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
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive/70 hover:text-destructive hover:bg-destructive/10">
            <LogOut className="w-4 h-4" />
            System Shutdown
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 space-y-8">
        <header className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/40 bg-clip-text text-transparent">
              Threat Intelligence Hub
            </h1>
            <p className="text-muted-foreground text-sm font-medium">Real-time explainable ML analysis for adaptive network response.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-muted/30 border border-white/5">
              <div className={cn("w-2.5 h-2.5 rounded-full", isLive ? "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" : "bg-red-400")} />
              <span className="text-xs font-bold tracking-widest uppercase">{isLive ? "Live Stream" : "System Paused"}</span>
            </div>
            <Button onClick={() => setIsLive(!isLive)} variant={isLive ? "outline" : "default"} size="sm" className="px-6 rounded-full font-bold">
              {isLive ? "Pause Sensors" : "Resume Analysis"}
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 space-y-8">
            <AdaptiveControls 
              predictedClass={currentPredict?.predicted_class} 
              action={currentPredict?.recommended_action}
              cluster={currentPredict?.cluster}
              score={currentPredict?.threat_score || 0}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ThreatScoreChart 
                data={history.map(h => ({ time: h.time, score: h.score })).reverse()} 
              />
              <ModelConsensus models={currentPredict?.model_details} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-accent" />
                    Feature Engineering Pipeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {currentPredict ? (
                    <div className="font-code text-[11px] bg-black/40 p-5 rounded-xl border border-white/5 space-y-3">
                      <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                        <span className="text-muted-foreground">PCA COORDINATES:</span>
                        <span className="text-accent font-bold">[{currentPredict.pca_features[0].toFixed(3)}, {currentPredict.pca_features[1].toFixed(3)}]</span>
                      </div>
                      <div className="space-y-1 pt-2">
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-muted-foreground uppercase">Method:</span>
                          <Badge variant="outline" className="text-[10px] text-primary border-primary/20">{currentPredict.input.path_type}</Badge>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-muted-foreground uppercase">Freq Norm:</span>
                          <span>{currentPredict.features[0].toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-1">
                          <span className="text-muted-foreground uppercase">Payload Norm:</span>
                          <span>{currentPredict.features[1].toFixed(4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground uppercase">Special Chars:</span>
                          <span className={currentPredict.input.special_chars > 5 ? "text-red-400 font-bold" : ""}>{currentPredict.input.special_chars}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Skeleton className="h-10 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="glass-card relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Shield className="w-32 h-32" />
                </div>
                <CardHeader>
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    Explainable AI (XAI)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    {isExplaining && (
                      <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
                        <div className="flex flex-col items-center gap-3">
                          <Activity className="w-6 h-6 animate-spin text-primary" />
                          <span className="text-xs font-bold uppercase tracking-widest">Generating Logic...</span>
                        </div>
                      </div>
                    )}
                    <div className="min-h-[120px] p-5 rounded-xl bg-primary/5 border border-primary/10 text-xs leading-relaxed text-foreground/80 italic font-medium">
                      {explanation || "Awaiting sensor data for logical decomposition..."}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Badge className="text-[9px] px-2 py-0 bg-primary/20 text-primary border-primary/30">
                      GEMINI FLASH 2.5 ANALYST
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-8">
            <Card className="glass-card flex flex-col h-[calc(100vh-14rem)]">
              <CardHeader className="border-b border-white/5 pb-4">
                <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest">
                  <Activity className="w-4 h-4 text-primary" />
                  Request Stream
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full px-6 py-4">
                  <div className="space-y-6 pb-6">
                    {history.map((item, i) => (
                      <div key={i} className="group relative flex items-start justify-between border-b border-white/5 pb-5 last:border-0 hover:bg-white/[0.02] transition-colors p-2 rounded-lg -mx-2">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-code text-muted-foreground">{item.time}</span>
                            <Badge className={cn(
                              "text-[9px] font-bold uppercase px-1.5 py-0",
                              item.class === 'Attack' ? "bg-red-500/20 text-red-400 border-red-500/20" :
                              item.class === 'Suspicious' ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/20" :
                              "bg-green-500/20 text-green-400 border-green-500/20"
                            )}>
                              {item.class}
                            </Badge>
                          </div>
                          <div className="text-[11px] font-bold tracking-tight">
                            {item.payload} B → <span className="text-accent italic">{item.action}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={cn(
                            "text-sm font-bold",
                            item.score > 75 ? "text-red-400" : item.score > 40 ? "text-yellow-400" : "text-green-400"
                          )}>
                            {item.score}%
                          </div>
                          <div className="text-[9px] uppercase tracking-tighter text-muted-foreground font-bold">Threat</div>
                        </div>
                      </div>
                    ))}
                    {history.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
                        <div className="w-12 h-12 rounded-full border border-dashed border-white/10 animate-pulse" />
                        <span className="text-xs font-bold uppercase tracking-widest opacity-40">Polling Sensor Hub...</span>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="bg-primary/10 border-primary/20 relative overflow-hidden group">
              <div className="absolute -top-4 -right-4 p-2 opacity-5 group-hover:opacity-10 transition-transform duration-700 group-hover:scale-110">
                <Shield className="w-32 h-32" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">System Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-3">
                  <div className="text-5xl font-headline font-black text-primary tracking-tighter">100<span className="text-2xl opacity-50">%</span></div>
                  <div className="mb-2">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-3 bg-primary rounded-full" />)}
                    </div>
                  </div>
                </div>
                <p className="text-[10px] leading-relaxed text-primary/70 mt-4 font-medium">
                  Honeypot sandbox isolated. All suspicious nodes are automatically redirected to high-latency tarpits via RL agent.
                </p>
              </CardContent>
            </Card>

            <div className="flex gap-4">
               <div className="flex-1 p-4 rounded-xl border bg-yellow-500/5 border-yellow-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span className="text-[10px] font-bold text-yellow-400 uppercase">Alerts</span>
                  </div>
                  <div className="text-xl font-bold">03</div>
               </div>
               <div className="flex-1 p-4 rounded-xl border bg-red-500/5 border-red-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-red-400" />
                    <span className="text-[10px] font-bold text-red-400 uppercase">Blocks</span>
                  </div>
                  <div className="text-xl font-bold">12</div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
