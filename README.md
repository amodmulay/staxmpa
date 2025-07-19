# StaxMap: A Technology Radar Generator

StaxMap is a web application built with Next.js that allows users to create, visualize, and manage technology radars. It's designed to be an intuitive tool for teams to map out technologies, frameworks, and tools, assessing their adoption stage within the organization (e.g., Adopt, Trial, Assess, Hold).

## Features

- **Dynamic Radar Creation**: Add and remove concentric regions (e.g., "Adopt", "Assess").
- **Real-time Topic Management**: Add topics to different regions, and see them appear instantly on the radar.
- **Interactive Visualization**: Drag-and-drop topics within the radar to fine-tune their position and change their region.
- **Theming and Customization**: Switch between pre-defined themes (Light, Dark, etc.) or customize the colors of each region to match your branding.
- **Screenshot Capture**: Export a high-resolution PNG image of your radar for presentations and documentation.
- **Filtering and Searching**: Easily find topics in the list with search and region-based filtering.
- **Responsive Design**: Works on both desktop and mobile devices.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI/Generative Features**: [Google Genkit](https://firebase.google.com/docs/genkit) (Configured but not yet implemented)
- **Testing**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/)

## Getting Started

Follow these instructions to get a local copy up and running.

### Prerequisites

- Node.js (v18 or newer recommended)
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd staxmap
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server

To start the Next.js development server:

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002). The server uses Turbopack for fast refresh.

### Running Genkit Flows (for AI features)

If you are developing AI-powered features, you'll need to run the Genkit development server in a separate terminal:

```bash
npm run genkit:dev
```

This starts the Genkit development UI where you can inspect and test your AI flows.

### Running Tests

The project is configured with Jest and React Testing Library. To run the test suite:

```bash
npm test
```

This will execute all `*.test.tsx` files and report the results in your terminal.

## Architecture and State Management

### Architecture Diagram

The application follows a component-based architecture where the main page (`RadarPage`) acts as a central controller, managing state and passing data and functions down to child presentational components.

```mermaid
graph TD
    subgraph "State & Logic Controller (Client Component)"
        A[<b>RadarPage</b><br>(src/app/radar/page.tsx)<br><i>Manages all application state</i>]
    end

    subgraph "Presentational UI Components"
        B[<b>TopicForm</b><br><i>Adds new topics</i>]
        C[<b>RadarView</b><br><i>Renders the interactive SVG radar</i>]
        D[<b>TopicList</b><br><i>Displays and filters all topics</i>]
        E[<b>Radar Configuration</b><br><i>Controls themes, regions, and colors</i>]
    end

    A -- "regions, onAddTopic()" --> B
    A -- "regions, topics, topicPositions, onTopicPositionChange()" --> C
    A -- "topics, regions, onRemoveTopic()" --> D
    A -- "regions, themes, onRegionConfigChange(), onThemeChange()" --> E

    B -- "Calls onAddTopic()" --> A
    C -- "Calls onTopicPositionChange()" --> A
    D -- "Calls onRemoveTopic()" --> A
    E -- "Calls config change handlers" --> A

    style A fill:#e3f2fd,stroke:#1e88e5,stroke-width:2px
    style B fill:#fff,stroke:#333
    style C fill:#fff,stroke:#333
    style D fill:#fff,stroke:#333
    style E fill:#fff,stroke:#333
```

### State Management

The state management in StaxMap is intentionally simple and centralized, following standard React patterns without external state management libraries like Redux or Zustand.

- **Single Source of Truth**: The `RadarPage` component (`src/app/radar/page.tsx`) is the heart of the application. Because it is a client component (`"use client"`), it can use React hooks to manage all the critical pieces of state:
    - `regions`: The array of radar rings (e.g., Adopt, Assess).
    - `topics`: The array of technology topics added to the radar.
    - `topicPositions`: The pixel coordinates of topics that have been manually dragged. This state is crucial for persisting UI changes.
    - `selectedThemeId`: The ID of the currently active theme.
    - `customColorOverrides`: Custom colors applied to specific regions.

- **Lifting State Up**: This is the core principle used. `RadarPage` holds the state and defines the functions that can modify it (e.g., `handleAddTopic`, `handleTopicPositionChange`).

- **Unidirectional Data Flow**:
    1.  **State is passed down**: `RadarPage` passes the state down to its child components as props (e.g., `RadarView` receives `topics` and `regions`). These child components are purely presentational; they render what they are given.
    2.  **Actions are passed up**: When a user interacts with a child component (like clicking "Add Topic" in `TopicForm`), the component doesn't change the state directly. Instead, it calls a function (like `onAddTopic`) that was passed down to it as a prop. This function, which lives in `RadarPage`, is the only thing that can modify the state.

