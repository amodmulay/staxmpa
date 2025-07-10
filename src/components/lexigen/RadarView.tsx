
"use client";

import React, { useState, useEffect, useMemo } from 'react'; // Full import for React
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Draggable from 'react-draggable';
import type { Region, Topic } from '@/types/lexigen';

interface RadarViewProps extends React.HTMLAttributes<HTMLDivElement> {
  regions: Region[];
  topics: Topic[];
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
  onStop: (event: any, data: any) => void;
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
  const nodeRef = React.useRef<SVGGElement>(null); // Called once per DraggableTopicItem instance

  return (
    <Draggable
      nodeRef={nodeRef} // Pass the stable ref
      position={position}
      onStop={onStop}
      // Removed key from here as it's on the parent mapping
    >
      <g ref={nodeRef} className="group"> {/* Assign the ref to the <g> element */}
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
          x={0} // Positioned relative to the draggable <g>
          y={TOPIC_LABEL_OFFSET_Y} // Positioned relative to the draggable <g>
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
  ({ regions, topics, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, className, topicDotColor, ...props }, ref) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radarRadius = Math.min(centerX, centerY) - PADDING;

    const [topicPositions, setTopicPositions] = useState<{ [key: string]: { x: number; y: number } }>({});
    
    // The regions are ordered from inner to outer (e.g., Adopt, Trial, Assess, Hold)
    // The SVG is drawn from outer to inner. We must pass the original, non-reversed array to this component.
    const reversedRegionsForRendering = useMemo(() => [...regions].reverse(), [regions]);

    const getTopicCoordinates = React.useCallback((topic: Topic) => {
      const regionIndex = regions.findIndex(r => r.id === topic.regionId);
      if (regionIndex === -1) return { x: centerX, y: centerY };

      const numRegions = regions.length;
      if (numRegions === 0) return { x: centerX, y: centerY };
      const bandThickness = radarRadius / numRegions;

      // Calculate distance from center based on the region's index
      // regionIndex 0 (e.g., "Adopt") should be closest to the center.
      const innerRadiusForRegion = regionIndex * bandThickness;
      
      const distanceFromCenter = innerRadiusForRegion + topic.magnitude * bandThickness;
      const angleRad = (topic.angle - 90) * (Math.PI / 180);

      return {
        x: centerX + distanceFromCenter * Math.cos(angleRad),
        y: centerY + distanceFromCenter * Math.sin(angleRad),
      };
    }, [regions, centerX, centerY, radarRadius]);


    useEffect(() => {
      const newPositions: { [key: string]: { x: number; y: number } } = {};
      topics.forEach(topic => {
        newPositions[topic.id] = getTopicCoordinates(topic);
      });
      // Only update positions if they are different to avoid potential loops
      // or if a topic is added/removed.
      // A more robust way would be to only initialize new topics or update if coordinates truly changed.
      setTopicPositions(prevPositions => {
        const updatedPositions = { ...prevPositions };
        topics.forEach(topic => {
            // Initialize if not present or re-calculate based on getTopicCoordinates if structure changed.
            // For simplicity, this re-initializes all based on current props.
            // If preserving dragged positions across minor (non-geometric) region changes is needed,
            // this logic would need to be more nuanced.
            updatedPositions[topic.id] = getTopicCoordinates(topic);
        });
        // Filter out positions for topics that no longer exist
        const topicIds = new Set(topics.map(t => t.id));
        Object.keys(updatedPositions).forEach(id => {
            if (!topicIds.has(id)) {
                delete updatedPositions[id];
            }
        });
        return updatedPositions;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topics, regions, width, height, getTopicCoordinates]); 

    const numRegions = regions.length;

    if (numRegions === 0) {
      return (
        <div ref={ref} className={className} {...props} style={{ width, height, background: 'hsl(var(--background))' }}>
          <p className="text-center text-muted-foreground">Please configure regions to display the radar.</p>
        </div>
      );
    }

    const bandThickness = radarRadius / numRegions;

    return (
      <div ref={ref} className={className} {...props} style={{ width, height, background: 'hsl(var(--background))' }}>
        <TooltipProvider>
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {reversedRegionsForRendering.map((region, index) => {
              // This calculation is now correct because we are iterating over the reversed array.
              // index 0 = "Hold" (the outermost ring)
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
                  key={topic.id} // Key for the list item
                  topic={topic}
                  position={currentPosition}
                  onStop={(e, data) => {
                    setTopicPositions(prevPositions => ({
                      ...prevPositions,
                      [topic.id]: { x: data.x, y: data.y },
                    }));
                  }}
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
