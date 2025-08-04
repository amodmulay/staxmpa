
"use client";

import { TopicForm } from '@/components/lexigen/TopicForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { BaseRegion, Region } from '@/types/lexigen';
import { Download, Palette, PlusCircle, Settings2 } from 'lucide-react';
import { hslToHex } from '@/lib/utils';
import React from 'react';


interface RadarControlsProps {
  regions: Region[];
  onAddTopic: (name: string, regionId: string) => void;
  radarSize: number;
  onRadarSizeChange: (size: number) => void;
  onScreenshot: () => void;
  baseRegionDefinitions: BaseRegion[];
  onRegionConfigChange: (index: number, field: 'name' | 'color' | 'textColor', value: string) => void;
  onRemoveRegion: (id: string) => void;
  onAddRegion: () => void;
  children?: React.ReactNode; // For theme selector
}

export function RadarControls({
  regions,
  onAddTopic,
  radarSize,
  onRadarSizeChange,
  onScreenshot,
  baseRegionDefinitions,
  onRegionConfigChange,
  onRemoveRegion,
  onAddRegion,
  children,
}: RadarControlsProps) {

  return (
    <Tabs defaultValue="add-topic" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="add-topic">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Topic
        </TabsTrigger>
        <TabsTrigger value="configure">
            <Settings2 className="mr-2 h-4 w-4" />
            Configure
        </TabsTrigger>
      </TabsList>
      <TabsContent value="add-topic">
        <TopicForm regions={regions} onAddTopic={onAddTopic} />
      </TabsContent>
      <TabsContent value="configure">
        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Settings2 className="mr-2 h-6 w-6 text-primary" />
              Radar Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {children && (
              <>
                {children}
                <Separator />
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="radar-size-slider">Radar Size: {radarSize}px</Label>
              <Slider
                id="radar-size-slider"
                min={400}
                max={1000}
                step={20}
                value={[radarSize]}
                onValueChange={(value) => onRadarSizeChange(value[0])}
              />
            </div>
            <Button onClick={onScreenshot} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Capture Screenshot
            </Button>
            
            <Separator />

            <Label className="text-md font-medium">Regions</Label>
            <ScrollArea className="h-[250px] pr-3">
              <div className="space-y-3">
              {regions.map((region, index) => (
                <Card key={region.id} className="p-3 bg-muted/50">
                  <Label htmlFor={`region-name-${index}`} className="text-sm font-medium">Region {index + 1}: {region.name}</Label>
                  <Input
                    id={`region-name-${index}`}
                    type="text"
                    value={region.name}
                    onChange={(e) => onRegionConfigChange(index, 'name', e.target.value)}
                    className="mt-1 mb-2"
                  />
                  <div className="flex items-center space-x-2">
                    <Label htmlFor={`region-color-${index}`} className="text-xs">BG:</Label>
                    <Input
                      id={`region-color-${index}`}
                      type="color"
                      value={region.color.startsWith('hsl') ? hslToHex(region.color) : region.color}
                      onChange={(e) => onRegionConfigChange(index, 'color', e.target.value)}
                      className="w-12 h-8 p-1"
                    />
                      <Label htmlFor={`region-text-color-${index}`} className="text-xs">Text:</Label>
                    <Input
                      id={`region-text-color-${index}`}
                      type="color"
                      value={region.textColor.startsWith('hsl') ? hslToHex(region.textColor) : region.textColor}
                      onChange={(e) => onRegionConfigChange(index, 'textColor', e.target.value)}
                        className="w-12 h-8 p-1"
                    />
                    <Button variant="destructive" size="sm" onClick={() => onRemoveRegion(region.id)} disabled={baseRegionDefinitions.length <=1 }>&times;</Button>
                  </div>
                </Card>
              ))}
              </div>
            </ScrollArea>
              <Button onClick={onAddRegion} variant="outline" className="w-full">
              <Palette className="mr-2 h-4 w-4" /> Add Region
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
