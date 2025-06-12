
"use client";

import type * as React from 'react';
import { useState, useRef, useEffect, useMemo } from 'react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { TopicForm } from '@/components/lexigen/TopicForm';
import { RadarView } from '@/components/lexigen/RadarView';
import { AppHeader } from '@/components/lexigen/AppHeader';
import type { Region, Topic, ThemeDefinition, BaseRegion } from '@/types/lexigen';
import { Download, Settings2, Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ThemeSelector } from '@/components/lexigen/ThemeSelector'; // New component
import TopicList from '@/components/lexigen/TopicList';

const initialRegionDefinitions: BaseRegion[] = [
  { id: 'today', name: 'Today' },
  { id: 'tomorrow', name: 'Tomorrow' },
  { id: 'recent-future', name: 'Recent Future' },
  { id: 'distant-future', name: 'Distant Future' },
];

// --- THEME DEFINITIONS ---

const generateDefaultColors: ThemeDefinition['generateColors'] = (baseRegions) => {
  const baseHue = 207; // Base hue for blue
  const saturation = 70;
  const baseLightness = 92;
  const lightnessStep = -5;
  const textBaseLightness = 30;
  const textLightnessStep = 5;

  return baseRegions.map((region, index) => ({
    ...region,
    color: `hsla(${baseHue}, ${saturation}%, ${baseLightness + index * lightnessStep}%, 0.6)`,
    textColor: `hsl(${baseHue - 10}, ${saturation-50}%, ${textBaseLightness + index * textLightnessStep}%)`,
  }));
};

const generateMaterialDarkColors: ThemeDefinition['generateColors'] = (baseRegions) => {
  const HUE = 210;
  const SAT = 10;
  return baseRegions.map((region, index) => ({
    ...region,
    color: `hsla(${HUE}, ${SAT}%, ${20 + index * 6}%, 0.75)`, // Darker, slightly increasing lightness
    textColor: `hsl(${HUE}, ${SAT}%, ${85 - index * 5}%)`, // Light text
  }));
};

const generateMaterialLightIndigoColors: ThemeDefinition['generateColors'] = (baseRegions) => {
  const HUE = 230; // Indigo-ish
  const SAT = 55;
  return baseRegions.map((region, index) => ({
    ...region,
    color: `hsla(${HUE}, ${SAT}%, ${96 - index * 8}%, 0.65)`, // Light to darker indigo shades
    textColor: `hsl(${HUE}, ${SAT-25}%, ${25 + index * 6}%)`, // Darker text, good contrast
  }));
};

const generateMonochromeColors: ThemeDefinition['generateColors'] = (baseRegions) => {
  return baseRegions.map((region, index) => ({
    ...region,
    color: `hsla(0, 0%, ${90 - index * 12}%, 0.7)`, // Shades of gray from light to dark
    textColor: `hsl(0, 0%, ${15 + index * 5}%)`, // Dark text, ensuring readability
  }));
};

const appThemes: ThemeDefinition[] = [
  {
    id: 'default',
    name: 'Default Teal',
    generateColors: generateDefaultColors,
    topicDotColor: 'hsl(var(--primary))', // Uses CSS variable for dots
    screenshotBackgroundColor: 'hsl(var(--background))',
  },
  {
    id: 'materialDark',
    name: 'Material Dark',
    generateColors: generateMaterialDarkColors,
    topicDotColor: '#BB86FC', // Material Purple A200
    screenshotBackgroundColor: 'hsl(220,15%,10%)', // Matches dark theme background
  },
  {
    id: 'materialLightIndigo',
    name: 'Material Light (Indigo)',
    generateColors: generateMaterialLightIndigoColors,
    topicDotColor: '#3F51B5', // Material Indigo 500
    screenshotBackgroundColor: 'hsl(0,0%,100%)',
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    generateColors: generateMonochromeColors,
    topicDotColor: '#212121', // Dark Gray
    screenshotBackgroundColor: 'hsl(0,0%,100%)',
  },
];

// --- END THEME DEFINITIONS ---

