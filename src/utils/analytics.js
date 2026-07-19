// GA4 event helpers shared by the site's primary conversion paths.
// Keep parameters primitive and avoid blocking navigation when analytics is unavailable.

const MAX_SEARCH_TERM_LENGTH = 80;

export function sendAnalyticsEvent(eventName, params = {}) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return false;

  try {
    window.gtag('event', eventName, params);
    return true;
  } catch {
    // Analytics must never prevent a user from reaching a cancellation page.
    return false;
  }
}

function getLinkDetails(url) {
  try {
    const parsed = new URL(url);
    return {
      link_url: parsed.href,
      link_domain: parsed.hostname,
    };
  } catch {
    return {};
  }
}

export function trackOfficialCancelClick({ service, placement, url, difficulty }) {
  return sendAnalyticsEvent('official_cancel_click', {
    asp: 'direct',
    service: service || 'unknown',
    placement: placement || 'unknown',
    position: 0,
    layer: 'A',
    ...(difficulty ? { difficulty } : {}),
    ...getLinkDetails(url),
  });
}

function sanitizeSearchTerm(value) {
  const normalized = String(value || '').trim().replace(/\s+/g, ' ');
  if (!normalized) return '(empty)';

  // Avoid accidentally sending obvious personal data when the field is misused.
  const containsEmail = /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/.test(normalized);
  const digitsOnly = normalized.replace(/\D/g, '');
  if (containsEmail || digitsOnly.length >= 10) return '(redacted)';

  return normalized.slice(0, MAX_SEARCH_TERM_LENGTH);
}

export function trackServiceSearch({ term, resultCount, selectedService, method, position = 0 }) {
  const count = Number.isFinite(resultCount) ? resultCount : 0;
  return sendAnalyticsEvent('service_search', {
    asp: 'internal',
    service: selectedService || (count > 0 ? 'results_shown' : 'no_match'),
    placement: 'home_hero_search',
    position,
    layer: 'A',
    search_term: sanitizeSearchTerm(term),
    search_method: method || 'unknown',
    result_count: count,
    search_status: count > 0 ? 'matched' : 'no_match',
  });
}
