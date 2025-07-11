// src/app/[locale]/apartments/[slug]/page.tsx

import type { PageProps } from 'next';
import type { Metadata } from 'next';
import { apartments } from '@/lib/data';
import { notFound } from 'next/navigation';
import ApartmentDetailClientContent from './apartment-detail-client-content';
import { Meteors } from '@/components/ui/meteors';
import { locales } from '@/i18n';

// 1) Generate every locale/slug combination with string codes
export async function generateStaticParams() {
  return locales.flatMap((l) => {
    const code = typeof l === 'string' ? l : l.code ?? l.locale;
    return apartments.map((ap) => ({
      locale: code,
      slug: ap.slug,
    }));
  });
}

// 2) Metadata generation using PageProps
export async function generateMetadata({
  params,
}: PageProps<{ locale: string; slug: string }>): Promise<Metadata> {
  const { locale, slug } = params;
  const ap = apartments.find((a) => a.slug === slug);
  if (!ap) return { title: 'Apartment Not Found' };

  const name = ap.name[locale] || ap.name.en;
  const raw = ap.description[locale] || ap.description.en;
  const description =
    typeof raw === 'string'
      ? raw.replace(/\*\*|##|###|\n/g, ' ').slice(0, 160)
      : '';

  return {
    title: name,
    description,
    openGraph: {
      title: name,
      description,
      images: ap.images.length ? [{ url: ap.images[0] }] : [],
    },
  };
}

// 3) Main page component
export default function ApartmentDetailPage({
  params,
}: PageProps<{ locale: string; slug: string }>) {
  const { locale, slug } = params;
  const ap = apartments.find((a) => a.slug === slug);
  if (!ap) notFound();

  return (
    <div className="relative bg-background min-h-screen flex-grow">
      <Meteors number={60} className="opacity-70 -z-10 absolute inset-0" />
      <ApartmentDetailClientContent apartment={ap} slug={slug} />
    </div>
  );
}
