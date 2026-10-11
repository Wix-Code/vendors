"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle2, LockKeyhole } from "lucide-react";
import { supabase } from "@/libs/supabase";
import Input from "@/components/reusuable/InputProps";

export default function ResetPassword() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [checkingSession, setCheckingSession] = useState(true);
  const [validSession, setValidSession] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let active = true;

    async function checkRecoverySession() {
      try {
        // Handles recovery links containing an authorization code.
        const code = new URLSearchParams(window.location.search).get("code");

        if (code) {
          const { error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (exchangeError) {
            throw exchangeError;
          }

          window.history.replaceState({}, "", window.location.pathname);
        }

        // With an implicit recovery flow, Supabase processes
        // the URL hash when the client initializes.
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!active) return;

        setValidSession(Boolean(data.session));

        if (!data.session) {
          setError(
            "Your password reset link is invalid or has expired. Please request a new one.",
          );
        }
      } catch {
        if (!active) return;

        setValidSession(false);
        setError("Unable to verify your reset link. Please request a new one.");
      } finally {
        if (active) {
          setCheckingSession(false);
        }
      }
    }

    checkRecoverySession();

    return () => {
      active = false;
    };
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!validSession) {
      setError("Please request a new password reset link.");
      return;
    }

    if (password.length < 6) {
      setError("Password needs to be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      setDone(true);

      // End the recovery session after updating the password.
      await supabase.auth.signOut();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const passwordRequirements = [
    {
      label: "At least 6 characters",
      valid: password.length >= 6,
    },
    {
      label: "Passwords match",
      valid: confirmPassword.length > 0 && password === confirmPassword,
    },
  ];

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

        {/* Reset Password Card */}
        <div className="rounded-3xl border border-[#EADFF0] bg-white p-8 shadow-xl shadow-[#351B46]/5 sm:p-10">
          {done ? (
            /* Success State */
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F7F0FA]">
                <CheckCircle2
                  size={40}
                  strokeWidth={1.7}
                  className="text-[#763C92]"
                />
              </div>

              <div className="mb-5 inline-flex items-center rounded-full border border-[#E8D5F0] bg-[#F7F0FA] px-4 py-2 text-xs font-semibold tracking-wide text-[#763C92]">
                PASSWORD UPDATED
              </div>

              <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#351B46]">
                Password updated!
              </h1>

              <p className="mt-4 leading-7 text-gray-500">
                Your password has been successfully updated. You can now log in
                to your Bukka account using your new password.
              </p>

              <button
                type="button"
                onClick={() => router.replace("/login")}
                className="mt-8 w-full rounded-full bg-[#763C92] py-4 font-semibold text-white shadow-lg shadow-[#763C92]/20 transition-all duration-300 hover:bg-[#5D2D75] hover:shadow-xl hover:shadow-[#763C92]/25"
              >
                Back to login
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-8">
                <div className="mb-5 inline-flex items-center rounded-full border border-[#E8D5F0] bg-[#F7F0FA] px-4 py-2 text-xs font-semibold tracking-wide text-[#763C92]">
                  ACCOUNT SECURITY
                </div>

                <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#351B46]">
                  Set a new password
                </h1>

                <p className="mt-3 leading-7 text-gray-500">
                  Create a new password for your Bukka account to keep your
                  store secure.
                </p>
              </div>

              {checkingSession ? (
                <div
                  role="status"
                  className="py-8 text-center text-sm text-gray-500"
                >
                  Verifying your reset link...
                </div>
              ) : !validSession ? (
                <div>
                  <div
                    role="alert"
                    className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
                  >
                    {error}
                  </div>

                  <Link
                    href="/forgot-password"
                    className="block w-full rounded-full bg-[#763C92] py-4 text-center font-semibold text-white transition-colors hover:bg-[#5D2D75]"
                  >
                    Request a new reset link
                  </Link>
                </div>
              ) : (
                /* Reset Password Form */
                <form onSubmit={submit} noValidate>
                  <div className="space-y-1">
                    {/* New Password */}
                    <div className="relative">
                      <Input
                        label="New password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError(null);
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword
                            ? "Hide new password"
                            : "Show new password"
                        }
                        className="absolute right-4 top-[42px] text-gray-400 transition-colors hover:text-[#763C92]"
                      >
                        {showPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                      <Input
                        label="Confirm password"
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setError(null);
                        }}
                      />

                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={
                          showConfirmPassword
                            ? "Hide confirmation password"
                            : "Show confirmation password"
                        }
                        className="absolute right-4 top-[42px] text-gray-400 transition-colors hover:text-[#763C92]"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={19} />
                        ) : (
                          <Eye size={19} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="mb-6 mt-2 rounded-2xl border border-[#EADFF0] bg-[#FCFAFD] p-4">
                    <p className="mb-3 text-xs font-semibold text-[#351B46]">
                      PASSWORD REQUIREMENTS
                    </p>

                    <div className="space-y-2">
                      {passwordRequirements.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle2
                            size={16}
                            className={
                              item.valid ? "text-green-600" : "text-gray-300"
                            }
                          />

                          <span
                            className={`text-sm ${
                              item.valid ? "text-green-700" : "text-gray-500"
                            }`}
                          >
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
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
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[#763C92] py-4 font-semibold text-white shadow-lg shadow-[#763C92]/20 transition-all duration-300 hover:bg-[#5D2D75] hover:shadow-xl hover:shadow-[#763C92]/25 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <LockKeyhole size={18} />

                    {loading ? "Updating password…" : "Update password"}
                  </button>
                </form>
              )}

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

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#763C92] transition-colors hover:text-[#351B46] hover:underline"
          >
            Log in
          </Link>
        </p>

        <p className="mt-5 text-center text-xs text-gray-400">
          A simpler way to showcase and sell your products.
        </p>
      </div>
    </div>
  );
}
