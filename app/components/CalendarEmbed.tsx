"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

const namespace = "discovery-call";

export default function CalendarEmbed({ calLink }: { calLink: string }) {
  useEffect(() => {
    getCalApi({ namespace }).then(cal => {
      cal("ui", {
        theme: "dark",
        styles: {
          body: { background: "#171717" },
        },
        cssVarsPerTheme: {
          dark: {
            "--cal-spacing-6": "0.75rem",
          },
          light: {
            "--cal-spacing-6": "0.75rem",
          },
        },
      });
    });
  }, []);

  return (
    <Cal
      namespace={namespace}
      calLink={calLink}
      style={{
        width: "min(1120px, calc(100vw - 24px))",
        height: "min(620px, calc(100dvh - 56px))",
        maxWidth: "100%",
        maxHeight: "100%",
        overflow: "auto",
        background: "#171717",
        borderRadius: "18px",
        boxShadow: "0 24px 80px rgba(0, 0, 0, 0.28)",
      }}
      config={{
        layout: "month_view",
        theme: "dark",
        useSlotsViewOnSmallScreen: "true",
      }}
    />
  );
}
