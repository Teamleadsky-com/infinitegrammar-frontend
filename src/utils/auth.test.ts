import { describe, it, expect, vi, afterEach } from 'vitest';
import { register } from './auth';
import { getSessionId } from '@/lib/exerciseEvents';

// The starter-exercises experiment links an account to the anonymous session it was created in:
// the signup request carries this tab's session id (the one the exercise events use).

afterEach(() => vi.unstubAllGlobals());

describe('register', () => {
  it("sends this tab's session id with the signup", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { id: 'u1', email: 'a@b.de', name: null } }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await register({ email: 'a@b.de', password: 'longenough1' } as Parameters<typeof register>[0]);

    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain('/auth-register');
    expect(JSON.parse(init.body)).toMatchObject({ email: 'a@b.de', password: 'longenough1', session_id: getSessionId() });
    expect(getSessionId()).toMatch(/^[0-9a-f-]{36}$/);
  });
});
