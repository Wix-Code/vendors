"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import Input from "@/components/reusuable/InputProps";
import { supabase } from "@/libs/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("Enter the email you signed up with.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        trimmedEmail,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        },
      );

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setEmail(trimmedEmail);
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FCFAFD] px-6 py-12">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full bg-[#D9BDE8]/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-[#F6DFE7]/60 blur-3xl" />

      <div className="relative z-10 w-full max-w-[500px]">
        {/* Brand */}
        <Link
          href="/"
          className="mb-8 flex flex-col items-center justify-center text-center"
        >
          <img
            className="w-[80px] object-contain"
            src="/images/logo.png"
            alt="Bukka logo"
          />

          <p className="mt-2 text-xl font-bold tracking-tight text-[#351B46]">
            Bukka
          </p>
        </Link>

        {/* Forgot Password Card */}
        <div className="rounded-3xl border border-[#EADFF0] bg-white p-8 shadow-xl shadow-[#351B46]/5 sm:p-10">
          {sent ? (
            /* Success State */
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F7F0FA]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#763C92"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a2 2 0 0 1-2.06 0L2 7" />
                </svg>
              </div>

              <div className="mb-5 inline-flex items-center rounded-full border border-[#E8D5F0] bg-[#F7F0FA] px-4 py-2 text-xs font-semibold tracking-wide text-[#763C92]">
                CHECK YOUR INBOX
              </div>

              <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#351B46]">
                Check your email
              </h1>

              <p className="mt-4 leading-7 text-gray-500">
                If an account exists for{" "}
                <span className="font-semibold text-[#351B46]">{email}</span>,
                you'll receive a password reset link.
              </p>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Didn't receive an email? Check your spam folder or try another
                email address.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setError(null);
                }}
                className="mt-8 w-full rounded-full bg-[#763C92] py-4 font-semibold text-white shadow-lg shadow-[#763C92]/20 transition-all duration-300 hover:bg-[#5D2D75] hover:shadow-xl hover:shadow-[#763C92]/25"
              >
                Try another email
              </button>

              <Link
                href="/login"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#763C92] transition-colors hover:text-[#351B46]"
              >
                <span aria-hidden="true">←</span>
                Back to login
              </Link>
            </div>
          ) : (
            /* Reset Password Form */
            <>
              <div className="mb-8">
                <div className="mb-5 inline-flex items-center rounded-full border border-[#E8D5F0] bg-[#F7F0FA] px-4 py-2 text-xs font-semibold tracking-wide text-[#763C92]">
                  ACCOUNT RECOVERY
                </div>

                <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#351B46]">
                  Forgot your password?
                </h1>

                <p className="mt-3 leading-7 text-gray-500">
                  No worries! Enter the email associated with your Bukka account
                  and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={submit} noValidate>
                <div className="mb-6">
                  <Input
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(null);
                    }}
                  />
                </div>

                {error && (
                  <div
                    role="alert"
                    className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[#763C92] py-4 font-semibold text-white shadow-lg shadow-[#763C92]/20 transition-all duration-300 hover:bg-[#5D2D75] hover:shadow-xl hover:shadow-[#763C92]/25 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Sending reset link…" : "Send reset link"}
                </button>
              </form>

              <div className="mt-8 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#763C92] transition-colors hover:text-[#351B46]"
                >
                  <span aria-hidden="true">←</span>
                  Back to login
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Registration */}
        <p className="mt-8 text-center text-sm text-gray-600">
          New to Bukka?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#763C92] transition-colors hover:text-[#351B46] hover:underline"
          >
            Create an account
          </Link>
        </p>

        <p className="mt-5 text-center text-xs text-gray-400">
          A simpler way to showcase and sell your products.
        </p>
      </div>
    </div>
  );
}
