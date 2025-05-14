"use client";

import type * as React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Region, Topic } from '@/types/lexigen';

interface RadarViewProps extends React.HTMLAttributes<HTMLDivElement> {
  regions: Region[];
  topics: Topic[];
  width?: number;
  height?: number;
}

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;
const PADDING = 60; // For labels outside the main radar circle

export const RadarView = React.forwardRef<HTMLDivElement, RadarViewProps>(
  ({ regions, topics, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, className, ...props }, ref) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radarRadius = Math.min(centerX, centerY) - PADDING;
    const numRegions = regions.length;

    if (numRegions === 0) {
      return (
        <div ref={ref} className={className} {...props} style={{ width, height }}>
          <p className="text-center text-muted-foreground">Please configure regions to display the radar.</p>
        </div>
      );
    }

    const bandThickness = radarRadius / numRegions;

    // Function to calculate topic coordinates
    const getTopicCoordinates = (topic: Topic) => {
      const regionIndex = regions.findIndex(r => r.id === topic.regionId);
      if (regionIndex === -1) return { x: centerX, y: centerY }; // Default to center if region not found

      const innerRadiusForRegion = regionIndex * bandThickness;
      const thicknessForRegion = bandThickness;
      
      // Magnitude: 0 = inner edge, 0.5 = middle, 1 = outer edge of the band
      const distanceFromCenter = innerRadiusForRegion + topic.magnitude * thicknessForRegion;
      
      const angleRad = (topic.angle - 90) * (Math.PI / 180); // -90 to make 0 degrees at the top

      return {
        x: centerX + distanceFromCenter * Math.cos(angleRad),
        y: centerY + distanceFromCenter * Math.sin(angleRad),
      };
    };
    
    const getRegionLabelPosition = (regionIndex: number, angleDegrees: number = -90) => {
        const labelRadius = (regionIndex + 0.5) * bandThickness; // Mid-point of the band
        const angleRad = angleDegrees * (Math.PI / 180);
        return {
          x: centerX + labelRadius * Math.cos(angleRad),
          y: centerY + labelRadius * Math.sin(angleRad),
        };
    };


    return (
      <div ref={ref} className={className} {...props} style={{ width, height, background: 'hsl(var(--background))' }}>
        <TooltipProvider>
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {/* Draw region circles and labels */}
            {regions.map((region, index) => {
              const outerR = (numRegions - index) * bandThickness; // Draw from outermost to innermost for correct layering
              const currentRegionIndex = numRegions - 1 - index; // Actual index from center (0 = innermost)
              const labelPos = getRegionLabelPosition(currentRegionIndex);

              return (
                <g key={region.id}>
                  <circle
                    cx={centerX}
                    cy={centerY}
                    r={outerR}
                    fill={region.color}
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                  />
                   {/* Region labels - simplified to appear at the top of each band */}
                  <text
                    x={centerX}
                    y={centerY - outerR + bandThickness / 2 + 5} // Adjust y to be within the band, +5 for baseline
                    textAnchor="middle"
                    fontSize="12"
                    fill={region.textColor}
                    className="font-semibold"
                  >
                    {region.name}
                  </text>
                </g>
              );
            })}

             {/* Concentric grid lines (optional, for effect) */}
            {Array.from({ length: numRegions -1 }).map((_, i) => (
                <circle
                key={`grid-${i}`}
                cx={centerX}
                cy={centerY}
                r={(i + 1) * bandThickness}
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
                strokeDasharray="2,2"
                />
            ))}

            {/* Radial grid lines (optional, for effect - e.g. 8 lines) */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = i * (360 / 8);
              const angleRad = (angle - 90) * (Math.PI / 180);
              return (
                <line
                  key={`radial-line-${i}`}
                  x1={centerX}
                  y1={centerY}
                  x2={centerX + radarRadius * Math.cos(angleRad)}
                  y2={centerY + radarRadius * Math.sin(angleRad)}
                  stroke="hsl(var(--border))"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
              );
            })}


            {/* Draw topics */}
            {topics.map((topic) => {
              const { x, y } = getTopicCoordinates(topic);
              return (
                <Tooltip key={topic.id}>
                  <TooltipTrigger asChild>
                    <g transform={`translate(${x}, ${y})`}>
                       <circle r="6" fill="hsl(var(--primary))" stroke="hsl(var(--background))" strokeWidth="1.5" className="cursor-pointer"/>
                       <circle r="3" fill="hsl(var(--primary-foreground))" className="cursor-pointer" />
                    </g>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-semibold">{topic.name}</p>
                    <p className="text-sm text-muted-foreground">Region: {regions.find(r => r.id === topic.regionId)?.name}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </svg>
        </TooltipProvider>
      </div>
    );
  }
);

RadarView.displayName = "RadarView";
