// src/app/[locale]/page.tsx

import type { PageProps } from 'next';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import HomePageClient from '@/components/ui/home-page-client';
import { Meteors } from '@/components/ui/meteors';
import { locales } from '@/i18n';

// 1) Generate one page per locale
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 2) generateMetadata using PageProps<{ locale }>
export async function generateMetadata({
  params,
}: PageProps<{ locale: string }>): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'Navbar' });
  const brandT = await getTranslations({ locale, namespace: 'Brand' });
  return {
    title: t('home'),
    description: `Welcome to ${brandT('name')} - Your premier choice for apartment rentals in Târgu Mureș.`,
  };
}

// 3) Default export uses the same PageProps<{ locale }>
export default function HomePage({
  params,
}: PageProps<{ locale: string }>) {
  return (
    <div className="relative flex-grow">
      <Meteors number={60} className="opacity-70 -z-10 absolute inset-0" />
      <HomePageClient locale={params.locale} />
    </div>
  );
}
