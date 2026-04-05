import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/auth/login/route";
import { resetRateLimiter } from "@/lib/security";

describe("POST /api/auth/login", () => {
  it("returns success for valid demo credentials", async () => {
    resetRateLimiter();
    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: "csrfToken=test-token",
        "x-csrf-token": "test-token",
      },
      body: JSON.stringify({ email: "demo@saas.com", password: "Password123!" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });

  it("returns generic auth failure for wrong credentials", async () => {
    resetRateLimiter();
    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: "csrfToken=test-token",
        "x-csrf-token": "test-token",
      },
      body: JSON.stringify({ email: "unknown@example.com", password: "Password123!" }),
    });

    const response = await POST(request);
    const payload = (await response.json()) as { message: string };
    expect(response.status).toBe(401);
    expect(payload.message).toBe("Invalid credentials.");
  });

  it("rejects request with missing CSRF token", async () => {
    resetRateLimiter();
    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: "csrfToken=test-token",
      },
      body: JSON.stringify({ email: "demo@saas.com", password: "Password123!" }),
    });

    const response = await POST(request);
    expect(response.status).toBe(403);
    const payload = (await response.json()) as { message: string };
    expect(payload.message).toBe("Invalid request token.");
  });

  it("rejects malformed JSON payload", async () => {
    resetRateLimiter();
    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: "csrfToken=test-token",
        "x-csrf-token": "test-token",
      },
      body: "{invalid json",
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    const payload = (await response.json()) as { message: string };
    expect(payload.message).toBe("Invalid payload.");
  });

  it("returns 429 rate limit after 5 requests", async () => {
    resetRateLimiter();
    const headers = {
      "content-type": "application/json",
      cookie: "csrfToken=test-token",
      "x-csrf-token": "test-token",
    };
    const body = JSON.stringify({ email: "demo@saas.com", password: "Password123!" });

    for (let i = 0; i < 5; i++) {
      const request = new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers,
        body,
      });
      const response = await POST(request);
      expect(response.status).toBe(200);
    }

    const sixthRequest = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers,
      body,
    });
    const sixthResponse = await POST(sixthRequest);
    expect(sixthResponse.status).toBe(429);
    const payload = (await sixthResponse.json()) as { message: string };
    expect(payload.message).toMatch(/too many|try again/i);
  });
});
