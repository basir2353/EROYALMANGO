"use client";

import { FormEvent, useRef, useState } from "react";
import Link from "next/link";
import { Building2, Check, Copy, Smartphone, Upload } from "lucide-react";
import { uploadPaymentReceipt, type PublicPaymentSettings } from "@/lib/api";
import { formatShopPrice } from "@/services/shop-products";
import { resolveMediaUrl } from "@/lib/media";

type PendingOrder = {
  id: string;
  orderNumber: string;
  total: number;
  email: string;
};

type BankTransferPaymentPanelProps = {
  order: PendingOrder;
  payments: PublicPaymentSettings;
  onComplete: (result: { emailConfirmationSent?: boolean }) => void;
  onClose?: () => void;
};

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  if (!value.trim()) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="bank-payment-copy-row">
      <div className="bank-payment-copy-text">
        <span className="bank-payment-copy-label">{label}</span>
        <span className="bank-payment-copy-value">{value}</span>
      </div>
      <button
        type="button"
        onClick={copy}
        className={`bank-payment-copy-btn${copied ? " is-copied" : ""}`}
        aria-label={`Copy ${label}`}
      >
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        <span>{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}

export default function BankTransferPaymentPanel({
  order,
  payments,
  onComplete,
}: BankTransferPaymentPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (next: File | null) => {
    setFile(next);
    setError(null);
    if (preview) URL.revokeObjectURL(preview);
    setPreview(next ? URL.createObjectURL(next) : null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError("Please upload your payment receipt or screenshot.");
      return;
    }

    setUploading(true);
    setError(null);

    const { data, error: uploadError } = await uploadPaymentReceipt(order.id, order.email, file);
    setUploading(false);

    if (!data) {
      setError(uploadError ?? "Could not upload receipt. Please try again.");
      return;
    }

    onComplete({ emailConfirmationSent: Boolean(data.emailConfirmationSent) });
  };

  const introText =
    payments.paymentInstructions?.trim() ||
    "If you want to transfer the payment amount to our bank account, you can make a direct bank transfer to one of the following accounts:";

  return (
    <div className="bank-payment-page" role="dialog" aria-modal="true" aria-labelledby="bank-payment-title">
      <section className="bank-payment-hero">
        <div className="bank-payment-hero-inner">
          <p className="bank-payment-hero-eyebrow">Complete payment</p>
          <h1 id="bank-payment-title" className="bank-payment-hero-title">
            Please use this form to send deposit confirmation.
          </h1>
          <div className="bank-payment-order-chip">
            <span>
              Order <strong>{order.orderNumber}</strong>
            </span>
            <span className="bank-payment-order-divider" aria-hidden="true" />
            <span>
              Pay <strong>{formatShopPrice(order.total)}</strong>
            </span>
          </div>
        </div>
      </section>

      <div className="bank-payment-shell">
        <div className="bank-payment-content">
          <p className="bank-payment-intro">{introText}</p>

          <div className="bank-payment-methods">
            {payments.jazzCash !== false && payments.jazzCashAccount ? (
              <section className="bank-payment-card">
                <div className="bank-payment-card-head">
                  <span className="bank-payment-card-icon bank-payment-card-icon--mobile">
                    <Smartphone className="h-5 w-5" />
                  </span>
                  <h2 className="bank-payment-card-title">JazzCash</h2>
                </div>
                <CopyRow label="Account number" value={payments.jazzCashAccount} />
              </section>
            ) : null}

            {payments.easyPaisa !== false && payments.easyPaisaAccount ? (
              <section className="bank-payment-card">
                <div className="bank-payment-card-head">
                  <span className="bank-payment-card-icon bank-payment-card-icon--mobile">
                    <Smartphone className="h-5 w-5" />
                  </span>
                  <h2 className="bank-payment-card-title">EasyPaisa</h2>
                </div>
                <CopyRow label="Account number" value={payments.easyPaisaAccount} />
              </section>
            ) : null}

            {payments.bankTransfer !== false &&
            (payments.bankAccountNumber || payments.bankIban || payments.bankAccountTitle) ? (
              <section className="bank-payment-card bank-payment-card--wide">
                <div className="bank-payment-card-head">
                  <span className="bank-payment-card-icon bank-payment-card-icon--bank">
                    <Building2 className="h-5 w-5" />
                  </span>
                  <h2 className="bank-payment-card-title">{payments.bankName || "Bank transfer"}</h2>
                </div>
                <CopyRow label="Account title" value={payments.bankAccountTitle ?? ""} />
                <CopyRow label="Account number" value={payments.bankAccountNumber ?? ""} />
                <CopyRow label="IBAN" value={payments.bankIban ?? ""} />
                {payments.bankDetails ? (
                  <p className="bank-payment-bank-note">{payments.bankDetails}</p>
                ) : null}
              </section>
            ) : null}
          </div>

          <section className="bank-payment-form-panel">
            <div className="bank-payment-form-head">
              <span className="bank-payment-form-badge">Step 2</span>
              <h2 className="bank-payment-form-title">Upload payment receipt</h2>
              <p className="bank-payment-form-subtitle">
                Transfer the exact order total, then upload a screenshot or photo of your payment
                confirmation (JPG, PNG, or WebP, max 10MB).
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bank-payment-form">
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />

              <div
                className={`bank-payment-dropzone${file ? " has-file" : ""}`}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    inputRef.current?.click();
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Choose payment receipt file"
              >
                <span className="bank-payment-dropzone-icon">
                  <Upload className="h-6 w-6" />
                </span>
                <p className="bank-payment-dropzone-title">
                  {file ? "Receipt selected — tap to change" : "Tap to choose receipt file"}
                </p>
                <p className="bank-payment-dropzone-hint">
                  {file ? file.name : "Drag & drop or browse from your device"}
                </p>
              </div>

              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview.startsWith("blob:") ? preview : resolveMediaUrl(preview)}
                  alt="Payment receipt preview"
                  className="bank-payment-preview"
                />
              ) : null}

              {error ? <p className="bank-payment-error">{error}</p> : null}

              <button type="submit" className="bank-payment-submit" disabled={uploading}>
                {uploading ? "Uploading receipt…" : "Submit payment receipt"}
              </button>

              <p className="bank-payment-note">
                Your order is saved. We will verify your payment and contact you at{" "}
                <strong>{order.email}</strong>.
              </p>
            </form>
          </section>

          <div className="bank-payment-footer">
            <Link href="/products" className="bank-payment-back-link">
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
