import Image from 'next/image';

export default function SampleNews() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white/90">🎸 New Features</h3>
        <ul className="list-disc list-inside space-y-2 text-white/80">
          <li>Enhanced Guitar Finder with better filtering options</li>
          <li>Improved song recommendations based on your preferences</li>
          <li>New video lessons section with professional tutorials</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white/90">🚀 Performance Updates</h3>
        <ul className="list-disc list-inside space-y-2 text-white/80">
          <li>Faster page loading times</li>
          <li>Smoother transitions between pages</li>
          <li>Better mobile responsiveness</li>
        </ul>
      </div>

      <div className="mt-4 text-sm text-white/60">
        Stay tuned for more exciting updates coming soon!
      </div>
    </div>
  );
} 