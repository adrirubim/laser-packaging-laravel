# Security Policy

## Supported Versions

We release security updates for the following versions:

| Version | Supported |
| ------- | --------- |
| main    | ✅         |

---

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it **responsibly**.

**Do not** open a public issue for security-sensitive topics.

### How to report

1. **Email:** [adrianmorillasperez@gmail.com](mailto:adrianmorillasperez@gmail.com)  
   Use a descriptive subject, for example: `[Security] laser-packaging-laravel – short description`.
2. **Include:**
   - Description of the vulnerability
   - Steps to reproduce (if possible)
   - Impact and suggested fix (optional)

### What to expect

- We will acknowledge receipt as soon as possible.
- We will work on a fix and keep you updated.
- Once fixed, we may publish a security advisory (crediting you if you wish).

---

## Do Not Commit Secrets

- Never commit `.env` files or any file containing real secrets.
- Use `.env.example` as a template for local setup; each environment must provide its own real `.env`.
- Do not commit API keys, database passwords, OAuth secrets, or private keys.

---

## Safe Handling of Credentials

- Configure `APP_KEY`, DB credentials, mail credentials, and third‑party APIs only through environment variables or secret managers.
- Ensure `APP_KEY` is strong and never shared publicly.
- Avoid logging credentials, full JWTs, or sensitive payloads.

---

## Dependency Hygiene

- Keep `composer.json` / `composer.lock` and frontend dependencies up to date.
- Run `composer update` and `npm update` periodically in development and review security advisories.
- Test changes in a non‑production environment before deploying major version upgrades.

---

## Logging and Debugging Caution

- In production:
  - Set `APP_DEBUG=false`.
  - Limit logging to necessary information; avoid logging full request bodies containing personal data.
- Restrict access to logs and error traces; they may contain internal details useful to an attacker.

