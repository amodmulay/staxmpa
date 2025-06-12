import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TopicForm } from '../TopicForm';
import type { Region } from '@/types/lexigen';

// Mock the useToast hook as it's used internally for notifications
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

const mockRegions: Region[] = [
  { id: 'region1', name: 'Region One', color: 'hsl(0, 0%, 90%)', textColor: 'hsl(0, 0%, 10%)' },
  { id: 'region2', name: 'Region Two', color: 'hsl(240, 70%, 90%)', textColor: 'hsl(240, 70%, 10%)' },
];

describe('TopicForm', () => {
  it('should allow a user to add a topic to a region', async () => {
    const handleAddTopicMock = jest.fn();
    const user = userEvent.setup();

    render(<TopicForm regions={mockRegions} onAddTopic={handleAddTopicMock} />);

    // Find form elements
    const topicNameInput = screen.getByLabelText(/Topic Name/i);
    const regionSelectTrigger = screen.getByRole('combobox', { name: /Region/i });
    const addButton = screen.getByRole('button', { name: /Add Topic to Radar/i });

    // Fill in the topic name
    await user.type(topicNameInput, 'New AI Topic');

    // Open the select dropdown
    // Ensure the component is fully rendered and interactive before clicking
    expect(regionSelectTrigger).toBeEnabled();
    await user.click(regionSelectTrigger);
    
    // Select a region
    // Use findByRole for elements that appear asynchronously or after interaction
    const regionOption = await screen.findByRole('option', { name: 'Region Two' });
    await user.click(regionOption);

    // Submit the form
    expect(addButton).toBeEnabled();
    await user.click(addButton);

    // Assert that onAddTopic was called with the correct arguments
    expect(handleAddTopicMock).toHaveBeenCalledTimes(1);
    expect(handleAddTopicMock).toHaveBeenCalledWith('New AI Topic', 'region2');

    // Assert that the form was reset (topic name cleared)
    expect(topicNameInput).toHaveValue('');
    
    // Assert that the region selection is retained
    // The text content of the SelectTrigger will be the name of the selected region.
    expect(screen.getByRole('combobox', { name: /Region/i })).toHaveTextContent('Region Two');
  });

  it('should disable add button if no regions are available', () => {
    const handleAddTopicMock = jest.fn();
    render(<TopicForm regions={[]} onAddTopic={handleAddTopicMock} />);
    
    const addButton = screen.getByRole('button', { name: /Add Topic to Radar/i });
    expect(addButton).toBeDisabled();
  });

  it('should pre-select the first region if regions are available and no region is selected', () => {
    const handleAddTopicMock = jest.fn();
    render(<TopicForm regions={mockRegions} onAddTopic={handleAddTopicMock} />);

    // The first region "Region One" should be pre-selected by the useEffect in TopicForm
    expect(screen.getByRole('combobox', { name: /Region/i })).toHaveTextContent('Region One');
  });
});
