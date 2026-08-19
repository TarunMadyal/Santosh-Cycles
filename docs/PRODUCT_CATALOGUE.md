# Updating the Santosh Cycles catalogue

Products are managed from the website and appear in the catalogue automatically.

1. Open [santosh-cycles-seven.vercel.app/admin](https://santosh-cycles-seven.vercel.app/admin).
2. Select **Email me a sign-in link**. Only `tarunmadyal@gmail.com` can manage the catalogue.
3. Open the link sent by Supabase, then select **Add product**.
4. Enter the English details and optional Kannada details.
5. Select up to eight JPG, PNG or WebP photos, each no larger than 5 MB.
6. Select **Add product**. The images are uploaded and linked automatically; no public URLs need to be copied.

Use a short lowercase slug such as `hercules-roadeo-26-red`. Exact prices are currently hidden from the public catalogue, so the price field can be left blank. Turn off **Visible on website** when a product should temporarily disappear. Existing products can be edited and given more photos from the same page.

The homepage refreshes its catalogue within about one minute. Each product also has a dedicated, shareable page with a swipeable photo gallery.

## One-time Supabase Auth setting

In **Supabase → Authentication → URL Configuration**, use:

- Site URL: `https://santosh-cycles-seven.vercel.app`
- Redirect URL: `https://santosh-cycles-seven.vercel.app/admin`

This allows the passwordless sign-in email to return to the catalogue editor.
