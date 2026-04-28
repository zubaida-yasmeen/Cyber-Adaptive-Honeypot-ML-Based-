"use client";

import { Shield, ShieldAlert, ShieldCheck, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AdaptiveControlsProps {
  predictedClass: string;
  action: string;
  cluster: number;
  score: number;
}

export function AdaptiveControls({ predictedClass, action, cluster, score }: AdaptiveControlsProps) {
  const getStatusColor = (cls: string) => {
    switch (cls) {
      case 'Normal': return 'text-green-400';
      case 'Suspicious': return 'text-yellow-400';
      case 'Attack': return 'text-red-400';
      default: return 'text-muted-foreground';
    }
  };

  const getActionIcon = (act: string) => {
    switch (act) {
      case 'allow': return <ShieldCheck className="w-6 h-6 text-green-400" />;
      case 'tarpit': return <ShieldAlert className="w-6 h-6 text-yellow-400" />;
      case 'block': return <Shield className="w-6 h-6 text-red-400" />;
      default: return <Zap className="w-6 h-6 text-primary" />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Classification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={cn("text-2xl font-bold font-headline", getStatusColor(predictedClass))}>
            {predictedClass || 'Scanning...'}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">Multi-model consensus</p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Adaptive Response</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-2xl font-bold font-headline capitalize">
            {action || 'Auto'}
          </div>
          {getActionIcon(action)}
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Traffic Cluster</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-accent border-accent/30 bg-accent/10">
              ID: {cluster}
            </Badge>
            <span className="text-sm font-medium">K-Means Grouping</span>
          </div>
          <div className="flex gap-1 mt-3">
            {[0, 1, 2].map((i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1 flex-1 rounded-full",
                  cluster === i ? "bg-accent" : "bg-muted"
                )} 
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Risk Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-xs mb-2">
            <span>Criticality</span>
            <span className={cn("font-bold", score > 70 ? "text-red-400" : score > 30 ? "text-yellow-400" : "text-green-400")}>
              {score}%
            </span>
          </div>
          <Progress value={score} className="h-2" />
        </CardContent>
      </Card>
    </div>
  );
}
