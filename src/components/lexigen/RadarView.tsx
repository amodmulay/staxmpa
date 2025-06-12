
"use client";

import * as React from 'react'; // Full import for React.forwardRef and React.useRef
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

export const RadarView = React.forwardRef<HTMLDivElement, RadarViewProps>(
  ({ regions, topics, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT, className, topicDotColor, ...props }, ref) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const radarRadius = Math.min(centerX, centerY) - PADDING;

    const [topicPositions, setTopicPositions] = React.useState<{ [key: string]: { x: number; y: number } }>({});

    React.useEffect(() => {
      const initialPositions: { [key: string]: { x: number; y: number } } = {};
      topics.forEach(topic => {
        initialPositions[topic.id] = getTopicCoordinates(topic);
      });
      setTopicPositions(initialPositions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [topics, regions, width, height]); // Recalculate initial positions when topics, regions or dimensions change

    const numRegions = regions.length;

    if (numRegions === 0) {
      return (
        <div ref={ref} className={className} {...props} style={{ width, height, background: 'hsl(var(--background))' }}>
          <p className="text-center text-muted-foreground">Please configure regions to display the radar.</p>
        </div>
      );
    }

    const bandThickness = radarRadius / numRegions;

    const getTopicCoordinates = (topic: Topic) => {
      const regionIndex = regions.findIndex(r => r.id === topic.regionId);
      if (regionIndex === -1) return { x: centerX, y: centerY };

      const innerRadiusForRegion = regionIndex * bandThickness;
      const thicknessForRegion = bandThickness;

      const distanceFromCenter = innerRadiusForRegion + topic.magnitude * thicknessForRegion;
      const angleRad = (topic.angle - 90) * (Math.PI / 180);

      return {
        x: centerX + distanceFromCenter * Math.cos(angleRad),
        y: centerY + distanceFromCenter * Math.sin(angleRad),
      };
    };

    return (
      <div ref={ref} className={className} {...props} style={{ width, height, background: 'hsl(var(--background))' }}>
        <TooltipProvider>
          <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
            {regions.map((region, index) => {
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
              const nodeRef = React.useRef<SVGGElement>(null); // Create a ref for each draggable item
              const initialPosition = getTopicCoordinates(topic);
              // Use position from state if available, otherwise use calculated initialPosition
              const currentPosition = topicPositions[topic.id] || initialPosition;
              const topicRegion = regions.find(r => r.id === topic.regionId);
              const dotFillColor = topicDotColor || 'hsl(var(--primary))';

              return (
                <Draggable
                  key={topic.id}
                  nodeRef={nodeRef} // Pass the ref here
                  position={currentPosition} // Use currentPosition for controlled component
                  onStop={(e, data) => {
                    setTopicPositions(prevPositions => ({
                      ...prevPositions,
                      [topic.id]: { x: data.x, y: data.y },
                    }));
                  }}
                  // Since we are controlling position, remove defaultPosition to avoid conflicts
                >
                  <g ref={nodeRef} className="group"> {/* Assign the ref to the <g> element */}
                    <Tooltip>
                    <TooltipTrigger asChild>
                      <g className="cursor-pointer">
                         <circle r={TOPIC_DOT_RADIUS} fill={dotFillColor} stroke="hsl(var(--background))" strokeWidth="1.5" />
                         <circle r={TOPIC_DOT_RADIUS/2} fill={topicRegion?.color.startsWith('hsl(0, 0%, 20%)') || topicRegion?.color.startsWith('hsla(0, 0%, 20%)') ? 'hsl(var(--background))' : 'hsl(var(--primary-foreground))'} />
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
            })}
          </svg>
        </TooltipProvider>
      </div>
    );
  }
);

RadarView.displayName = "RadarView";
