# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (use ci for reproducible installs)
RUN npm ci

# Copy source code
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./
COPY *.config.* ./
COPY *.json ./

# Accept build arguments
ARG VITE_API_BASE_URL
ARG VITE_AGENT_URL
ARG VITE_SAAS_APP_URL
ARG VITE_FRONTEND_URL
ARG VITE_DASHBOARD_DOMAIN_URL
ARG VITE_ENABLE_LOGGING=true

# Set production environment for build stage
ENV NODE_ENV=production
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_AGENT_URL=${VITE_AGENT_URL}
ENV VITE_SAAS_APP_URL=${VITE_SAAS_APP_URL}
ENV VITE_FRONTEND_URL=${VITE_FRONTEND_URL}
ENV VITE_DASHBOARD_DOMAIN_URL=${VITE_DASHBOARD_DOMAIN_URL}
ENV VITE_ENABLE_LOGGING=${VITE_ENABLE_LOGGING}

# Build the app for production
RUN npm run build:production

# Production stage - use nginx for better static asset handling
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /app/dist

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 3000
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
