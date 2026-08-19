"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Bike,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Cog,
  Languages,
  MapPin,
  MessageCircle,
  PackageOpen,
  Phone,
  ShieldCheck,
  UsersRound,
  Wrench,
} from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import type { Product, ProductCategory } from "@/lib/products";

const MAPS_URL = "https://maps.app.goo.gl/7pkGdu4PisML9RVV9";
const PRIMARY_PHONE = "+919900138902";
const SECONDARY_PHONE = "+919480342035";
const LANGUAGE_STORAGE_KEY = "santosh-cycles-language:v1";
const LANGUAGE_CHANGE_EVENT = "santosh-cycles-language-change";

const copy = {
  en: {
    language: "ಕನ್ನಡ",
    languageLabel: "Switch website to Kannada",
    nav: { cycles: "Cycles", services: "Repairs", visit: "Visit us" },
    eyebrow: "Haveri’s neighbourhood cycle store",
    heroTitle: "A cycle for every age. Care for every ride.",
    heroBody:
      "From a child’s first cycle to everyday adult rides, accessories, spare parts and complete repairs—all under one roof.",
    explore: "Explore the range",
    whatsapp: "WhatsApp us",
    addressShort: "MG Road, Haveri – 581110",
    trust: ["All age groups", "Parts & accessories", "Complete repairs"],
    categoryEyebrow: "Find your next ride",
    categoryTitle: "Everything cycling, right here.",
    categoryBody:
      "Visit the store to compare sizes, colours and styles. We’ll help you choose a comfortable, practical cycle.",
    categories: [
      { key: "baby", title: "Baby cycles", body: "Tricycles and first rides" },
      { key: "kids", title: "Kids & teens", body: "Growing riders, every size" },
      { key: "adult", title: "Adult cycles", body: "Daily, fitness and geared" },
      { key: "accessories", title: "Accessories & parts", body: "From bells to complete spares" },
    ],
    catalogEyebrow: "Live catalogue",
    catalogTitle: "Cycles available in store",
    catalogBody: "Products and prices added here will automatically appear on the website.",
    filters: {
      all: "All",
      baby: "Baby",
      kids: "Kids",
      adult: "Adult",
      geared: "Geared",
      accessories: "Accessories",
      "spare-parts": "Spare parts",
    },
    emptyTitle: "The online catalogue is being prepared.",
    emptyBody:
      "Browse our catalogue, then call or WhatsApp us for current stock, the exact price and recommendations.",
    askStock: "Ask about current stock",
    exactPrice: "Exact price on WhatsApp",
    enquire: "WhatsApp us",
    repairsEyebrow: "Repairs, end to end",
    repairsTitle: "From a puncture to a complete rebuild.",
    repairsBody:
      "Bring in any cycle. We inspect the problem, explain the work clearly and get it ready for the road again.",
    repairItems: [
      "Puncture, tyre and tube work",
      "Brake and gear adjustment",
      "Chain, pedal and wheel repairs",
      "New cycle assembly and safety check",
    ],
    callRepair: "Call about a repair",
    whyEyebrow: "Why Santosh Cycles",
    whyTitle: "Local help before and after you buy.",
    reasons: [
      { title: "The right fit", body: "Practical guidance for the rider’s age, height and use." },
      { title: "Everything in one place", body: "Cycles, accessories, spare parts and repairs together." },
      { title: "Easy to reach", body: "Call, WhatsApp or visit us on MG Road in Haveri." },
    ],
    visitEyebrow: "Visit the store",
    visitTitle: "Santosh Cycles, MG Road, Haveri",
    hours: "Business hours",
    morning: "11:00 AM – 2:30 PM",
    lunch: "Lunch break: 2:30 PM – 3:30 PM",
    evening: "3:30 PM – 8:00 PM",
    phones: "Call or WhatsApp",
    directions: "Get directions",
    primary: "Primary",
    alternate: "Alternate",
    finalTitle: "Not sure which cycle or part you need?",
    finalBody: "Send us a message. We’ll help you narrow it down before you visit.",
    messageNow: "Message Santosh Cycles",
    footer: "Cycles · Accessories · Spare parts · Complete repairs",
    call: "Call",
    quickWhatsApp: "WhatsApp",
    quickDirections: "Directions",
  },
  kn: {
    language: "English",
    languageLabel: "ವೆಬ್‌ಸೈಟ್ ಅನ್ನು ಇಂಗ್ಲಿಷ್‌ಗೆ ಬದಲಿಸಿ",
    nav: { cycles: "ಸೈಕಲ್‌ಗಳು", services: "ರಿಪೇರಿ", visit: "ನಮ್ಮನ್ನು ಭೇಟಿ ಮಾಡಿ" },
    eyebrow: "ಹಾವೇರಿಯ ವಿಶ್ವಾಸಾರ್ಹ ಸೈಕಲ್ ಅಂಗಡಿ",
    heroTitle: "ಪ್ರತಿ ವಯಸ್ಸಿಗೂ ಸೈಕಲ್. ಪ್ರತಿ ಸವಾರಿಗೂ ಕಾಳಜಿ.",
    heroBody:
      "ಮಕ್ಕಳ ಮೊದಲ ಸೈಕಲ್‌ನಿಂದ ದೊಡ್ಡವರ ದೈನಂದಿನ ಸವಾರಿವರೆಗೆ—ಆಕ್ಸೆಸರೀಸ್, ಬಿಡಿಭಾಗಗಳು ಮತ್ತು ಸಂಪೂರ್ಣ ರಿಪೇರಿ ಒಂದೇ ಕಡೆ.",
    explore: "ಸೈಕಲ್‌ಗಳನ್ನು ನೋಡಿ",
    whatsapp: "ವಾಟ್ಸಾಪ್ ಮಾಡಿ",
    addressShort: "ಎಂ.ಜಿ. ರಸ್ತೆ, ಹಾವೇರಿ – 581110",
    trust: ["ಎಲ್ಲಾ ವಯಸ್ಸಿನವರಿಗೆ", "ಬಿಡಿಭಾಗಗಳು ಮತ್ತು ಆಕ್ಸೆಸರೀಸ್", "ಸಂಪೂರ್ಣ ರಿಪೇರಿ"],
    categoryEyebrow: "ನಿಮ್ಮ ಮುಂದಿನ ಸವಾರಿ ಹುಡುಕಿ",
    categoryTitle: "ಸೈಕಲ್‌ಗೆ ಬೇಕಾದ ಎಲ್ಲವೂ ಇಲ್ಲಿ.",
    categoryBody:
      "ಗಾತ್ರ, ಬಣ್ಣ ಮತ್ತು ಮಾದರಿಗಳನ್ನು ಹೋಲಿಸಲು ಅಂಗಡಿಗೆ ಬನ್ನಿ. ಆರಾಮದಾಯಕ ಮತ್ತು ಉಪಯುಕ್ತ ಸೈಕಲ್ ಆಯ್ಕೆ ಮಾಡಲು ನಾವು ಸಹಾಯ ಮಾಡುತ್ತೇವೆ.",
    categories: [
      { key: "baby", title: "ಚಿಕ್ಕ ಮಕ್ಕಳ ಸೈಕಲ್‌ಗಳು", body: "ಟ್ರೈಸಿಕಲ್ ಮತ್ತು ಮೊದಲ ಸವಾರಿ" },
      { key: "kids", title: "ಮಕ್ಕಳು ಮತ್ತು ಟೀನೇಜರ್ಸ್", body: "ಪ್ರತಿ ವಯಸ್ಸಿಗೂ ಸರಿಯಾದ ಗಾತ್ರ" },
      { key: "adult", title: "ದೊಡ್ಡವರ ಸೈಕಲ್‌ಗಳು", body: "ದೈನಂದಿನ, ಫಿಟ್ನೆಸ್ ಮತ್ತು ಗೇರ್" },
      { key: "accessories", title: "ಆಕ್ಸೆಸರೀಸ್ ಮತ್ತು ಬಿಡಿಭಾಗಗಳು", body: "ಬೆಲ್‌ನಿಂದ ಎಲ್ಲಾ ಸ್ಪೇರ್ಸ್‌ವರೆಗೆ" },
    ],
    catalogEyebrow: "ಲೈವ್ ಕ್ಯಾಟಲಾಗ್",
    catalogTitle: "ಅಂಗಡಿಯಲ್ಲಿ ಲಭ್ಯವಿರುವ ಸೈಕಲ್‌ಗಳು",
    catalogBody: "ಇಲ್ಲಿ ಸೇರಿಸುವ ಉತ್ಪನ್ನಗಳು ಮತ್ತು ಬೆಲೆಗಳು ವೆಬ್‌ಸೈಟ್‌ನಲ್ಲಿ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಕಾಣಿಸುತ್ತವೆ.",
    filters: {
      all: "ಎಲ್ಲಾ",
      baby: "ಚಿಕ್ಕ ಮಕ್ಕಳು",
      kids: "ಮಕ್ಕಳು",
      adult: "ದೊಡ್ಡವರು",
      geared: "ಗೇರ್",
      accessories: "ಆಕ್ಸೆಸರೀಸ್",
      "spare-parts": "ಬಿಡಿಭಾಗಗಳು",
    },
    emptyTitle: "ಆನ್‌ಲೈನ್ ಕ್ಯಾಟಲಾಗ್ ಸಿದ್ಧವಾಗುತ್ತಿದೆ.",
    emptyBody:
      "ನಮ್ಮ ಉತ್ಪನ್ನಗಳನ್ನು ನೋಡಿ; ಪ್ರಸ್ತುತ ಸ್ಟಾಕ್, ನಿಖರ ಬೆಲೆ ಮತ್ತು ಸಲಹೆಗಾಗಿ ಕರೆ ಅಥವಾ ವಾಟ್ಸಾಪ್ ಮಾಡಿ.",
    askStock: "ಪ್ರಸ್ತುತ ಸ್ಟಾಕ್ ವಿಚಾರಿಸಿ",
    exactPrice: "ನಿಖರ ಬೆಲೆಗೆ ವಾಟ್ಸಾಪ್ ಮಾಡಿ",
    enquire: "ವಾಟ್ಸಾಪ್ ಮಾಡಿ",
    repairsEyebrow: "ಸಂಪೂರ್ಣ ರಿಪೇರಿ ಸೇವೆ",
    repairsTitle: "ಪಂಕ್ಚರ್‌ನಿಂದ ಸಂಪೂರ್ಣ ರಿಪೇರಿ ವರೆಗೆ.",
    repairsBody:
      "ಯಾವುದೇ ಸೈಕಲ್ ತಂದುಕೊಡಿ. ಸಮಸ್ಯೆ ಪರಿಶೀಲಿಸಿ, ಬೇಕಾದ ಕೆಲಸವನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ತಿಳಿಸಿ ಮತ್ತೆ ಸವಾರಿಗೆ ಸಿದ್ಧಪಡಿಸುತ್ತೇವೆ.",
    repairItems: [
      "ಪಂಕ್ಚರ್, ಟೈರ್ ಮತ್ತು ಟ್ಯೂಬ್ ಕೆಲಸ",
      "ಬ್ರೇಕ್ ಮತ್ತು ಗೇರ್ ಅಡ್ಜಸ್ಟ್‌ಮೆಂಟ್",
      "ಚೈನ್, ಪೆಡಲ್ ಮತ್ತು ವೀಲ್ ರಿಪೇರಿ",
      "ಹೊಸ ಸೈಕಲ್ ಅಸೆಂಬ್ಲಿ ಮತ್ತು ಸುರಕ್ಷತಾ ಪರಿಶೀಲನೆ",
    ],
    callRepair: "ರಿಪೇರಿಗಾಗಿ ಕರೆ ಮಾಡಿ",
    whyEyebrow: "ಸಂತೋಷ್ ಸೈಕಲ್ಸ್ ಏಕೆ",
    whyTitle: "ಖರೀದಿಗೂ ಮೊದಲು ಮತ್ತು ನಂತರವೂ ಸ್ಥಳೀಯ ಸಹಾಯ.",
    reasons: [
      { title: "ಸರಿಯಾದ ಗಾತ್ರ", body: "ವಯಸ್ಸು, ಎತ್ತರ ಮತ್ತು ಬಳಕೆಗೆ ತಕ್ಕ ಪ್ರಾಯೋಗಿಕ ಸಲಹೆ." },
      { title: "ಎಲ್ಲವೂ ಒಂದೇ ಕಡೆ", body: "ಸೈಕಲ್, ಆಕ್ಸೆಸರೀಸ್, ಬಿಡಿಭಾಗಗಳು ಮತ್ತು ರಿಪೇರಿ." },
      { title: "ಸುಲಭ ಸಂಪರ್ಕ", body: "ಕರೆ, ವಾಟ್ಸಾಪ್ ಅಥವಾ ಹಾವೇರಿಯ ಎಂ.ಜಿ. ರಸ್ತೆಯ ಅಂಗಡಿಗೆ ಭೇಟಿ ನೀಡಿ." },
    ],
    visitEyebrow: "ಅಂಗಡಿಗೆ ಭೇಟಿ ನೀಡಿ",
    visitTitle: "ಸಂತೋಷ್ ಸೈಕಲ್ಸ್, ಎಂ.ಜಿ. ರಸ್ತೆ, ಹಾವೇರಿ",
    hours: "ವ್ಯಾಪಾರದ ಸಮಯ",
    morning: "ಬೆಳಿಗ್ಗೆ 11:00 – ಮಧ್ಯಾಹ್ನ 2:30",
    lunch: "ಊಟದ ವಿರಾಮ: 2:30 – 3:30",
    evening: "ಮಧ್ಯಾಹ್ನ 3:30 – ರಾತ್ರಿ 8:00",
    phones: "ಕರೆ ಅಥವಾ ವಾಟ್ಸಾಪ್",
    directions: "ದಾರಿ ನೋಡಿ",
    primary: "ಮುಖ್ಯ",
    alternate: "ಪರ್ಯಾಯ",
    finalTitle: "ಯಾವ ಸೈಕಲ್ ಅಥವಾ ಭಾಗ ಬೇಕೆಂದು ಖಚಿತವಿಲ್ಲವೇ?",
    finalBody: "ನಮಗೆ ಸಂದೇಶ ಕಳುಹಿಸಿ. ಅಂಗಡಿಗೆ ಬರುವ ಮೊದಲು ಸರಿಯಾದ ಆಯ್ಕೆ ಮಾಡಲು ಸಹಾಯ ಮಾಡುತ್ತೇವೆ.",
    messageNow: "ಸಂತೋಷ್ ಸೈಕಲ್ಸ್‌ಗೆ ಸಂದೇಶ ಕಳುಹಿಸಿ",
    footer: "ಸೈಕಲ್‌ಗಳು · ಆಕ್ಸೆಸರೀಸ್ · ಬಿಡಿಭಾಗಗಳು · ಸಂಪೂರ್ಣ ರಿಪೇರಿ",
    call: "ಕರೆ",
    quickWhatsApp: "ವಾಟ್ಸಾಪ್",
    quickDirections: "ದಾರಿ",
  },
} as const;

