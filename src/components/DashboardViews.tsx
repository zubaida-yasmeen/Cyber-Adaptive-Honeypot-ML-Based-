"use client";

import React, { useMemo } from "react";
import { Activity, Shield, Terminal, BrainCircuit, Network, History, Info, AlertTriangle, Fingerprint, Layers, Cpu, Settings } from "lucide-react";
import { AdaptiveControls } from "@/components/AdaptiveControls";
import { ThreatScoreChart } from "@/components/ThreatScoreChart";
import { ModelConsensus } from "@/components/ModelConsensus";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';

export interface HistoricalEvent {
  id: string;
  time: string;
  score: number;
  class: string;
  action: string;
  payload: number;
}

export function DashboardView({ currentPredict, history, explanation, isExplaining }: any) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in duration-700 items-start">
      <div className="xl:col-span-2 space-y-8">
        <AdaptiveControls 
          predictedClass={currentPredict?.predicted_class} 
          action={currentPredict?.recommended_action}
          cluster={currentPredict?.cluster}
          score={currentPredict?.threat_score || 0}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ThreatScoreChart 
            data={history.map((h: any) => ({ time: h.time, score: h.score })).reverse()} 
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
                <div className="font-code text-[11px] bg-black/40 p-5 rounded-xl border border-white/5 space-y-3 transition-all duration-500">
                  <div className="flex justify-between items-center bg-white/5 p-2 rounded">
                    <span className="text-muted-foreground">PCA COORDINATES:</span>
                    <span className="text-accent font-bold animate-in zoom-in-95 duration-300">[{currentPredict.pca_features[0].toFixed(3)}, {currentPredict.pca_features[1].toFixed(3)}]</span>
                  </div>
                  <div className="space-y-1 pt-2">
                    <div className="flex justify-between items-center border-b border-white/5 pb-1">
                      <span className="text-muted-foreground uppercase">Method:</span>
                      <Badge variant="outline" className="text-[10px] text-primary border-primary/20">{currentPredict.input.path_type}</Badge>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-muted-foreground uppercase">Freq Norm:</span>
                      <span className="transition-all duration-300">{currentPredict.features[0].toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/5 pb-1">
                      <span className="text-muted-foreground uppercase">Payload Norm:</span>
                      <span className="transition-all duration-300">{currentPredict.features[1].toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground uppercase">Special Chars:</span>
                      <span className={cn("transition-all duration-300", currentPredict.input.special_chars > 5 ? "text-red-400 font-bold" : "")}>{currentPredict.input.special_chars}</span>
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
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center rounded-lg z-10 animate-in fade-in duration-300">
                    <div className="flex flex-col items-center gap-3">
                      <Activity className="w-6 h-6 animate-spin text-primary" />
                      <span className="text-xs font-bold uppercase tracking-widest">Generating Logic...</span>
                    </div>
                  </div>
                )}
                <div className="min-h-[120px] p-5 rounded-xl bg-primary/5 border border-primary/10 text-xs leading-relaxed text-foreground/80 italic font-medium transition-all duration-1000">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <Card className="bg-primary/10 border-primary/20 relative overflow-hidden group col-span-1 transition-all duration-500 hover:shadow-primary/5">
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
                    {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-3 bg-primary rounded-full transition-all duration-300 hover:h-4" />)}
                  </div>
                </div>
              </div>
              <p className="text-[10px] leading-relaxed text-primary/70 mt-4 font-medium">
                Honeypot sandbox isolated. All suspicious nodes are automatically redirected to high-latency tarpits.
              </p>
            </CardContent>
          </Card>

          <div className="flex gap-4 col-span-1 md:col-span-2">
             <div className="flex-1 p-4 rounded-xl border bg-yellow-500/5 border-yellow-500/20 transition-all duration-500 hover:bg-yellow-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400" />
                  <span className="text-[10px] font-bold text-yellow-400 uppercase">Alerts</span>
                </div>
                <div className="text-xl font-bold animate-in zoom-in duration-300">03</div>
             </div>
             <div className="flex-1 p-4 rounded-xl border bg-red-500/5 border-red-500/20 transition-all duration-500 hover:bg-red-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-red-400" />
                  <span className="text-[10px] font-bold text-red-400 uppercase">Blocks</span>
                </div>
                <div className="text-xl font-bold animate-in zoom-in duration-300">12</div>
             </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 xl:sticky xl:top-0">
        <Card className="glass-card flex flex-col h-[calc(100vh-12rem)] min-h-[600px]">
          <CardHeader className="border-b border-white/5 pb-4">
            <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-widest">
              <Activity className="w-4 h-4 text-primary" />
              Request Stream
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full px-6 py-4">
              <div className="space-y-6 pb-6">
                {history.map((item: HistoricalEvent) => (
                  <div key={item.id} className="group relative flex items-start justify-between border-b border-white/5 pb-5 last:border-0 hover:bg-white/[0.02] transition-all duration-300 p-2 rounded-lg -mx-2 animate-in fade-in slide-in-from-top-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-code text-muted-foreground">{item.time}</span>
                        <Badge className={cn(
                          "text-[9px] font-bold uppercase px-1.5 py-0 transition-colors duration-300",
                          item.class === 'Attack' ? "bg-red-500/20 text-red-400 border-red-500/20" :
                          item.class === 'Suspicious' ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/20" :
                          "bg-green-500/20 text-green-400 border-green-500/20"
                        )}>
                          {item.class}
                        </Badge>
                      </div>
                      <div className="text-[11px] font-bold tracking-tight">
                        {item.payload} B → <span className="text-accent italic transition-colors duration-300">{item.action}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "text-sm font-bold transition-colors duration-300",
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
      </div>
    </div>
  );
}

export function PCAMapView({ currentPredict }: { currentPredict: any }) {
  const pcaData = useMemo(() => {
    const base = [
      { x: -1.2, y: -0.8, label: 'Normal' },
      { x: -0.9, y: -1.1, label: 'Normal' },
      { x: -1.5, y: -0.5, label: 'Normal' },
      { x: -1.0, y: -1.0, label: 'Normal' },
      { x: -0.7, y: -0.9, label: 'Normal' },
      { x: 0.2, y: 0.1, label: 'Suspicious' },
      { x: 0.5, y: 0.4, label: 'Suspicious' },
      { x: 0.8, y: 0.2, label: 'Suspicious' },
      { x: 0.3, y: 0.6, label: 'Suspicious' },
      { x: 2.1, y: 1.8, label: 'Attack' },
      { x: 2.5, y: 2.2, label: 'Attack' },
      { x: 1.8, y: 2.5, label: 'Attack' },
      { x: 2.3, y: 1.5, label: 'Attack' },
      { x: 1.9, y: 2.0, label: 'Attack' },
    ];
    
    if (currentPredict?.pca_features) {
      base.push({
        x: currentPredict.pca_features[0],
        y: currentPredict.pca_features[1],
        label: currentPredict.predicted_class
      });
    }
    return base;
  }, [currentPredict]);

  const getColor = (label: string) => {
    switch (label) {
      case 'Normal': return 'hsl(var(--primary))';
      case 'Suspicious': return 'hsl(var(--accent))';
      case 'Attack': return '#f87171'; // red-400
      default: return '#94a3b8';
    }
  };

  return (
    <Card className="glass-card animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="w-6 h-6 text-accent" />
            Traffic Principal Component Analysis (PCA)
          </CardTitle>
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /><span className="text-[10px] font-bold uppercase">Normal</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-accent" /><span className="text-[10px] font-bold uppercase">Suspicious</span></div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-400" /><span className="text-[10px] font-bold uppercase">Attack</span></div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-[500px] border rounded-xl border-white/5 bg-black/20 p-8">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={true} />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="PC1" 
              stroke="rgba(255,255,255,0.3)" 
              fontSize={10} 
              label={{ value: 'Principal Component 1', position: 'bottom', fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="PC2" 
              stroke="rgba(255,255,255,0.3)" 
              fontSize={10}
              label={{ value: 'Principal Component 2', angle: -90, position: 'left', fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
            />
            <ZAxis type="number" range={[100, 400]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-card border border-white/10 p-2 rounded shadow-xl text-[10px] font-code">
                      <div className="font-bold text-accent uppercase mb-1">{data.label}</div>
                      <div>X: {data.x.toFixed(4)}</div>
                      <div>Y: {data.y.toFixed(4)}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Scatter name="Network Traffic" data={pcaData} shape="circle">
              {pcaData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getColor(entry.label)} 
                  className="transition-all duration-700"
                  style={{ filter: index === pcaData.length - 1 ? 'drop-shadow(0 0 10px currentColor)' : 'none' }}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function ClusteringView() {
  return (
    <Card className="glass-card animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="w-6 h-6 text-primary" />
          K-Means Clustering Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[500px] flex items-center justify-center border-2 border-dashed rounded-xl border-white/5 bg-black/20">
        <div className="text-center space-y-4">
          <BrainCircuit className="w-16 h-16 text-primary" />
          <h3 className="text-xl font-headline font-bold">Unsupervised Learning Hub</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Detecting zero-day threats by grouping requests with similar characteristics without pre-defined labels.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function QLearningView() {
  return (
    <Card className="glass-card animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cpu className="w-6 h-6 text-yellow-400" />
          Reinforcement Learning Policy (Q-Learning)
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[500px] flex items-center justify-center border-2 border-dashed rounded-xl border-white/5 bg-black/20">
        <div className="text-center space-y-4">
          <History className="w-16 h-16 text-yellow-400" />
          <h3 className="text-xl font-headline font-bold">Adaptive Agent Logs</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Reviewing how the security agent learns optimal responses (Allow, Tarpit, Block) through iterative reward maximization.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function MLParamsView() {
  return (
    <Card className="glass-card animate-in fade-in slide-in-from-bottom-4 duration-500">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="w-6 h-6 text-accent" />
          ML Model Hyperparameters
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[500px] flex items-center justify-center border-2 border-dashed rounded-xl border-white/5 bg-black/20">
        <div className="text-center space-y-4">
          <Settings className="w-16 h-16 text-accent" />
          <h3 className="text-xl font-headline font-bold">Pipeline Configuration</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Fine-tune the weights of the MLP, KNN sensitivity, and LogReg thresholds for optimized threat detection.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}