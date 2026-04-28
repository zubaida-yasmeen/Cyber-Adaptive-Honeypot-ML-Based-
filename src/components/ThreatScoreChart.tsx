"use client";

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ThreatScoreChartProps {
  data: { time: string; score: number }[];
}

export function ThreatScoreChart({ data }: ThreatScoreChartProps) {
  return (
    <Card className="glass-card col-span-2 transition-all duration-500">
      <CardHeader>
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Real-time Threat Intensity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            score: {
              label: "Threat Score",
              color: "hsl(var(--primary))",
            },
          }}
          className="h-[200px] w-full"
        >
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="time" 
              hide 
            />
            <YAxis 
              domain={[0, 100]} 
              stroke="rgba(255,255,255,0.3)" 
              fontSize={10}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="var(--color-score)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
              animationDuration={1000}
              animationEasing="ease-in-out"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}