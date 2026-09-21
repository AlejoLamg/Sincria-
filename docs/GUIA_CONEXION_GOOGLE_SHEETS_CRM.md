# 📊 GUÍA DE CONEXIÓN INMEDIATA: GOOGLE SHEETS CRM
## SincroIA — Registro Automático de Leads en la Nube (100% Gratuito y sin Zapier)

**Propósito:** Esta guía te permite conectar en **2 minutos** tu formulario web (`https://www.sincroia.lat`) con una hoja de cálculo en **Google Sheets**, de modo que cada vez que un prospecto envíe el formulario, se cree automáticamente una nueva fila con todos sus datos organizada cronológicamente.

---

### PASO 1: Crear la Hoja de Cálculo en Google Drive
1. Entra a [drive.google.com](https://drive.google.com) o [sheets.new](https://sheets.new).
2. Crea una nueva hoja de cálculo y ponle de nombre:
   ```text
   SincroIA - CRM Oficial de Leads
   ```
3. En la primera fila (Fila 1), escribe estos encabezados en cada columna:
   * **Columna A:** `Fecha y Hora (Bogotá)`
   * **Columna B:** `Nombre del Prospecto`
   * **Columna C:** `Teléfono / WhatsApp`
   * **Columna D:** `Enlace Directo WhatsApp`
   * **Columna E:** `Correo Electrónico`
   * **Columna F:** `Plan / Objetivo`
   * **Columna G:** `Inversión Estimada`
   * **Columna H:** `Comentarios y Módulos`
   * **Columna I:** `Estado Comercial` *(Nuevo / Contactado / Meet Agendado / Cerrado)*

*(Tip: Ponle negrita y fondo azul oscuro con letras blancas a la Fila 1 para que se vea como un CRM profesional).*

---

### PASO 2: Pegar el Código en Google Apps Script
1. En el menú superior de tu Google Sheet, haz clic en **Extensiones** → **Apps Script**.
2. Se abrirá una pestaña con un editor de código. Borra cualquier texto que haya en el archivo `Código.gs` y **pega exactamente este código**:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);

    var fecha = data.fecha || new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" });
    var nombre = data.nombre || "No especificado";
    var telefono = data.telefono || "";
    var cleanPhone = telefono.replace(/\D/g, "");
    var waLink = cleanPhone ? "https://wa.me/" + cleanPhone : "N/A";
    var email = data.email || "No especificado";
    var objetivo = data.objetivo || "Diagnóstico general";
    var inversion = data.inversionEstimada || "Por cotizar";
    var comentarios = data.comentarios || "Sin comentarios adicionales.";
    var estadoInicial = "🟡 Nuevo Lead";

    // Si la hoja está totalmente vacía, añade encabezados automáticamente
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Fecha y Hora (Bogotá)",
        "Nombre del Prospecto",
        "Teléfono / WhatsApp",
        "Enlace Directo WhatsApp",
        "Correo Electrónico",
        "Plan / Objetivo",
        "Inversión Estimada",
        "Comentarios y Módulos",
        "Estado Comercial"
      ]);
    }

    // Insertar la nueva fila con los datos del cliente
    sheet.appendRow([
      fecha,
      nombre,
      telefono,
      waLink,
      email,
      objetivo,
      inversion,
      comentarios,
      estadoInicial
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Lead registrado exitosamente" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

### PASO 3: Publicar como Aplicación Web (Obtener la URL)
1. Arriba a la derecha en la ventana de Apps Script, haz clic en el botón azul **Implementar** (*Deploy*) → **Nueva implementación** (*New deployment*).
2. En la ventana emergente, haz clic en el icono de engranaje ⚙️ (al lado de *"Seleccionar tipo"*) y elige **Aplicación web** (*Web app*).
3. Configura estos 3 campos:
   * **Descripción:** `SincroIA Leads Webhook`
   * **Ejecutar como:** **Yo (tu cuenta de Google)**
   * **Quién tiene acceso:** **Cualquiera** (*Anyone*) *(⚠️ Obligatorio para que la web pueda escribir en la hoja sin pedir contraseña).*
4. Haz clic en el botón azul **Implementar**.
5. Google te pedirá *"Autorizar acceso"*. Elige tu cuenta de Google → Haz clic en *Avanzado* → *Ir a SincroIA Leads Webhook (no seguro)* → Haz clic en *Permitir*.
6. Al finalizar, verás un campo que dice **URL de la aplicación web**. Se verá así:
   `https://script.google.com/macros/s/AKfycbx.../exec`
7. **Copia esa URL**.

---

### PASO 4: Conectar la URL a SincroIA

#### En tu archivo local `.env.local`:
Pega la URL en la variable `LEADS_WEBHOOK_URL`:
```env
LEADS_WEBHOOK_URL=https://script.google.com/macros/s/TU_CODIGO_DE_APPS_SCRIPT/exec
```

#### En Vercel (para la web pública en internet):
1. Entra a [vercel.com](https://vercel.com) → Tu proyecto → **Settings** → **Environment Variables**.
2. En **Key** escribe: `LEADS_WEBHOOK_URL`
3. En **Value** pega tu URL de Google Apps Script.
4. Guarda (*Save*) y haz un **Redeploy**.

---

### 🚀 Resultado
A partir de este momento, cada vez que alguien llene el formulario:
1. **Telegram te vibrará en menos de 1 segundo** con la alerta y el botón directo a WhatsApp.
2. **Google Sheets creará una nueva fila automáticamente** guardando al prospecto en tu base de datos histórica para seguimiento y remarketing.
