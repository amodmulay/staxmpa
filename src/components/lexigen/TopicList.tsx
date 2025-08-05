
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { List, Search, X } from 'lucide-react';
import type { Topic, Region } from '@/types/lexigen';

interface TopicListProps {
  topics: Topic[];
  regions: Region[];
  onRemoveTopic: (topicId: string) => void;
}

const ALL_REGIONS_VALUE = 'all-regions-filter-value';

export function TopicList({ topics, regions, onRemoveTopic }: TopicListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRegion, setFilterRegion] = useState(ALL_REGIONS_VALUE);

  const regionMap = useMemo(() => new Map(regions.map(r => [r.id, r])), [regions]);

  const filteredAndSortedTopics = useMemo(() => {
    return topics
      .filter(topic => {
        const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRegion = filterRegion === ALL_REGIONS_VALUE || topic.regionId === filterRegion;
        return matchesSearch && matchesRegion;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [topics, searchTerm, filterRegion]);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                 <List className="mr-2 h-6 w-6 text-primary" />
                 <CardTitle className="text-xl">Topics Added</CardTitle>
            </div>
            <Badge variant="secondary">{filteredAndSortedTopics.length} / {topics.length} showing</Badge>
        </div>
        <CardDescription>Filter, search, and manage the topics on your radar.</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by topic name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={filterRegion} onValueChange={setFilterRegion}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by region..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_REGIONS_VALUE}>All Regions</SelectItem>
              {regions.map(region => (
                <SelectItem key={region.id} value={region.id}>{region.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="border rounded-md max-h-[400px] overflow-auto">
            <Table>
                <TableHeader className="sticky top-0 bg-muted">
                    <TableRow>
                    <TableHead>Topic</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {filteredAndSortedTopics.length > 0 ? (
                    filteredAndSortedTopics.map((topic) => (
                    <TableRow key={topic.id}>
                        <TableCell className="font-medium">{topic.name}</TableCell>
                        <TableCell>
                            <Badge style={{ 
                                backgroundColor: regionMap.get(topic.regionId)?.color, 
                                color: regionMap.get(topic.regionId)?.textColor 
                            }}
                            variant="outline"
                            >
                                {regionMap.get(topic.regionId)?.name || 'Unknown'}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveTopic(topic.id)}
                            aria-label={`Remove topic ${topic.name}`}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))
                ) : (
                    <TableRow>
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                        No topics match your filters.
                    </TableCell>
                    </TableRow>
                )}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
};
