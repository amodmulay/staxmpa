
"use client";

import React, { useMemo, useCallback } from 'react'; // Full import for React
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Draggable, { type DraggableData, type DraggableEvent } from 'react-draggable';
import type { Region, Topic } from '@/types/lexigen';

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
const TOPIC_LABEL_OFFSET_Y = 18;
const TOPIC_DOT_RADIUS = 6;

// Define DraggableTopicItem outside of RadarView or memoize if inside
interface DraggableTopicItemProps {
  topic: Topic;
  position: { x: number; y: number };
  onStop: (event: DraggableEvent, data: DraggableData) => void;
  topicRegion?: Region;
  dotFillColor: string;
}

const DraggableTopicItem: React.FC<DraggableTopicItemProps> = ({
  topic,
  position,
  onStop,
  topicRegion,
  dotFillColor,
}) => {
  const nodeRef = React.useRef<SVGGElement>(null); 

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onStop={onStop}
    >
      <g ref={nodeRef} className="group">
        <Tooltip>
          <TooltipTrigger asChild>
            <g className="cursor-pointer">
              <circle r={TOPIC_DOT_RADIUS} fill={dotFillColor} stroke="hsl(var(--background))" strokeWidth="1.5" />
              <circle r={TOPIC_DOT_RADIUS / 2} fill={topicRegion?.color.startsWith('hsl(0, 0%, 20%)') || topicRegion?.color.startsWith('hsla(0, 0%, 20%)') ? 'hsl(var(--background))' : 'hsl(var(--primary-foreground))'} />
            </g>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-semibold">{topic.name}</p>
            <p className="text-sm text-muted-foreground">Region: {topicRegion?.name}</p>
          </TooltipContent>
        </Tooltip>
        <text
          x={0}
          y={TOPIC_LABEL_OFFSET_Y}
          textAnchor="middle"
          fontSize="10"
          fill={topicRegion?.textColor || "hsl(var(--foreground))"}
          className="font-medium select-none pointer-events-none"
        >
          {topic.name}
        </text>
      </g>
    </Draggable>
  );
};
DraggableTopicItem.displayName = "DraggableTopicItem";


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
        <TooltipProvider>
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {reversedRegionsForRendering.map((region, index) => {
              const outerR = (numRegions - index) * bandThickness;
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

            {topics.map((topic) => {
              const currentPosition = topicPositions[topic.id] || getTopicCoordinates(topic);
              const topicRegion = regions.find(r => r.id === topic.regionId);
              const dotFillColor = topicDotColor || 'hsl(var(--primary))';

              return (
                <DraggableTopicItem
                  key={topic.id}
                  topic={topic}
                  position={currentPosition}
                  onStop={(e, data) => handleDragStop(topic.id, data)}
                  topicRegion={topicRegion}
                  dotFillColor={dotFillColor}
                />
              );
            })}
          </svg>
        </TooltipProvider>
      </div>
    );
  }
);

RadarView.displayName = "RadarView";

    
