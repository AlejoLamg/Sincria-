# Imagen base Node.js 20 Alpine (ultra liviana y eficiente)
FROM node:20-alpine

# Dependencias nativas mínimas
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copiar manifiesto de dependencias
COPY package.json ./

# Instalar dependencias omitiendo devDependencies
RUN npm install --omit=dev

# Copiar scripts del puente
COPY scripts/ ./scripts/

# Crear directorio para volumen persistente
RUN mkdir -p /app/whatsapp_auth && chmod -R 777 /app/whatsapp_auth

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=8080
ENV WHATSAPP_AUTH_DIR=/app/whatsapp_auth
ENV AGENT_API_URL=https://www.sincroia.lat/api/agent/chat

# Puerto HTTP para escanear QR y Healthcheck de Railway
EXPOSE 8080

# Iniciar el daemon 24/7
CMD ["node", "scripts/whatsapp-bridge.js"]
