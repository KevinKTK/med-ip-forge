
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAccount } from 'wagmi';
import { Tables } from '@/integrations/supabase/types';

type Patent = Tables<'patents'>;

export const usePatents = () => {
  const [patents, setPatents] = useState<Patent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { address } = useAccount();

  const fetchPatents = async () => {
    try {
      const { data, error } = await supabase
        .from('patents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPatents(data || []);
    } catch (error) {
      console.error('Error fetching patents:', error);
      toast({
        title: "Error Loading Patents",
        description: error instanceof Error ? error.message : "Failed to load patents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatents();
  }, []);

  const refreshPatents = () => {
    fetchPatents();
  };

  return {
    patents,
    isLoading,
    refreshPatents,
  };
};
