# StaxMap: A Technology Radar Generator

StaxMap is a web application built with Next.js that allows users to create, visualize, and manage technology radars. It's designed to be an intuitive tool for teams to map out technologies, frameworks, and tools, assessing their adoption stage within the organization (e.g., Adopt, Trial, Assess, Hold).

## Features

- **Dynamic Radar Creation**: Add and remove concentric regions (e.g., "Adopt", "Assess").
- **Real-time Topic Management**: Add topics to different regions, and see them appear instantly on the radar.
- **Interactive Visualization**: Drag-and-drop topics within the radar to fine-tune their position.
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
- **AI/Generative Features**: [Google Genkit](https://firebase.google.com/docs/genkit) (Not yet fully implemented but configured)
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

- **`src/app/radar/page.tsx` (`RadarPage`)**: This is the main client component that holds the state for the entire radar application, including `topics`, `regions`, and `themes`. It contains all the handler functions for adding/removing topics and regions, changing themes, and taking screenshots.

- **`src/components/lexigen/RadarView.tsx`**: A pure presentation component that renders the SVG radar. It receives `regions` and `topics` as props and calculates their positions. It uses `react-draggable` to allow topics to be moved around.

- **`src/components/lexigen/TopicForm.tsx`**: A form built with `react-hook-form` and `zod` for validation. It allows users to input a new topic name and select a region to add it to.

- **`src/components/lexigen/TopicList.tsx`**: Displays a list of all added topics. Includes controls for filtering by region and searching by name.

- **`src/types/lexigen.ts`**: This file is central to the application's data structure. It defines the `Region` and `Topic` interfaces, ensuring type safety across all components. It also defines the structure for `ThemeDefinition`, which allows for modular and extensible theming.
