import { useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import shopProducts from '@/data/shopProducts';
import uiDb from '@/services/data';

const guitars = shopProducts.filter(p => p.category !== 'აქსესუარები' && p.inStock);

export default function ShopTeaser({ placement = 'unknown' }) {
  const { lang } = useLanguage();
  const t = lang.shopTeaser || {};
  const impressionLogged = useRef(false);

  const featured = useMemo(() => {
    return guitars[Math.floor(Math.random() * guitars.length)];
  }, []);

  useEffect(() => {
    if (impressionLogged.current) return;
    impressionLogged.current = true;
    uiDb.logEvent('shop_teaser_impression', placement);
  }, [placement]);

  function handleCtaClick() {
    uiDb.logEvent('shop_teaser_click', placement);
  }

  function handleProductClick() {
    uiDb.logEvent('shop_teaser_product_click', `${placement}:${featured.id}`);
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

        {/* Featured product chip + CTA */}
        <div className="flex items-center gap-3 flex-wrap">
          {featured && (
            <Link
              href={`/shop/product/${featured.id}`}
              onClick={handleProductClick}
              className="flex items-center gap-3 bg-slate-700/50 hover:bg-slate-700/80 border border-slate-600/40 rounded-xl px-3 py-2 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-600/50 shrink-0">
                <Image
                  src={featured.thumbnail}
                  alt={featured.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-medium truncate group-hover:text-amber-400 transition-colors">
                  {featured.name}
                </p>
                <p className="text-amber-500 text-xs font-bold">
                   {featured.price} ₾
                </p>
              </div>
            </Link>
          )}

          <Link
            href="/shop"
            onClick={handleCtaClick}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-medium px-4 py-2.5 rounded-xl transition-colors ml-auto"
          >
            {t.cta || 'მაღაზიაში გადასვლა'}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
