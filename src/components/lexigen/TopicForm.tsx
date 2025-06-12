
"use client";

import React from 'react'; // Changed from type-only import
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Region } from '@/types/lexigen';
import { PlusCircle } from 'lucide-react';

const topicFormSchema = z.object({
  name: z.string().min(1, { message: "Topic name is required." }).max(50, { message: "Topic name must be 50 characters or less."}),
  regionId: z.string().min(1, { message: "Please select a region." }),
});

type TopicFormData = z.infer<typeof topicFormSchema>;

interface TopicFormProps {
  regions: Region[];
  onAddTopic: (name: string, regionId: string) => void;
}

export function TopicForm({ regions, onAddTopic }: TopicFormProps) {
  const form = useForm<TopicFormData>({
    resolver: zodResolver(topicFormSchema),
    defaultValues: {
      name: "",
      regionId: regions.length > 0 ? regions[0].id : "", // Default to first region if available
    },
  });

  // Effect to update default regionId if regions change or on initial load
  React.useEffect(() => {
    if (regions.length > 0 && !form.getValues("regionId")) {
      form.setValue("regionId", regions[0].id);
    }
  }, [regions, form]);


  const onSubmit: SubmitHandler<TopicFormData> = (data) => {
    const currentRegionId = data.regionId;
    onAddTopic(data.name, data.regionId);
    form.reset({
      name: "",
      regionId: currentRegionId, // Retain the last selected region
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <PlusCircle className="mr-2 h-6 w-6 text-primary" />
          Add New Topic
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Topic Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Gen AI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="regionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Region</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || (regions.length > 0 ? regions[0].id : "")} // Ensure value is controlled
                    key={regions.map(r => r.id).join('-')} // Re-key to force re-render if regions change
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a region" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {regions.map((region) => (
                        <SelectItem key={region.id} value={region.id}>
                          {region.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={regions.length === 0}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Topic to Radar
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
