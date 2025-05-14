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
