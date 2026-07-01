"use client";

import { FormEvent, useEffect, useState } from "react";
import AppImage from "@/components/AppImage";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import BankTransferPaymentPanel from "@/components/checkout/BankTransferPaymentPanel";
import { useCart } from "@/store/CartContext";
import { getPublicSettings, submitOrder, type PublicPaymentSettings } from "@/lib/api";
import { formatShopPrice } from "@/services/shop-products";

const pakistanStates = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Balochistan",
  "Islamabad Capital Territory",
  "Gilgit-Baltistan",
  "Azad Jammu and Kashmir",
] as const;

type CheckoutForm = {
  firstName: string;
  lastName: string;
  company: string;
  country: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  phone: string;
  email: string;
  orderNotes: string;
};

const initialForm: CheckoutForm = {
  firstName: "",
  lastName: "",
  company: "",
  country: "Pakistan",
  address1: "",
  address2: "",
  city: "",
  state: "Punjab",
  postcode: "",
  phone: "",
  email: "",
  orderNotes: "",
};

type PaymentMethod = "cod" | "bank_transfer";

function mapPaymentMethod(method: PaymentMethod): string {
  return method === "cod" ? "cash_on_delivery" : "direct_bank_transfer";
}

function formatLineItem(name: string, weight?: string, quantity?: number) {
  const label = weight ? `${name} - ${weight}` : name;
  return `${label} × ${quantity ?? 1}`;
}

const DEFAULT_PAYMENT_SETTINGS: PublicPaymentSettings = {
  jazzCash: true,
  easyPaisa: true,
  bankTransfer: true,
  jazzCashAccount: "03073970850",
  easyPaisaAccount: "03154749309",
  bankName: "MCB",
  bankAccountTitle: "BABER SOHAIL",
  bankAccountNumber: "1436665541000808",
  bankIban: "PK42MUCB1436665541000808",
  paymentInstructions:
    "Transfer the exact order total and upload your payment screenshot or receipt below.",
};

type PendingBankOrder = {
  id: string;
  orderNumber: string;
  total: number;
  email: string;
};

