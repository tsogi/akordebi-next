import { useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import shopProducts from '@/data/shopProducts';
import uiDb from '@/services/data';

const guitars = shopProducts.filter(p => p.category !== 'აქსესუარები' && p.inStock);
const accessories = shopProducts.filter(p => p.category === 'აქსესუარები' && p.inStock);

export default function ShopTeaser({ placement = 'unknown' }) {
  const { lang } = useLanguage();
  const t = lang.shopTeaser || {};
  const impressionLogged = useRef(false);

  const { guitar, accs } = useMemo(() => {
    const g = guitars[Math.floor(Math.random() * guitars.length)];
    const shuffled = [...accessories].sort(() => Math.random() - 0.5);
    return { guitar: g, accs: shuffled.slice(0, 2) };
  }, []);

  useEffect(() => {
    if (impressionLogged.current) return;
    impressionLogged.current = true;
    uiDb.logEvent('shop_teaser_impression', placement);
  }, [placement]);

  function handleCtaClick() {
    uiDb.logEvent('shop_teaser_click', placement);
  }

  function handleProductClick(productId) {
    uiDb.logEvent('shop_teaser_product_click', `${placement}:${productId}`);
  }

  return (
    <section className="my-8 mx-auto max-w-2xl lg:max-w-4xl">
      <div className="bg-gradient-to-br from-slate-800/90 to-slate-800/60 border border-slate-700/60 rounded-2xl p-5 md:p-6">
        {/* Header row */}
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-amber-500 text-slate-900 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0">
            {t.badge || 'სიახლე'}
          </span>
          <h3 className="text-white text-sm md:text-base font-semibold leading-tight">
            {t.title || 'akordebi.ge-ის გიტარის მაღაზია'}
          </h3>
        </div>

        {/* Trust line */}
        <p className="text-gray-400 text-xs md:text-sm mb-4 leading-relaxed">
          {t.trustLine || 'უფასო მიტანა იმავე დღეს · ადგილზე გადახდა'}
        </p>

        {/* Featured guitar (left) + two accessories stacked (right) */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {guitar && (
            <Link
              href={`/shop/product/${guitar.id}`}
              onClick={() => handleProductClick(guitar.id)}
              className="bg-slate-700/50 hover:bg-slate-700/80 border border-slate-600/40 rounded-xl p-3 transition-colors group"
            >
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-slate-600/30 mb-2">
                <Image
                  src={guitar.thumbnail}
                  alt={guitar.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-white text-sm font-medium truncate group-hover:text-amber-400 transition-colors">
                {guitar.name}
              </p>
              <p className="text-amber-500 text-sm font-bold">
                {guitar.price} ₾
              </p>
            </Link>
          )}
          <div className="flex flex-col gap-3">
            {accs.map((acc) => (
              <Link
                key={acc.id}
                href={`/shop/product/${acc.id}`}
                onClick={() => handleProductClick(acc.id)}
                className="flex-1 bg-slate-700/50 hover:bg-slate-700/80 border border-slate-600/40 rounded-xl p-2.5 transition-colors group flex flex-col"
              >
                <div className="w-full flex-1 rounded-lg overflow-hidden bg-slate-600/30 flex items-center justify-center">
                  <Image
                    src={acc.thumbnail}
                    alt={acc.name}
                    width={100}
                    height={100}
                    className="w-3/4 h-3/4 object-contain"
                  />
                </div>
                <div className="mt-1.5">
                  <p className="text-white text-xs font-medium truncate group-hover:text-amber-400 transition-colors">
                    {acc.name}
                  </p>
                  <p className="text-amber-500 text-xs font-bold">
                    {acc.price} ₾
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/shop"
          onClick={handleCtaClick}
          className="flex items-center justify-center gap-1.5 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-3 rounded-xl transition-colors"
        >
          {t.cta || 'მაღაზიაში გადასვლა'}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
