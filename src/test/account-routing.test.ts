import { describe, expect, it } from "vitest";
import { getAccountDashboard, isAccountDashboard } from "@/lib/account-routing";

describe("account dashboard routing", () => {
  it("sends staff sign-in to the staff dashboard", () => {
    expect(getAccountDashboard("/admin")).toBe("/admin/dashboard");
  });

  it("sends employer sign-in to the employer dashboard", () => {
    expect(getAccountDashboard("/employers")).toBe("/employers");
  });

  it("sends job-seeker sign-in to the job-seeker dashboard", () => {
    expect(getAccountDashboard("/job-seekers")).toBe("/job-seekers");
  });

  it("accepts only the app's known account destinations", () => {
    expect(isAccountDashboard("/job-seekers")).toBe(true);
    expect(isAccountDashboard("/admin/dashboard")).toBe(true);
    expect(isAccountDashboard("https://example.com")).toBe(false);
    expect(isAccountDashboard(null)).toBe(false);
  });
});