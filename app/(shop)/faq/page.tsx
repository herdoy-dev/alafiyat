import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do I place an order?",
    a: "Browse our products, add items to your cart, and proceed to checkout. Fill in your shipping details, choose a payment method (Cash on Delivery or mobile banking), and submit your order. We'll confirm by phone before dispatching.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Cash on Delivery (COD) and mobile banking payments via bKash, Nagad, Rocket, and Upay. For mobile banking, send payment to the number shown at checkout and enter your transaction ID.",
  },
  {
    q: "How long does delivery take?",
    a: "Inside Dhaka: 1-2 business days. Outside Dhaka: 3-5 business days. We dispatch orders with Pathao and Steadfast couriers. You'll receive a tracking number via SMS once your order is shipped.",
  },
  {
    q: "How can I track my order?",
    a: "Visit our Order Tracking page and enter your phone number along with your order ID. You'll see the current status of your order including courier tracking information.",
  },
  {
    q: "What is your return policy?",
    a: "We offer a 7-day return policy from the date of delivery. If you're not satisfied with your purchase, contact us through the Complaints page or WhatsApp. The product must be in its original condition with packaging intact.",
  },
  {
    q: "Do you offer free shipping?",
    a: "Shipping costs are calculated based on your location and order size. Check our announcement banner for any ongoing free shipping promotions.",
  },
  {
    q: "Can I cancel my order?",
    a: "You can cancel your order before it's dispatched by contacting us via WhatsApp or the Complaints page. Once the order has been sent to the courier, cancellation may not be possible.",
  },
  {
    q: "Do you have a physical store?",
    a: "We are currently an online-only store. All orders are processed and shipped from our warehouse in Dhaka.",
  },
  {
    q: "How do I use a coupon code?",
    a: "During checkout, you'll see a coupon code input in the order summary section. Enter your code and click Apply. The discount will be calculated and shown before you place your order.",
  },
  {
    q: "What if I receive a damaged product?",
    a: "If your product arrives damaged, please submit a complaint through our Complaints page with photos of the damage. We'll arrange a replacement or refund within 48 hours.",
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <header className="mb-10 flex flex-col gap-1 md:mb-12">
        <p className="font-display text-sm italic text-muted-foreground">
          Got questions?
        </p>
        <h1 className="font-display text-4xl leading-[1.05] tracking-tight md:text-6xl">
          Frequently <em className="font-display italic">asked</em>
        </h1>
      </header>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="rounded-2xl border border-border/60 bg-card px-6 shadow-xs"
          >
            <AccordionTrigger className="py-5 text-left font-display text-base tracking-tight hover:no-underline [&[data-state=open]]:text-primary">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
