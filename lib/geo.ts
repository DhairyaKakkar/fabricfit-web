// Detects if the request is from India to route to Razorpay instead of Stripe.
// Uses Vercel's geo headers in production; falls back to 'international'.
export function getGateway(headers: Headers): 'razorpay' | 'stripe' {
  const country =
    headers.get('x-vercel-ip-country') ??
    headers.get('cf-ipcountry') ??
    '';
  return country.toUpperCase() === 'IN' ? 'razorpay' : 'stripe';
}
