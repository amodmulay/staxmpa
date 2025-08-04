
"use client";

import type * as React from 'react';
import { useState, useRef, useEffect, useMemo } from 'react';
import html2canvas from 'html2canvas';
import { useTheme } from 'next-themes';
import type { Region, Topic, ThemeDefinition, BaseRegion } from '@/types/lexigen';
import { useToast } from '@/hooks/use-toast';
import { RadarView } from '@/components/lexigen/RadarView';
import TopicList from '@/components/lexigen/TopicList';
import { Sidebar } from '@/components/lexigen/Sidebar';
import { RadarControls } from '@/components/lexigen/RadarControls';

const initialRegionDefinitions: BaseRegion[] = [
  { id: 'today', name: 'Adopt' },
  { id: 'tomorrow', name: 'Assess' },
  { id: 'recent-future', name: 'Trial' },
  { id: 'distant-future', name: 'Hold' },
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
  const HUE = 221; // Blue from globals.css
  const SAT = 100;
  return baseRegions.map((region, index) => ({
    ...region,
    color: `hsla(${HUE}, ${SAT}%, ${20 + index * 8}%, 0.75)`, // Darker, slightly increasing lightness
    textColor: `hsl(${HUE}, ${SAT-20}%, ${85 - index * 5}%)`, // Light text
  }));
};

const appThemes: ThemeDefinition[] = [
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
];

// --- END THEME DEFINITIONS ---

export default function RadarPage() {
  const { theme: systemTheme } = useTheme();
  const [baseRegionDefinitions, setBaseRegionDefinitions] = useState<BaseRegion[]>(initialRegionDefinitions);
  const [selectedThemeId, setSelectedThemeId] = useState<string>(appThemes[0].id);
  const [customColorOverrides, setCustomColorOverrides] = useState<Record<string, Partial<Pick<Region, 'color' | 'textColor'>>>>({});
  
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicPositions, setTopicPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [radarSize, setRadarSize] = useState(600);

  const radarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Automatically switch radar theme based on light/dark mode
  useEffect(() => {
    if (systemTheme === 'dark') {
      setSelectedThemeId('materialDark');
    } else {
      setSelectedThemeId('default');
    }
    setCustomColorOverrides({});
  }, [systemTheme]);

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
        const canvasOptions: Partial<html2canvas.Options> = { 
          useCORS: true,
          scale: 2, 
          backgroundColor: currentTheme.screenshotBackgroundColor || null,
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
  
  const radarControls = (
    <RadarControls
        regions={regions}
        onAddTopic={handleAddTopic}
        radarSize={radarSize}
        onRadarSizeChange={setRadarSize}
        onScreenshot={handleScreenshot}
        onRegionConfigChange={handleRegionConfigChange}
        onRemoveRegion={handleRemoveRegion}
        onAddRegion={handleAddRegion}
        baseRegionDefinitions={baseRegionDefinitions}
      />
  );

  if (!mounted) {
    return (
      <div className="flex-grow w-full max-w-7xl mx-auto p-4 flex items-center justify-center">
        <p>Loading Radar...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_320px] lg:grid-cols-[minmax(0,1fr)_400px] gap-6 h-full">
      <div className="flex flex-col gap-6">
        <div className="flex-grow flex items-center justify-center rounded-lg border bg-card text-card-foreground shadow-sm p-4 md:p-6">
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
          {radarControls}
        </Sidebar>
      </div>
    </div>
  );
}
