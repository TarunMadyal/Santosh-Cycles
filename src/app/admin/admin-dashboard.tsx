"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  LoaderCircle,
  LogOut,
  Mail,
  Pencil,
  Plus,
  Save,
  ShieldCheck,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { ProductCategory } from "@/lib/products";
import { getBrowserSupabaseClient } from "@/lib/supabase-browser";

const ADMIN_EMAIL = "tarunmadyal@gmail.com";
const PRODUCT_IMAGE_BUCKET = "product-images";
const MAX_IMAGES_PER_UPLOAD = 8;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const categoryOptions: Array<{ value: ProductCategory; label: string }> = [
  { value: "baby", label: "Baby cycles" },
  { value: "kids", label: "Kids & teens" },
  { value: "adult", label: "Adult cycles" },
  { value: "geared", label: "Geared cycles" },
  { value: "accessories", label: "Accessories" },
  { value: "spare-parts", label: "Spare parts" },
];

type AdminProductImage = {
  id: number;
  product_id: number;
  image_url: string;
  storage_path: string;
  sort_order: number;
  is_primary: boolean;
};

type AdminProduct = {
  id: number;
  slug: string;
  name_en: string;
  name_kn: string | null;
  description_en: string | null;
  description_kn: string | null;
  category: ProductCategory;
  brand: string | null;
  price: number | null;
  image_url: string | null;
  wheel_size: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  images: AdminProductImage[];
};

type ProductDraft = {
  slug: string;
  name_en: string;
  name_kn: string;
  description_en: string;
  description_kn: string;
  category: ProductCategory;
  brand: string;
  price: string;
  wheel_size: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: string;
};

const emptyDraft: ProductDraft = {
  slug: "",
  name_en: "",
  name_kn: "",
  description_en: "",
  description_kn: "",
  category: "kids",
  brand: "",
  price: "",
  wheel_size: "",
  is_featured: false,
  is_active: true,
  sort_order: "0",
};

function toSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function cleanFileName(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const base = toSlug(file.name.replace(/\.[^.]+$/, "")) || "product";
  return `${base}.${extension}`;
}

