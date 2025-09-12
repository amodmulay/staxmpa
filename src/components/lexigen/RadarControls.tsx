
"use client";

import { TopicForm } from '@/components/lexigen/TopicForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { BaseRegion, Region } from '@/types/lexigen';
import { Download, Upload, Palette, PlusCircle, Settings2, Trash2 } from 'lucide-react';
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
  onExport: () => void;
  onImport: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
  onExport,
  onImport,
  children,
}: RadarControlsProps) {

  const importInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <Tabs defaultValue="manage-items" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="manage-items">
            <PlusCircle className="mr-2 h-4 w-4" />
            Manage Items
        </TabsTrigger>
        <TabsTrigger value="configure">
            <Settings2 className="mr-2 h-4 w-4" />
            Configure
        </TabsTrigger>
      </TabsList>
      <TabsContent value="manage-items">
        <div className="space-y-4">
          <TopicForm regions={regions} onAddTopic={onAddTopic} />
          <Card className="shadow-lg border-none">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                Manage Regions
              </CardTitle>
              <CardDescription>Add or remove the concentric rings of your radar.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={onAddRegion} variant="outline" className="w-full">
                <PlusCircle className="mr-2 h-4 w-4" /> Add New Region
              </Button>
            </CardContent>
          </Card>
        </div>
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
            
            <Separator />

            <div className="grid grid-cols-2 gap-2">
                <Button onClick={onExport} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>
                <Button onClick={() => importInputRef.current?.click()} variant="outline">
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                </Button>
                <input
                    type="file"
                    ref={importInputRef}
                    onChange={onImport}
                    className="hidden"
                    accept=".json"
                />
            </div>

             <Button onClick={onScreenshot} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Capture Screenshot
            </Button>
            
            <Separator />

            <Label className="text-md font-medium">Edit Regions</Label>
            <ScrollArea className="h-[250px] pr-3">
              <div className="space-y-3">
              {regions.map((region, index) => (
                <Card key={region.id} className="p-3 bg-muted/50">
                  <div className="flex justify-between items-center mb-2">
                    <Label htmlFor={`region-name-${index}`} className="text-sm font-medium">Region {index + 1}</Label>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground" onClick={() => onRemoveRegion(region.id)} disabled={baseRegionDefinitions.length <=1 }>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <Input
                    id={`region-name-${index}`}
                    type="text"
                    value={region.name}
                    onChange={(e) => onRegionConfigChange(index, 'name', e.target.value)}
                    className="mb-2"
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
                  </div>
                </Card>
              ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
