# IP-Forge: Intellectual Property Rights Marketplace

## Project Overview

IP-Forge is an innovative intellectual property rights marketplace built on the Story Protocol. It empowers creators and innovators to register their intellectual property (IP) on-chain, providing a transparent and secure platform for managing their rights.

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
    Create a `.env` file in the root of your project and add your Supabase and other necessary environment variables. Refer to `.env.example` if available.

    ```
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_API=your_supabase_anon_key
    # Add other Story Protocol related environment variables as needed
    ```

4.  **Database Setup (Supabase):**
    Ensure your Supabase database has the `artists`, `projects`, and `patents` tables configured with the correct schema, including the columns discussed during development (e.g., `status`, `filing_date`, `patent_number`, `ip_asset_address`, `ip_asset_chain` as `text`, `date`, `text`, `text`, `integer` respectively).

    - You might need to run database migrations or manually create tables if starting from scratch. Refer to `src/scripts/seedDatabase.ts` for expected data structure.

5.  **Seed the Database (Optional but Recommended):**
    To populate your local database with mock data for testing:
    ```bash
    npm run seed-database
    # or
    yarn seed-database
    ```

### Running the Application

```bash
npm run dev
# or
yarn dev
```

This will start the development server. Open your browser and navigate to `http://localhost:5173` (or the port indicated in your terminal).

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **Blockchain Integration**: Story Protocol SDK, Wagmi, Viem
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Shadcn UI

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.
