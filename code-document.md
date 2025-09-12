
# StaxMap: Developer Documentation

Welcome to the StaxMap project! This document serves as a technical guide for developers. It covers the project's architecture, state management, key components, and common development tasks.

## 1. High-Level Overview

StaxMap is a web application built with Next.js that allows users to create, visualize, and manage technology radars. Users can define concentric regions (like "Adopt", "Trial"), add technology topics to these regions, and then interact with the visualization by dragging topics and customizing the appearance. The entire state of the radar can be saved to a JSON file and loaded back into the application.

### Core Technologies

- **Framework**: [Next.js](https://nextjs.org/) (using the App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Drag & Drop**: [react-draggable](https://github.com/react-grid-layout/react-draggable)
- **Form Management**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
- **Testing**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/)

---

## 2. Project Structure

The project follows a standard Next.js App Router structure, organized to separate concerns.

```
staxmap/
├── src/
│   ├── app/                    # Next.js App Router: Pages and Layouts
│   │   ├── radar/
│   │   │   ├── __tests__/      # Jest tests for the radar page
│   │   │   │   └── page.test.tsx
│   │   │   ├── page.tsx        # The main radar application page (client component)
│   │   │   └── layout.tsx      # Layout for the radar app (header, footer)
│   │   ├── page.tsx            # The public landing page
│   │   ├── globals.css         # Global styles and Tailwind CSS theme variables
│   │   └── layout.tsx          # Root HTML layout for the entire application
│   │
│   ├── components/             # Reusable React components
│   │   ├── lexigen/            # Components specific to the StaxMap application
│   │   │   ├── RadarView.tsx   # The core interactive SVG radar
│   │   │   ├── Sidebar.tsx     # The right-hand control panel container (desktop)
│   │   │   ├── RadarControls.tsx # Tabbed controls for adding/configuring topics
│   │   │   ├── TopicList.tsx   # Table for displaying and managing topics
│   │   │   └── ...other app-specific components
│   │   └── ui/                 # Generic UI components from ShadCN (Button, Card, etc.)
│   │
│   ├── hooks/                  # Custom React hooks (e.g., use-toast)
│   │
│   ├── lib/                    # Utility functions (e.g., cn for classnames)
│   │
│   └── types/                  # TypeScript type definitions
│       └── lexigen.ts          # Core application types (Region, Topic, Theme, RadarData)
│
├── public/                     # Static assets (images, etc.)
└── package.json                # Project dependencies and scripts
```

---

## 3. Architecture and State Management

### Architecture Diagram

The application uses a centralized state management pattern where a single parent component (`RadarPage`) controls the application's state and logic. This state is passed down to presentational child components, which then emit events back up to the parent to modify the state. On desktop, user controls are in a sidebar; on mobile, they are in a slide-out sheet.

```mermaid
graph TD
    subgraph "State & Logic Controller (Client Component)"
        A[<b>RadarPage</b><br>(src/app/radar/page.tsx)<br><i>Manages all application state</i>]
    end

    subgraph "Presentational UI Components"
        C[<b>RadarView</b><br><i>Renders the interactive SVG radar</i>]
        D[<b>TopicList</b><br><i>Displays and filters all topics</i>]
        E[<b>Sidebar (Desktop) / Sheet (Mobile)</b><br><i>Container for all controls</i>]
    end

    subgraph "Controls (inside Sidebar/Sheet)"
        F[<b>RadarControls</b><br><i>Holds tabs for item management & configuration</i>]
    end

    A -- "State & handlers for all controls" --> E
    A -- "regions, topics, topicPositions, onTopicPositionChange()" --> C
    A -- "topics, regions, onRemoveTopic()" --> D
    
    E --> F

    F -- "Calls state handlers (e.g., onAddTopic, onThemeChange)" --> A
    C -- "Calls onTopicPositionChange(topicId, pos, newRegionId)" --> A
    D -- "Calls onRemoveTopic(topicId)" --> A

    style A fill:#e3f2fd,stroke:#1e88e5,stroke-width:2px
    style C fill:#fff,stroke:#333
    style D fill:#fff,stroke:#333
    style E fill:#f4f4f5,stroke:#999
    style F fill:#fff,stroke:#333
```

### State Management Strategy

The state management is intentionally simple, using React's built-in hooks (`useState`, `useMemo`, `useCallback`) without external libraries like Redux or Zustand. This approach is known as **"Lifting State Up"**.

-   **Single Source of Truth**: The `RadarPage` component (`src/app/radar/page.tsx`) is the heart of the application. Marked with `"use client"`, it holds all critical pieces of state:
    -   `regions`: The array of radar rings (e.g., Adopt, Assess).
    -   `topics`: The array of technology topics added to the radar.
    -   `topicPositions`: A dictionary mapping a topic's ID to its `{x, y}` coordinates. This is crucial for persisting the position of manually dragged topics.
    -   `selectedThemeId`: The ID of the currently active color theme for the radar.
    -   `customColorOverrides`: Custom colors applied to specific regions, overriding the theme.
    -   `radarSize`: The pixel dimension of the radar view, controlled by a slider.
    -   `isMobileSheetOpen`: Controls the visibility of the control panel on mobile.

-   **Unidirectional Data Flow**:
    1.  **State is passed down as props**: `RadarPage` passes the state down to its child components (e.g., `RadarView` receives `topics` and `regions`). These child components are "dumb" and purely presentational; they just render what they are given.
    2.  **Events are passed up via callbacks**: When a user interacts with a child component (like dragging a topic in `RadarView`), the component doesn't change the state directly. Instead, it calls a function (like `onTopicPositionChange`) that was passed down to it as a prop. This function, which is defined in `RadarPage`, is the only thing that can modify the state.

