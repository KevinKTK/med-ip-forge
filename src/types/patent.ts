
// Simple Patent type for components that don't need the full Supabase type
export interface Patent {
  id: number;
  title: string;
  description: string;
  status: string;
  patent_number: string;
  filing_date: string;
  category: string;
}
