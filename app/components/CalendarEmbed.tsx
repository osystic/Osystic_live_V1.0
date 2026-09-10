"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useState } from "react";

const namespace = "discovery-call";
function CalendarContent({ calLink }: { calLink: string }) {
  const [status, setStatus] = useState<"loading" | "ready" | "slow" | "error">("loading");
  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};
    const timer = window.setTimeout(() => { if (active) setStatus(s => s === "loading" ? "slow" : s); }, 12000);
    const ready = () => { if (active) { window.clearTimeout(timer); setStatus("ready"); } };
    const failed = () => { if (active) { window.clearTimeout(timer); setStatus("error"); } };
    getCalApi({ namespace }).then(api => {
      if (!active) return;
      api("on", { action: "linkReady", callback: ready });
      api("on", { action: "linkFailed", callback: failed });
      unsubscribe = () => {
        api("off", { action: "linkReady", callback: ready });
        api("off", { action: "linkFailed", callback: failed });
      };
    }).catch(failed);
    return () => { active = false; window.clearTimeout(timer); unsubscribe(); };
  }, []);
  return <div className="calendar-content">
    {status !== "ready" ? <div className="calendar-status" role="status" aria-live="polite">
      {status === "loading" ? "Loading available times…" : status === "slow" ? "The calendar is taking longer than usual. You can keep waiting or email us below." : "The calendar is unavailable. Please email us below."}
    </div> : null}
    <Cal namespace={namespace} calLink={calLink} style={{ width: "100%", height: "100%", overflow: "auto" }} config={{ layout: "month_view", theme: "dark", useSlotsViewOnSmallScreen: "true" }} />
  </div>;
}
export default function CalendarEmbed({ calLink }: { calLink: string }) {
  return <CalendarContent calLink={calLink} />;
}