function formatPrice(value: number | null) {
  if (value === null) return "Price pending";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function productToDraft(product: AdminProduct): ProductDraft {
  return {
    slug: product.slug,
    name_en: product.name_en,
    name_kn: product.name_kn ?? "",
    description_en: product.description_en ?? "",
    description_kn: product.description_kn ?? "",
    category: product.category,
    brand: product.brand ?? "",
    price: product.price === null ? "" : String(product.price),
    wheel_size: product.wheel_size ?? "",
    is_featured: product.is_featured,
    is_active: product.is_active,
    sort_order: String(product.sort_order),
  };
}

export function AdminDashboard() {
  const supabase = useMemo(() => getBrowserSupabaseClient(), []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [loginSent, setLoginSent] = useState(false);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [draft, setDraft] = useState<ProductDraft>(emptyDraft);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoadingProducts(true);

    const [productsResult, imagesResult] = await Promise.all([
      supabase
        .from("products")
        .select(
          "id,slug,name_en,name_kn,description_en,description_kn,category,brand,price,image_url,wheel_size,is_featured,is_active,sort_order",
        )
        .order("is_featured", { ascending: false })
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false }),
      supabase
        .from("product_images")
        .select("id,product_id,image_url,storage_path,sort_order,is_primary")
        .order("is_primary", { ascending: false })
        .order("sort_order", { ascending: true }),
    ]);

    if (productsResult.error) {
      setError(productsResult.error.message);
      setLoadingProducts(false);
      return;
    }

    if (imagesResult.error) {
      setError(imagesResult.error.message);
      setLoadingProducts(false);
      return;
    }

    const images = (imagesResult.data ?? []) as AdminProductImage[];
    setProducts(
      (productsResult.data ?? []).map((product) => ({
        ...product,
        category: product.category as ProductCategory,
        price: product.price === null ? null : Number(product.price),
        images: images.filter((image) => image.product_id === product.id),
      })) as AdminProduct[],
    );
    setLoadingProducts(false);
  }, [supabase]);

  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      const nextUser = data.user ?? null;
      setUser(nextUser);
      if (nextUser?.email?.toLowerCase() === ADMIN_EMAIL) void loadProducts();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      if (nextUser?.email?.toLowerCase() === ADMIN_EMAIL) void loadProducts();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [loadProducts, supabase]);

  const isAdmin = user?.email?.toLowerCase() === ADMIN_EMAIL;

  async function requestLogin() {
    setBusy(true);
    setError(null);
    setNotice(null);

    const { error: loginError } = await supabase.auth.signInWithOtp({
      email: ADMIN_EMAIL,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/admin`,
      },
    });

    if (loginError) setError(loginError.message);
    else setLoginSent(true);
    setBusy(false);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setProducts([]);
    setDraft(emptyDraft);
    setEditingId(null);
  }

  function resetEditor() {
    setDraft(emptyDraft);
    setEditingId(null);
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function startEditing(product: AdminProduct) {
    setDraft(productToDraft(product));
    setEditingId(product.id);
    setSelectedFiles([]);
    setNotice(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    document.getElementById("product-editor")?.scrollIntoView({ behavior: "smooth" });
  }

  function updateDraft<Key extends keyof ProductDraft>(key: Key, value: ProductDraft[Key]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function handleFiles(files: FileList | null) {
    const nextFiles = Array.from(files ?? []);
    setError(null);

    if (nextFiles.length > MAX_IMAGES_PER_UPLOAD) {
      setSelectedFiles([]);
      setError(`Choose up to ${MAX_IMAGES_PER_UPLOAD} photos at a time.`);
      return;
    }

    const invalid = nextFiles.find(
      (file) =>
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > MAX_IMAGE_BYTES,
    );

    if (invalid) {
      setSelectedFiles([]);
      setError("Each photo must be JPG, PNG or WebP and no larger than 5 MB.");
      return;
    }

    setSelectedFiles(nextFiles);
  }

  async function uploadImages(product: AdminProduct, files: File[]) {
    const uploadedPaths: string[] = [];
    const rows: Array<{
      product_id: number;
      image_url: string;
      storage_path: string;
      alt_en: string;
      alt_kn: string | null;
      sort_order: number;
      is_primary: boolean;
    }> = [];
    const startingOrder = product.images.length;

    try {
      for (const [index, file] of files.entries()) {
        const storagePath = `catalog/${product.slug}/${crypto.randomUUID()}-${cleanFileName(file)}`;
        const { error: uploadError } = await supabase.storage
          .from(PRODUCT_IMAGE_BUCKET)
          .upload(storagePath, file, {
            cacheControl: "3600",
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) throw uploadError;
        uploadedPaths.push(storagePath);

        const { data: publicUrlData } = supabase.storage
          .from(PRODUCT_IMAGE_BUCKET)
          .getPublicUrl(storagePath);

        rows.push({
          product_id: product.id,
          image_url: publicUrlData.publicUrl,
          storage_path: storagePath,
          alt_en: product.name_en,
          alt_kn: product.name_kn,
          sort_order: startingOrder + index,
          is_primary: product.images.length === 0 && index === 0,
        });
      }

      if (rows.length) {
        const { error: rowsError } = await supabase.from("product_images").insert(rows);
        if (rowsError) throw rowsError;

        if (!product.image_url) {
          const { error: coverError } = await supabase
            .from("products")
            .update({ image_url: rows[0].image_url, updated_at: new Date().toISOString() })
            .eq("id", product.id);
          if (coverError) throw coverError;
        }
      }
    } catch (uploadError) {
      if (uploadedPaths.length) {
        await supabase.from("product_images").delete().in("storage_path", uploadedPaths);
        await supabase.storage.from(PRODUCT_IMAGE_BUCKET).remove(uploadedPaths);
      }
      throw uploadError;
    }
  }

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);

    const slug = draft.slug || toSlug(draft.name_en);
    if (!slug) {
      setError("Enter an English product name so a product link can be created.");
      setBusy(false);
      return;
    }

    const payload = {
      slug,
      name_en: draft.name_en.trim(),
      name_kn: draft.name_kn.trim() || null,
      description_en: draft.description_en.trim() || null,
      description_kn: draft.description_kn.trim() || null,
      category: draft.category,
      brand: draft.brand.trim() || null,
      price: draft.price === "" ? null : Number(draft.price),
      wheel_size: draft.wheel_size.trim() || null,
      is_featured: draft.is_featured,
      is_active: draft.is_active,
      sort_order: Number(draft.sort_order || 0),
      updated_at: new Date().toISOString(),
    };

    let savedProduct: AdminProduct | null = null;
    let createdProductId: number | null = null;

    try {
      if (editingId) {
        const { data, error: updateError } = await supabase
          .from("products")
          .update(payload)
          .eq("id", editingId)
          .select(
            "id,slug,name_en,name_kn,description_en,description_kn,category,brand,price,image_url,wheel_size,is_featured,is_active,sort_order",
          )
          .single();
        if (updateError) throw updateError;

        const existing = products.find((product) => product.id === editingId);
        savedProduct = {
          ...data,
          category: data.category as ProductCategory,
          price: data.price === null ? null : Number(data.price),
          images: existing?.images ?? [],
        } as AdminProduct;
      } else {
        const { data, error: insertError } = await supabase
          .from("products")
          .insert(payload)
          .select(
            "id,slug,name_en,name_kn,description_en,description_kn,category,brand,price,image_url,wheel_size,is_featured,is_active,sort_order",
          )
          .single();
        if (insertError) throw insertError;

        createdProductId = data.id;
        savedProduct = {
          ...data,
          category: data.category as ProductCategory,
          price: data.price === null ? null : Number(data.price),
          images: [],
        } as AdminProduct;
      }

      if (savedProduct && selectedFiles.length) {
        await uploadImages(savedProduct, selectedFiles);
      }

      setNotice(editingId ? "Product updated successfully." : "Product published successfully.");
      resetEditor();
      await loadProducts();
    } catch (saveError) {
      if (createdProductId) {
        await supabase.from("products").delete().eq("id", createdProductId);
      }
      setError(saveError instanceof Error ? saveError.message : "The product could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  if (user === undefined) {
    return (
      <main className="admin-shell admin-centered">
        <LoaderCircle className="admin-spinner" aria-hidden="true" size={34} />
        <p>Checking secure access…</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="admin-shell admin-centered">
        <section className="admin-login-card">
          <Link className="admin-back-link" href="/">
            <ArrowLeft aria-hidden="true" size={18} /> Back to the website
          </Link>
          <div className="admin-login-icon"><ShieldCheck aria-hidden="true" size={30} /></div>
          <p className="admin-eyebrow">Santosh Cycles</p>
          <h1>Catalogue admin</h1>
          <p>Add product details and several photos from your phone. No image URLs need to be copied.</p>
          <div className="admin-email"><Mail aria-hidden="true" size={18} />{ADMIN_EMAIL}</div>
          {loginSent ? (
            <div className="admin-success-message">
              <CheckCircle2 aria-hidden="true" size={21} />
              <span>Check your inbox and open the secure sign-in link.</span>
            </div>
          ) : (
            <button className="admin-primary-button" disabled={busy} onClick={requestLogin} type="button">
              {busy ? <LoaderCircle className="admin-spinner" aria-hidden="true" size={19} /> : <Mail aria-hidden="true" size={19} />}
              Email me a sign-in link
            </button>
          )}
          {error && <p className="admin-error" role="alert">{error}</p>}
        </section>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="admin-shell admin-centered">
        <section className="admin-login-card">
          <div className="admin-login-icon"><ShieldCheck aria-hidden="true" size={30} /></div>
          <h1>Access not allowed</h1>
          <p>This account cannot manage the Santosh Cycles catalogue.</p>
          <button className="admin-secondary-button" onClick={signOut} type="button">
            <LogOut aria-hidden="true" size={18} /> Sign out
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <Link className="wordmark" href="/">SANTOSH <span>CYCLES</span></Link>
        <div className="admin-header-actions">
          <Link href="/">View website</Link>
          <button onClick={signOut} type="button"><LogOut aria-hidden="true" size={17} /> Sign out</button>
        </div>
      </header>

      <div className="admin-page-width">
        <section className="admin-intro">
          <p className="admin-eyebrow">Secure catalogue manager</p>
          <h1>Products and photos</h1>
          <p>Choose several images together. They upload and connect to the product automatically.</p>
        </section>

        <section className="admin-panel" id="product-editor">
          <div className="admin-panel-heading">
            <div>
              <p className="admin-eyebrow">{editingId ? "Editing product" : "New product"}</p>
              <h2>{editingId ? draft.name_en : "Add to the catalogue"}</h2>
            </div>
            {editingId && <button className="admin-text-button" onClick={resetEditor} type="button"><Plus aria-hidden="true" size={17} /> New product</button>}
          </div>

          <form className="admin-product-form" onSubmit={saveProduct}>
            <div className="admin-form-grid">
              <label>
                <span>English name *</span>
                <input required value={draft.name_en} onChange={(event) => {
                  const name = event.target.value;
                  setDraft((current) => ({
                    ...current,
                    name_en: name,
                    slug: editingId ? current.slug : toSlug(name),
                  }));
                }} placeholder="Example: Hercules Roadeo 26" />
              </label>
              <label>
                <span>Kannada name</span>
                <input value={draft.name_kn} onChange={(event) => updateDraft("name_kn", event.target.value)} placeholder="ಕನ್ನಡ ಹೆಸರು" />
              </label>
              <label>
                <span>Brand</span>
                <input value={draft.brand} onChange={(event) => updateDraft("brand", event.target.value)} placeholder="Example: Hercules" />
              </label>
              <label>
                <span>Category *</span>
                <select required value={draft.category} onChange={(event) => updateDraft("category", event.target.value as ProductCategory)}>
                  {categoryOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <label>
                <span>Price (₹)</span>
                <input min="0" inputMode="decimal" type="number" value={draft.price} onChange={(event) => updateDraft("price", event.target.value)} placeholder="3899" />
              </label>
              <label>
                <span>Wheel size</span>
                <input value={draft.wheel_size} onChange={(event) => updateDraft("wheel_size", event.target.value)} placeholder="Example: 20 inch" />
              </label>
              <label className="admin-full-field">
                <span>English description</span>
                <textarea rows={3} value={draft.description_en} onChange={(event) => updateDraft("description_en", event.target.value)} placeholder="Short product description" />
              </label>
              <label className="admin-full-field">
                <span>Kannada description</span>
                <textarea rows={3} value={draft.description_kn} onChange={(event) => updateDraft("description_kn", event.target.value)} placeholder="ಕನ್ನಡ ವಿವರಣೆ" />
              </label>
              <label>
                <span>Product link</span>
                <input required value={draft.slug} onChange={(event) => updateDraft("slug", toSlug(event.target.value))} placeholder="product-name" />
              </label>
              <label>
                <span>Display order</span>
                <input inputMode="numeric" type="number" value={draft.sort_order} onChange={(event) => updateDraft("sort_order", event.target.value)} />
              </label>
            </div>

            <label className="admin-upload-field">
              <ImagePlus aria-hidden="true" size={28} />
              <span><strong>{editingId ? "Add more photos" : "Choose product photos"}</strong><small>Up to 8 JPG, PNG or WebP images · 5 MB each</small></span>
              <input accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => handleFiles(event.target.files)} ref={fileInputRef} type="file" />
            </label>
            {selectedFiles.length > 0 && (
              <p className="admin-file-summary">{selectedFiles.length} photo{selectedFiles.length === 1 ? "" : "s"} selected: {selectedFiles.map((file) => file.name).join(", ")}</p>
            )}

            <div className="admin-check-row">
              <label><input checked={draft.is_active} onChange={(event) => updateDraft("is_active", event.target.checked)} type="checkbox" /> Show on website</label>
              <label><input checked={draft.is_featured} onChange={(event) => updateDraft("is_featured", event.target.checked)} type="checkbox" /> Feature this product</label>
            </div>

            {error && <p className="admin-error" role="alert">{error}</p>}
            {notice && <p className="admin-success-message" role="status"><CheckCircle2 aria-hidden="true" size={20} />{notice}</p>}

            <div className="admin-form-actions">
              <button className="admin-primary-button" disabled={busy} type="submit">
                {busy ? <LoaderCircle className="admin-spinner" aria-hidden="true" size={19} /> : <Save aria-hidden="true" size={19} />}
                {editingId ? "Save changes" : "Publish product"}
              </button>
              {editingId && <button className="admin-secondary-button" onClick={resetEditor} type="button">Cancel</button>}
            </div>
          </form>
        </section>

        <section className="admin-products-section">
          <div className="admin-panel-heading">
            <div><p className="admin-eyebrow">Current catalogue</p><h2>{products.length} product{products.length === 1 ? "" : "s"}</h2></div>
          </div>

          {loadingProducts ? (
            <div className="admin-loading-row"><LoaderCircle className="admin-spinner" aria-hidden="true" size={24} /> Loading products…</div>
          ) : (
            <div className="admin-products-grid">
              {products.map((product) => (
                <article className="admin-product-card" key={product.id}>
                  <div className="admin-product-thumb">
                    {product.image_url ? <Image alt={product.name_en} fill sizes="120px" src={product.image_url} /> : <ImagePlus aria-hidden="true" size={32} />}
                  </div>
                  <div className="admin-product-info">
                    <div className="admin-product-status"><span className={product.is_active ? "is-live" : "is-hidden"}>{product.is_active ? "Live" : "Hidden"}</span><span>{product.images.length} photo{product.images.length === 1 ? "" : "s"}</span></div>
                    <h3>{product.name_en}</h3>
                    <p>{product.brand ?? categoryOptions.find((option) => option.value === product.category)?.label} · {formatPrice(product.price)}</p>
                  </div>
                  <button className="admin-edit-button" onClick={() => startEditing(product)} type="button"><Pencil aria-hidden="true" size={17} /> Edit</button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
