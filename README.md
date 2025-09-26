
# StaxMap: A Technology Radar Generator

StaxMap is a web application built with Next.js that allows users to create, visualize, and manage technology radars. It's designed to be an intuitive tool for teams to map out technologies, frameworks, and tools, assessing their adoption stage within the organization (e.g., Adopt, Trial, Assess, Hold).

## Features

- **Dynamic Radar Creation**: Add and remove concentric regions (e.g., "Adopt", "Assess").
- **Real-time Topic Management**: Add topics to different regions, and see them appear instantly on the radar.
- **Interactive Visualization**: Drag-and-drop topics within the radar to fine-tune their position and change their region.
- **Theming and Customization**: Switch between pre-defined themes (e.g. Monochrome, Sunset) or customize the colors of each region to match your branding.
- **Import/Export**: Save your complete radar configuration to a JSON file and import it later to continue your work.
- **Screenshot Capture**: Export a high-resolution PNG image of your radar for presentations and documentation.
- **Filtering and Searching**: Easily find topics in the list with search and region-based filtering.
- **Educational Content**: A dedicated "Learn" section explaining the concepts and benefits of technology radars.
- **SEO Optimized**: Includes a dynamic sitemap and structured metadata for better search engine visibility.
- **Responsive Design**: Works on both desktop and mobile devices, with dedicated controls for smaller screens.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics) & [Vercel Speed Insights](https://vercel.com/speed-insights)
- **Monetization**: [Google AdSense](https://www.google.com/adsense)
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

The application follows a component-based architecture where the main page (`RadarPage`) acts as a central controller, managing state and passing data and functions down to child presentational components. The controls are consolidated into a sidebar on desktop and a slide-out sheet on mobile.

```mermaid
graph TD
    subgraph "State & Logic Controller (Client Component)"
        A[<b>RadarPage</b><br>(src/app/radar/page.tsx)<br><i>Manages all application state</i>]
    end

    subgraph "Presentational UI Components"
        C[<b>RadarView</b><br><i>Renders the interactive SVG radar</i>]
        D[<b>TopicList</b><br><i>Displays and filters all topics</i>]
        E[<b>Sidebar (Desktop) / Sheet (Mobile)</b><br><i>Container for controls</i>]
    end

    subgraph "Controls (inside Sidebar/Sheet)"
        F[<b>RadarControls</b><br><i>Tabbed container for managing items & configuration</i>]
    end
    
    A -- "regions, topics, topicPositions, onTopicPositionChange()" --> C
    A -- "topics, regions, onRemoveTopic()" --> D
    A -- "Props for all controls" --> E
    A -- "Handles Import/Export" --> D

    E --> F

    F -- "Calls state handlers (onAddTopic, onThemeChange, etc.)" --> A
    C -- "Calls onTopicPositionChange()" --> A
    D -- "Calls onRemoveTopic()" --> A

    style A fill:#e3f2fd,stroke:#1e88e5,stroke-width:2px
    style C fill:#fff,stroke:#333
    style D fill:#fff,stroke:#333
    style E fill:#f4f4f5,stroke:#999
    style F fill:#fff,stroke:#333
```

### State Management

The state management in StaxMap is intentionally simple and centralized, following standard React patterns without external state management libraries like Redux or Zustand.

- **Single Source of Truth**: The `RadarPage` component (`src/app/radar/page.tsx`) is the heart of the application. Because it is a client component (`"use client"`), it can use React hooks to manage all the critical pieces of state:
    - `regions`: The array of radar rings (e.g., Adopt, Assess).
    - `topics`: The array of technology topics added to the radar.
    - `topicPositions`: The pixel coordinates of topics that have been manually dragged. This state is crucial for persisting UI changes.
    - `selectedThemeId`: The ID of the currently active theme.
    - `customColorOverrides`: Custom colors applied to specific regions.
    - `radarSize`: The pixel dimensions (width & height) of the radar view.
    - `isMobileSheetOpen`: A boolean to control the visibility of the control panel on mobile devices.

- **Lifting State Up**: This is the core principle used. `RadarPage` holds the state and defines the functions that can modify it (e.g., `handleAddTopic`, `handleTopicPositionChange`, `handleImport`, `handleExport`).

- **Unidirectional Data Flow**:
    1.  **State is passed down**: `RadarPage` passes the state down to its child components as props (e.g., `RadarView` receives `topics` and `regions`). These child components are purely presentational; they render what they are given.
    2.  **Actions are passed up**: When a user interacts with a child component (like clicking "Add Topic" in `RadarControls`), the component doesn't change the state directly. Instead, it calls a function (like `onAddTopic`) that was passed down to it as a prop. This function, which lives in `RadarPage`, is the only thing that can modify the state.

This approach keeps the application predictable and easier to debug, as all state changes happen in one central location.

## Project Structure

The codebase is organized to separate concerns and maintain a clean architecture.

```
staxmap/
├── src/
│   ├── app/                    # Next.js App Router: Pages and Layouts
│   │   ├── radar/
│   │   │   ├── __tests__/      # Jest tests for the radar page
│   │   │   ├── page.tsx        # The main radar application page
│   │   │   └── layout.tsx      # Layout for the radar app
│   │   ├── learn/
│   │   │   ├── page.tsx        # The educational "Learn" page
│   │   │   └── layout.tsx      # Layout for the "Learn" page
│   │   ├── sitemap/
│   │   │   └── page.tsx        # The HTML sitemap page
│   │   ├── sitemap.xml/
│   │   │   └── route.ts        # Dynamic XML sitemap generator
│   │   ├── page.tsx            # The public landing page
│   │   ├── globals.css         # Global styles and Tailwind directives
│   │   └── layout.tsx          # Root HTML layout (includes Analytics, AdSense, Footer)
│   │
│   ├── ai/                     # Genkit AI flows and configuration
│   │
│   ├── components/             # Reusable React components
│   │   ├── lexigen/            # App-specific components (RadarView, Sidebar, etc.)
│   │   │   ├── AdPlaceholder.tsx # Ad placeholder component
│   │   │   └── ...
│   │   └── ui/                 # Generic UI components from ShadCN
│   │
│   ├── hooks/                  # Custom React hooks (e.g., use-toast)
│   │
│   ├── lib/                    # Utility functions
│   │
│   └── types/                  # TypeScript type definitions
│       └── lexigen.ts          # Core types for Region, Topic, Theme
│
├── public/
│   └── robots.txt              # Instructions for search engine crawlers
│
├── package.json                # Project dependencies and scripts
└── ...
```

## Core Components and Logic

This section details the most important files and their functions within the application.

### `src/app/radar/page.tsx` (`RadarPage`)

This is the **central hub** of the application. As a client component (`"use client"`), it manages the entire state of the radar and its layout.

- **State Management**: It uses `useState` hooks to manage all application state (see State Management section above).
- **Layout**: It arranges the main components on the page, including the `RadarView`, `TopicList`, and `AdPlaceholder`. It conditionally renders the `Sidebar` for desktop and a `Sheet` with a trigger button for mobile. It also contains the Import/Export buttons.
- **Core Functions**:
    - `handleAddTopic`: Creates a new topic object with a random position and adds it to the `topics` state.
    - `handleRemoveTopic`: Removes a topic from the `topics` state.
    - `handleTopicPositionChange`: Updates a topic's pixel position and its `regionId` when it's dragged and dropped on the radar.
    - `handleThemeChange`: Updates the selected radar theme from the `ThemeSelector`.
    - `handleRegionConfigChange`: Allows users to change the name and colors of radar regions.
    - `handleScreenshot`: Uses the `html2canvas` library to capture the radar view as a PNG and trigger a download.
    - `handleExport`: Gathers the complete radar state into a `RadarData` object and downloads it as a JSON file.
    - `handleImport`: Reads a `RadarData` JSON file, validates it, and restores the application state from the file.

### `src/components/lexigen/RadarView.tsx`

This is a pure presentation component responsible for rendering the interactive SVG radar.

- **Rendering Logic**: It receives `regions` and `topics` as props and calculates the positions of circles and topics using trigonometry.
- **Interactivity**: It uses `react-draggable` to allow each topic to be moved. The `onStop` handler calculates the topic's new region and calls a prop to update the state in `RadarPage`.

### `src/app/learn/page.tsx`

An educational page that explains the theory and benefits of using a Technology Radar. It uses a combination of well-structured text, custom SVG illustrations, and styled cards to present the information in an engaging way, serving as valuable content for both users and search engines.

### `src/app/layout.tsx`

The root layout for the entire application. It's responsible for the `<html>` and `<body>` tags and includes providers and scripts that are global to the app:
-   **`ThemeProvider`** for dark/light mode.
-   **Vercel Analytics and Speed Insights** scripts.
-   **Google AdSense** script.
-   A comprehensive **site footer** with navigation links.
