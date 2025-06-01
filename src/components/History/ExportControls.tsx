
import { Button } from '@/components/ui/button';
import { Download, FileText, Table, Code } from 'lucide-react';

export const ExportControls = () => {
  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}...`);
    // Export logic would be implemented here
  };

  return (
    <div className="pixel-card p-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h3 className="font-retro text-cyber-purple text-sm uppercase mb-2">Export History</h3>
          <p className="text-xs text-cyber-purple/70 font-pixel">Download your transaction history for accounting or analysis</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            onClick={() => handleExport('csv')}
            className="border-2 border-cyber-purple text-cyber-purple bg-transparent hover:bg-cyber-purple hover:text-white font-retro text-xs"
          >
            <Table className="w-4 h-4 mr-2" />
            CSV
          </Button>
          <Button 
            onClick={() => handleExport('pdf')}
            className="border-2 border-cyber-purple text-cyber-purple bg-transparent hover:bg-cyber-purple hover:text-white font-retro text-xs"
          >
            <FileText className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button 
            onClick={() => handleExport('json')}
            className="border-2 border-cyber-purple text-cyber-purple bg-transparent hover:bg-cyber-purple hover:text-white font-retro text-xs"
          >
            <Code className="w-4 h-4 mr-2" />
            JSON
          </Button>
          <Button 
            onClick={() => handleExport('all')}
            className="pixel-button"
          >
            <Download className="w-4 h-4 mr-2" />
            EXPORT ALL
          </Button>
        </div>
      </div>
    </div>
  );
};
