
"use client";

import React, { useMemo, useCallback } from 'react';
import Draggable, { type DraggableData } from 'react-draggable';
import type { Region, Topic } from '@/types/lexigen';
import { DraggableTopicItem } from './DraggableTopicItem';

interface RadarViewProps extends React.HTMLAttributes<HTMLDivElement> {
  regions: Region[];
  topics: Topic[];
  topicPositions: Record<string, { x: number; y: number }>;
  onTopicPositionChange: (topicId: string, position: { x: number; y: number }, newRegionId?: string) => void;
  width?: number;
  height?: number;
  topicDotColor?: string;
}

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;
const PADDING = 60;

export const RadarView = React.forwardRef<HTMLDivElement, RadarViewProps>(
  ({ regions, topics, topicPositions, onTopicPositionChange, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, className, topicDotColor, ...props }, ref) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radarRadius = Math.min(centerX, centerY) - PADDING;

    const reversedRegionsForRendering = useMemo(() => [...regions].reverse(), [regions]);

    const getTopicCoordinates = useCallback((topic: Topic) => {
      const regionIndex = regions.findIndex(r => r.id === topic.regionId);
      if (regionIndex === -1) return { x: centerX, y: centerY };

      const numRegions = regions.length;
      if (numRegions === 0) return { x: centerX, y: centerY };
      const bandThickness = radarRadius / numRegions;

      const innerRadiusForRegion = regionIndex * bandThickness;
      
      const distanceFromCenter = innerRadiusForRegion + topic.magnitude * bandThickness;
      const angleRad = (topic.angle - 90) * (Math.PI / 180);

      return {
        x: centerX + distanceFromCenter * Math.cos(angleRad),
        y: centerY + distanceFromCenter * Math.sin(angleRad),
      };
    }, [regions, centerX, centerY, radarRadius]);

    const numRegions = regions.length;

    if (numRegions === 0) {
      return (
        <div ref={ref} className={className} {...props} style={{ width, height, background: 'hsl(var(--background))' }}>
          <p className="text-center text-muted-foreground">Please configure regions to display the radar.</p>
        </div>
      );
    }

    const bandThickness = radarRadius / numRegions;
    
    const handleDragStop = (topicId: string, data: DraggableData) => {
        const { x, y } = data;
        const deltaX = x - centerX;
        const deltaY = y - centerY;
        const distanceFromCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
        // Calculate the new region based on the distance from the center
        let newRegionIndex = Math.floor(distanceFromCenter / bandThickness);
        // Clamp the index to be within the bounds of the regions array
        newRegionIndex = Math.min(Math.max(newRegionIndex, 0), numRegions - 1);
    
        const newRegionId = regions[newRegionIndex]?.id;
    
        // Call the prop to update both position and region in the parent state
        onTopicPositionChange(topicId, { x, y }, newRegionId);
    };

    return (
      <div ref={ref} className={className} {...props} style={{ width, height, background: 'hsl(var(--background))' }}>
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {reversedRegionsForRendering.map((region, index) => {
              const outerR = (numRegions - index) * bandThickness;
              return (
                <g key={region.id}>
                  <circle
                    cx={centerX}
                    cy={centerY}
                    r={outerR}
                    fill={region.color}
                    stroke="hsl(var(--foreground))"
                    strokeWidth="0.5"
                    strokeOpacity="0.3"
                  />
                  <text
                    x={centerX}
                    y={centerY - outerR + bandThickness / 2 + 5}
                    textAnchor="middle"
                    fontSize="12"
                    fill={region.textColor}
                    className="font-semibold select-none pointer-events-none"
                  >
                    {region.name}
                  </text>
                </g>
              );
            })}

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
                  stroke="hsl(var(--foreground))"
                  strokeWidth="0.5"
                  strokeOpacity="0.5"
                  strokeDasharray="4,4"
                />
              );
            })}

            {topics.map((topic) => {
                const nodeRef = React.useRef<SVGGElement>(null);
                const currentPosition = topicPositions[topic.id] || getTopicCoordinates(topic);
                
                return (
                    <Draggable
                        key={topic.id}
                        nodeRef={nodeRef}
                        position={currentPosition}
                        onStop={(e, data) => handleDragStop(topic.id, data)}
                    >
                        <g ref={nodeRef}>
                            <DraggableTopicItem
                                topic={topic}
                                region={regions.find(r => r.id === topic.regionId)}
                                topicDotColor={topicDotColor}
                            />
                        </g>
                    </Draggable>
                );
            })}
          </svg>
      </div>
    );
  }
);

RadarView.displayName = "RadarView";
