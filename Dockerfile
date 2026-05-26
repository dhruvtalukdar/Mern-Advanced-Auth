# ============================================
# AuthKit Pro — Production Dockerfile
# ============================================

FROM node:20-alpine AS base
WORKDIR /app

# -------- Dependencies --------
FROM base AS deps
COPY package*.json ./
COPY frontend/package*.json ./frontend/
RUN npm ci --omit=dev
RUN cd frontend && npm ci

# -------- Build Frontend --------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY . .
RUN npm run build --prefix frontend

# -------- Production --------
FROM base AS runner
ENV NODE_ENV=production

# Copy backend dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./

# Copy backend source
COPY backend ./backend

# Copy built frontend
COPY --from=builder /app/frontend/dist ./frontend/dist

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

# Start server
CMD ["node", "backend/index.js"]
