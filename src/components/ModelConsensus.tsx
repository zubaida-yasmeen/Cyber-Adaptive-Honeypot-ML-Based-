"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Activity, Network, Layers } from "lucide-react";
import type { ModelOutputs } from "@/lib/ml-engine";

interface ModelConsensusProps {
  models: ModelOutputs | null;
}

export function ModelConsensus({ models }: ModelConsensusProps) {
  if (!models) return null;

  const getLabelColor = (label: string) => {
    switch (label) {
      case 'Normal': return 'text-green-400 bg-green-500/10';
      case 'Suspicious': return 'text-yellow-400 bg-yellow-500/10';
      case 'Attack': return 'text-red-400 bg-red-500/10';
      default: return '';
    }
  };

  const modelConfigs = [
    { name: "Logistic Regression", key: "logistic_regression", icon: Activity, detail: `${Math.round(models.logistic_regression.probability * 100)}% Prob` },
    { name: "K-Nearest Neighbors", key: "knn", icon: Network, detail: "Similarity Score" },
    { name: "Naive Bayes", key: "naive_bayes", icon: BrainCircuit, detail: "Likelihood Ratio" },
    { name: "MLP Neural Net", key: "mlp", icon: Layers, detail: "Forward Pass" }
  ];

  return (
    <Card className="glass-card transition-all duration-500">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Model Pipeline Consensus</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 p-4">
        {modelConfigs.map((m) => {
          const mData = (models as any)[m.key];
          return (
            <div key={m.key} className="flex flex-col gap-1 p-2 rounded bg-white/5 border border-white/5 transition-all duration-300 hover:bg-white/10">
              <div className="flex items-center gap-2 mb-1">
                <m.icon className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">{m.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className={`text-[10px] py-0 px-1.5 transition-all duration-500 ${getLabelColor(mData.label)}`}>
                  {mData.label}
                </Badge>
                <span className="text-[9px] text-muted-foreground font-code transition-all duration-300">{m.detail}</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}