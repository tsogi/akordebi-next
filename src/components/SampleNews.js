import Image from 'next/image';

export default function SampleNews() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white/90">🎨 ვიზუალური განახლება</h3>
        <div className="space-y-2 text-white/80 mxedruli">
          <div className="flex items-start">
            <span className="mr-2 text-indigo-400">→</span>
            <p>საიტის დიზაინი გახდა უფრო სუფთა და მოწესრიგებული</p>
          </div>
          <div className="flex items-start">
            <span className="mr-2 text-indigo-400">→</span>
            <p>კომპაქტური ინტერფეისი უკეთესი მოხმარებისთვის</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white/90">📱 მობილური ვერსია</h3>
        <div className="space-y-2 text-white/80 mxedruli">
          <div className="flex items-start">
            <span className="mr-2 text-indigo-400">→</span>
            <p>განსაკუთრებით კომფორტული გამოყენება მობილურ ტელეფონებზე</p>
          </div>
          <div className="flex items-start">
            <span className="mr-2 text-indigo-400">→</span>
            <p>ადაპტირებული ინტერფეისი ყველა ზომის ეკრანისთვის</p>
          </div>
        </div>
      </div>
    </div>
  );
} 