This pattern makes the application predictable and easier to debug, as all state modifications happen in one central location.

---

## 4. Key Files and Core Logic

Understanding these files is essential for making changes to the application.

### `src/app/radar/page.tsx` (`RadarPage`)

This is the **most important file** in the application. It acts as the central controller.

-   **State Management**: Contains all `useState` hooks for the application's data.
-   **Core Handlers**: Defines all the functions that modify the state.
    -   `handleAddTopic`: Creates a new topic and adds it to the `topics` array.
    -   `handleRemoveTopic`: Filters a topic out of the `topics` array.
    -   `handleTopicPositionChange`: This is a key function for interactivity. It's called when a topic is dragged. It updates both the `topicPositions` state (for the UI) and the topic's `regionId` in the `topics` array (for the data model).
    -   `handleThemeChange`: Switches the active radar theme.
    -   `handleRegionConfigChange`: Updates a region's name or color.
    -   `handleScreenshot`: Uses `html2canvas` to capture the radar view as a PNG.
    -   `handleExport`: Serializes the entire radar state to a JSON file and triggers a download.
    -   `handleImport`: Reads a JSON file, validates it with a Zod schema, and restores the application state.
-   **Layout Logic**: Manages the responsive layout, rendering the `Sidebar` for desktop and the `Sheet` for mobile.
-   **Navigation Guard**: Contains a `useEffect` hook that checks for a `sessionStorage` item. If not present, it redirects the user to the landing page (`/`).

### `src/components/lexigen/RadarView.tsx`

This component is responsible for rendering the interactive SVG radar. It is a pure **presentational component**.

-   **Rendering Logic**:
    -   It receives `regions` and `topics` as props.
    -   It uses `useMemo` to reverse the regions array for rendering, as SVG layers need to be drawn from the outermost circle to the innermost.
    -   It calculates the positions of the concentric circles based on the number of regions and the `radarSize`.
    -   It maps each topic to coordinates within its assigned region using trigonometry (`Math.cos`, `Math.sin`). If a topic has a manual position in the `topicPositions` prop, that is used instead.
-   **Interactivity**:
    -   It wraps each topic in a `<Draggable>` component.
    -   The `onStop` handler for the drag event calculates the topic's new distance from the center to determine its new region and calls the `onTopicPositionChange` prop to update the state in `RadarPage`.

### `src/components/lexigen/RadarControls.tsx`

This component consolidates all user controls into a single, tabbed interface inside the sidebar/sheet.
- **Tabs**: It uses ShadCN's `Tabs` to switch between a "Manage Items" view and a "Configure" view.
- **TopicForm & Region Management**: The "Manage Items" tab renders the `TopicForm` for adding technologies and a button to add new regions.
- **Configuration**: The "Configure" tab contains the `ThemeSelector`, a slider to control the `radarSize`, and the interface for editing and customizing regions.

### `src/types/lexigen.ts`

This file defines the core data structures for the entire application. When adding new properties to topics or regions, start here.

-   **`Region`**: Defines a radar ring (`id`, `name`, `color`, `textColor`).
-   **`Topic`**: Defines a technology topic (`id`, `name`, `regionId`, `angle`, `magnitude`).
-   **`ThemeDefinition`**: Defines the structure for a theme. A key part is the `generateColors` function, which programmatically creates region colors. This makes the theming system highly extensible.
-   **`RadarData`**: Defines the complete, serializable state of the radar. This schema is used by Zod to validate imported files, ensuring data integrity.

---

## 5. How to Make Common Changes

### How to Add a New Radar Theme

1.  **Open `src/app/radar/page.tsx`**.
2.  **Create a color generator function**: Write a new function with the signature `(baseRegions: BaseRegion[]) => Region[]`. This function will receive the list of regions and should return a new list with `color` and `textColor` properties assigned. Look at `generateMonochromeColors` for an example.
3.  **Add a new `ThemeDefinition`**: In the `appThemes` array, add a new object for your theme, providing a unique `id`, a `name` for the UI, your new color generator function, and a `topicDotColor`.
4.  That's it! The `ThemeSelector` component inside `RadarControls` will automatically pick up the new theme and display it as an option.

### How to Add a New Field to a Topic

Let's say you want to add a `description` to each topic.

1.  **Update the Type**: Go to `src/types/lexigen.ts` and add `description: string;` to the `Topic` interface. You'll also need to add it to the `RadarData` interface and the Zod schema in `page.tsx` if you want it to be imported/exported.
2.  **Update the Form**:
    -   Go to `src/components/lexigen/TopicForm.tsx`.
    -   Add a `description` field to the `topicFormSchema` (the Zod schema) with validation rules.
    -   Add a `<Textarea>` or `<Input>` component inside the `<Form>` for the user to enter the description.
3.  **Update the State Logic**:
    -   In `src/app/radar/page.tsx`, find the `handleAddTopic` function. Modify its signature to accept the new `description` field.
    -   When creating the `newTopic` object inside this function, include the `description`.
4.  **Display the Description**:
    -   You could show the description in the `Tooltip` inside `src/components/lexigen/RadarView.tsx`.
    -   You could also add a new "Description" column to the table in `src/components/lexigen/TopicList.tsx`.

### How to Change the Default Regions

If you want to change the initial regions from "Today, Tomorrow, etc." to something else:

1.  **Open `src/app/radar/page.tsx`**.
2.  Find the `initialRegionDefinitions` constant at the top of the file.
3.  Modify the `id` and `name` for each region as needed. You can also add or remove regions from this initial array.
```javascript
const initialRegionDefinitions: BaseRegion[] = [
  { id: 'now', name: 'Now' },
  { id: 'next', name: 'Next' },
  { id: 'later', name: 'Later' },
];
```
This is the only place you need to change it. The rest of the application will adapt dynamically.
