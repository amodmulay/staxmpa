
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Topic } from '@/types/lexigen'; // Use shared Topic type
import type { Region } from '@/types/lexigen'; // Import Region type

interface TopicListProps {
  topics: Topic[];
  onRemoveTopic: (topicId: string) => void;
  regions: Region[]; // Changed from { id: string; name: string }[] to full Region type
}

const ALL_REGIONS_FILTER_VALUE = "all-regions-filter-value";

const TopicList: React.FC<TopicListProps> = ({ topics, onRemoveTopic, regions }) => {
  const [filterText, setFilterText] = useState('');
  const [filterRegion, setFilterRegion] = useState(''); // Empty string means all regions initially (placeholder shown)
  const [sortBy, setSortBy] = useState<'name' | 'regionId' | 'angle'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedTopics = useMemo(() => {
    let filteredTopics = topics.filter(topic =>
      topic.name.toLowerCase().includes(filterText.toLowerCase()) &&
      (filterRegion === '' || filterRegion === ALL_REGIONS_FILTER_VALUE || topic.regionId === filterRegion)
    );

    filteredTopics.sort((a, b) => {
      let compareValue = 0;
      if (sortBy === 'name') {
        compareValue = a.name.localeCompare(b.name);
      } else if (sortBy === 'regionId') {
        const regionA = regions.find(r => r.id === a.regionId)?.name || '';
        const regionB = regions.find(r => r.id === b.regionId)?.name || '';
        compareValue = regionA.localeCompare(regionB);
      } else if (sortBy === 'angle') {
        // Ensure angle is treated as a number for sorting
        const angleA = typeof a.angle === 'number' ? a.angle : 0;
        const angleB = typeof b.angle === 'number' ? b.angle : 0;
        compareValue = angleA - angleB;
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return filteredTopics;
  }, [topics, filterText, filterRegion, sortBy, sortOrder, regions]);

  return (
    <Card className="shadow-lg">
      <CardContent className="p-4 pb-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Filtering Controls */}
          <Input placeholder="Filter by name" value={filterText} onChange={(e) => setFilterText(e.target.value)} className="w-full" />
          <Select 
            onValueChange={(value) => setFilterRegion(value === ALL_REGIONS_FILTER_VALUE ? '' : value)} 
            value={filterRegion === '' && regions.length > 0 ? ALL_REGIONS_FILTER_VALUE : filterRegion}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_REGIONS_FILTER_VALUE}>All Regions</SelectItem>
              {regions.map(region => <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>)}
            </SelectContent>
          </Select>
          {/* Sorting Controls */}
          <Select onValueChange={(value) => setSortBy(value as 'name' | 'regionId' | 'angle')} value={sortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="regionId">Region</SelectItem>
              <SelectItem value="angle">Angle</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')} value={sortOrder}>
            <SelectTrigger>
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">Ascending</SelectItem>
              <SelectItem value="desc">Descending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardHeader>
        <CardTitle className="text-xl">Topics Added ({filteredAndSortedTopics.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {filteredAndSortedTopics.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {topics.length > 0 ? 'No topics match your current filters.' : 'No topics added yet.'}
            </p>
        ) : (
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {filteredAndSortedTopics.map((topic) => (
              <li key={topic.id} className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/50 transition-colors">
                <div>
                  <span className="text-sm font-semibold text-primary">{topic.name}</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Region: {regions.find(r => r.id === topic.regionId)?.name || 'N/A'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Angle: {topic.angle.toFixed(1)}°, Magnitude: {(topic.magnitude * 100).toFixed(0)}%
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveTopic(topic.id)}
                  aria-label={`Remove topic ${topic.name}`}
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default TopicList;
