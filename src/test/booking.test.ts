import { describe, expect, it } from "vitest";
import { CALENDLY_URL } from "@/components/BookingModal";
import { KNOWLEDGE } from "@/lib/knowledge";

describe("Booking destination", () => {
  it("uses the requested calendar for booking", () => {
    expect(CALENDLY_URL).toBe("https://calendly.com/ialuko-2203833-stu/30min");
  });
  it("provides the same calendar in chatbot booking knowledge", () => {
    for (const title of ["Getting started / booking a demo", "Contact"]) {
      expect(KNOWLEDGE.find((section) => section.title === title)?.text).toContain(
        "https://calendly.com/ialuko-2203833-stu/30min",
      );
    }
  });
});
