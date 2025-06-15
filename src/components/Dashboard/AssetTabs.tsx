
import { useState } from 'react';
import { AssetCard } from './AssetCard';

const mockAssets = [
  {
    title: "The Beatles Complete Discography",
    type: "Copyright" as const,
    creator: "Abbey Road Studios",
    marketCap: "$IP 2.4M",
    completion: 78,
    apy: "12.5%"
  },
  {
    title: "Tesla Battery Technology Patent",
    type: "Patent" as const,
    creator: "Tesla Inc.",
    marketCap: "$IP 5.1M",
    completion: 45,
    apy: "18.2%"
  },
  {
    title: "Netflix Original Series Rights",
    type: "Copyright" as const,
    creator: "Netflix Studios",
    marketCap: "$IP 3.8M",
    completion: 92,
    apy: "9.8%"
  },
  {
    title: "Apple iOS Interface Patent",
    type: "Patent" as const,
    creator: "Apple Inc.",
    marketCap: "$IP 8.2M",
    completion: 67,
    apy: "15.4%"
  },
  {
    title: "Marvel Character IP Rights",
    type: "Copyright" as const,
    creator: "Marvel Entertainment",
    marketCap: "$IP 12.5M",
    completion: 34,
    apy: "22.1%"
  },
  {
    title: "Google Search Algorithm Patent",
    type: "Patent" as const,
    creator: "Google LLC",
    marketCap: "$IP 15.7M",
    completion: 56,
    apy: "14.8%"
  }
];

export const AssetTabs = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'copyright' | 'patent'>('all');

  const filteredAssets = mockAssets.filter(asset => {
    if (activeTab === 'all') return true;
    if (activeTab === 'copyright') return asset.type === 'Copyright';
    if (activeTab === 'patent') return asset.type === 'Patent';
    return true;
  });

  const tabs = [
    { id: 'all', label: 'All Assets', count: mockAssets.length },
    { id: 'copyright', label: 'Copyright', count: mockAssets.filter(a => a.type === 'Copyright').length },
    { id: 'patent', label: 'Patent', count: mockAssets.filter(a => a.type === 'Patent').length }
  ];

  return (
    <div className="space-y-6">
      <div className="flex space-x-6 border-b border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-1 font-medium text-sm transition-colors relative ${
              activeTab === tab.id
                ? 'text-neon-blue'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
            <span className="ml-2 px-2 py-1 bg-gray-700 rounded-full text-xs">
              {tab.count}
            </span>
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-blue"></div>
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset, index) => (
          <AssetCard key={index} {...asset} />
        ))}
      </div>
    </div>
  );
};
