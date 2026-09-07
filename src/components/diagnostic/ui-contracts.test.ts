import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  DIAGNOSTIC_MAX_QUESTIONS,
  DIAGNOSTIC_NEUTRAL_QUESTIONS,
  DIAGNOSTIC_REPORT_MAX_CHARS,
  DIAGNOSTIC_REPORT_MIN_CHARS,
} from "@/lib/diagnostic/constants";

/**
 * Contratos que a UI V2 deve respeitar — sem rede.
 */
describe("diagnostic UI contracts", () => {
  it("keeps report limits aligned with foundation", () => {
    expect(DIAGNOSTIC_REPORT_MIN_CHARS).toBe(12);
    expect(DIAGNOSTIC_REPORT_MAX_CHARS).toBe(2000);
  });

  it("caps clarifying questions at 3", () => {
    expect(DIAGNOSTIC_MAX_QUESTIONS).toBe(3);
    expect(DIAGNOSTIC_NEUTRAL_QUESTIONS.length).toBe(3);
  });

  it("neutral questions are business language only", () => {
    const blob = DIAGNOSTIC_NEUTRAL_QUESTIONS.map((q) => q.prompt).join(" ").toLowerCase();
    expect(blob).not.toMatch(/stack|framework|api|backend|react|node/);
  });

  it("V3.13 exposes four visual chapters (temporary states are inline)", () => {
    const chapters = ["entry", "understanding", "context", "result"] as const;
    expect(chapters).toHaveLength(4);
  });

  it("extraordinary states stay inline (no exclusive page modes in public chapters)", () => {
    const exclusivePagesRemoved = ["resume_page", "expired_page", "error_page"] as const;
    expect(exclusivePagesRemoved.every((p) => !["entry", "understanding", "context", "result"].includes(p))).toBe(
      true,
    );
  });

  it("accent-bars.tsx stays deleted (no CodeRain on /estimar)", () => {
    const accentPath = join(process.cwd(), "src/components/diagnostic/accent-bars.tsx");
    expect(existsSync(accentPath)).toBe(false);
  });

  it("does not expose complexityHint or automatic price/timeline in public neutral prompts", () => {
    const blob = DIAGNOSTIC_NEUTRAL_QUESTIONS.map((q) => `${q.prompt} ${q.helpText}`).join(" ");
    expect(blob.toLowerCase()).not.toMatch(/complexity|preço|prazo|stack|investimento/);
  });
});
