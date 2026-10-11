
import Link from "next/link";
import { isTrialActive, trialDaysLeft } from "./Trials";

type Props = {
  planStatus: string;
  trialEndsAt: string | null;
};

export default function TrialBanner({
  planStatus,
  trialEndsAt,
}: Props) {
  if (planStatus === "active") return null;

  const active = isTrialActive({
    plan_status: planStatus,
    trial_ends_at: trialEndsAt,
  });

  const linkClassName =
    "shrink-0 font-semibold underline underline-offset-4 transition-colors";

  if (active) {
    const daysLeft = trialDaysLeft(trialEndsAt);

    return (
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#EADFF0] bg-[#F7F0FA] px-4 py-4 text-sm text-[#351B46] sm:px-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#763C92]">
            <span className="text-lg font-bold">!</span>
          </span>

          <div>
            <p className="font-semibold text-[#351B46]">
              Your free trial is active
            </p>

            <p className="mt-1 text-[#763C92]">
              {daysLeft} day{daysLeft === 1 ? "" : "s"} left in
              your free trial.
            </p>
          </div>
        </div>

        <Link
          href="/dashboard/billing"
          className={`${linkClassName} text-[#763C92] hover:text-[#5D2D75]`}
        >
          Subscribe now
        </Link>
      </div>
    );
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-4 text-sm text-red-700 sm:px-5">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-red-600">
          <span className="text-lg font-bold">!</span>
        </span>

        <div>
          <p className="font-semibold">Your free trial has ended</p>

          <p className="mt-1 leading-5 text-red-600">
            Subscribe to keep managing your menu.
          </p>
        </div>
      </div>

      <Link
        href="/dashboard/billing"
        className={`${linkClassName} text-red-700 hover:text-red-900`}
      >
        Subscribe now
      </Link>
    </div>
  );
}