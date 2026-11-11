import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRODUCTS, getProductBySlug } from "@/data/catalog";
import { ProductDetail } from "@/components/product-detail";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: { title: product.name, description: product.description, type: "website" },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const sameCategory = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id);
  const others = sameCategory.length < 4 ? PRODUCTS.filter((p) => p.id !== product.id && p.category !== product.category) : [];
  const related = [...sameCategory, ...others].slice(0, 4);

  return <ProductDetail product={product} related={related} />;
}
