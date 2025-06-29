// src/app/[locale]/contact/page.tsx

import type { PageProps } from 'next';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ContactClientContent from './contact-client-content';
import { locales } from '@/i18n';

// 1) Tell Next.js which locales to generate
export async function generateStaticParams() {
  return locales.map((l) => {
    const code = typeof l === 'string' ? l : l.code ?? l.locale;
    return { locale: code };
  });
}

// 2) Use PageProps<{locale}> for metadata
export async function generateMetadata({
  params,
}: PageProps<{ locale: string }>): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: 'ContactPage' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

// 3) Main page component using the generic PageProps
export default function ContactPage({
  params,
}: PageProps<{ locale: string }>) {
  return <ContactClientContent params={params} />;
}
