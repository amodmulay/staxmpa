export interface Region {
  id: string;
  name: string;
  color: string; // For the band fill
  textColor: string; // For the label text
}

export interface Topic {
  id: string;
  name: string;
  regionId: string;
  angle: number; // Degrees 0-360
  magnitude: number; // 0-1, fractional distance within the region band (0 = inner edge, 1 = outer edge)
}

export type BaseRegion = Omit<Region, 'color' | 'textColor'>;

export type RegionColorGenerator = (baseRegions: BaseRegion[]) => Region[];

export interface ThemeDefinition {
  id: string;
  name: string;
  generateColors: RegionColorGenerator;
  topicDotColor: string;
  // Optional: If a theme dictates a very specific overall radar background for screenshots
  // otherwise, it will use the SVG's background (derived from CSS vars).
  screenshotBackgroundColor?: string; 
}