type Language = keyof typeof copy;
type Filter = "all" | ProductCategory;

function subscribeToLanguage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(LANGUAGE_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, onStoreChange);
  };
}

function getLanguageSnapshot(): Language {
  const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return saved === "kn" ? "kn" : "en";
}

function getServerLanguageSnapshot(): Language {
  return "en";
}

const categoryStyles = ["category-cobalt", "category-coral", "category-sun", "category-ink"];
const categoryIcons = [Bike, UsersRound, Bike, Cog];

export function Storefront({ products }: { products: Product[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    getServerLanguageSnapshot,
  );
  const t = copy[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const visibleProducts =
    filter === "all" ? products : products.filter((product) => product.category === filter);

  function toggleLanguage() {
    const next = language === "en" ? "kn" : "en";
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
  }

  return (
    <main className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Santosh Cycles home">
          SANTOSH <span>CYCLES</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          <a href="#catalog">{t.nav.cycles}</a>
          <a href="#repairs">{t.nav.services}</a>
          <a href="#visit">{t.nav.visit}</a>
        </nav>
        <button className="language-toggle" onClick={toggleLanguage} type="button" aria-label={t.languageLabel}>
          <Languages aria-hidden="true" size={18} />
          {t.language}
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-overlay" />
        <div className="hero-content page-width">
          <p className="eyebrow hero-eyebrow">{t.eyebrow}</p>
          <h1>{t.heroTitle}</h1>
          <p className="hero-copy">{t.heroBody}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#catalog">
              <Bike aria-hidden="true" size={20} /> {t.explore}
            </a>
            <a className="button button-light" href={`https://wa.me/${PRIMARY_PHONE.slice(1)}`} target="_blank" rel="noreferrer">
              <MessageCircle aria-hidden="true" size={20} /> {t.whatsapp}
            </a>
          </div>
          <a className="location-link" href={MAPS_URL} target="_blank" rel="noreferrer">
            <MapPin aria-hidden="true" size={17} /> {t.addressShort}
          </a>
        </div>
      </section>

      <section className="trust-strip" aria-label="Store highlights">
        <div className="page-width trust-grid">
          {t.trust.map((item, index) => {
            const Icon = [Bike, PackageOpen, Wrench][index];
            return <div className="trust-item" key={item}><Icon aria-hidden="true" size={20} /><span>{item}</span></div>;
          })}
        </div>
      </section>

      <section className="category-section page-width" id="cycles">
        <div className="section-intro split-intro">
          <div><p className="eyebrow">{t.categoryEyebrow}</p><h2>{t.categoryTitle}</h2></div>
          <p>{t.categoryBody}</p>
        </div>
        <div className="category-grid">
          {t.categories.map((category, index) => {
            const Icon = categoryIcons[index];
            return (
              <button
                className={`category-card ${categoryStyles[index]}`}
                key={category.key}
                onClick={() => {
                  setFilter(category.key === "accessories" ? "accessories" : category.key as Filter);
                  document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
                }}
                type="button"
              >
                <span className="category-icon"><Icon aria-hidden="true" size={27} /></span>
                <span><strong>{category.title}</strong><small>{category.body}</small></span>
                <ChevronRight className="category-arrow" aria-hidden="true" size={22} />
              </button>
            );
          })}
        </div>
      </section>

      <section className="catalog-section" id="catalog">
        <div className="page-width">
          <div className="section-intro catalog-intro">
            <div><p className="eyebrow">{t.catalogEyebrow}</p><h2>{t.catalogTitle}</h2></div>
            <p>{t.catalogBody}</p>
          </div>
          <div className="filter-row" role="group" aria-label="Product categories">
            {(Object.keys(t.filters) as Filter[]).map((key) => (
              <button key={key} className={filter === key ? "filter-chip active" : "filter-chip"} onClick={() => setFilter(key)} type="button" aria-pressed={filter === key}>
                {t.filters[key]}
              </button>
            ))}
          </div>

          {visibleProducts.length ? (
            <div className="product-grid">
              {visibleProducts.map((product) => {
                const name = language === "kn" && product.name_kn ? product.name_kn : product.name_en;
                const description = language === "kn" && product.description_kn ? product.description_kn : product.description_en;
                const message = encodeURIComponent(`Hello Santosh Cycles, I am interested in ${product.name_en}. Please share the exact price and availability.`);
                return (
                  <article className="product-card" key={product.id}>
                    <div className="product-image">
                      {product.image_url ? (
                        <Image src={product.image_url} alt={name} fill sizes="(max-width: 719px) 82vw, (max-width: 1100px) 45vw, 30vw" />
                      ) : <Bike aria-hidden="true" size={62} />}
                      {product.is_featured && <span className="featured-badge">Featured</span>}
                    </div>
                    <div className="product-content">
                      <p className="product-meta">{product.brand ?? t.filters[product.category]}{product.wheel_size ? ` · ${product.wheel_size}` : ""}</p>
                      <h3>
                        <Link aria-label={`View details for ${name}`} href={`/products/${encodeURIComponent(product.slug)}`}>
                          {name}<ChevronRight aria-hidden="true" size={16} />
                        </Link>
                      </h3>
                      {description && <p className="product-description">{description}</p>}
                      <div className="product-footer">
                        <strong>{t.exactPrice}</strong>
                        <a href={`https://wa.me/${PRIMARY_PHONE.slice(1)}?text=${message}`} target="_blank" rel="noreferrer">{t.enquire}</a>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="empty-catalog">
              <div className="empty-icon"><PackageOpen aria-hidden="true" size={34} /></div>
              <div><h3>{t.emptyTitle}</h3><p>{t.emptyBody}</p></div>
              <a className="button button-dark" href={`https://wa.me/${PRIMARY_PHONE.slice(1)}`} target="_blank" rel="noreferrer">
                <MessageCircle aria-hidden="true" size={19} /> {t.askStock}
              </a>
            </div>
          )}
        </div>
      </section>

      <section className="repairs-section" id="repairs">
        <div className="repair-image">
          <Image src="https://images.pexels.com/photos/132682/pexels-photo-132682.jpeg?auto=compress&cs=tinysrgb&w=1400" alt="A cycle being repaired in a workshop" fill sizes="(max-width: 899px) 100vw, 50vw" />
        </div>
        <div className="repair-content">
          <p className="eyebrow light-eyebrow">{t.repairsEyebrow}</p>
          <h2>{t.repairsTitle}</h2>
          <p className="repair-copy">{t.repairsBody}</p>
          <ul>
            {t.repairItems.map((item) => <li key={item}><CheckCircle2 aria-hidden="true" size={19} />{item}</li>)}
          </ul>
          <a className="button button-light repair-button" href={`tel:${PRIMARY_PHONE}`}><Phone aria-hidden="true" size={19} />{t.callRepair}</a>
        </div>
      </section>

      <section className="why-section page-width">
        <div className="section-intro"><p className="eyebrow">{t.whyEyebrow}</p><h2>{t.whyTitle}</h2></div>
        <div className="reason-grid">
          {t.reasons.map((reason, index) => {
            const Icon = [ShieldCheck, PackageOpen, MapPin][index];
            return <article className="reason-card" key={reason.title}><span><Icon aria-hidden="true" size={24} /></span><h3>{reason.title}</h3><p>{reason.body}</p></article>;
          })}
        </div>
      </section>

      <section className="visit-section" id="visit">
        <div className="page-width visit-grid">
          <div className="visit-heading"><p className="eyebrow light-eyebrow">{t.visitEyebrow}</p><h2>{t.visitTitle}</h2><a className="map-link" href={MAPS_URL} target="_blank" rel="noreferrer"><MapPin aria-hidden="true" size={20} />{t.directions}<ChevronRight aria-hidden="true" size={18} /></a></div>
          <div className="visit-card">
            <div className="visit-card-title"><Clock3 aria-hidden="true" size={22} /><h3>{t.hours}</h3></div>
            <p>{t.morning}</p><p className="lunch-note">{t.lunch}</p><p>{t.evening}</p>
          </div>
          <div className="visit-card">
            <div className="visit-card-title"><Phone aria-hidden="true" size={22} /><h3>{t.phones}</h3></div>
            <a href={`tel:${PRIMARY_PHONE}`}><small>{t.primary}</small>99001 38902</a>
            <a href={`tel:${SECONDARY_PHONE}`}><small>{t.alternate}</small>94803 42035</a>
          </div>
        </div>
      </section>

      <section className="final-cta page-width">
        <div><p className="eyebrow">Santosh Cycles</p><h2>{t.finalTitle}</h2><p>{t.finalBody}</p></div>
        <a className="button button-primary" href={`https://wa.me/${PRIMARY_PHONE.slice(1)}`} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" size={20} />{t.messageNow}</a>
      </section>

      <footer className="site-footer"><div className="page-width footer-content"><a className="wordmark footer-wordmark" href="#top">SANTOSH <span>CYCLES</span></a><p>{t.footer}</p></div></footer>

      <nav className="mobile-actions" aria-label="Quick contact">
        <a href={`tel:${PRIMARY_PHONE}`}><Phone aria-hidden="true" size={17} />{t.call}</a>
        <a href={`https://wa.me/${PRIMARY_PHONE.slice(1)}`} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" size={17} />{t.quickWhatsApp}</a>
        <a href={MAPS_URL} target="_blank" rel="noreferrer"><MapPin aria-hidden="true" size={17} />{t.quickDirections}</a>
      </nav>
    </main>
  );
}
