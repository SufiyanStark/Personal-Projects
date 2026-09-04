"use client";

import {
  bestSellerProducts,
  featuredProducts,
  getProduct,
  getProductsByCategory,
  newArrivalProducts,
  type Product,
  type ProductCategory,
} from "@/data/products";
import type { AevrisseScrollProgressDetail } from "@/components/three/ScrollProgressBridge";
import { ProductStage, formatPrice } from "@/v2/ProductStage";
import { AnimatePresence, motion, useMotionValue, useTransform } from "motion/react";
import Image from "next/image";
import type { ReactNode, WheelEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

const categories: Array<{ key: ProductCategory; label: string }> = [
  { key: "hoodies", label: "HOODIES" },
  { key: "tshirts", label: "T-SHIRTS" },
  { key: "shirts", label: "SHIRTS" },
  { key: "jackets", label: "JACKETS" },
  { key: "trousers", label: "TROUSERS" },
  { key: "coats", label: "COATS" },
];

const editorialSectionShell = "relative flex h-screen overflow-hidden px-5 py-[clamp(3.5rem,7vh,5rem)] text-[#f6efe3] sm:px-10 lg:px-16";

function Label({ children }: { children: string }) {
  return <p className="text-xs uppercase tracking-[0.34em] text-[#c7a76e]">{children}</p>;
}

function ProductRow({
  cardClassName = "",
  displayMode = "default",
  emphasizeCenter = false,
  gridClassName = "",
  imageClassName = "h-[clamp(270px,31vw,430px)]",
  imageScaleClassName = "",
  onInspect,
  products,
}: {
  cardClassName?: string;
  displayMode?: "default" | "editorial-card";
  emphasizeCenter?: boolean;
  gridClassName?: string;
  imageClassName?: string;
  imageScaleClassName?: string;
  onInspect: (productId: string) => void;
  products: Product[];
}) {
  return (
    <div
      className={`grid w-full min-w-0 items-end gap-3 ${gridClassName ? "" : "lg:gap-4"} ${
        products.length === 3
          ? "md:grid-cols-3"
          : "grid-cols-2 md:grid-cols-4"
      } ${gridClassName}`}
    >
      {products.map((product, index) => (
        <ProductStage
          key={product.id}
          cardClassName={cardClassName}
          displayMode={displayMode}
          product={product}
          onInspect={onInspect}
          imageClassName={imageClassName}
          imageScaleClassName={imageScaleClassName}
          stageClassName={emphasizeCenter && index === 1 ? "md:scale-[1.1]" : ""}
          transitionDelay={index * 80}
        />
      ))}
    </div>
  );
}

function getRevealStep(progress: number, start: number, end: number) {
  if (end <= start) return progress >= end ? 1 : 0;
  return Math.min(1, Math.max(0, (progress - start) / (end - start)));
}

type SectionTimeline = {
  enterEnd: number;
  enterStart: number;
  exitEnd: number;
  exitStart: number;
};

type SectionState = {
  enterProgress: number;
  exitProgress: number;
  hold: boolean;
  opacity: number;
  scale: number;
  translate: number;
  windowProgress: number;
};

function getSectionProgress(progress: number, timeline: SectionTimeline): SectionState {
  const enterProgress = getRevealStep(progress, timeline.enterStart, timeline.enterEnd);
  const exitProgress = getRevealStep(progress, timeline.exitStart, timeline.exitEnd);
  const opacity = Math.min(enterProgress, 1 - exitProgress);
  const windowProgress = getRevealStep(progress, timeline.enterStart, timeline.exitEnd);

  return {
    enterProgress,
    exitProgress,
    hold: progress >= timeline.enterEnd && progress <= timeline.exitStart,
    opacity,
    scale: 0.98 + enterProgress * 0.02 - exitProgress * 0.008,
    translate: (1 - enterProgress) * 20 - exitProgress * 15,
    windowProgress,
  };
}

function TimelineLayer({
  children,
  name,
  onWheel,
  timeline,
}: {
  children: ReactNode;
  name: string;
  onWheel: (event: WheelEvent<HTMLElement>) => void;
  timeline: SectionTimeline;
}) {
  return (
    <div
      className="pointer-events-none invisible absolute inset-0"
      data-aev-enter-end={timeline.enterEnd}
      data-aev-enter-start={timeline.enterStart}
      data-aev-exit-end={timeline.exitEnd}
      data-aev-exit-start={timeline.exitStart}
      data-aev-section={name}
      onWheel={onWheel}
      style={{
        opacity: 0,
        transform: "translateY(20px) scale(0.98)",
      }}
    >
      {children}
    </div>
  );
}

function ShopByCategory({ onInspect }: { onInspect: (productId: string) => void }) {
  const [active, setActive] = useState<ProductCategory>("hoodies");
  const [page, setPage] = useState(0);
  const products = useMemo(() => getProductsByCategory(active), [active]);
  const pageCount = Math.max(1, Math.ceil(products.length / 4));
  const visibleProducts = products.slice(page * 4, page * 4 + 4);
  const showArrows = products.length > 4;

  return (
    <section id="shop" className="relative min-h-screen overflow-hidden px-5 py-12 text-[#f6efe3] sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(8,7,6,0.72),rgba(8,7,6,0.24)_58%,rgba(8,7,6,0.58))]" />
      <div className="pointer-events-none absolute right-6 top-8 text-[clamp(5rem,15vw,17rem)] font-light leading-none text-[#efe7d7]/[0.022]">
        {categories.find((category) => category.key === active)?.label}
      </div>
      <div className="relative mx-auto grid min-h-[calc(100vh-6rem)] w-full max-w-[98rem] gap-6 lg:flex lg:items-center">
        <div className="lg:w-[30%] lg:shrink-0">
          <div data-aev-shop-reveal="label" style={{ opacity: 0, transform: "translateY(18px)" }}>
            <Label>COLLECTION 01</Label>
          </div>
          <h1
            data-aev-shop-reveal="title"
            className="mt-4 text-[clamp(2.8rem,6vw,6rem)] font-light leading-none"
            style={{ opacity: 0, transform: "translateY(24px)" }}
          >
            SHOP BY
            <br />
            CATEGORY
          </h1>
          <div
            data-aev-shop-reveal="categories"
            className="mt-7 grid gap-1.5"
            style={{ opacity: 0, transform: "translateY(20px)" }}
          >
            {categories.map((category) => (
              <button
                key={category.key}
                type="button"
                onMouseEnter={() => {
                  setActive(category.key);
                  setPage(0);
                }}
                onClick={() => {
                  setActive(category.key);
                  setPage(0);
                }}
                className={`w-fit text-left text-[clamp(1.25rem,2.25vw,2.35rem)] font-light transition ${
                  active === category.key ? "text-[#f6efe3]" : "text-[#f6efe3]/32 hover:text-[#f6efe3]/72"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
        <div
          data-aev-shop-reveal="products"
          className="relative lg:w-[70%] lg:min-w-0"
          style={{ opacity: 0, transform: "translateY(26px)" }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`${active}-${page}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProductRow
                products={visibleProducts}
                onInspect={onInspect}
                imageClassName="h-[clamp(280px,42vh,340px)]"
                gridClassName="lg:gap-5"
              />
            </motion.div>
          </AnimatePresence>
          {showArrows ? (
            <>
              <button
                type="button"
                aria-label="Previous category products"
                onClick={() => setPage((page - 1 + pageCount) % pageCount)}
                className="absolute left-0 top-1/2 border border-[#efe7d7]/18 bg-[#080706]/50 px-4 py-3 text-[#efe7d7]/70 backdrop-blur-sm"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next category products"
                onClick={() => setPage((page + 1) % pageCount)}
                className="absolute right-0 top-1/2 border border-[#efe7d7]/18 bg-[#080706]/50 px-4 py-3 text-[#efe7d7]/70 backdrop-blur-sm"
              >
                →
              </button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function BestSellers({ onInspect }: { onInspect: (productId: string) => void }) {
  const pieces = bestSellerProducts.slice(0, 3);

  return (
    <section className={`${editorialSectionShell} items-center`}>
      <div className="pointer-events-none absolute inset-0 bg-[#080706]/58" />
      <div className="pointer-events-none absolute right-[-4vw] top-8 text-[clamp(7rem,15vw,16rem)] font-light leading-none text-[#efe7d7]/[0.035]">
        CURATED
      </div>
      <div className="relative mx-auto flex w-full max-w-[76rem] flex-col items-center">
        <div className="text-center">
          <Label>AEVRISSE / CURATED</Label>
          <h2 className="mt-3 text-[clamp(3.5rem,7vw,6.2rem)] font-light leading-[0.9]">BEST SELLERS</h2>
        </div>
        <div className="mt-[clamp(1.5rem,4vh,2.3rem)] w-full min-w-0">
          <ProductRow
            products={pieces}
            onInspect={onInspect}
            imageClassName="h-[clamp(260px,39vh,320px)]"
            imageScaleClassName="scale-[1.2]"
            emphasizeCenter
            gridClassName="mx-auto max-w-[66rem] lg:gap-8"
          />
        </div>
      </div>
    </section>
  );
}

function Featured({ onInspect }: { onInspect: (productId: string) => void }) {
  const product = featuredProducts[0] ?? getProduct("jacket-01");
  const x = useMotionValue(0);
  const imageY = useMotionValue(86);
  const imageScale = useMotionValue(0.9);
  const copyY = useMotionValue(42);
  const rotate = useTransform(x, [-0.5, 0.5], [-1.4, 1.4]);

  useEffect(() => {
    const update = (progress: number) => {
      const featuredProgress = getSectionProgress(progress, sectionTimelines.featured).windowProgress;
      imageY.set(86 - featuredProgress * 128);
      imageScale.set(0.9 + Math.min(featuredProgress / 0.45, 1) * 0.14);
      copyY.set(42 - Math.min(featuredProgress / 0.5, 1) * 42);
    };
    const handleProgress = (event: Event) => {
      update((event as CustomEvent<AevrisseScrollProgressDetail>).detail.progress);
    };

    update(0);
    window.addEventListener("aevrisse-scroll-progress", handleProgress);
    return () => window.removeEventListener("aevrisse-scroll-progress", handleProgress);
  }, [copyY, imageScale, imageY]);

  if (!product) return null;

  return (
    <section className={`${editorialSectionShell} items-center bg-[#0b0908]/82`}>
      <div className="pointer-events-none absolute inset-x-0 top-10 text-center text-[clamp(5rem,18vw,20rem)] font-light leading-none text-[#efe7d7]/[0.035]">
        AEVRISSE
      </div>
      <div className="relative mx-auto grid max-w-[88rem] gap-10 lg:grid-cols-2 lg:items-center">
        <motion.div style={{ y: copyY }}>
          <Label>AEVRISSE / DESIGN NOTE</Label>
          <h2 className="mt-4 text-[clamp(2.8rem,5.8vw,5.4rem)] font-light leading-[0.94]">
            OBSIDIAN
            <br />
            STRUCTURED
            <br />
            BLAZER
          </h2>
          <p className="mt-5 max-w-md text-sm leading-6 text-[#efe7d7]/62">{product.description}</p>
          <p className="mt-5 text-lg text-[#c7a76e]">{formatPrice(product.price)}</p>
          <button
            type="button"
            onClick={() => onInspect(product.id)}
            className="mt-6 border border-[#c7a76e]/60 px-6 py-4 text-xs uppercase tracking-[0.24em]"
          >
            VIEW PIECE
          </button>
        </motion.div>
        <motion.button
          type="button"
          onClick={() => onInspect(product.id)}
          onPointerMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            x.set((event.clientX - rect.left) / rect.width - 0.5);
          }}
          onPointerLeave={() => x.set(0)}
          style={{ rotate, y: imageY, scale: imageScale }}
          className="relative h-[clamp(380px,58vh,520px)] self-center"
        >
          <Image
            alt={product.name}
            className="object-contain drop-shadow-[0_52px_58px_rgba(0,0,0,0.5)]"
            fill
            sizes="(min-width:1024px) 48vw, 90vw"
            src={product.image}
          />
        </motion.button>
      </div>
    </section>
  );
}

function NewArrivals({ onInspect }: { onInspect: (productId: string) => void }) {
  const pieces = newArrivalProducts.slice(0, 4);

  return (
    <section className={`${editorialSectionShell} items-center`}>
      <div className="pointer-events-none absolute inset-0 bg-[#100d0b]/68" />
      <div className="relative mx-auto flex w-full max-w-[90rem] flex-col items-center">
        <div className="min-w-0 text-center">
          <Label>RECENTLY PLACED</Label>
          <h2 className="mt-3 text-[clamp(3.1rem,5.2vw,5.4rem)] font-light leading-[0.92]">
            NEW ARRIVALS
          </h2>
        </div>
        <motion.div className="mt-[clamp(1.75rem,4vh,2.75rem)] w-full min-w-0 px-[clamp(0rem,1.5vw,1.75rem)]">
          <ProductRow
            products={pieces}
            onInspect={onInspect}
            displayMode="editorial-card"
            cardClassName="h-[clamp(360px,52vh,420px)] border border-[#efe7d7]/10 bg-[#0c0a08]/50 px-2 pb-4 pt-5 backdrop-blur-[2px] hover:border-[#c7a76e]/42"
            imageClassName="h-[clamp(240px,36vh,285px)] flex-none"
            gridClassName="gap-[clamp(0.875rem,1.5vw,1.375rem)]"
          />
        </motion.div>
      </div>
    </section>
  );
}

function CollectionEditorial({ onInspect }: { onInspect: (productId: string) => void }) {
  const pieces = ["coat-03", "shirt-04", "jacket-03", "trousers-04"]
    .map((id) => getProduct(id))
    .filter((product): product is Product => Boolean(product));

  return (
    <section className={`${editorialSectionShell} items-center`}>
      <div className="pointer-events-none absolute inset-0 bg-[#080706]/78" />
      <div className="pointer-events-none absolute bottom-8 left-4 text-[clamp(6rem,17vw,18rem)] font-light leading-none text-[#efe7d7]/[0.035]">
        MOVEMENT
      </div>
      <div className="relative mx-auto flex w-full max-w-[90rem] flex-col items-center">
        <div className="min-w-0 text-center">
          <Label>COLLECTION 01</Label>
          <h2 className="mt-3 text-[clamp(3.25rem,5vw,5.25rem)] font-light leading-[0.92]">
            FORM MATERIAL MOVEMENT
          </h2>
        </div>
        <div className="mt-[clamp(1.75rem,4vh,2.75rem)] w-full min-w-0 px-[clamp(0rem,1.5vw,1.75rem)]">
          <ProductRow
            products={pieces}
            onInspect={onInspect}
            displayMode="editorial-card"
            cardClassName="h-[clamp(360px,50vh,430px)] border border-[#efe7d7]/10 bg-[#0c0a08]/50 px-2 pb-4 pt-5 backdrop-blur-[2px] hover:border-[#c7a76e]/42"
            imageClassName="h-[clamp(240px,35vh,290px)] flex-none"
            gridClassName="gap-[clamp(0.875rem,1.5vw,1.375rem)]"
          />
        </div>
      </div>
    </section>
  );
}

function BrandFooter() {
  return (
    <section id="about" className="flex h-screen items-center bg-[#060504] px-5 py-[clamp(2.5rem,5vh,3.75rem)] text-[#f6efe3] sm:px-10 lg:px-16">
      <div className="mx-auto grid h-full max-h-[42rem] w-full max-w-[86rem] grid-rows-[minmax(0,0.48fr)_minmax(0,0.52fr)] gap-6">
        <div className="grid min-h-0 gap-5 md:grid-cols-3">
          {[
            ["01", "FORM", "Sculpted silhouettes designed for modern movement."],
            ["02", "MATERIAL", "Premium textures, restrained palettes, refined construction."],
            ["03", "MOTION", "Digital fashion experiences built to respond and move."],
          ].map(([number, title, copy]) => (
            <article key={number} className="min-h-0 border border-[#efe7d7]/12 bg-[#120f0d] p-[clamp(1.25rem,2.3vw,2rem)]">
              <p className="text-xs text-[#c7a76e]">{number}</p>
              <h3 className="mt-[clamp(2.2rem,5vh,3.5rem)] text-[clamp(1.8rem,3.2vw,2.7rem)] font-light">{title}</h3>
              <p className="mt-4 text-sm leading-6 text-[#efe7d7]/58">{copy}</p>
            </article>
          ))}
        </div>
        <footer className="min-h-0 border-t border-[#efe7d7]/12 pt-7">
          <h2 className="text-[clamp(5.5rem,10vw,9.4rem)] font-light leading-[0.82]">AEVRISSE</h2>
          <p className="mt-4 text-xs uppercase tracking-[0.28em] text-[#efe7d7]/54">COLLECTION 01</p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm uppercase tracking-[0.22em] text-[#efe7d7]/62">
            <a href="#shop">Shop</a>
            <a href="#about">About</a>
            <a href="mailto:contact@aevrisse.example">Contact</a>
            <a href="https://instagram.com">Instagram</a>
            <a href="https://x.com">X</a>
          </div>
          <p className="mt-6 text-sm leading-6 text-[#efe7d7]/50">
            Concept & Frontend Experience
            <br />
            starkbuilds.ai
          </p>
        </footer>
      </div>
    </section>
  );
}

const sectionTimelines = {
  shop: { enterStart: 0.38, enterEnd: 0.415, exitStart: 0.535, exitEnd: 0.565 },
  bestSellers: { enterStart: 0.555, enterEnd: 0.59, exitStart: 0.67, exitEnd: 0.7 },
  featured: { enterStart: 0.685, enterEnd: 0.715, exitStart: 0.79, exitEnd: 0.82 },
  newArrivals: { enterStart: 0.795, enterEnd: 0.825, exitStart: 0.895, exitEnd: 0.925 },
  collection: { enterStart: 0.905, enterEnd: 0.925, exitStart: 0.96, exitEnd: 0.985 },
  footer: { enterStart: 0.975, enterEnd: 0.992, exitStart: 1, exitEnd: 1 },
} as const;

function isInteractive(progress: number, timeline: SectionTimeline) {
  return progress >= timeline.enterEnd && progress <= timeline.exitStart;
}

function updateTimelineLayer(layer: HTMLElement, progress: number, timeline: SectionTimeline) {
  const section = getSectionProgress(progress, timeline);
  layer.style.opacity = String(section.opacity);
  layer.style.transform = `translateY(${section.translate}px) scale(${section.scale})`;
  layer.style.visibility = section.opacity > 0.01 ? "visible" : "hidden";
  layer.style.pointerEvents = isInteractive(progress, timeline) ? "auto" : "none";
}

function updateShopReveal(root: HTMLElement, progress: number) {
  const shopState = getSectionProgress(progress, sectionTimelines.shop);
  const revealSteps = [
    ["label", getRevealStep(shopState.enterProgress, 0, 0.28), 18],
    ["title", getRevealStep(shopState.enterProgress, 0.14, 0.52), 24],
    ["categories", getRevealStep(shopState.enterProgress, 0.32, 0.74), 20],
    ["products", getRevealStep(shopState.enterProgress, 0.46, 1), 26],
  ] as const;

  revealSteps.forEach(([name, reveal, translate]) => {
    const element = root.querySelector<HTMLElement>(`[data-aev-shop-reveal="${name}"]`);
    if (!element) return;
    element.style.opacity = String(reveal);
    element.style.transform = `translateY(${(1 - reveal) * translate}px)`;
  });
}

export function EditorialExperience({
  onInspect,
  onWheel,
}: {
  onInspect: (productId: string) => void;
  onWheel: (event: WheelEvent<HTMLElement>) => void;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = (progress: number) => {
      const rootElement = root.current;
      if (!rootElement) return;

      Object.entries(sectionTimelines).forEach(([name, timeline]) => {
        const layer = rootElement.querySelector<HTMLElement>(`[data-aev-section="${name}"]`);
        if (layer) updateTimelineLayer(layer, progress, timeline);
      });
      updateShopReveal(rootElement, progress);
    };
    const handleProgress = (event: Event) => {
      update((event as CustomEvent<AevrisseScrollProgressDetail>).detail.progress);
    };

    update(0);
    window.addEventListener("aevrisse-scroll-progress", handleProgress);
    return () => window.removeEventListener("aevrisse-scroll-progress", handleProgress);
  }, []);

  return (
    <div ref={root} className="pointer-events-none fixed inset-0 z-10 overflow-hidden" data-aev-editorial-root>
      <TimelineLayer
        name="shop"
        timeline={sectionTimelines.shop}
        onWheel={onWheel}
      >
        <ShopByCategory onInspect={onInspect} />
      </TimelineLayer>
      <TimelineLayer
        name="bestSellers"
        timeline={sectionTimelines.bestSellers}
        onWheel={onWheel}
      >
        <BestSellers onInspect={onInspect} />
      </TimelineLayer>
      <TimelineLayer
        name="featured"
        timeline={sectionTimelines.featured}
        onWheel={onWheel}
      >
        <Featured onInspect={onInspect} />
      </TimelineLayer>
      <TimelineLayer
        name="newArrivals"
        timeline={sectionTimelines.newArrivals}
        onWheel={onWheel}
      >
        <NewArrivals onInspect={onInspect} />
      </TimelineLayer>
      <TimelineLayer
        name="collection"
        timeline={sectionTimelines.collection}
        onWheel={onWheel}
      >
        <CollectionEditorial onInspect={onInspect} />
      </TimelineLayer>
      <TimelineLayer
        name="footer"
        timeline={sectionTimelines.footer}
        onWheel={onWheel}
      >
        <BrandFooter />
      </TimelineLayer>
    </div>
  );
}