export default function CheckoutPage() {
  const { items, subtotal, itemCount, isHydrated, clearCart } = useCart();
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank_transfer");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [placed, setPlaced] = useState(false);
  const [placedOrderEmail, setPlacedOrderEmail] = useState<string | null>(null);
  const [emailConfirmationSent, setEmailConfirmationSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [paymentSettings, setPaymentSettings] = useState<PublicPaymentSettings>(
    DEFAULT_PAYMENT_SETTINGS,
  );
  const [pendingBankOrder, setPendingBankOrder] = useState<PendingBankOrder | null>(null);
  const [placedOrderNumber, setPlacedOrderNumber] = useState<string | null>(null);
  const [receiptSubmitted, setReceiptSubmitted] = useState(false);

  useEffect(() => {
    getPublicSettings().then((settings) => {
      if (settings?.payments) {
        setPaymentSettings({ ...DEFAULT_PAYMENT_SETTINGS, ...settings.payments });
      }
    });
  }, []);

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!agreedToTerms) {
      setTermsError("You must agree to the terms and conditions to place your order.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    setTermsError(null);

    const { data: order, error } = await submitOrder({
      customerInfo: {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        name: `${form.firstName} ${form.lastName}`.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: {
          company: form.company.trim(),
          address1: form.address1.trim(),
          address2: form.address2.trim(),
          city: form.city.trim(),
          state: form.state,
          postcode: form.postcode.trim(),
          country: form.country,
        },
      },
      items: items.map((item) => ({
        name: item.name,
        slug: item.slug,
        image: item.image,
        weight: item.weight,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        lineTotal: Number(item.unitPrice) * Number(item.quantity),
      })),
      subtotal: Number(subtotal),
      shippingCost: 0,
      tax: 0,
      discount: 0,
      total: Number(subtotal),
      paymentMethod: mapPaymentMethod(paymentMethod),
      notes: form.orderNotes.trim() || undefined,
      couponCode: couponCode.trim() || undefined,
    });

    setSubmitting(false);

    if (!order) {
      setSubmitError(
        error ??
          "Could not place your order. Please try again or contact us.",
      );
      return;
    }

    clearCart();

    if (paymentMethod === "bank_transfer" || order.requiresPaymentReceipt) {
      const orderId = String(order.id ?? order._id ?? "");
      if (!orderId) {
        setSubmitError("Order was created but payment could not be started. Please contact support.");
        return;
      }

      setPendingBankOrder({
        id: orderId,
        orderNumber: String(order.orderNumber ?? "—"),
        total: Number(order.total ?? subtotal),
        email: form.email.trim(),
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setPlaced(true);
    setPlacedOrderEmail(form.email.trim());
    setPlacedOrderNumber(String(order.orderNumber ?? ""));
    setEmailConfirmationSent(Boolean(order.emailConfirmationSent));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const completeBankPayment = (result: { emailConfirmationSent?: boolean }) => {
    setPlacedOrderNumber(pendingBankOrder?.orderNumber ?? null);
    setReceiptSubmitted(true);
    setPendingBankOrder(null);
    setPlaced(true);
    setPlacedOrderEmail(form.email.trim());
    setEmailConfirmationSent(Boolean(result.emailConfirmationSent));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isHydrated) {
    return (
      <section className="shop-section py-24 text-center">
        <p className="text-sm text-white/40">Loading checkout…</p>
      </section>
    );
  }

  if (items.length === 0 && !placed && !pendingBankOrder) {
    return (
      <section className="cart-section relative min-h-[calc(100vh-5rem)] overflow-hidden pb-24 pt-8">
        <div className="relative mx-auto max-w-lg px-5 text-center sm:px-8">
          <ShoppingBag className="mx-auto h-12 w-12 text-gold-300/60" strokeWidth={1.25} />
          <h1
            className="mt-6 text-2xl font-semibold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your cart is empty
          </h1>
          <p className="mt-3 text-sm text-white/50">
            Add mangoes to your cart before checkout.
          </p>
          <Link href="/products" className="cart-return-btn mt-8 inline-flex">
            Return to Shop
          </Link>
        </div>
      </section>
    );
  }

  if (placed) {
    return (
      <section className="shop-section relative overflow-hidden pb-24 pt-8 sm:pt-10">
        <div className="relative mx-auto max-w-xl px-5 text-center sm:px-8">
          <motion.div
            className="cart-empty-panel rounded-[1.75rem] px-6 py-12 sm:px-10"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-gold-400/80">
              Order received
            </p>
            <h1
              className="mt-4 text-3xl font-semibold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Thank you!
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/55">
              {placedOrderNumber ? (
                <>
                  Your order <span className="text-gold-300">{placedOrderNumber}</span> has been
                  received. We will contact you at{" "}
                </>
              ) : (
                <>Your order has been placed successfully. We will contact you at </>
              )}
              <span className="text-gold-300">{placedOrderEmail || form.email || form.phone}</span> to
              confirm delivery.
            </p>
            {receiptSubmitted ? (
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                We have received your payment receipt and will verify it before processing your order.
              </p>
            ) : null}
            {emailConfirmationSent && placedOrderEmail ? (
              <p className="mt-3 text-sm leading-relaxed text-gold-300/90">
                A confirmation email has been sent to{" "}
                <span className="font-medium text-gold-300">{placedOrderEmail}</span>.
              </p>
            ) : null}
            <Link href="/products" className="cart-return-btn mt-8 inline-flex">
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  if (pendingBankOrder) {
    return (
      <BankTransferPaymentPanel
        order={pendingBankOrder}
        payments={paymentSettings}
        onComplete={completeBankPayment}
      />
    );
  }

  return (
    <section className="checkout-section relative overflow-hidden pb-24 pt-8 sm:pb-32 sm:pt-10">
      <div className="shop-section-glow pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap items-center gap-2 text-sm text-white/45"
        >
          <Link href="/" className="transition-colors hover:text-gold-300">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-white/25" aria-hidden="true" />
          <Link href="/cart" className="transition-colors hover:text-gold-300">
            Cart
          </Link>
          <ChevronRight className="h-4 w-4 text-white/25" aria-hidden="true" />
          <span className="text-gold-300/80">Checkout</span>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            className="text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Checkout
          </h1>
        </motion.div>

        <div className="checkout-coupon-banner mt-8">
          <Calendar className="h-5 w-5 shrink-0 text-gold-400" strokeWidth={1.5} />
          <p className="text-sm text-white/60">
            Have a coupon?{" "}
            <button
              type="button"
              onClick={() => setShowCoupon((prev) => !prev)}
              className="font-semibold text-gold-300 transition-colors hover:text-gold-200"
            >
              Click here to enter your code
            </button>
          </p>
        </div>

        {showCoupon && (
          <motion.div
            className="mt-4 flex max-w-md flex-col gap-3 sm:flex-row"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
          >
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Coupon code"
              className="checkout-input flex-1"
            />
            <button type="button" className="product-card-cta px-6 py-3">
              Apply
            </button>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-12 xl:grid-cols-[1fr_420px]">
          {/* Billing */}
          <div className="checkout-form-panel space-y-10">
            <div>
              <h2
                className="text-xl font-semibold text-white sm:text-2xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Billing details
              </h2>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="checkout-label" htmlFor="firstName">
                    First name <span className="text-mango-400">*</span>
                  </label>
                  <input
                    id="firstName"
                    required
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    className="checkout-input"
                  />
                </div>
                <div>
                  <label className="checkout-label" htmlFor="lastName">
                    Last name <span className="text-mango-400">*</span>
                  </label>
                  <input
                    id="lastName"
                    required
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    className="checkout-input"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="checkout-label" htmlFor="company">
                  Company name <span className="text-white/35">(optional)</span>
                </label>
                <input
                  id="company"
                  value={form.company}
                  onChange={(e) => updateField("company", e.target.value)}
                  className="checkout-input"
                />
              </div>

              <div className="mt-5">
                <label className="checkout-label" htmlFor="country">
                  Country / Region <span className="text-mango-400">*</span>
                </label>
                <select
                  id="country"
                  required
                  value={form.country}
                  onChange={(e) => updateField("country", e.target.value)}
                  className="checkout-input checkout-select"
                >
                  <option value="Pakistan">Pakistan</option>
                </select>
              </div>

              <div className="mt-5">
                <label className="checkout-label" htmlFor="address1">
                  Street address <span className="text-mango-400">*</span>
                </label>
                <input
                  id="address1"
                  required
                  placeholder="House number and street name"
                  value={form.address1}
                  onChange={(e) => updateField("address1", e.target.value)}
                  className="checkout-input"
                />
                <input
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  value={form.address2}
                  onChange={(e) => updateField("address2", e.target.value)}
                  className="checkout-input mt-3"
                />
              </div>

              <div className="mt-5">
                <label className="checkout-label" htmlFor="city">
                  Town / City <span className="text-mango-400">*</span>
                </label>
                <input
                  id="city"
                  required
                  value={form.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  className="checkout-input"
                />
              </div>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="checkout-label" htmlFor="state">
                    State / County <span className="text-mango-400">*</span>
                  </label>
                  <select
                    id="state"
                    required
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className="checkout-input checkout-select"
                  >
                    {pakistanStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="checkout-label" htmlFor="postcode">
                    Postcode / ZIP <span className="text-mango-400">*</span>
                  </label>
                  <input
                    id="postcode"
                    required
                    value={form.postcode}
                    onChange={(e) => updateField("postcode", e.target.value)}
                    className="checkout-input"
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="checkout-label" htmlFor="phone">
                  Phone <span className="text-mango-400">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => updateField("phone", e.target.value)}
                  className="checkout-input"
                />
              </div>

              <div className="mt-5">
                <label className="checkout-label" htmlFor="email">
                  Email address <span className="text-mango-400">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="checkout-input"
                />
              </div>
            </div>

            <div>
              <h2
                className="text-xl font-semibold text-white sm:text-2xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Additional information
              </h2>
              <div className="mt-5">
                <label className="checkout-label" htmlFor="orderNotes">
                  Order notes <span className="text-white/35">(optional)</span>
                </label>
                <textarea
                  id="orderNotes"
                  rows={4}
                  placeholder="Notes about your order, e.g. special notes for delivery."
                  value={form.orderNotes}
                  onChange={(e) => updateField("orderNotes", e.target.value)}
                  className="checkout-input checkout-textarea resize-none"
                />
              </div>
            </div>
          </div>

          {/* Order summary */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="checkout-order-panel">
              <h2
                className="text-xl font-semibold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Your order
              </h2>

              <div className="checkout-order-table mt-6">
                <div className="checkout-order-head">
                  <span>Product</span>
                  <span>Subtotal</span>
                </div>

                {items.map((item) => (
                  <div key={item.lineId} className="checkout-order-row">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                        <AppImage
                          src={item.image}
                          alt={item.alt}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm text-white/70">
                        {formatLineItem(item.name, item.weight, item.quantity)}
                      </span>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-gold-300">
                      {formatShopPrice(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}

                <div className="checkout-order-row border-t border-white/8 pt-4">
                  <span className="text-white/50">Subtotal</span>
                  <span className="font-semibold text-white/80">
                    {formatShopPrice(subtotal)}
                  </span>
                </div>

                <div className="checkout-order-row checkout-order-total">
                  <span>Total</span>
                  <span>{formatShopPrice(subtotal)}</span>
                </div>
              </div>

              <div className="checkout-payment mt-8">
                <fieldset className="checkout-payment-options border-0 p-0 m-0">
                  <legend className="sr-only">Payment method</legend>

                  <div className="checkout-payment-block">
                    <label className="checkout-payment-option">
                      <input
                        type="radio"
                        name="payment"
                        value="bank_transfer"
                        checked={paymentMethod === "bank_transfer"}
                        onChange={() => setPaymentMethod("bank_transfer")}
                        className="checkout-radio"
                      />
                      <span className="font-semibold text-white">Direct bank transfer</span>
                    </label>
                    {paymentMethod === "bank_transfer" && (
                      <p className="checkout-payment-note text-sm text-white/45">
                        Make your payment directly into our bank account. Your order will be
                        processed after payment is received.
                      </p>
                    )}
                  </div>

                  <div className="checkout-payment-block mt-4">
                    <label className="checkout-payment-option">
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="checkout-radio"
                      />
                      <span className="font-semibold text-white">Cash on delivery</span>
                    </label>
                    {paymentMethod === "cod" && (
                      <p className="checkout-payment-note text-sm text-white/45">
                        Pay with cash upon delivery.
                      </p>
                    )}
                  </div>
                </fieldset>
              </div>

              <p className="checkout-privacy-note mt-6">
                Your personal data will be used to process your order, support your
                experience throughout this website, and for other purposes described
                in our{" "}
                <Link href="/contact" className="checkout-inline-link">
                  privacy policy
                </Link>
                .
              </p>

              <div className="checkout-terms mt-6">
                <label className="checkout-terms-label">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(event) => {
                      setAgreedToTerms(event.target.checked);
                      if (event.target.checked) setTermsError(null);
                    }}
                    className="checkout-checkbox"
                  />
                  <span className="checkout-terms-text">
                    I have read and agree to the website{" "}
                    <Link href="/faq" className="checkout-inline-link">
                      terms and conditions
                    </Link>
                    <span className="checkout-required"> *</span>
                  </span>
                </label>
                {termsError && (
                  <p className="checkout-terms-error">{termsError}</p>
                )}
              </div>

              {submitError && (
                <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                className="checkout-place-order mt-8 w-full"
                disabled={submitting}
              >
                {submitting ? "Placing order…" : "Place order"}
              </button>

              <p className="mt-4 text-center text-xs text-white/35">
                {itemCount} {itemCount === 1 ? "item" : "items"} in your order
              </p>
            </div>
          </aside>
        </form>
      </div>
    </section>
  );
}
