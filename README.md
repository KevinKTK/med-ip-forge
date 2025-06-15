# Medici: Intellectual Property Rights Marketplace

## Project Overview

Medici is an innovative intellectual property rights marketplace built on the Story Protocol. It empowers creators and innovators to register their intellectual property (IP) on-chain, providing a transparent and secure platform for managing their rights.

### Key Features:

- **IP Registration**: Creators can register their patents, copyrights, and other forms of intellectual property on the Story Protocol.
- **Community Funding**: Users can support their favorite IP assets through direct funding, helping creators bring their innovations to life.
- **IP Staking**: Engage with the marketplace by staking on existing IP assets to earn rewards, fostering a vibrant ecosystem around intellectual property.
- **Transparent Rights Management**: Leverage the power of blockchain and Story Protocol to ensure clear, immutable, and verifiable ownership and licensing of IP rights.

## Getting Started

To set up and run this project locally, follow these steps:

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn
- A Supabase account with your database configured (including the `patents` and `artists` tables with the necessary columns).
- Environment variables configured for Supabase and Story Protocol (e.g., `VITE_SUPABASE_URL`, `VITE_SUPABASE_API`, Story Protocol RPC endpoint, etc.).

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd med-ip-forge
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root of your project and add your Supabase and other necessary environment variables.

    ```
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_API=your_supabase_anon_key
    # Add other Story Protocol related environment variables as needed
    ```

4.  **Database Setup (Supabase):**
    Ensure your Supabase database has the `artists`, `projects`, and `patents` tables configured with the correct schema, including the columns discussed during development.

    - You might need to run database migrations or manually create tables if starting from scratch. Refer to `src/scripts/createTables.sql` for expected data structure.

5.  **Seed the Database (Optional but Recommended):**
    To populate your Supabase database with mock data for testing:
    ```bash
     npx tsx src/scripts/seedDatabase.ts
    ```

### Running the Application

```bash
npm run dev
# or
yarn dev
```

This will start the development server. Open your browser and navigate to `http://localhost:8080` (or the port indicated in your terminal).

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Blockchain Integration**: Story Protocol SDK, Wagmi, Viem, Smart Contracts (ABIs)
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Shadcn UI

## Codebase Structure

The project follows a standard React application structure, organized within the `src/` directory.

```
src/
├── components/
│   ├── Dashboard/
│   ├── Staking/
│   ├── Artists/
│   ├── Patents/
│   ├── ui/
│   ├── Portfolio/
│   ├── History/
│   ├── Layout.tsx
│   └── Navigation.tsx
├── hooks/
├── integrations/
│   └── supabase/
├── pages/
├── scripts/
├── utils/
├── contexts/
├── App.tsx
├── index.css
├── vite-env.d.ts
├── main.tsx
└── App.css
```

---

#### `src/components/`

This directory houses all reusable UI components. It's further organized into sub-directories for specific sections of the application or generic UI elements.

- **`src/components/Dashboard/`**: Contains components specific to the main dashboard, such as `StatCard` (for displaying key metrics), `AssetCard` (for individual project/asset display), and `AssetTabs` (for navigating between different asset types like copyrights and patents).
- **`src/components/Patents/`**: Dedicated to the Patents components of the web app.
- **`src/components/ui/`**: Contains re-usable UI components from Shadcn UI, such as `Button`, `Progress`, `Input`, `Dialog`, etc.
- **`src/components/Staking/`**: Components related to the staking functionality.
- **`src/components/Artists/`**: Components specific to artist profiles and management.
- **`src/components/Portfolio/`**: Components for user portfolio views.
- **`src/components/History/`**: Components for displaying historical data.
- **`src/components/Layout.tsx`**: Defines the overall page layout
- **`src/components/Navigation.tsx`**: Handles the main navigation menu of the application.

#### `src/hooks/`

This directory contains custom React hooks, which encapsulate reusable logic and stateful behavior.

- **`useStoryClient.ts`**: A hook to initialize and interact with the Story Protocol SDK, providing a client instance and managing its state (e.g., loading, errors).
- **`useStoryProtocol.ts`**: Contains the core logic for interacting with the Story Protocol, including functions like `mintAndRegisterIpAssetWithPilTerms`, handling metadata, and managing transaction states (loading, error, success).
- **`useToast.ts`**: A custom hook for displaying notifications or "toasts" to the user.
- **`usePatents.ts`**: This handles data fetching, state management, and interactions related to patent data specifically, possibly interacting with Supabase.

#### `src/integrations/`

This is where code for integrating with external services resides.

- **`src/integrations/supabase/`**: Contains all logic related to interacting with the Supabase backend.
 
#### `src/pages/`

These are the top-level components that represent different pages or routes in the application.

- **`Index.tsx`**: The main dashboard page, showcasing featured IP assets, stats, and activity feeds.
- **`Patents.tsx`**: The main page for managing and viewing patents, incorporating filters, patent cards, and modals.
- **`Artists.tsx`**: The page dedicated to artist profiles.
- **`Portfolio.tsx`**: The user's personal portfolio page.
- **`Staking.tsx`**: The page for staking functionalities.
- **`History.tsx`**: Displays the transaction or activity history.
- **`NotFound.tsx`**: A simple 404 page.

#### `src/scripts/`

Contains utility scripts for one-off tasks or backend operations.

- **`seedDatabase.ts`**: A toy example script for populating the Supabase database with initial mock data, essential for local development and testing.

#### `src/utils/`

Houses utility functions that can be used across various parts of the application.

#### `src/contexts/`

Contains React Context API providers for managing global state that needs to be accessible by many components without prop-drilling.

---

#### Root Level Files in `src/`

- **`App.tsx`**: The main application component, responsible for setting up routing and global providers.
- **`main.tsx`**: The entry point of the React application, rendering the `App` component.
- **`index.css`**: The main CSS file, likely containing global styles, Tailwind CSS imports, and custom component styles (like `pixel-card`, `pixel-button`, `font-retro`, `font-pixel`).
- **`App.css`**: Additional application-specific CSS.
- **`vite-env.d.ts`**: TypeScript declaration file for Vite environment variables.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.
