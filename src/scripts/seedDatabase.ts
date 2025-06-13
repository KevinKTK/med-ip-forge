import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_API;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const mockArtists = [
  {
    name: "Sarah Chen",
    avatar: "/placeholder.svg",
    genre: "Music",
    verified: true,
    total_raised: 125000,
    completed_projects: 3,
    followers: 2400,
    rating: 4.8,
    current_project: "AI-Powered Music Composition",
    bio: "Creating immersive digital experiences that blend reality with imagination",
    wallet_address: "0x0b1e46e42c49f450aF30769C4BC2a3CF0425A8c1"
  },
  {
    name: "Marcus Rodriguez",
    avatar: "/placeholder.svg",
    genre: "Visual Arts",
    verified: true,
    total_raised: 89000,
    completed_projects: 5,
    followers: 5600,
    rating: 4.9,
    current_project: "Digital Art NFT Collection",
    bio: "Composer pushing boundaries between classical music and AI-generated melodies",
    wallet_address: "0x0000000000000000000000000000000000000000"
  },
  {
    name: "Emma Thompson",
    avatar: "/placeholder.svg",
    genre: "Literature",
    verified: false,
    total_raised: 45000,
    completed_projects: 1,
    followers: 890,
    rating: 4.6,
    current_project: "Interactive Storytelling Platform",
    bio: "Independent filmmaker documenting cultural transformation in urban environments",
    wallet_address: "0x0000000000000000000000000000000000000000"
  }
];

