import { useState } from 'react';
import ProductGrid from '../../components/products/ProductGrid';

export default function GamingPcsPage() {
  const [type, setType] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [processor, setProcessor] = useState('all');
  const [gpu, setGpu] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const pcTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'PREBUILT', label: 'Pre-built' },
    { value: 'CUSTOM', label: 'Custom Built' },
    { value: 'REFURBISHED', label: 'Refurbished' },
  ];

  const processors = [
    { value: 'all', label: 'All CPUs' },
    { value: 'intel-i9', label: 'Intel Core i9' },
    { value: 'intel-i7', label: 'Intel Core i7' },
    { value: 'intel-i5', label: 'Intel Core i5' },
    { value: 'amd-r9', label: 'AMD Ryzen 9' },
    { value: 'amd-r7', label: 'AMD Ryzen 7' },
    { value: 'amd-r5', label: 'AMD Ryzen 5' },
  ];

  const gpus = [
    { value: 'all', label: 'All GPUs' },
    { value: 'rtx-4090', label: 'RTX 4090' },
    { value: 'rtx-4080', label: 'RTX 4080' },
    { value: 'rtx-4070', label: 'RTX 4070' },
    { value: 'rx-7900', label: 'RX 7900 XT' },
    { value: 'rx-7800', label: 'RX 7800 XT' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gaming PCs</h1>
        <p className="mt-2 text-gray-600">
          Discover high-performance gaming computers built for every level of gamer
        </p>
      </div>

      {/* PC Type Tabs */}
      <div className="mb-6 flex gap-4 overflow-x-auto pb-2">
        {pcTypes.map((pcType) => (
          <button
            key={pcType.value}
            onClick={() => setType(pcType.value)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              type === pcType.value
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {pcType.label}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        {/* Processor Filter */}
        <select
          className="rounded-md border border-gray-300 px-3 py-2"
          value={processor}
          onChange={(e) => setProcessor(e.target.value)}
        >
          {processors.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        {/* GPU Filter */}
        <select
          className="rounded-md border border-gray-300 px-3 py-2"
          value={gpu}
          onChange={(e) => setGpu(e.target.value)}
        >
          {gpus.map((g) => (
            <option key={g.value} value={g.value}>{g.label}</option>
          ))}
        </select>

        {/* Price Range Filter */}
        <select
          className="rounded-md border border-gray-300 px-3 py-2"
          value={`${priceRange[0]}-${priceRange[1]}`}
          onChange={(e) => {
            const [min, max] = e.target.value.split('-').map(Number);
            setPriceRange([min, max]);
          }}
        >
          <option value="0-10000">All Prices</option>
          <option value="0-1000">Under $1,000</option>
          <option value="1000-2000">$1,000 - $2,000</option>
          <option value="2000-3000">$2,000 - $3,000</option>
          <option value="3000-10000">Over $3,000</option>
        </select>

        {/* Sort */}
        <select
          className="rounded-md border border-gray-300 px-3 py-2 ml-auto"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="performance">Performance</option>
        </select>
      </div>

      <ProductGrid
        category="GAMING_PCS"
        filter={{
          type: type !== 'all' ? type : undefined,
          processor: processor !== 'all' ? processor : undefined,
          gpu: gpu !== 'all' ? gpu : undefined,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          sortBy,
        }}
      />
    </div>
  );
}