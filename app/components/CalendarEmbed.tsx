"use client";

import Cal from "@calcom/embed-react";

const namespace = "discovery-call";

export default function CalendarEmbed({ calLink }: { calLink: string }) {
  return (
    <Cal
      namespace={namespace}
      calLink={calLink}
      style={{
        width: "min(1120px, calc(100vw - 24px))",
        height: "min(720px, calc(100dvh - 24px))",
        maxWidth: "100%",
        maxHeight: "100%",
        overflow: "auto",
      }}
      config={{
        layout: "month_view",
        theme: "dark",
        useSlotsViewOnSmallScreen: "true",
      }}
    />
  );
}
