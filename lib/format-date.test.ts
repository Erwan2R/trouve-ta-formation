import { expect, it } from "vitest";
import { dateLongue } from "./format-date";

it("date longue française avec « 1er »", () => {
  expect(dateLongue("2026-09-01T10:00:00Z")).toBe("1er septembre 2026");
  expect(dateLongue("2026-09-28T10:00:00Z")).toBe("28 septembre 2026");
  expect(dateLongue("2026-08-31T23:30:00Z")).toBe("1er septembre 2026"); // minuit passé à Paris
});
