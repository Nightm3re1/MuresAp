// src/app/[locale]/apartments/page.tsx
import type { PageProps } from 'next';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ApartmentsClientContent from './apartments-client-content';

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

export default function ApartmentsPage({
  params,
}: PageProps<{ locale: string }>) {
  return <ApartmentsClientContent params={params} />;
}
