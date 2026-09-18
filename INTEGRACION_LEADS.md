# 🚀 Guía Rápida de Integraciones y Notificaciones en SincroIA.lat

Esta guía te permite activar en 5 minutos las alertas inmediatas en tu celular y tu CRM en Google Sheets, sin servidores ni bases de datos complejas.

---

## 📱 1. Alertas Inmediatas en tu Celular (Telegram Bot en < 1 segundo)

Cada vez que un cliente llene el formulario de cotización, tu celular sonará con una notificación push que incluye nombre, email, plan, presupuesto en COP y un **enlace directo para chatear con él en WhatsApp en 1 solo clic**.

### Pasos para activarlo (Toma 2 minutos):
1. Abre Telegram y busca a **`@BotFather`** (el bot oficial de Telegram con la insignia azul).
2. Escríbele el comando: `/newbot`.
3. Sigue las instrucciones: asígnale un nombre (ej. `SincroIA Leads`) y un usuario (ej. `SincroIALeadsBot`).
4. `@BotFather` te responderá entregándote tu **Token de API** (un código largo como `7891234567:AAFnK...`).
5. Ahora busca en Telegram a **`@userinfobot`** y dale clic en "Iniciar". Te devolverá tu **Id numérico** (ej. `123456789`).
6. En tu bot recién creado, dale clic en **"Iniciar"** para abrir el canal de mensajes.
7. Guarda estas dos variables en tu archivo `.env.local` (y en las Variables de Entorno de tu proyecto en Vercel):
   ```env
   TELEGRAM_BOT_TOKEN=tu_token_aqui
   TELEGRAM_CHAT_ID=tu_id_numerico_aqui
   ```
¡Listo! Desde ese momento, cada prospecto que cotice en la web te avisará al celular al instante.

---

## 📊 2. Conectar tu CRM en Google Sheets (100% Gratis)

Si quieres que cada cotización se guarde automáticamente en una hoja de cálculo en tu Google Drive:

1. Crea una nueva hoja de cálculo en **Google Sheets** (ej. llamada `Leads SincroIA`).
2. En la fila 1 escribe los encabezados de columna:
   `Fecha` | `Nombre` | `Email` | `Teléfono` | `Objetivo / Plan` | `Inversión Estimada` | `Comentarios`
3. En el menú superior de Google Sheets, ve a **Extensiones** > **Apps Script**.
4. Borra el código existente y pega exactamente este script:
   ```javascript
   function doPost(e) {
     try {
       var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
       var data = JSON.parse(e.postData.contents);
       
       sheet.appendRow([
         data.fecha || new Date().toLocaleString("es-CO"),
         data.nombre || "",
         data.email || "",
         data.telefono || "",
         data.objetivo || "",
         data.inversionEstimada || "",
         data.comentarios || ""
       ]);
       
       return ContentService.createTextOutput(JSON.stringify({"result": "success"}))
         .setMimeType(ContentService.MimeType.JSON);
     } catch (error) {
       return ContentService.createTextOutput(JSON.stringify({"result": "error", "error": error.toString()}))
         .setMimeType(ContentService.MimeType.JSON);
     }
   }
   ```
5. Haz clic en **Implementar** (botón azul arriba a la derecha) > **Nueva implementación**.
6. En tipo selecciona **Aplicación web**.
   - En *Quién tiene acceso*: Selecciona **Cualquier usuario** (*Anyone*).
7. Haz clic en **Implementar**, autoriza los permisos y copia la **URL de la aplicación web**.
8. Pega esa URL en tu `.env.local` y en Vercel:
   ```env
   LEADS_WEBHOOK_URL=https://script.google.com/macros/s/AKfycby.../exec
   ```

---

## 📞 3. Configurar tu Nuevo Número de WhatsApp (SIM Card)

En cuanto compres tu SIM card mañana:
1. Añade el número en tu `.env.local` y en Vercel con el código de país (57 para Colombia), sin signos `+` ni espacios:
   ```env
   NEXT_PUBLIC_WHATSAPP_NUMBER=573001234567
   ```
2. La web actualizará automáticamente todos los enlaces de contacto y el botón proactivo de WhatsApp.

---

## 📈 4. Conectar Google Analytics 4

1. Crea tu propiedad en [Google Analytics](https://analytics.google.com).
2. Copia tu ID de medición (formato `G-XXXXXXXXXX`).
3. Añádelo a tu `.env.local` y en Vercel:
   ```env
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
El código ya está programado con `next/script` y empezará a registrar visitas, conversiones y tiempos de permanencia sin penalizar la velocidad de la web.

---

## 🔍 5. Conectar Google Search Console

1. Entra a [Google Search Console](https://search.google.com/search-console).
2. Agrega una nueva propiedad seleccionando **Prefijo de la URL** y escribe:
   `https://sincroia.lat`
3. En los métodos de verificación, despliega **Etiqueta HTML**.
4. Verás una etiqueta similar a:
   `<meta name="google-site-verification" content="TU_CODIGO_AQUI" />`
5. Copia únicamente el valor dentro de las comillas (`TU_CODIGO_AQUI`) y pégalo en tu `.env.local` y en Vercel:
   ```env
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=TU_CODIGO_AQUI
   ```
   *(También puedes enviármelo aquí directamente y yo te lo inyecto en el código).*
6. Una vez desplegado, haz clic en **Verificar** en Search Console.
7. **Paso final en Search Console:** Ve a la pestaña **Sitemaps** en el menú lateral izquierdo y envía tu sitemap:
   `https://sincroia.lat/sitemap.xml`

