# Updating the Santosh Cycles catalogue

Products are managed in Supabase and appear on the website automatically.

1. Open Supabase Studio and select the **Santosh Cycles** project.
2. Upload the product photo to **Storage → product-images**.
3. Copy the photo's public URL.
4. Open **Table Editor → products → Insert row**.
5. Enter the English name, optional Kannada name, category, price, photo URL and any other details.
6. Keep `is_active` enabled, then save. The website refreshes its catalogue within about one minute.

Use a short lowercase slug such as `hercules-roadeo-26-red`. Prices should be entered as numbers without the ₹ symbol. Turn off `is_active` when a product should temporarily disappear from the website.
