import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/contact/route";
import { resetRateLimiter } from "@/lib/security";

describe("POST /api/contact", () => {
  it("returns success for valid payload", async () => {
    resetRateLimiter();
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: "csrfToken=test-token",
        "x-csrf-token": "test-token",
      },
      body: JSON.stringify({
        name: "Pat",
        email: "pat@example.com",
        message: "Please contact me to schedule a demo this week.",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });

  it("rejects script-like payload as invalid after sanitization", async () => {
    resetRateLimiter();
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: "csrfToken=test-token",
        "x-csrf-token": "test-token",
      },
      body: JSON.stringify({
        name: "<script>alert(1)</script>",
        email: "pat@example.com",
        message: "<script>x</script>",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
  });

  it("rejects request with missing CSRF token", async () => {
    resetRateLimiter();
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: "csrfToken=test-token",
      },
      body: JSON.stringify({
        name: "Pat",
        email: "pat@example.com",
        message: "Please contact me to schedule a demo.",
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(403);
    const payload = (await response.json()) as { message: string };
    expect(payload.message).toBe("Invalid request token.");
  });

  it("rejects malformed JSON payload", async () => {
    resetRateLimiter();
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: "csrfToken=test-token",
        "x-csrf-token": "test-token",
      },
      body: "{bad json",
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
    const body = JSON.stringify({
      name: "Pat",
      email: "pat@example.com",
      message: "Please contact me to schedule a demo this week.",
    });

    for (let i = 0; i < 5; i++) {
      const request = new Request("http://localhost/api/contact", {
        method: "POST",
        headers,
        body,
      });
      const response = await POST(request);
      expect(response.status).toBe(200);
    }

    const sixthRequest = new Request("http://localhost/api/contact", {
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
