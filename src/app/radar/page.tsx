
"use client";

import type * as React from 'react';
import { useState, useRef, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import html2canvas from 'html2canvas';
import type { Region, Topic, ThemeDefinition, BaseRegion, RadarData } from '@/types/lexigen';
import { useToast } from '@/hooks/use-toast';
import { RadarView } from '@/components/lexigen/RadarView';
import { TopicList } from '@/components/lexigen/TopicList';
import { Sidebar } from '@/components/lexigen/Sidebar';
import { RadarControls } from '@/components/lexigen/RadarControls';
import { ThemeSelector } from '@/components/lexigen/ThemeSelector';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { z } from 'zod';

const initialRegionDefinitions: BaseRegion[] = [
  { id: 'today', name: 'Today' },
  { id: 'tomorrow', name: 'Tomorrow' },
  { id: 'recent-future', name: 'Recent Future' },
  { id: 'distant-future', name: 'Distant Future' },
];

// --- THEME DEFINITIONS ---

const generateDefaultColors: ThemeDefinition['generateColors'] = (baseRegions) => {
  const baseHue = 175; // Teal
  const saturation = 55;
  const baseLightness = 94;
  const lightnessStep = -6;
  const textBaseLightness = 30;
  const textLightnessStep = 5;

  return baseRegions.map((region, index) => ({
    ...region,
    color: `hsla(${baseHue}, ${saturation}%, ${baseLightness + index * lightnessStep}%, 0.7)`,
    textColor: `hsl(${baseHue - 10}, ${saturation - 30}%, ${textBaseLightness + index * textLightnessStep}%)`,
  }));
};

const generateMaterialDarkColors: ThemeDefinition['generateColors'] = (baseRegions) => {
  const HUE = 221; // Blue
  const SAT = 83;
  return baseRegions.map((region, index) => ({
    ...region,
    color: `hsla(${HUE}, ${SAT}%, ${15 + index * 6}%, 0.8)`, // Darker, slightly increasing lightness
    textColor: `hsl(${HUE}, ${SAT - 30}%, ${88 - index * 5}%)`, // Light text
  }));
};

const generateSunsetColors: ThemeDefinition['generateColors'] = (baseRegions) => {
    const colors = ['#4c1d95', '#be185d', '#f97316', '#facc15']; // Purple, Pink, Orange, Yellow
    const textColors = ['#f5d0fe', '#fbcfe8', '#ffedd5', '#fef9c3'];
    return baseRegions.map((region, index) => ({
      ...region,
      color: colors[index % colors.length],
      textColor: textColors[index % textColors.length],
    }));
};

const generateMonochromeColors: ThemeDefinition['generateColors'] = (baseRegions) => {
  return baseRegions.map((region, index) => ({
      ...region,
      color: `hsl(0, 0%, ${95 - index * 10}%)`,
      textColor: `hsl(0, 0%, ${20 + index * 10}%)`,
  }));
};


const appThemes: ThemeDefinition[] = [
  {
    id: 'monochrome',
    name: 'Monochrome',
    generateColors: generateMonochromeColors,
    topicDotColor: 'hsl(var(--primary))',
    screenshotBackgroundColor: 'hsl(var(--background))',
  },
  {
    id: 'default',
    name: 'Default Teal',
    generateColors: generateDefaultColors,
    topicDotColor: 'hsl(var(--primary))',
    screenshotBackgroundColor: 'hsl(var(--background))',
  },
  {
    id: 'materialDark',
    name: 'Material Dark',
    generateColors: generateMaterialDarkColors,
    topicDotColor: 'hsl(var(--primary))',
    screenshotBackgroundColor: 'hsl(var(--background))',
  },
  {
    id: 'sunset',
    name: 'Sunset',
    generateColors: generateSunsetColors,
    topicDotColor: '#ffffff',
    screenshotBackgroundColor: '#1c1917',
  }
];

// --- END THEME DEFINITIONS ---
// Zod schema for validating the imported JSON file
const radarDataSchema: z.ZodType<RadarData> = z.object({
  baseRegionDefinitions: z.array(z.object({ id: z.string(), name: z.string() })),
  topics: z.array(z.object({
    id: z.string(),
    name: z.string(),
    regionId: z.string(),
    angle: z.number(),
    magnitude: z.number(),
  })),
  topicPositions: z.record(z.object({ x: z.number(), y: z.number() })),
  selectedThemeId: z.string(),
  customColorOverrides: z.record(z.object({ color: z.string().optional(), textColor: z.string().optional() })),
  radarSize: z.number(),
});


export default function RadarPage() {
  const router = useRouter();
  const [baseRegionDefinitions, setBaseRegionDefinitions] = useState<BaseRegion[]>(initialRegionDefinitions);
  const [selectedThemeId, setSelectedThemeId] = useState<string>('monochrome');
  const [customColorOverrides, setCustomColorOverrides] = useState<Record<string, Partial<Pick<Region, 'color' | 'textColor'>>>>({});
  
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicPositions, setTopicPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [radarSize, setRadarSize] = useState(600);
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);

  const radarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Redirect if the user hasn't visited the landing page first
    if (typeof window !== 'undefined' && sessionStorage.getItem('hasVisitedLanding') !== 'true') {
      router.push('/');
    } else {
      setMounted(true);
    }
  }, [router]);
  
  const handleThemeChange = (themeId: string) => {
    setSelectedThemeId(themeId);
    // Reset custom color overrides when changing themes
    setCustomColorOverrides({});
    toast({
        title: "Theme Changed",
        description: `Switched to the ${appThemes.find(t => t.id === themeId)?.name || ''} theme.`,
        duration: 2000,
    });
  };

  const currentTheme = useMemo(() => {
    return appThemes.find(t => t.id === selectedThemeId) || appThemes.find(t => t.id === 'monochrome')!;
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
    // Close the sheet on mobile after adding a topic
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsMobileSheetOpen(false);
    }
  };

  const handleTopicPositionChange = (topicId: string, position: { x: number; y: number }, newRegionId?: string) => {
    // Update visual position
    setTopicPositions(prevPositions => ({
      ...prevPositions,
      [topicId]: position,
    }));
    
    // If a new region is determined, update the topic data
    if (newRegionId) {
        setTopics(prevTopics => 
            prevTopics.map(topic => 
                topic.id === topicId ? { ...topic, regionId: newRegionId } : topic
            )
        );
    }
  };

  const handleScreenshot = async () => {
    if (radarRef.current) {
      try {
        // Get the computed background color, which resolves CSS variables
        const computedStyle = window.getComputedStyle(radarRef.current);
        const backgroundColor = computedStyle.backgroundColor;

        const canvasOptions: Partial<html2canvas.Options> = {
          useCORS: true,
          scale: 2,
          // Use the resolved color, or the theme's specific color if it's not a CSS var
          backgroundColor: currentTheme.screenshotBackgroundColor?.startsWith('hsl')
            ? backgroundColor
            : currentTheme.screenshotBackgroundColor,
        };
        
        const canvas = await html2canvas(radarRef.current, canvasOptions);
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'staxmap-radar.png';
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
    setTopicPositions(prev => {
      const updated = {...prev};
      delete updated[topicId];
      return updated;
    });
    toast({
      title: "Topic Removed",
      description: "The topic has been removed from the radar and the list.",
      duration: 2000,
    });
  };

  const handleExport = () => {
    const radarData: RadarData = {
      baseRegionDefinitions,
      topics,
      topicPositions,
      selectedThemeId,
      customColorOverrides,
      radarSize,
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(radarData, null, 2))}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'staxmap-radar.json';
    link.click();
    toast({ title: "Radar Exported", description: "Your radar configuration has been saved." });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    const file = event.target.files?.[0];
    if (!file) return;

    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = e => {
      const fileContent = e.target?.result;
      if (typeof fileContent !== 'string') {
        toast({ title: "Import Failed", description: "Could not read file content.", variant: "destructive" });
        return;
      }
      try {
        const parsedData = JSON.parse(fileContent);
        const validationResult = radarDataSchema.safeParse(parsedData);

        if (!validationResult.success) {
          console.error("Invalid radar data format:", validationResult.error.flatten());
          toast({ title: "Import Failed", description: "Invalid or corrupt radar file format.", variant: "destructive" });
          return;
        }
        
        const data: RadarData = validationResult.data;

        // Restore state from imported data
        setBaseRegionDefinitions(data.baseRegionDefinitions);
        setTopics(data.topics);
        setTopicPositions(data.topicPositions);
        setSelectedThemeId(data.selectedThemeId);
        setCustomColorOverrides(data.customColorOverrides);
        setRadarSize(data.radarSize);

        toast({ title: "Import Successful", description: "Your radar has been loaded." });
      } catch (error) {
        console.error("Error parsing JSON:", error);
        toast({ title: "Import Failed", description: "The selected file is not a valid JSON file.", variant: "destructive" });
      } finally {
        // Reset the file input so the same file can be loaded again
        event.target.value = '';
      }
    };
  };

  if (!mounted) {
    return (
      <div className="flex-grow w-full max-w-7xl mx-auto p-4 flex items-center justify-center">
        <p>Loading Radar...</p>
      </div>
    );
  }

  const controlsComponent = (
    <RadarControls
      regions={regions}
      onAddTopic={handleAddTopic}
      radarSize={radarSize}
      onRadarSizeChange={setRadarSize}
      onScreenshot={handleScreenshot}
      onRegionConfigChange={handleRegionConfigChange}
      onRemoveRegion={handleRemoveRegion}
      onAddRegion={handleAddRegion}
      onExport={handleExport}
      onImport={handleImport}
      baseRegionDefinitions={baseRegionDefinitions}
    >
      <ThemeSelector
        themes={appThemes}
        selectedThemeId={selectedThemeId}
        onSelectTheme={handleThemeChange}
      />
    </RadarControls>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_320px] lg:grid-cols-[minmax(0,1fr)_400px] gap-6 h-full">
      <div className="flex flex-col gap-6">
        <div className="flex-grow flex items-center justify-center rounded-lg border bg-card text-card-foreground shadow-sm p-4 md:p-6 relative">
            <div className="absolute top-2 right-2 md:hidden">
              <Sheet open={isMobileSheetOpen} onOpenChange={setIsMobileSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-5 w-5" />
                    <span className="sr-only">Open Controls</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Radar Controls</SheetTitle>
                  </SheetHeader>
                  <div className="py-4">
                    {controlsComponent}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <RadarView 
              ref={radarRef} 
              regions={regions} 
              topics={topics} 
              topicPositions={topicPositions}
              onTopicPositionChange={handleTopicPositionChange}
              width={radarSize} 
              height={radarSize}
              topicDotColor={currentTheme.topicDotColor}
            />
        </div>
        <TopicList topics={topics} onRemoveTopic={handleRemoveTopic} regions={regions} />
      </div>
      
      <div className="hidden md:block">
        <Sidebar>
            {controlsComponent}
        </Sidebar>
      </div>
    </div>
  );
}

    