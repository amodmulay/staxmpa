
"use client";

import React from 'react';
import Draggable, { type DraggableData } from 'react-draggable';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Region, Topic } from '@/types/lexigen';

interface DraggableTopicItemProps {
  topic: Topic;
  region?: Region;
  topicDotColor?: string;
  initialPosition: { x: number; y: number };
  onTopicPositionChange: (topicId: string, position: { x: number; y: number }, newRegionId?: string) => void;
  options: {
      centerX: number;
      centerY: number;
      bandThickness: number;
      numRegions: number;
  };
  regions: Region[]; // IMPORTANT: This must be ordered from INNER to OUTER
}

const TOPIC_LABEL_OFFSET_Y = 18;
const TOPIC_DOT_RADIUS = 6;

export function DraggableTopicItem({
  topic,
  region,
  topicDotColor,
  initialPosition,
  onTopicPositionChange,
  options,
  regions,
}: DraggableTopicItemProps) {
  const nodeRef = React.useRef<SVGGElement>(null);
  const dotFillColor = topicDotColor || 'hsl(var(--primary))';

  const handleDragStop = (data: DraggableData) => {
    const { x, y } = data;
    const { centerX, centerY, bandThickness, numRegions } = options;
    const deltaX = x - centerX;
    const deltaY = y - centerY;
    const distanceFromCenter = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // The `regions` prop is ordered from innermost to outermost.
    // We can directly calculate the index from the distance.
    let newRegionIndex = Math.floor(distanceFromCenter / bandThickness);
    
    // Clamp the index to be within the bounds of the regions array.
    newRegionIndex = Math.min(Math.max(newRegionIndex, 0), numRegions - 1);
    
    // Get the new region's ID from the correctly ordered regions array
    const newRegionId = regions[newRegionIndex]?.id;

    onTopicPositionChange(topic.id, { x, y }, newRegionId);
  };

  return (
    <Draggable
        nodeRef={nodeRef}
        position={initialPosition}
        onStop={(e, data) => handleDragStop(data)}
    >
        <g ref={nodeRef} className="group">
            <TooltipProvider>
                <Tooltip>
                <TooltipTrigger asChild>
                    <g className="cursor-grab active:cursor-grabbing">
                    <circle r={TOPIC_DOT_RADIUS * 1.5} fill={dotFillColor} style={{ filter: 'url(#glow)' }} opacity="0.5" />
                    <circle r={TOPIC_DOT_RADIUS} fill={dotFillColor} stroke="hsl(var(--background))" strokeWidth="1.5" />
                    <circle r={TOPIC_DOT_RADIUS * 0.5} fill={region?.color.startsWith('hsl(0, 0%, 20%)') || region?.color.startsWith('hsla(0, 0%, 20%)') ? 'hsl(var(--background))' : 'hsl(var(--primary-foreground))'} />
                    </g>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="font-semibold">{topic.name}</p>
                    <p className="text-sm text-muted-foreground">Region: {region?.name}</p>
                </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <text
                x={0}
                y={TOPIC_LABEL_OFFSET_Y}
                textAnchor="middle"
                fontSize="10"
                fill={region?.textColor || "hsl(var(--foreground))"}
                className="font-medium select-none pointer-events-none"
            >
                {topic.name}
            </text>
        </g>
    </Draggable>
  );
}
