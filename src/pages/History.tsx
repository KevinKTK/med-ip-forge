
import { Layout } from '@/components/Layout';
import { HistoryHeader } from '@/components/History/HistoryHeader';
import { FilterControls } from '@/components/History/FilterControls';
import { ActivityTable } from '@/components/History/ActivityTable';
import { ExportControls } from '@/components/History/ExportControls';

const History = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <HistoryHeader />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <FilterControls />
          </div>
          <div className="lg:col-span-3 space-y-6">
            <ExportControls />
            <ActivityTable />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default History;
