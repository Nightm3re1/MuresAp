// src/app/[locale]/discounts/page.tsx

import type { PageProps } from 'next';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import DiscountsClientContent from './discounts-client-content';

import { locales } from '@/i18n';

// 1) Tell Next.js to statically generate for all locales
export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// 2) Metadata generation using PageProps
export async function generateMetadata({
  params,
}: PageProps<{ locale: string }>): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'DiscountsPage' });
  return {
    title: t('title'),
  };
}

// 3) Page component also uses PageProps
export default function DiscountsPage({
  params,
}: PageProps<{ locale: string }>) {
  return <DiscountsClientContent params={params} />;
}
