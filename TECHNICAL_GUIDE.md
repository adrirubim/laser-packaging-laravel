# Technical Guide — Laser Packaging Laravel

Single **Flat Master Docs** technical guide for this repository.
If this guide disagrees with the code, **the code wins**.

> This file exists to match the shared “Triton Gold Standard” across the suite.
> Detailed implementation docs live under `docs/` and are linked from here.

---

## Table of Contents

- [Architecture](#architecture)
- [Security](#security)
- [Resilience](#resilience)
- [Observability](#observability)
- [Deployment Guardrails](#deployment-guardrails)
- [Key Files](#key-files)
- [Authorship & Maintenance](#authorship--maintenance)

---

## Architecture

### High-level request/response path

This is a Laravel + Inertia (React) application with a large domain surface (offers, orders, planning, production portal).

References:

- `ARCHITECTURE_OMEGA.md` (deep architecture)
- `docs/BACKEND_GUIDE.md` and `docs/FRONTEND_GUIDE.md` (implementation guides)

---

## Security

- `SECURITY.md` (reporting + secrets policy)
- `docs/GIT_WHAT_TO_COMMIT.md` (what not to commit)

---

## Resilience

Key runtime reliability topics:

- Queue / scheduler guidance: see `docs/deployment/README.md`
- Testing and CI parity: see `docs/TEST_COVERAGE.md`

---

## Observability

Common errors and fixes:

- `docs/TROUBLESHOOTING.md`

---

## Deployment Guardrails

- `docs/deployment/README.md`
- `docs/DATABASE.md`

Local CI-parity guidance:

- `scripts/dev-verify.sh` (if present) or the README “Before Pushing to GitHub” section

---

## Key Files

- Docs index: `docs/README.md`
- API contract: `docs/API.md`

---

## Authorship & Maintenance

Stack: [VERSION_STACK.md](VERSION_STACK.md)

