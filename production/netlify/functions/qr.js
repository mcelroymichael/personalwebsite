// netlify/functions/qr.js (CommonJS for Netlify Functions)
const crypto = require("crypto");

exports.handler = async (event) => {
  const qs = event.queryStringParameters || {};
  const headers = event.headers || {};

  // Best source of client IP on Netlify, with fallbacks
  const ip =
    headers["x-nf-client-connection-ip"] ||
    (headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    "unknown";

  const ua = headers["user-agent"] || "";
  const referer = headers["referer"] || "";
  const campaign = qs.campaign || "unknown";
  const ts = new Date().toISOString();

  // OPTIONAL: hash the IP for privacy (recommended)
  // If you truly need the raw IP, store `ip` instead of `ipHash`.
  const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

  // ---- LOG IT ----
  // 1) Minimal: send to function logs (visible in Netlify > Sites > Functions > qr)
  console.log(
    JSON.stringify({ ts, campaign, ipHash, ua, referer }, null, 0)
  );

  // 2) (Optional) Send to an external DB (e.g., Supabase, PlanetScale, DynamoDB)
  //    Uncomment and adapt:
  // await fetch(process.env.LOG_ENDPOINT, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.LOG_TOKEN}` },
  //   body: JSON.stringify({ ts, campaign, ipHash, ua, referer })
  // });

  // Map each campaign to its final destination
  const destinations = {
    "BUSINESS_CARD": "https://mcelroymichael.com/",
    // add more here…
  };

  const dest = destinations[campaign] || "https://mcelroymichael.com/";
  return {
    statusCode: 302,
    headers: {
      Location: dest,
      "Cache-Control": "no-store",
    },
  };
};
