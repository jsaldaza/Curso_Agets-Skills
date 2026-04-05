import { describe, expect, it } from "vitest";
import { POST as registerPost } from "@/app/api/auth/register/route";
import { POST as loginPost } from "@/app/api/auth/login/route";
import { resetAuthStore } from "@/lib/auth-store";
import { resetRateLimiter } from "@/lib/security";

describe("POST /api/auth/register", () => {
  it("creates account with valid payload", async () => {
    resetAuthStore();
    resetRateLimiter();

    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: "csrfToken=test-token",
        "x-csrf-token": "test-token",
      },
      body: JSON.stringify({ name: "Morgan", email: "morgan@example.com", password: "Password123!" }),
    });

    const response = await registerPost(request);
    expect(response.status).toBe(201);
  });

  it("rejects request with missing CSRF token", async () => {
    resetAuthStore();
    resetRateLimiter();

    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: "csrfToken=test-token",
      },
      body: JSON.stringify({ name: "Morgan", email: "morgan@example.com", password: "Password123!" }),
    });

    const response = await registerPost(request);
    expect(response.status).toBe(403);
  });

  it("rejects malformed JSON payload", async () => {
    resetAuthStore();
    resetRateLimiter();

    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        cookie: "csrfToken=test-token",
        "x-csrf-token": "test-token",
      },
      body: "{bad json",
    });

    const response = await registerPost(request);
    expect(response.status).toBe(400);
  });

  it("rejects duplicate account registration", async () => {
    resetAuthStore();
    resetRateLimiter();

    const headers = {
      "content-type": "application/json",
      cookie: "csrfToken=test-token",
      "x-csrf-token": "test-token",
    };

    const first = await registerPost(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        headers,
        body: JSON.stringify({ name: "Morgan", email: "morgan@example.com", password: "Password123!" }),
      }),
    );
    expect(first.status).toBe(201);

    const second = await registerPost(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        headers,
        body: JSON.stringify({ name: "Morgan", email: "MORGAN@example.com", password: "Password123!" }),
      }),
    );
    expect(second.status).toBe(409);
  });

  it("returns 429 rate limit after 5 requests", async () => {
    resetAuthStore();
    resetRateLimiter();

    const headers = {
      "content-type": "application/json",
      cookie: "csrfToken=test-token",
      "x-csrf-token": "test-token",
    };

    for (let i = 0; i < 5; i++) {
      const response = await registerPost(
        new Request("http://localhost/api/auth/register", {
          method: "POST",
          headers,
          body: JSON.stringify({
            name: `Morgan ${i}`,
            email: `morgan${i}@example.com`,
            password: "Password123!",
          }),
        }),
      );
      expect(response.status).toBe(201);
    }

    const sixth = await registerPost(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: "Morgan 6",
          email: "morgan6@example.com",
          password: "Password123!",
        }),
      }),
    );
    expect(sixth.status).toBe(429);
  });
});

describe("registration login integration", () => {
  it("allows login after successful registration", async () => {
    resetAuthStore();
    resetRateLimiter();

    const headers = {
      "content-type": "application/json",
      cookie: "csrfToken=test-token",
      "x-csrf-token": "test-token",
    };

    const registerResponse = await registerPost(
      new Request("http://localhost/api/auth/register", {
        method: "POST",
        headers,
        body: JSON.stringify({ name: "Pat", email: "pat@example.com", password: "Password123!" }),
      }),
    );
    expect(registerResponse.status).toBe(201);

    const loginResponse = await loginPost(
      new Request("http://localhost/api/auth/login", {
        method: "POST",
        headers,
        body: JSON.stringify({ email: "pat@example.com", password: "Password123!" }),
      }),
    );

    expect(loginResponse.status).toBe(200);
  });
});
