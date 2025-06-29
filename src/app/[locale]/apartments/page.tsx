// src/app/[locale]/apartments/page.tsx

import type { PageProps } from 'next';
import type { Metadata } from 'next';
import ApartmentsClientContent from './apartments-client-content';
import { getTranslations } from 'next-intl/server';
import { locales } from '@/i18n';

// 1) Generate one page per locale
export async function generateStaticParams() {
  return locales.map((l) => {
    const code = typeof l === 'string' ? l : l.code ?? l.locale;
    return { locale: code };
  });
}

// 2) Metadata generation using PageProps
export async function generateMetadata({
  params,
}: PageProps<{ locale: string }>): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'ApartmentsPage' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

// 3) Main page component
export default function ApartmentsPage({
  params,
}: PageProps<{ locale: string }>) {
  return <ApartmentsClientContent params={params} />;
}
