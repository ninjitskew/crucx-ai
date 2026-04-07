// Static placeholder. Real success page lives at /checkout/success/?id=<orderId>.
// We keep this directory only because the route was scaffolded earlier.
import Redirect from "./Redirect";

export function generateStaticParams() {
  return [{ orderId: "placeholder" }];
}

export default async function Page({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params;
  return <Redirect orderId={orderId} />;
}
