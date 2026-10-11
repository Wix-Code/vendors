"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Input from "@/components/reusuable/InputProps";
import ImageUpload from "@/components/reusuable/ImageUpload";

export default function Onboarding() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [vendorId, setVendorId] = useState<string | null>(null);

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    description: "",
    location: "",
    openingHours: "",
    phone: "",
    coverImage: "",
  });

  // -------------------------------------------
  // CHECK AUTHENTICATION
  // -------------------------------------------

  useEffect(() => {
    let active = true;

    async function checkUser() {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (!active) return;

        if (authError || !user) {
          router.replace("/login");
          return;
        }

        setVendorId(user.id);

        // Check existing vendor onboarding status
        const { data: vendor, error: vendorError } = await supabase
          .from("vendors")
          .select(
            "description, location, opening_hours, phone, cover_image, onboarding_completed",
          )
          .eq("id", user.id)
          .single();

        if (!active) return;

        if (vendorError) {
          setError(
            "Unable to load your business details. Please refresh the page.",
          );
          return;
        }

        if (vendor?.onboarding_completed) {
          router.replace("/dashboard");
          return;
        }

        // Restore any previously saved details
        if (vendor) {
          setForm({
            description: vendor.description ?? "",
            location: vendor.location ?? "",
            openingHours: vendor.opening_hours ?? "",
            phone: vendor.phone ?? "",
            coverImage: vendor.cover_image ?? "",
          });
        }
      } catch {
        if (active) {
          setError("Something went wrong while loading your account.");
        }
      } finally {
        if (active) {
          setCheckingAuth(false);
        }
      }
    }

    checkUser();

    return () => {
      active = false;
    };
  }, [router]);

  // -------------------------------------------
  // FORM VALIDATION
  // -------------------------------------------

  const isStep1Valid =
    form.description.trim().length > 0 &&
    form.location.trim().length > 0 &&
    form.openingHours.trim().length > 0;

  // Nigerian WhatsApp number:
  // e.g. 2348012345678
  const isPhoneValid = /^234[789]\d{9}$/.test(form.phone.trim());

  const isStep2Valid = isPhoneValid && form.coverImage.trim().length > 0;

  const isFormValid = isStep1Valid && isStep2Valid;

  // -------------------------------------------
  // UPDATE FORM
  // -------------------------------------------

  function updateForm(field: keyof typeof form, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    if (error) {
      setError(null);
    }
  }

  // -------------------------------------------
  // CONTINUE TO STEP 2
  // -------------------------------------------

  function next(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isStep1Valid) {
      setError("Please complete all required fields.");
      return;
    }

    setError(null);
    setStep(2);
  }

  // -------------------------------------------
  // SAVE ONBOARDING
  // -------------------------------------------

  async function finish(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (saving || !vendorId) return;

    if (!isFormValid) {
      setError("Please complete all required fields before continuing.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const { data, error: updateError } = await supabase
        .from("vendors")
        .update({
          description: form.description.trim(),
          location: form.location.trim(),
          opening_hours: form.openingHours.trim(),
          phone: form.phone.trim(),
          cover_image: form.coverImage.trim(),
          onboarding_completed: true,
        })
        .eq("id", vendorId)
        .select("id")
        .single();

      if (updateError) {
        throw updateError;
      }

      if (!data) {
        throw new Error("Your business information could not be saved.");
      }

      // Redirect to dashboard after onboarding.
      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to complete onboarding. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  // -------------------------------------------
  // AUTH LOADING STATE
  // -------------------------------------------

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FCFAFD]">
        <div role="status" className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#EADFF0] border-t-[#763C92]" />

          <p className="text-sm font-medium text-[#763C92]">
            Preparing your Bukka account...
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------
  // PAGE
  // -------------------------------------------

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FCFAFD] px-6 py-12">
      {/* Background decorations */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-[450px] w-[450px] rounded-full bg-[#D9BDE8]/35 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-[#F6DFE7]/60 blur-3xl" />

      <div className="relative z-10 w-full max-w-lg">
        {/* Logo */}
        <Link
          href="/"
          className="mb-8 flex flex-col items-center justify-center text-center"
        >
          <img
            src="/images/logo.png"
            alt="Bukka logo"
            className="w-[80px] object-contain"
          />

          <p className="mt-2 text-xl font-bold tracking-tight text-[#351B46]">
            Bukka
          </p>
        </Link>

        {/* Main Card */}
        <div className="rounded-3xl border border-[#EADFF0] bg-white p-8 shadow-xl shadow-[#351B46]/5 sm:p-10">
          {/* Progress */}
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold tracking-wide text-[#763C92]">
                RESTAURANT SETUP
              </p>

              <p className="text-xs font-medium text-gray-500">
                Step {step} of 2
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-[#763C92]" />

              <div
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  step === 2 ? "bg-[#763C92]" : "bg-gray-100"
                }`}
              />
            </div>
          </div>

          {/* STEP 1 */}
          {step === 1 ? (
            <>
              <div className="mb-8">
                <div className="mb-5 inline-flex items-center rounded-full border border-[#E8D5F0] bg-[#F7F0FA] px-4 py-2 text-xs font-semibold tracking-wide text-[#763C92]">
                  BUSINESS INFORMATION
                </div>

                <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#351B46]">
                  Tell us about your restaurant
                </h1>

                <p className="mt-3 leading-7 text-gray-500">
                  Let's create a beautiful digital presence for your food
                  business.
                </p>
              </div>

              <form onSubmit={next} noValidate>
                {/* Description */}
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Description <span className="text-red-500">*</span>
                  </label>

                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    placeholder="Home-cooked Nigerian meals, made fresh daily."
                    rows={3}
                    required
                    className="w-full resize-none rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#763C92] focus:ring-2 focus:ring-[#F7F0FA]"
                  />
                </div>

                {/* Location */}
                <Input
                  label="Location"
                  placeholder="Wuse 2, Abuja"
                  value={form.location}
                  onChange={(e) => updateForm("location", e.target.value)}
                  required
                />

                {/* Opening Hours */}
                <Input
                  label="Opening hours"
                  placeholder="9am - 9pm"
                  value={form.openingHours}
                  onChange={(e) => updateForm("openingHours", e.target.value)}
                  required
                />

                {/* Validation Message */}
                {!isStep1Valid && (
                  <p className="mb-4 mt-2 text-xs text-gray-400">
                    Complete all fields to continue.
                  </p>
                )}

                {/* Continue Button */}
                <button
                  type="submit"
                  disabled={!isStep1Valid || !vendorId}
                  className="mt-3 w-full rounded-full bg-[#763C92] py-4 font-semibold text-white shadow-lg shadow-[#763C92]/20 transition-all duration-300 hover:bg-[#5D2D75] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
                >
                  Continue
                </button>
              </form>
            </>
          ) : (
            <>
              {/* STEP 2 */}
              <div className="mb-8">
                <div className="mb-5 inline-flex items-center rounded-full border border-[#E8D5F0] bg-[#F7F0FA] px-4 py-2 text-xs font-semibold tracking-wide text-[#763C92]">
                  ORDER & MENU SETUP
                </div>

                <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#351B46]">
                  How should orders reach you?
                </h1>

                <p className="mt-3 leading-7 text-gray-500">
                  Connect your WhatsApp number and upload a cover photo for your
                  public menu.
                </p>
              </div>

              <form onSubmit={finish} noValidate>
                {/* WhatsApp */}
                <Input
                  label="WhatsApp number"
                  placeholder="2348012345678"
                  hint="Include country code, without spaces or dashes."
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                  required
                />

                {/* Phone Validation */}
                {form.phone.trim().length > 0 && !isPhoneValid && (
                  <p className="mb-4 text-xs text-red-500">
                    Enter a valid Nigerian WhatsApp number, e.g. 2348012345678.
                  </p>
                )}

                {/* Cover Image */}
                {vendorId && (
                  <div className="mt-4">
                    <ImageUpload
                      label="Cover photo"
                      value={form.coverImage}
                      onChange={(url) => updateForm("coverImage", url)}
                      pathPrefix={`${vendorId}/cover`}
                      hint="Upload a wide photo for your public menu page."
                    />
                  </div>
                )}

                {/* Error */}
                {error && (
                  <div
                    role="alert"
                    className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
                  >
                    {error}
                  </div>
                )}

                {/* Validation */}
                {!isStep2Valid && (
                  <p className="mb-4 mt-3 text-xs text-gray-400">
                    Enter a valid WhatsApp number and upload your cover photo to
                    finish setup.
                  </p>
                )}

                {/* Buttons */}
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => {
                      setError(null);
                      setStep(1);
                    }}
                    className="rounded-full px-6 py-4 font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Back
                  </button>

                  <button
                    type="submit"
                    disabled={saving || !vendorId || !isFormValid}
                    className="flex-1 rounded-full bg-[#763C92] py-4 font-semibold text-white shadow-lg shadow-[#763C92]/20 transition-all duration-300 hover:bg-[#5D2D75] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
                  >
                    {saving ? "Setting up..." : "Finish setup"}
                  </button>
                </div>
              </form>
            </>
          )}

          {/* General Error */}
          {step === 1 && error && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          Your digital menu is almost ready.
        </p>
      </div>
    </div>
  );
}