const mockProjects = [
  {
    title: "AI-Powered Music Composition",
    category: "Music",
    target_funding: 50000,
    current_funding: 24.20,
    staking_apy: 15,
    time_remaining: "30 days",
    description: "An AI system that composes original music based on emotional inputs",
    risk_level: "Medium",
    milestones: 3,
    completed_milestones: 1,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    title: "Digital Art NFT Collection",
    category: "Visual Arts",
    target_funding: 75000,
    current_funding: 69432.88,
    staking_apy: 12,
    time_remaining: "45 days",
    description: "A collection of 100 unique digital art pieces with AR integration",
    risk_level: "Low",
    milestones: 4,
    completed_milestones: 2,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    title: "Interactive Storytelling Platform",
    category: "Literature",
    target_funding: 105000,
    current_funding: 12551.02,
    staking_apy: 18,
    time_remaining: "60 days",
    description: "A platform for creating interactive stories with multiple endings",
    risk_level: "High",
    milestones: 5,
    completed_milestones: 0,
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];
const mockStakingPools = [
  {
    name: "AI Music Staking Pool",
    description: "Stake your IP tokens to support AI-powered music composition",
    contract_address: "0x671F162703054C27A321d184073795007cb76f1D",
    deployer_address: "0x0b1e46e42c49f450aF30769C4BC2a3CF0425A8c1",
    deployment_date: new Date().toISOString(),
    apy: 15,
    lockup_periods: [30, 60, 90],
    total_staked: 2541,
    total_stakers: 32,
    is_active: true,
    asset_type: "IP",
    current_completion: 20,
    total_pool_size: 50000,
    available_capacity: 40000,
    risk_level: "Medium",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: "Digital Art Staking Pool",
    description: "Support digital art creation with your IP tokens",
    contract_address: "0x3e6294c2F8BBaD89c6E8A407d78526F651e52e33",
    deployer_address: "0x0b1e46e42c49f450aF30769C4BC2a3CF0425A8c1",
    deployment_date: new Date().toISOString(),
    apy: 12,
    lockup_periods: [30, 60, 90],
    total_staked: 43210,
    total_stakers: 543,
    is_active: true,
    asset_type: "IP",
    current_completion: 20,
    total_pool_size: 75000,
    available_capacity: 60000,
    risk_level: "Low",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    name: "Storytelling Staking Pool",
    description: "Invest in interactive storytelling innovation",
    contract_address: "0x2D18C65f20d22Fca50c9F5FFCC2C536bd19F68A6",
    deployer_address: "0x0b1e46e42c49f450aF30769C4BC2a3CF0425A8c1",
    deployment_date: new Date().toISOString(),
    apy: 18,
    lockup_periods: [30, 60, 90],
    total_staked: 425,
    total_stakers: 12,
    is_active: true,
    asset_type: "IP",
    current_completion: 20,
    total_pool_size: 100000,
    available_capacity: 80000,
    risk_level: "High",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const mockFundingContracts = [
  {
    contract_address: "0xe846571fD5eda51dE3E5F0DF0B6FfBF095025803",
    deployer_address: "0x0b1e46e42c49f450aF30769C4BC2a3CF0425A8c1",
    deployment_date: new Date().toISOString(),
    max_funding: 50000,
  },
  {
    contract_address: "0x50cCD8b462142930B5fCC93F7B350f7C6A4AF2ab",
    deployer_address: "0x0b1e46e42c49f450aF30769C4BC2a3CF0425A8c1",
    deployment_date: new Date().toISOString(),
    max_funding: 75000,
  },
  {
    contract_address: "0x270948529035bA88bD1D08E1Eb54807197ff84c9",
    deployer_address: "0x0b1e46e42c49f450aF30769C4BC2a3CF0425A8c1",
    deployment_date: new Date().toISOString(),
    max_funding: 105000,
  }
];

const mockPatents = [
  {
    artist_id: 1,
    title: "AI-Powered Gene Editing System",
    description: "A novel CRISPR-Cas9 system enhanced with AI for precision gene editing.",
    category: "Biotechnology",
    status: "Granted",
    patent_number: "US1234567A",
    filing_date: "2022-01-15",
    ip_asset_id: "0x0000000000000000000000000000000000000001",
    ip_asset_address: "0x0000000000000000000000000000000000000001",
    ip_asset_chain: 1,
    ip_metadata_uri: "https://ipfs.io/ipfs/QmAIgene",
    ip_metadata_hash: "0x1a2b3c4d",
    nft_metadata_uri: "https://ipfs.io/ipfs/QmAIgenenft",
    nft_metadata_hash: "0x5e6f7a8b",
    created_at: new Date().toISOString(),
    project_id: 1,
  },
  {
    artist_id: 1,
    title: "Quantum Computing Encryption Algorithm",
    description: "A post-quantum cryptographic algorithm resistant to quantum attacks.",
    category: "Technology",
    status: "Pending",
    patent_number: "US9876543B",
    filing_date: "2023-03-20",
    ip_asset_id: "0x0000000000000000000000000000000000000002",
    ip_asset_address: "0x0000000000000000000000000000000000000002",
    ip_asset_chain: 1,
    ip_metadata_uri: "https://ipfs.io/ipfs/QmQuantum",
    ip_metadata_hash: "0x9c0d1e2f",
    nft_metadata_uri: "https://ipfs.io/ipfs/QmQuantumnft",
    nft_metadata_hash: "0x3g4h5i6j",
    created_at: new Date().toISOString(),
    project_id: 1,
  },
  {
    artist_id: 2,
    title: "Bio-Degradable Plastic Production Method",
    description: "An innovative method for producing plastics that fully degrade within 6 months.",
    category: "Technology",
    status: "Rejected",
    patent_number: "US4567890C",
    filing_date: "2021-08-01",
    ip_asset_id: "0x0000000000000000000000000000000000000003",
    ip_asset_address: "0x0000000000000000000000000000000000000003",
    ip_asset_chain: 1,
    ip_metadata_uri: "https://ipfs.io/ipfs/QmBioPlastic",
    ip_metadata_hash: "0x7k8l9m0n",
    nft_metadata_uri: "https://ipfs.io/ipfs/QmBioPlasticnft",
    nft_metadata_hash: "0x1o2p3q4r",
    created_at: new Date().toISOString(),
    project_id: 2,
  },
  {
    artist_id: 2,
    title: "Automated Surgical Robotic Arm",
    description: "A robotic arm capable of performing complex surgical procedures with minimal human intervention.",
    category: "Medical Device",
    status: "Granted",
    patent_number: "US1122334D",
    filing_date: "2020-05-10",
    ip_asset_id: "0x0000000000000000000000000000000000000004",
    ip_asset_address: "0x0000000000000000000000000000000000000004",
    ip_asset_chain: 1,
    ip_metadata_uri: "https://ipfs.io/ipfs/QmRoboticArm",
    ip_metadata_hash: "0x5s6t7u8v",
    nft_metadata_uri: "https://ipfs.io/ipfs/QmRoboticArmnft",
    nft_metadata_hash: "0x9w0x1y2z",
    created_at: new Date().toISOString(),
    project_id: 2,
  },
];

// Add error handling function
async function handleSupabaseError(operation: string, error: any) {
  console.error(`Error during ${operation}:`, {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code
  });
  throw error;
}

async function seedDatabase() {
  try {
    // Test connection first
    const { data: testData, error: testError } = await supabase
        .from('artists')
        .select('count')
        .limit(1);

    if (testError) {
      throw  new Error(`Failed to connect to Supabase: ${testError.message}`);
    }

    // Insert artists first
    const { data: artists, error: artistsError } = await supabase
        .from('artists')
        .insert(mockArtists)
        .select();

    if (artistsError) {
      await handleSupabaseError('artists insertion', artistsError);
    }
    console.log('Artists seeded successfully');

    // Insert funding contracts
    const { data: fundingContracts, error: fundingContractsError } = await supabase
        .from('funding_contracts')
        .insert(mockFundingContracts)
        .select();

    if (fundingContractsError) {
      await handleSupabaseError('funding contracts insertion', fundingContractsError);
    }
    console.log('Funding contracts seeded successfully');

    // Insert projects with artist_id and funding_contract_id
    const projectsWithArtistsAndFunding = mockProjects.map((project, index) => ({
      ...project,
      artist_id: artists[index].id,
      funding_contract_id: fundingContracts[index].id,
    }));

    const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .insert(projectsWithArtistsAndFunding)
        .select();

    if (projectsError) {
      await handleSupabaseError('projects insertion', projectsError);
    }
    console.log('Projects seeded successfully');

    // Insert staking pools with project_id
    const stakingPoolsWithProjects = mockStakingPools.map((pool, index) => ({
      ...pool,
      project_id: projects[index].id
    }));

    const { error: poolsError } = await supabase
        .from('staking_pools')
        .insert(stakingPoolsWithProjects);

    if (poolsError) {
      await handleSupabaseError('staking pools insertion', poolsError);
    }
    console.log('Staking pools seeded successfully');

    // Insert patents with project_id, artist_id, and other fields
    const patentsToInsert = mockPatents.map((patent) => ({
      ...patent,
      // The artist_id, project_id, ip_metadata_uri, ip_metadata_hash,
      // nft_metadata_uri, nft_metadata_hash, and created_at fields are now part of mockPatents.
      // No need to generate them here or set default values.
    }));

    // We are no longer using the `registerPatent` function from `patents.ts` for seeding
    // as that function handles IP asset registration with Story Protocol and IPFS uploads,
    // which is not necessary for merely seeding the Supabase table with mock data.
    const { error: patentsError } = await supabase
        .from('patents')
        .insert(patentsToInsert);

    if (patentsError) {
      await handleSupabaseError('patents insertion', patentsError);
    }
    console.log('Patents seeded successfully');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1); // Exit with error code
  }
}

// Run the seeding function
seedDatabase();