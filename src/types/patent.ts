
import { Database } from '@/integrations/supabase/types';

export type Patent = Database['public']['Tables']['patents']['Row'];
