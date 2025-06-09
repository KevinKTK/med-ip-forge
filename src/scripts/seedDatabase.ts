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

const mockProjects = [
  {
    title: "AI-Powered Music Composition",
    artist: "Sarah Chen",
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
    artist: "Marcus Rodriguez",
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
    artist: "Emma Thompson",
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
    project_id: 1,
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
    project_id: 2,
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
    project_id: 3,
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
    project_id: 1,
    title: "AI Music Composition System",
    description: "A system for generating music based on emotional inputs using machine learning",
    status: "Pending",
    filing_date: new Date().toISOString(),
    patent_number: "US2023000001",
  },
  {
    project_id: 2,
    title: "Digital Art Generation with AR",
    description: "Method for creating and displaying digital art with augmented reality features",
    status: "Granted",
    filing_date: new Date().toISOString(),
    patent_number: "US2023000002",
  },
  {
    project_id: 3,
    title: "Interactive Story Generation Platform",
    description: "System for creating branching narrative structures with user interaction",
    status: "Pending",
    filing_date: new Date().toISOString(),
    patent_number: "US2023000003",
  }
];

async function seedDatabase() {
  try {
    // Insert projects
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .insert(mockProjects)
      .select();

    if (projectsError) throw projectsError;
    console.log('Projects seeded successfully');

    // Insert staking pools
    const { error: poolsError } = await supabase
      .from('staking_pools')
      .insert(mockStakingPools);

    if (poolsError) throw poolsError;
    console.log('Staking pools seeded successfully');

    // Insert patents
    const { error: patentsError } = await supabase
      .from('patents')
      .insert(mockPatents);

    if (patentsError) throw patentsError;
    console.log('Patents seeded successfully');

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

// Run the seeding function
seedDatabase(); 