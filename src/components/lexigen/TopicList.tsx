
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Topic } from '@/types/lexigen'; // Use shared Topic type

interface TopicListProps {
  topics: Topic[];
  onRemoveTopic: (topicId: string) => void;
  regions: { id: string; name: string }[];
}

const TopicList: React.FC<TopicListProps> = ({ topics, onRemoveTopic, regions }) => {
  const [filterText, setFilterText] = useState('');
  const [filterRegion, setFilterRegion] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'regionId' | 'angle'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedTopics = useMemo(() => {
    let filteredTopics = topics.filter(topic =>
      topic.name.toLowerCase().includes(filterText.toLowerCase()) &&
      (filterRegion === '' || topic.regionId === filterRegion)
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
        compareValue = a.angle - b.angle;
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
          <Select onValueChange={setFilterRegion} value={filterRegion}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Regions</SelectItem>
              {regions.map(region => <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>)}
            </SelectContent>
          </Select> {/* Fixed: Added closing tag */}
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
        <CardTitle className="text-xl">Topics Added</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {filteredAndSortedTopics.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {topics.length > 0 ? 'No topics match your current filters.' : 'No topics added yet.'}
            </p>
        ) : (
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {filteredAndSortedTopics.map((topic) => (
              <li key={topic.id} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                <div>
                  <span className="text-sm font-medium">{topic.name}</span>
                  <p className="text-xs text-muted-foreground">
                    Region: {regions.find(r => r.id === topic.regionId)?.name || 'N/A'}
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
