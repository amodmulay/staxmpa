import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// Assuming Topic type is defined elsewhere and imported
// import type { Topic } from '@/types/lexigen'; // Example import

interface Topic {
  // Define the structure of your Topic type here if not imported
  // Example:
  id: string;
  name: string;
  regionId: string; // Assuming regionId is part of your Topic type
  angle: number;
  // Add other topic properties if needed
}

interface TopicListProps {
  topics: Topic[];
  onRemoveTopic: (topicId: string) => void;
}

const TopicList: React.FC<TopicListProps> = ({ topics, onRemoveTopic }) => {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl">Topics Added</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0"> {/* Adjust padding as needed */}
        {topics.length === 0 ? (
          <p className="text-muted-foreground text-sm">No topics added yet.</p>
        ) : (
          <ul className="space-y-2">
            {topics.map((topic) => (
              <li key={topic.id} className="flex justify-between items-center bg-muted/50 p-2 rounded-md">
                <span className="text-sm font-medium">{topic.name}</span>
                <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemoveTopic(topic.id)}
                aria-label={`Remove topic ${topic.name}`}
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