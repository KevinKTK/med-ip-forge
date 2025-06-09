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
    bio: "Creating immersive digital experiences that blend reality with imagination"
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
    bio: "Composer pushing boundaries between classical music and AI-generated melodies"
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
    bio: "Independent filmmaker documenting cultural transformation in urban environments"
  }
];

const mockProjects = [
  {
    title: "AI-Powered Music Composition",
    category: "Music",
    target_funding: 50000,
    current_funding: 25000,
    staking_apy: 15,
    time_remaining: "30 days",
    description: "An AI system that composes original music based on emotional inputs",
    risk_level: "Medium",
    milestones: 3,
    completed_milestones: 1,
  },
  {
    title: "Digital Art NFT Collection",
    category: "Visual Arts",
    target_funding: 75000,
    current_funding: 45000,
    staking_apy: 12,
    time_remaining: "45 days",
    description: "A collection of 100 unique digital art pieces with AR integration",
    risk_level: "Low",
    milestones: 4,
    completed_milestones: 2,
  },
  {
    title: "Interactive Storytelling Platform",
    category: "Literature",
    target_funding: 100000,
    current_funding: 60000,
    staking_apy: 18,
    time_remaining: "60 days",
    description: "A platform for creating interactive stories with multiple endings",
    risk_level: "High",
    milestones: 5,
    completed_milestones: 0,
  }
];

const mockStakingPools = [
  {
    contract_address: "0x1234567890123456789012345678901234567890",
    deployer_address: "0xabcdef1234567890abcdef1234567890abcdef12",
    deployment_date: new Date().toISOString(),
    apy: 15,
    lockup_periods: [30, 60, 90],
    total_staked: 25000,
    total_stakers: 15,
    is_active: true,
  },
  {
    contract_address: "0x2345678901234567890123456789012345678901",
    deployer_address: "0xabcdef1234567890abcdef1234567890abcdef12",
    deployment_date: new Date().toISOString(),
    apy: 12,
    lockup_periods: [30, 60, 90],
    total_staked: 45000,
    total_stakers: 25,
    is_active: true,
  },
  {
    contract_address: "0x3456789012345678901234567890123456789012",
    deployer_address: "0xabcdef1234567890abcdef1234567890abcdef12",
    deployment_date: new Date().toISOString(),
    apy: 18,
    lockup_periods: [30, 60, 90],
    total_staked: 60000,
    total_stakers: 35,
    is_active: true,
  }
];

const mockPatents = [
  {
    title: "AI Music Composition System",
    description: "A system for generating music based on emotional inputs using machine learning",
    status: "Pending",
    filing_date: new Date().toISOString(),
    patent_number: "US2023000001",
  },
  {
    title: "Digital Art Generation with AR",
    description: "Method for creating and displaying digital art with augmented reality features",
    status: "Granted",
    filing_date: new Date().toISOString(),
    patent_number: "US2023000002",
  },
  {
    title: "Interactive Story Generation Platform",
    description: "System for creating branching narrative structures with user interaction",
    status: "Pending",
    filing_date: new Date().toISOString(),
    patent_number: "US2023000003",
  }
];

async function seedDatabase() {
  try {
    // Insert artists first
    const { data: artists, error: artistsError } = await supabase
      .from('artists')
      .insert(mockArtists)
      .select();

    if (artistsError) throw artistsError;
    console.log('Artists seeded successfully');

    // Insert projects with artist_id
    const projectsWithArtists = mockProjects.map((project, index) => ({
      ...project,
      artist_id: artists[index].id
    }));

    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .insert(projectsWithArtists)
      .select();

    if (projectsError) throw projectsError;
    console.log('Projects seeded successfully');

    // Insert staking pools with project_id
    const stakingPoolsWithProjects = mockStakingPools.map((pool, index) => ({
      ...pool,
      project_id: projects[index].id
    }));

    const { error: poolsError } = await supabase
      .from('staking_pools')
      .insert(stakingPoolsWithProjects);

    if (poolsError) throw poolsError;
    console.log('Staking pools seeded successfully');

    // Insert patents with project_id
    const patentsWithProjects = mockPatents.map((patent, index) => ({
      ...patent,
      project_id: projects[index].id
    }));

    const { error: patentsError } = await supabase
      .from('patents')
      .insert(patentsWithProjects);

    if (patentsError) throw patentsError;
    console.log('Patents seeded successfully');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seeding function
seedDatabase(); 