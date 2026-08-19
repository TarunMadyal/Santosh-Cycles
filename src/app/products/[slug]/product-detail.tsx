"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bike,
  ChevronLeft,
  ChevronRight,
  Languages,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ProductDetails, ProductImage } from "@/lib/products";

const PRIMARY_PHONE = "+919900138902";
const MAPS_URL = "https://maps.app.goo.gl/7pkGdu4PisML9RVV9";
const LANGUAGE_STORAGE_KEY = "santosh-cycles-language:v1";
const LANGUAGE_CHANGE_EVENT = "santosh-cycles-language-change";

const detailCopy = {
  en: {
    language: "ಕನ್ನಡ",
    languageLabel: "Switch product page to Kannada",
    back: "Back to all products",
    available: "Available at Santosh Cycles",
    exactPrice: "WhatsApp us for exact price",
    enquire: "Ask on WhatsApp",
    call: "Call the store",
    details: "Product details",
    brand: "Brand",
    category: "Category",
    wheel: "Wheel size",
    visit: "See it at our MG Road store in Haveri",
    support: "Assembly, fitting guidance and complete repair support available in store.",
    gallery: "Product photo",
    categories: {
      baby: "Baby cycles",
      kids: "Kids & teens",
      adult: "Adult cycles",
      geared: "Geared cycles",
      accessories: "Accessories",
      "spare-parts": "Spare parts",
    },
  },
  kn: {
    language: "English",
    languageLabel: "ಉತ್ಪನ್ನ ಪುಟವನ್ನು ಇಂಗ್ಲಿಷ್‌ಗೆ ಬದಲಿಸಿ",
    back: "ಎಲ್ಲಾ ಉತ್ಪನ್ನಗಳಿಗೆ ಹಿಂತಿರುಗಿ",
    available: "ಸಂತೋಷ್ ಸೈಕಲ್ಸ್‌ನಲ್ಲಿ ಲಭ್ಯವಿದೆ",
    exactPrice: "ನಿಖರ ಬೆಲೆಗೆ ವಾಟ್ಸಾಪ್ ಮಾಡಿ",
    enquire: "ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ವಿಚಾರಿಸಿ",
    call: "ಅಂಗಡಿಗೆ ಕರೆ ಮಾಡಿ",
    details: "ಉತ್ಪನ್ನದ ವಿವರಗಳು",
    brand: "ಬ್ರಾಂಡ್",
    category: "ವರ್ಗ",
    wheel: "ವೀಲ್ ಗಾತ್ರ",
    visit: "ಹಾವೇರಿಯ ಎಂ.ಜಿ. ರಸ್ತೆಯ ಅಂಗಡಿಯಲ್ಲಿ ನೋಡಿ",
    support: "ಅಸೆಂಬ್ಲಿ, ಸರಿಯಾದ ಗಾತ್ರದ ಮಾರ್ಗದರ್ಶನ ಮತ್ತು ಸಂಪೂರ್ಣ ರಿಪೇರಿ ಬೆಂಬಲ ಲಭ್ಯವಿದೆ.",
    gallery: "ಉತ್ಪನ್ನದ ಚಿತ್ರ",
    categories: {
      baby: "ಚಿಕ್ಕ ಮಕ್ಕಳ ಸೈಕಲ್‌ಗಳು",
      kids: "ಮಕ್ಕಳು ಮತ್ತು ಹದಿಹರೆಯದವರು",
      adult: "ದೊಡ್ಡವರ ಸೈಕಲ್‌ಗಳು",
      geared: "ಗೇರ್ ಸೈಕಲ್‌ಗಳು",
      accessories: "ಆಕ್ಸೆಸರೀಸ್",
      "spare-parts": "ಬಿಡಿಭಾಗಗಳು",
    },
  },
} as const;

type Language = keyof typeof detailCopy;

function subscribeToLanguage(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(LANGUAGE_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(LANGUAGE_CHANGE_EVENT, onStoreChange);
  };
}

function getLanguageSnapshot(): Language {
  return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === "kn" ? "kn" : "en";
}

function getServerLanguageSnapshot(): Language {
  return "en";
}

