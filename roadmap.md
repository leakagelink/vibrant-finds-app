# JAKAS final MVP

Blocked: Cloud activation was denied because the workspace has no remaining credits. Server-backed implementation awaits credit replenishment and successful Cloud activation; phone OTP and push provider configuration must then be checked.

- [x] Remove ordinary-user posting from navigation, profile and the legacy create page. Server-enforced host-only permissions remain blocked on Cloud.
- [x] Add public event detail links, missing-event state, maps directions, native sharing and discovery price filters. Phone-verified actions remain unavailable, not simulated.
- [x] Remove simulated login and self-selected admin access; keep privileged panels unavailable until server verification is connected.
- [x] Apply uploaded Figma visual direction to location welcome/denied, Discover, phone login, My JAKAS, event sheets and Drops. Mobile/desktop browsing and dialog navigation verified. Real OTP screen, attendance, verified badges and countdowns await Cloud; mock counts are not copied.
- [ ] Correct rejected Discover layout to a viewport-fitting left/right swipe deck; refine screenshot proportions and shared animations, then verify gestures and details in the browser.

- [ ] Enable Cloud and verify phone OTP setup.
- [ ] Centralize profiles, host verification, moments, engagement, reports, service areas and audit history.
- [ ] Implement guest discovery, today-only time filters, distance/price filters and moment details/deep links.
- [ ] Implement Interested, Going, report reasons and notification preferences.
- [ ] Implement host onboarding, creation/preview, lifecycle overrides and metrics.
- [ ] Implement AI promo/flyer extraction and completeness checks.
- [ ] Implement admin queues, service areas, account controls and audit trail.
- [ ] Implement public landing/legal pages and installability.
- [ ] Configure expiry, confirmation reminders and push delivery.
- [ ] Verify a rebuilt APK on a real Android device — requires the user's Android build/device. Browser navigation and host-only visibility tests pass; inline logo imports and Capacitor build configuration are preserved.