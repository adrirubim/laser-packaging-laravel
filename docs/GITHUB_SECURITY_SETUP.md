# Configuración de Security en GitHub

Guía paso a paso para configurar las opciones de seguridad del repositorio [adrirubim/laser-packaging-laravel](https://github.com/adrirubim/laser-packaging-laravel).

---

## 1. Security policy (SECURITY.md)

### Qué es

Un archivo `SECURITY.md` en la raíz del repo que indica **cómo y a quién** reportar vulnerabilidades.

### Por qué

- **GitHub** muestra "No security policy detected" si no existe; con `SECURITY.md` aparece como configurado.
- Quien encuentre un fallo sabe **a quién contactar** (email) y **qué no hacer** (no abrir un issue público).
- Es una **buena práctica** recomendada por GitHub y por estándares de open source.

### Cómo (ya está en el repo)

El archivo `SECURITY.md` está en la raíz del proyecto. Solo tienes que:

1. Hacer commit y push de `SECURITY.md`.
2. En GitHub: **Security** → **Overview** → verás "Security policy: Enabled" (o "Set up" si aún no se ha detectado tras el push).

Si quieres cambiar el email o el texto, edita `SECURITY.md` en la raíz.

---

## 2. Dependabot alerts

### Qué es

GitHub analiza tus dependencias (`composer.json`, `package.json`, lockfiles) y **te avisa** cuando una tiene una vulnerabilidad conocida (CVE).

### Por qué

- Laravel, React, paquetes PHP y npm reciben parches de seguridad.
- Sin Dependabot es fácil **no enterarse** hasta que es tarde.
- En repos públicos es **gratis**; te llegan notificaciones y ves las alertas en **Security → Dependabot alerts**.

### Cómo (en la web de GitHub)

1. Abre el repo: [github.com/adrirubim/laser-packaging-laravel](https://github.com/adrirubim/laser-packaging-laravel).
2. Ve a **Settings** (pestaña del repo, no de tu perfil).
3. En el menú izquierdo: **Code security and analysis**.
4. En **Dependabot alerts** → clic en **Enable**.
5. (Opcional) Activa **Dependabot security updates**: GitHub abrirá PRs automáticos para actualizar dependencias vulnerables. Muy recomendable.

No hace falta tocar código; todo se configura desde la interfaz.

---

## 3. Dependabot security updates (recomendado)

### Qué es

Cuando Dependabot detecta una dependencia vulnerable, **crea un Pull Request** que actualiza solo esa dependencia a la versión segura.

### Por qué

- No solo te avisa: **te propone el fix** en un PR.
- Tú revisas, ejecutas tests y fusionas; el flujo es rápido y seguro.

### Cómo

En **Settings → Code security and analysis**, después de activar Dependabot alerts, activa **Dependabot security updates**.

---

## 4. Private vulnerability reporting

### Qué es

Permite que alguien reporte una vulnerabilidad **en privado** (sin abrir un issue público).

### Por qué

- Si alguien encuentra un fallo y solo puede abrir un issue público, el fallo se **divulga antes** de que puedas corregirlo.
- Con reporte privado: el investigador envía el reporte, tú lo arreglas y luego decidís si publicar un advisory; el proceso es **controlado**.

### Cómo (en la web de GitHub)

1. Repo → **Settings**.
2. En el menú izquierdo: **General** (primera opción).
3. Baja hasta la sección **Features**.
4. Activa **Private vulnerability reporting**.

---

## 5. Code scanning (opcional)

### Qué es

Análisis automático del código (por ejemplo con **CodeQL**) para detectar patrones inseguros o bugs típicos (inyección, XSS, uso incorrecto de APIs, etc.).

### Por qué

- Ayuda a encontrar **vulnerabilidades en tu código**, no solo en dependencias.
- En repos públicos, GitHub suele ofrecer **CodeQL gratis** (ver [documentación](https://docs.github.com/en/code-security/code-scanning)).

### Cómo (resumen)

1. Repo → **Settings → Code security and analysis**.
2. En **Code scanning** → **Set up** → elige **CodeQL** (o la opción que ofrezca GitHub).
3. GitHub te guía para crear un workflow en `.github/workflows/`; acepta los valores por defecto o personaliza (por ejemplo, solo en `push` a `main` y en `pull_request`).
4. Guarda el workflow; en el siguiente push/PR se ejecutará el análisis.

---

## 6. Secret scanning

### Qué es

GitHub escanea commits y PRs en busca de **secretos** (API keys, contraseñas, tokens) que no deberían estar en el repo.

### Por qué

- Evita que un `.env` o un token quede **expuesto** en el historial.
- En muchos repos públicos está **activado por defecto**; si ya ves "Enabled" en Security overview, no hace falta configurar nada más.

### Cómo

Si en **Security → Overview** aparece **Secret scanning: Enabled**, ya está activo. Si no, en **Settings → Code security and analysis** activa **Secret scanning**.

---

## Resumen rápido (orden sugerido)

| Paso | Dónde | Acción | Por qué |
|------|--------|--------|--------|
| 1 | Repo (archivo) | Subir `SECURITY.md` | Política de reporte clara |
| 2 | Settings → Code security and analysis | Enable **Dependabot alerts** | Avisos de dependencias vulnerables |
| 3 | Settings → Code security and analysis | Enable **Dependabot security updates** | PRs automáticos para parches |
| 4 | Settings → General → Features | Enable **Private vulnerability reporting** | Reportes privados |
| 5 | (Opcional) Settings → Code security and analysis | Set up **Code scanning** (CodeQL) | Análisis de código |

Tras el paso 1, en [Security overview](https://github.com/adrirubim/laser-packaging-laravel/security) deberías ver la política configurada; tras 2–4, las demás opciones activadas según lo que hayas elegido.
