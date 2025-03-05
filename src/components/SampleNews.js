import Image from 'next/image';

export default function SampleNews() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white/90">🎨 ვიზუალური განახლება</h3>
        <ul className="list-disc list-inside space-y-2 text-white/80 mxedruli">
          <li>საიტის დიზაინი გახდა უფრო სუფთა და მოწესრიგებული</li>
          <li>კომპაქტური ინტერფეისი უკეთესი მოხმარებისთვის</li>
        </ul>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-white/90">📱 მობილური ვერსია</h3>
        <ul className="list-disc list-inside space-y-2 text-white/80 mxedruli">
          <li>განსაკუთრებით კომფორტული გამოყენება მობილურ ტელეფონებზე</li>
          <li>ადაპტირებული ინტერფეისი ყველა ზომის ეკრანისთვის</li>
        </ul>
      </div>
    </div>
  );
} 