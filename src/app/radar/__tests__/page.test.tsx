
"use client";

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RadarPage from '../page';

// --- MOCKS ---

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock html2canvas
jest.mock('html2canvas', () => ({
    __esModule: true,
    default: jest.fn().mockResolvedValue({
        toDataURL: jest.fn().mockReturnValue('data:image/png;base64,...'),
    }),
}));


// Mock window.matchMedia for useIsMobile hook
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});


describe('RadarPage Integration Tests', () => {

    beforeEach(() => {
        // Set the session storage item to prevent redirection
        sessionStorage.setItem('hasVisitedLanding', 'true');

        // Reset mocks before each test
        jest.clearAllMocks();
    });

    it('should allow a user to add a new topic', async () => {
        const user = userEvent.setup();
        render(<RadarPage />);

        // Wait for the page to finish its initial loading state
        await screen.findByText('Radar Configuration');
        
        const topicNameInput = screen.getByPlaceholderText('e.g., Gen AI');
        const addButton = screen.getByRole('button', { name: /Add Topic to Radar/i });

        // Initially, the topic list should be empty
        expect(screen.getByText('No topics match your filters.')).toBeInTheDocument();
        
        // Add a new topic
        await user.type(topicNameInput, 'My New Test Topic');
        await user.click(addButton);

        // Verify the topic now appears in the topic list
        await waitFor(() => {
            expect(screen.getByText('My New Test Topic')).toBeInTheDocument();
        });

        // The input should be cleared
        expect(topicNameInput).toHaveValue('');
    });

    it('should allow a user to remove a topic', async () => {
        const user = userEvent.setup();
        render(<RadarPage />);

        // Add a topic first
        await user.type(screen.getByPlaceholderText('e.g., Gen AI'), 'Topic to Remove');
        await user.click(screen.getByRole('button', { name: /Add Topic to Radar/i }));
        
        // Wait for topic to appear
        const topicCell = await screen.findByText('Topic to Remove');
        expect(topicCell).toBeInTheDocument();

        // Find the remove button for that topic
        const row = topicCell.closest('tr');
        if (!row) throw new Error('Could not find table row for topic');
        
        const removeButton = row.querySelector('button[aria-label="Remove topic Topic to Remove"]');
        if (!removeButton) throw new Error('Could not find remove button');

        await user.click(removeButton);

        // Verify the topic is gone from the list
        await waitFor(() => {
            expect(screen.queryByText('Topic to Remove')).not.toBeInTheDocument();
        });
    });

    it('should filter the topic list based on search and region selection', async () => {
        const user = userEvent.setup();
        render(<RadarPage />);

        // Add topics to different regions
        const topicNameInput = screen.getByPlaceholderText('e.g., Gen AI');
        const regionSelect = screen.getByRole('combobox', { name: 'Region' });
        const addButton = screen.getByRole('button', { name: /Add Topic to Radar/i });

        // Add Topic 1 to "Today"
        await user.type(topicNameInput, 'React');
        await user.click(addButton);

        // Add Topic 2 to "Tomorrow"
        await user.click(regionSelect);
        await user.click(await screen.findByRole('option', { name: 'Tomorrow' }));
        await user.type(topicNameInput, 'Vue');
        await user.click(addButton);
        
        // Wait for both to be in the document
        await screen.findByText('React');
        await screen.findByText('Vue');

        // Search for 'React'
        const searchInput = screen.getByPlaceholderText('Search by topic name...');
        await user.type(searchInput, 'React');

        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.queryByText('Vue')).not.toBeInTheDocument();

        // Clear search and filter by region
        await user.clear(searchInput);
        const regionFilterSelect = screen.getAllByRole('combobox')[1];
        await user.click(regionFilterSelect);
        await user.click(await screen.findByRole('option', { name: 'Tomorrow' }));

        expect(screen.queryByText('React')).not.toBeInTheDocument();
        expect(screen.getByText('Vue')).toBeInTheDocument();
    });

    it('should change the theme when a new theme is selected', async () => {
        const user = userEvent.setup();
        const { getByText } = render(<RadarPage />);
        await screen.findByText('Radar Configuration');
        
        // Find and click the configure tab
        await user.click(screen.getByRole('tab', { name: 'Configure' }));

        // Find the "Sunset" theme button and click it
        const sunsetThemeButton = getByText('Sunset');
        await user.click(sunsetThemeButton);

        // A toast notification should appear confirming the change
        await waitFor(() => {
            expect(screen.getByText('Theme Changed')).toBeInTheDocument();
            expect(screen.getByText('Switched to the Sunset theme.')).toBeInTheDocument();
        });
    });
    
    it('should open the controls sheet on mobile view', async () => {
        // Set screen to mobile
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 500 });
        
        const user = userEvent.setup();
        render(<RadarPage />);

        // Find the settings button that is only visible on mobile
        const settingsButton = await screen.findByRole('button', { name: /Open Controls/i });
        expect(settingsButton).toBeInTheDocument();
        
        // The radar controls title should not be visible initially
        expect(screen.queryByRole('heading', { name: /Radar Controls/i })).not.toBeInTheDocument();
        
        await user.click(settingsButton);

        // The sheet with controls should now be visible
        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Radar Controls/i })).toBeInTheDocument();
            expect(screen.getByPlaceholderText('e.g., Gen AI')).toBeInTheDocument();
        });
    });
});