function ProductGallery({ images, language, productName }: { images: ProductImage[]; language: Language; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const activeImage = images[activeIndex];

  function move(direction: -1 | 1) {
    if (images.length < 2) return;
    setActiveIndex((current) => (current + direction + images.length) % images.length);
  }

  return (
    <div className="detail-gallery">
      <div
        className="detail-main-image"
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return;
          const distance = event.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1);
          touchStartX.current = null;
        }}
        onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
      >
        {activeImage ? (
          <Image
            alt={(language === "kn" ? activeImage.alt_kn : activeImage.alt_en) || productName}
            fill
            priority
            sizes="(max-width: 899px) 100vw, 52vw"
            src={activeImage.image_url}
          />
        ) : (
          <Bike aria-hidden="true" size={84} />
        )}
        {images.length > 1 && (
          <>
            <button aria-label="Previous photo" className="detail-gallery-arrow detail-gallery-prev" onClick={() => move(-1)} type="button"><ChevronLeft aria-hidden="true" size={22} /></button>
            <button aria-label="Next photo" className="detail-gallery-arrow detail-gallery-next" onClick={() => move(1)} type="button"><ChevronRight aria-hidden="true" size={22} /></button>
            <span className="detail-image-count">{activeIndex + 1} / {images.length}</span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="detail-thumbnails" aria-label="Product photos">
          {images.map((image, index) => (
            <button
              aria-label={`${detailCopy[language].gallery} ${index + 1}`}
              aria-pressed={activeIndex === index}
              className={activeIndex === index ? "active" : ""}
              key={image.id}
              onClick={() => setActiveIndex(index)}
              type="button"
            >
              <Image alt="" fill sizes="78px" src={image.image_url} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductDetail({ product }: { product: ProductDetails }) {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    getServerLanguageSnapshot,
  );
  const t = detailCopy[language];
  const name = language === "kn" && product.name_kn ? product.name_kn : product.name_en;
  const description = language === "kn" && product.description_kn ? product.description_kn : product.description_en;
  const whatsappMessage = encodeURIComponent(
    `Hello Santosh Cycles, I am interested in ${product.name_en}. Please share the exact price and availability.`,
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  function toggleLanguage() {
    const next = language === "en" ? "kn" : "en";
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
    window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
  }

  return (
    <main className="detail-shell">
      <header className="site-header detail-header">
        <Link className="wordmark" href="/">SANTOSH <span>CYCLES</span></Link>
        <button className="language-toggle" onClick={toggleLanguage} type="button" aria-label={t.languageLabel}>
          <Languages aria-hidden="true" size={18} />{t.language}
        </button>
      </header>

      <div className="detail-page-width">
        <Link className="detail-back-link" href="/#catalog"><ArrowLeft aria-hidden="true" size={18} />{t.back}</Link>

        <section className="detail-product-grid">
          <ProductGallery images={product.images} language={language} productName={name} />

          <div className="detail-product-info">
            <p className="detail-availability"><ShieldCheck aria-hidden="true" size={17} />{t.available}</p>
            <h1>{name}</h1>
            <p className="detail-product-meta">{product.brand ?? t.categories[product.category]}{product.wheel_size ? ` · ${product.wheel_size}` : ""}</p>
            {description && <p className="detail-description">{description}</p>}
            <p className="detail-price">{t.exactPrice}</p>

            <div className="detail-actions">
              <a className="button button-primary" href={`https://wa.me/${PRIMARY_PHONE.slice(1)}?text=${whatsappMessage}`} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" size={20} />{t.enquire}</a>
              <a className="button detail-call-button" href={`tel:${PRIMARY_PHONE}`}><Phone aria-hidden="true" size={19} />{t.call}</a>
            </div>

            <div className="detail-spec-panel">
              <h2>{t.details}</h2>
              <dl>
                {product.brand && <div><dt>{t.brand}</dt><dd>{product.brand}</dd></div>}
                <div><dt>{t.category}</dt><dd>{t.categories[product.category]}</dd></div>
                {product.wheel_size && <div><dt>{t.wheel}</dt><dd>{product.wheel_size}</dd></div>}
              </dl>
            </div>

            <a className="detail-visit-link" href={MAPS_URL} target="_blank" rel="noreferrer"><MapPin aria-hidden="true" size={20} /><span>{t.visit}<small>MG Road, Haveri – 581110</small></span><ChevronRight aria-hidden="true" size={20} /></a>
            <p className="detail-support"><Wrench aria-hidden="true" size={19} />{t.support}</p>
          </div>
        </section>
      </div>

      <nav className="detail-mobile-actions" aria-label="Product contact actions">
        <a href={`tel:${PRIMARY_PHONE}`}><Phone aria-hidden="true" size={18} />{t.call}</a>
        <a href={`https://wa.me/${PRIMARY_PHONE.slice(1)}?text=${whatsappMessage}`} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" size={18} />{t.enquire}</a>
      </nav>
    </main>
  );
}