export default function LexiGenPage() {
  const [baseRegionDefinitions, setBaseRegionDefinitions] = useState<BaseRegion[]>(initialRegionDefinitions);
  const [selectedThemeId, setSelectedThemeId] = useState<string>(appThemes[0].id);
  const [customColorOverrides, setCustomColorOverrides] = useState<Record<string, Partial<Pick<Region, 'color' | 'textColor'>>>>({});

  const [topics, setTopics] = useState<Topic[]>([]);
  const radarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = useMemo(() => {
    return appThemes.find(t => t.id === selectedThemeId) || appThemes[0];
  }, [selectedThemeId]);

  const regions: Region[] = useMemo(() => {
    const themeColoredRegions = currentTheme.generateColors(baseRegionDefinitions);
    return themeColoredRegions.map(tr => ({
      ...tr,
      ...(customColorOverrides[tr.id] || {}),
    }));
  }, [baseRegionDefinitions, currentTheme, customColorOverrides]);


  const handleAddTopic = (name: string, regionId: string) => {
    const newTopic: Topic = {
      id: `topic-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name,
      regionId,
      angle: Math.random() * 360,
      magnitude: 0.3 + Math.random() * 0.4,
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
        const canvasOptions: Partial<html2canvas.Options> = { 
          useCORS: true,
          scale: 2, 
        };
        if (currentTheme.screenshotBackgroundColor && currentTheme.id !== 'default') { 
          canvasOptions.backgroundColor = currentTheme.screenshotBackgroundColor;
        } else if (currentTheme.id === 'default') {
            const radarStyle = window.getComputedStyle(radarRef.current);
            canvasOptions.backgroundColor = radarStyle.backgroundColor || '#E3F2FD';
        }

        const canvas = await html2canvas(radarRef.current, canvasOptions);
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
  
  const handleThemeChange = (themeId: string) => {
    setSelectedThemeId(themeId);
    setCustomColorOverrides({}); 
    toast({ title: "Theme Changed", description: `Switched to ${appThemes.find(t=>t.id===themeId)?.name || 'selected'} theme.`});
  };

  const handleRegionConfigChange = (index: number, field: 'name' | 'color' | 'textColor', value: string) => {
    const regionIdToUpdate = baseRegionDefinitions[index]?.id;
    if (!regionIdToUpdate) return;

    if (field === 'name') {
      setBaseRegionDefinitions(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], name: value };
        return updated;
      });
    } else {
      setCustomColorOverrides(prev => ({
        ...prev,
        [regionIdToUpdate]: {
          ...prev[regionIdToUpdate],
          [field]: value,
        }
      }));
    }
  };

  const handleAddRegion = () => {
    const newRegionId = `region-${Date.now()}`;
    const newRegionName = `New Region ${baseRegionDefinitions.length + 1}`;
    setBaseRegionDefinitions(prev => [...prev, { id: newRegionId, name: newRegionName }]);
    toast({ title: "Region Added", description: `"${newRegionName}" configuration added.` });
  };
  
  const handleRemoveRegion = (idToRemove: string) => {
    if (baseRegionDefinitions.length <= 1) {
      toast({ title: "Cannot Remove", description: "At least one region must remain.", variant: "destructive" });
      return;
    }
    setBaseRegionDefinitions(prev => prev.filter(r => r.id !== idToRemove));
    setCustomColorOverrides(prev => {
      const updated = {...prev};
      delete updated[idToRemove];
      return updated;
    });
    setTopics(prevTopics => prevTopics.filter(topic => topic.regionId !== idToRemove));
    toast({ title: "Region Removed", description: "Region and associated topics removed." });
  };

  function handleRemoveTopic(topicId: string) {
    setTopics(topics.filter(topic => topic.id !== topicId));
    toast({
      title: "Topic Removed",
      description: "The topic has been removed from the radar and the list.",
      duration: 2000,
    });
  };

  if (!mounted) {
    return (
      <div className="flex flex-col min-h-screen">
        <AppHeader />
        <div className="flex-grow w-full max-w-[80%] mx-auto p-4 flex items-center justify-center">
          <p>Loading LexiGen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="flex-grow w-full max-w-[80%] mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> {/* This is the main grid container */}
          <div className="grid grid-cols-1 gap-6">
          <TopicForm regions={regions} onAddTopic={handleAddTopic} />
            
          {/* Item 2: RadarConfiguration Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Settings2 className="mr-2 h-6 w-6 text-primary" />
                Radar Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ThemeSelector 
                themes={appThemes} 
                selectedThemeId={selectedThemeId} 
                onSelectTheme={handleThemeChange} 
              />
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
                        value={region.color.startsWith('hsl') ? hslToHex(region.color) : region.color}
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
                      <Button variant="destructive" size="sm" onClick={() => handleRemoveRegion(region.id)} disabled={baseRegionDefinitions.length <=1 }>&times;</Button>
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

          </div> {/* Close the first column div */}

          <div className="lg:col-span-2 flex flex-col gap-6"> {/* This is the second/third column container */}
          <div className="flex items-center justify-center flex-grow">
            <Card className="shadow-xl w-full overflow-hidden flex-grow">
              <CardHeader>
                <CardTitle className="text-xl text-center">Topic Radar & Sunray View</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center items-center p-2 md:p-4">
                <RadarView 
                  ref={radarRef} 
                  regions={regions} 
                  topics={topics} 
                  width={600} 
                  height={600}
                  topicDotColor={currentTheme.topicDotColor}
                />
              </CardContent>
            </Card>
          </div>

          {/* Item 4: Topic List Card */}
            <Card className="shadow-lg">
             <TopicList topics={topics} onRemoveTopic={handleRemoveTopic} />
            </Card>
        </div>

      </div> {/* Close the main grid container */}
    </main>
 <footer className="text-center p-4 text-sm text-muted-foreground border-t">
        LexiGen &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

function hslToHex(hslStr: string): string {
  const match = hslStr.match(/hsla?\((\d+),\s*([\d.]+)%,\s*([\d.]+)%(?:,\s*([\d.]+))?\)/);
  if (!match) return '#000000'; 

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