This approach keeps the application predictable and easier to debug, as all state changes happen in one central location.

## Project Structure

The codebase is organized to separate concerns and maintain a clean architecture.

```
staxmap/
├── src/
│   ├── app/                    # Next.js App Router: Pages and Layouts
│   │   ├── radar/
│   │   │   ├── page.tsx        # The main radar application page
│   │   │   └── layout.tsx      # Layout for the radar app (header, footer)
│   │   ├── page.tsx            # The public landing page
│   │   ├── globals.css         # Global styles and Tailwind directives
│   │   └── layout.tsx          # Root HTML layout
│   │
│   ├── ai/                     # Genkit AI flows and configuration
│   │   ├── flows/              # Business logic for AI features
│   │   ├── genkit.ts           # Genkit initialization
│   │   └── dev.ts              # Entry point for Genkit dev server
│   │
│   ├── components/             # Reusable React components
│   │   ├── lexigen/            # App-specific components (RadarView, TopicForm, etc.)
│   │   │   └── __tests__/      # Tests for lexigen components
│   │   └── ui/                 # Generic UI components from ShadCN
│   │
│   ├── hooks/                  # Custom React hooks (e.g., use-toast)
│   │
│   ├── lib/                    # Utility functions
│   │   └── utils.ts            # General helper functions (e.g., `cn` for classnames)
│   │
│   └── types/                  # TypeScript type definitions
│       └── lexigen.ts          # Core types for Region, Topic, Theme
│
├── jest.config.mjs             # Jest configuration
├── jest.setup.js               # Jest setup file (imports jest-dom)
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

## Core Components and Logic

This section details the most important files and their functions within the application.

### `src/app/radar/page.tsx` (`RadarPage`)

This is the **central hub** of the application. As a client component (`"use client"`), it manages the entire state of the radar.

- **State Management**: It uses `useState` hooks to manage all application state (see State Management section above).
- **Core Functions**:
    - `handleAddTopic`: Creates a new topic object with a random position and adds it to the `topics` state.
    - `handleRemoveTopic`: Removes a topic from the `topics` state.
    - `handleTopicPositionChange`: Updates a topic's pixel position and its `regionId` when it's dragged and dropped on the radar. This is crucial for syncing the data model with the UI.
    - `handleThemeChange`: Updates the selected theme, causing the radar to re-render with new colors.
    - `handleRegionConfigChange`: Allows users to change the name and colors of radar regions.
    - `handleScreenshot`: Uses the `html2canvas` library to capture the radar view as a PNG and trigger a download.

### `src/components/lexigen/RadarView.tsx`

This is a pure presentation component responsible for rendering the interactive SVG radar.

- **Rendering Logic**:
    - It receives `regions` and `topics` as props.
    - It calculates the positions of the concentric circles based on the number of regions.
    - It maps each topic to coordinates within its assigned region using trigonometry (`Math.cos`, `Math.sin`) based on the topic's `angle` and `magnitude`.
- **Interactivity**:
    - It uses `react-draggable` to allow each topic (rendered as a `<g>` element) to be moved.
    - The `handleDragStop` function calculates the topic's new distance from the center to determine its new region and calls the `onTopicPositionChange` prop to update the state in the parent `RadarPage`.

### `src/components/lexigen/TopicForm.tsx`

A form for adding new topics to the radar.

- **Technology**: Built with `react-hook-form` for state management and `zod` for schema-based validation.
- **Functionality**:
    - Takes the list of `regions` as a prop to populate the dropdown.
    - On submission, it calls the `onAddTopic` function (passed from `RadarPage`) with the new topic's name and selected region ID.
    - It retains the last selected region after submission for a smoother user experience.

### `src/components/lexigen/TopicList.tsx`

Displays a filterable and searchable list of all topics that have been added to the radar.

- **Functionality**:
    - Receives the full `topics` and `regions` arrays as props.
    - Uses `useState` to manage local state for the search term and region filter.
    - Uses `useMemo` to efficiently compute `filteredAndSortedTopics` whenever the topics or filters change.
    - Renders a table showing the topic name and its current region (styled with a `Badge`).
    - Includes a button to remove a topic, which calls the `onRemoveTopic` prop from `RadarPage`.

### `src/types/lexigen.ts`

This file is central to the application's data structure, defining the core types used across components.

- **`Region`**: Defines the structure for a radar ring, including its `id`, `name`, `color`, and `textColor`.
- **`Topic`**: Defines the structure for a technology topic, including its `id`, `name`, `regionId`, and its position (`angle` and `magnitude`).
- **`ThemeDefinition`**: Defines the structure for a theme, which includes a `generateColors` function that dynamically creates region colors. This makes the theming system modular and extensible.

    