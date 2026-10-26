import { describe, it, expect } from 'vitest';
import { pageClass, pageViewBody } from './pageViews';
import { parsePageView } from '../../netlify/functions/_shared/pageView';

const SESSION = '9e8d7c6b-5a49-4382-a1b0-c9d8e7f6a5b4';

describe('pageClass', () => {
  it.each([
    ['/', 'home'],
    ['/deutsche-grammatik/', 'grammar'],
    ['/deutsche-grammatik/b1-niveau-lernen/praesens/', 'grammar'],
    ['/pruefungszentren/telc-berlin/', 'exam_centers'],
    ['/exercise', 'exercise'],
    ['/exercise/', 'exercise'],
    ['/exercise-stats/', 'exercise_stats'],
    ['/auth/', 'auth'],
    ['/verify-magic-link', 'auth'],
    ['/profile/', 'account'],
    ['/statistics', 'account'],
    ['/something-else', 'other'],
  ])('%s is %s', (path, page) => {
    expect(pageClass(path)).toBe(page);
  });

  it('does not track the admin area', () => {
    expect(pageClass('/admin')).toBeNull();
    expect(pageClass('/admin/')).toBeNull();
    expect(pageViewBody('/admin', null, SESSION)).toBeNull();
  });
});

describe('page view body', () => {
  it('carries the session, the page class and the path', () => {
    expect(pageViewBody('/deutsche-grammatik/', null, SESSION)).toEqual({ session_id: SESSION, page: 'grammar', path: '/deutsche-grammatik/', user_id: null });
  });

  it('is accepted by the server, which drops any query string', () => {
    expect(parsePageView({ session_id: SESSION, page: 'exercise', path: '/exercise?level=b1&t=secret-token' })).toEqual({
      session_id: SESSION, page: 'exercise', path: '/exercise', user_id: null,
    });
  });

  it.each([
    [{ session_id: 'nope', page: 'home', path: '/' }, 'session_id must be a UUID'],
    [{ session_id: SESSION, page: 'admin', path: '/admin' }, 'unknown page'],
    [{ session_id: SESSION, page: 'home', path: 'https://evil.example/' }, 'path must start with /'],
    [{ session_id: SESSION, page: 'home', path: '/', user_id: 'x' }, 'user_id must be a UUID'],
  ])('rejects %j', (body, error) => {
    expect(parsePageView(body)).toBe(error);
  });
});
