"use client";

import type * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { TopicForm } from '@/components/lexigen/TopicForm';
import { RadarView } from '@/components/lexigen/RadarView';
import { AppHeader } from '@/components/lexigen/AppHeader';
import type { Region, Topic } from '@/types/lexigen';
import { Download, Settings2, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const initialRegions: Region[] = [
  { id: 'today', name: 'Today', color: 'hsla(207, 90%, 90%, 0.7)', textColor: 'hsl(220, 10%, 40%)' },
  { id: 'tomorrow', name: 'Tomorrow', color: 'hsla(207, 90%, 85%, 0.7)', textColor: 'hsl(220, 10%, 35%)' },
  { id: 'recent-future', name: 'Recent Future', color: 'hsla(207, 90%, 80%, 0.7)', textColor: 'hsl(220, 10%, 30%)' },
  { id: 'distant-future', name: 'Distant Future', color: 'hsla(207, 90%, 75%, 0.7)', textColor: 'hsl(220, 10%, 25%)' },
];

// Function to generate distinct HSL colors for regions if not specified
const generateRegionColors = (regions: Omit<Region, 'color' | 'textColor'>[]): Region[] => {
  const baseHue = 207; // Base hue for blue
  const saturation = 70; // Fixed saturation
  const baseLightness = 92; // Start with a light color
  const lightnessStep = -5; // Decrease lightness for outer rings
  
  const textBaseLightness = 30;
  const textLightnessStep = 5;


  return regions.map((region, index) => ({
    ...region,
    color: `hsla(${baseHue}, ${saturation}%, ${baseLightness + index * lightnessStep}%, 0.6)`,
    textColor: `hsl(${baseHue - 10}, ${saturation-50}%, ${textBaseLightness + index * textLightnessStep}%)`,
  }));
};


export default function LexiGenPage() {
  const [regions, setRegions] = useState<Region[]>(generateRegionColors(initialRegions.map(({color, textColor, ...rest}) => rest)));
  const [topics, setTopics] = useState<Topic[]>([]);
  const radarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  const handleAddTopic = (name: string, regionId: string) => {
    const newTopic: Topic = {
      id: `topic-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name,
      regionId,
      angle: Math.random() * 360,
      magnitude: 0.3 + Math.random() * 0.4, // Place between 30% and 70% of band width
    };
    setTopics((prevTopics) => [...prevTopics, newTopic]);
    toast({
      title: "Topic Added",
      description: `"${name}" has been added to the radar.`,
    });
  };

  const handleScreenshot = async () => {
    if (radarRef.current) {
      try {
        const canvas = await html2canvas(radarRef.current, { 
          useCORS: true,
          backgroundColor: '#E3F2FD', // Explicitly set background for screenshot
          scale: 2, // Increase scale for better resolution
         });
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'lexigen-radar.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({
          title: "Screenshot Captured!",
          description: "The radar image has been downloaded.",
        });
      } catch (error) {
        console.error("Error capturing screenshot:", error);
        toast({
          title: "Screenshot Failed",
          description: "Could not capture the radar image. See console for details.",
          variant: "destructive",
        });
      }
    }
  };

  const handleRegionConfigChange = (index: number, field: 'name' | 'color' | 'textColor', value: string) => {
    setRegions(prevRegions => {
      const updatedRegions = [...prevRegions];
      updatedRegions[index] = { ...updatedRegions[index], [field]: value };
      return updatedRegions;
    });
  };

  const handleAddRegion = () => {
    const newRegionId = `region-${Date.now()}`;
    const newRegionName = `New Region ${regions.length + 1}`;
    const placeholderRegions = [...regions.map(r => ({id: r.id, name: r.name})), {id: newRegionId, name: newRegionName }];
    const coloredRegions = generateRegionColors(placeholderRegions);
    setRegions(coloredRegions);
     toast({ title: "Region Added", description: `"${newRegionName}" configuration added.` });
  };
  
  const handleRemoveRegion = (idToRemove: string) => {
    if (regions.length <= 1) {
       toast({ title: "Cannot Remove", description: "At least one region must remain.", variant: "destructive" });
      return;
    }
    const placeholderRegions = regions.filter(r => r.id !== idToRemove).map(r => ({id: r.id, name: r.name}));
    const coloredRegions = generateRegionColors(placeholderRegions);
    setRegions(coloredRegions);
    // Also remove topics associated with this region
    setTopics(prevTopics => prevTopics.filter(topic => topic.regionId !== idToRemove));
    toast({ title: "Region Removed", description: "Region and associated topics removed." });
  };


  if (!mounted) {
    // Render a loading state or null until the component is mounted
    // This helps avoid hydration mismatches with Math.random() or other client-side only logic
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <div className="flex-grow container mx-auto p-4 flex items-center justify-center">
          <p>Loading LexiGen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Controls */}
          <div className="lg:col-span-1 space-y-6">
            <TopicForm regions={regions} onAddTopic={handleAddTopic} />
            
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Settings2 className="mr-2 h-6 w-6 text-primary" />
                  Radar Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleScreenshot} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Capture Screenshot
                </Button>
                <ScrollArea className="h-[250px] pr-3">
                  <div className="space-y-3">
                  {regions.map((region, index) => (
                    <Card key={region.id} className="p-3 bg-muted/50">
                      <Label htmlFor={`region-name-${index}`} className="text-sm font-medium">Region {index + 1}: {region.name}</Label>
                      <Input
                        id={`region-name-${index}`}
                        type="text"
                        value={region.name}
                        onChange={(e) => handleRegionConfigChange(index, 'name', e.target.value)}
                        className="mt-1 mb-2"
                      />
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`region-color-${index}`} className="text-xs">Band Color:</Label>
                        <Input
                          id={`region-color-${index}`}
                          type="color"
                          value={region.color.startsWith('hsla') ? hslToHex(region.color) : region.color} // Basic conversion for input type=color
                          onChange={(e) => handleRegionConfigChange(index, 'color', e.target.value)}
                          className="w-16 h-8 p-1"
                        />
                         <Label htmlFor={`region-text-color-${index}`} className="text-xs">Text Color:</Label>
                        <Input
                          id={`region-text-color-${index}`}
                          type="color"
                          value={region.textColor.startsWith('hsl') ? hslToHex(region.textColor) : region.textColor}
                          onChange={(e) => handleRegionConfigChange(index, 'textColor', e.target.value)}
                           className="w-16 h-8 p-1"
                        />
                        <Button variant="destructive" size="sm" onClick={() => handleRemoveRegion(region.id)} disabled={regions.length <=1 }>&times;</Button>
                      </div>
                    </Card>
                  ))}
                  </div>
                </ScrollArea>
                 <Button onClick={handleAddRegion} variant="outline" className="w-full">
                  <Palette className="mr-2 h-4 w-4" /> Add Region
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Radar View */}
          <div className="lg:col-span-2 flex items-center justify-center">
            <Card className="shadow-xl w-full overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl text-center">Topic Radar</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center p-2 md:p-4">
                <RadarView ref={radarRef} regions={regions} topics={topics} width={600} height={600} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        LexiGen &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

// Helper function to convert HSL(A) to HEX for color input (simplified)
function hslToHex(hslStr: string): string {
  const match = hslStr.match(/hsla?\((\d+),\s*([\d.]+)%,\s*([\d.]+)%(?:,\s*([\d.]+))?\)/);
  if (!match) return '#000000'; // Fallback

  let h = parseInt(match[1]);
  let s = parseInt(match[2]) / 100;
  let l = parseInt(match[3]) / 100;

  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
  
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  const toHex = (val: number) => val.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

