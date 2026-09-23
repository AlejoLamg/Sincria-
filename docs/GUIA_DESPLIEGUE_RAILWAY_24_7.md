# Guía Oficial de Despliegue 24/7 en Railway: Sofía IA (WhatsApp Bridge)

Esta guía documenta el procedimiento exacto paso a paso para desplegar el agente de WhatsApp de **SincroIA.lat** en la nube de **Railway** utilizando Docker y un Volumen Persistente.

---

## 🏛️ Arquitectura del Sistema en Producción

- **Vercel Edge:** Aloja el portal web público (`https://www.sincroia.lat`) y el endpoint del cerebro de IA (`/api/agent/chat` con Gemini 3.6 Flash).
- **Railway Cloud:** Aloja el contenedor Docker con el worker de Baileys (`scripts/whatsapp-bridge.js`), el servidor HTTP embebido para escanear el QR y el **Volumen Persistente** para conservar la sesión de WhatsApp activa para siempre.

---

## 📋 Requisitos Previos

1. Cuenta activa en [Railway.app](https://railway.app) (Plan gratuito o Hobby).
2. Repositorio de GitHub sincronizado (`https://github.com/AlejoLamg/Sincria-`).
3. Tu celular con WhatsApp Business a la mano para escanear el código QR por única vez.

---

## 🚀 Paso a Paso de Despliegue

### Paso 1: Crear el Proyecto en Railway
1. Ingresa a [railway.app](https://railway.app) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **"+ New Project"**.
3. Selecciona **"Deploy from GitHub repo"**.
4. Elige tu repositorio: `AlejoLamg/Sincria-`.
5. Railway detectará automáticamente el archivo `Dockerfile` y `railway.json`.

---

### Paso 2: Crear el Volumen Persistente (CRUCIAL ⚠️)
*Este paso garantiza que tu sesión de WhatsApp nunca se cierre al reiniciar o actualizar el contenedor.*

1. En el lienzo de tu proyecto en Railway, haz clic sobre el servicio recién creado.
2. Ve a la pestaña **"Volumes"** (o en **Settings** -> **Volumes**).
3. Haz clic en **"+ Add Volume"** (o **"New Volume"**).
4. En el campo **Mount Path** ingresa exactamente:
   ```
   /app/whatsapp_auth
   ```
5. Haz clic en **Save** / **Add**.

---

### Paso 3: Configurar Variables de Entorno en Railway
1. En el mismo servicio de Railway, ve a la pestaña **"Variables"**.
2. Haz clic en **"+ New Variable"** o **"Raw Editor"** y agrega las siguientes variables:

```env
NODE_ENV=production
PORT=8080
WHATSAPP_AUTH_DIR=/app/whatsapp_auth
AGENT_API_URL=https://www.sincroia.lat/api/agent/chat
TELEGRAM_BOT_TOKEN=8594951111:AAF6L7oJ7ZqC-Z0R3Z1zXm4m6q7x8y9z0a1
TELEGRAM_CHAT_ID=6058097987
```
*(Nota: Asegúrate de que `TELEGRAM_BOT_TOKEN` y `TELEGRAM_CHAT_ID` coincidan con tus credenciales de `.env.local`).*

---

### Paso 4: Generar Dominio Público para Escanear el QR
1. En el servicio de Railway, ve a la pestaña **"Settings"**.
2. En la sección **"Networking"**, haz clic en el botón **"Generate Domain"**.
3. Railway te asignará una URL pública segura (ejemplo: `sincria-production.up.railway.app`).

---

### Paso 5: Escaneo Único del Código QR
1. Abre en tu navegador (en el celular o en la computadora) la URL generada en el Paso 4.
2. Verás la interfaz web de SincroIA con el **Código QR en vivo**.
3. En tu celular:
   - Abre **WhatsApp Business**.
   - Toca Ajustes o los tres puntos ⋮ -> **Dispositivos vinculados**.
   - Toca **Vincular un dispositivo** y apunta tu cámara al código QR en pantalla.
4. En cuestión de 3 segundos, la página web cambiará a verde con el mensaje:
   **"¡Sofía IA Conectada 24/7!"**.
5. Simultáneamente recibirás una notificación en tu Telegram:
   `🎉 SINCROIA - SOFÍA IA CONECTADA 24/7 EN RAILWAY`.

---

## 🛡️ Monitoreo y Resiliencia

- **Healthcheck Automático:** Railway verifica cada 30 segundos el endpoint `/health`. Si el contenedor experimenta cualquier anomalía, lo reinicia en automático.
- **Persistencia Total:** Gracias al volumen `/app/whatsapp_auth`, cualquier redeploy o reinicio automático reanuda la sesión de WhatsApp en <3 segundos sin pedir QR.
- **Relevo Humano:** Si tú (Alejo) escribes directamente desde tu celular en cualquier chat, el bot se silencia durante 2 horas en ese chat para permitirte atender al cliente personalmente.
- **Alertas de Desconexión:** Si por alguna razón cierras la sesión desde WhatsApp en tu celular, el bot enviará una alerta push a Telegram con el enlace directo para escanear el nuevo QR.
