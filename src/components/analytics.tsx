export const Analytics = () => (
  <script
    defer
    data-website-id={process.env.NEXT_PUBLIC_UMAMI_SITE_ID}
    src={process.env.NEXT_PUBLIC_UMAMI_URL}
  />
);
