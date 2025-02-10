FROM node:20-alpine AS base

FROM base AS  builder
WORKDIR /app
COPY . .
RUN npm ci && \
    npx prisma generate && \
    npm run build && \
    npm prune --production

FROM base AS runner
WORKDIR /app
RUN addgroup  --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nest
RUN chown -R nest:nodejs /app
COPY --from=builder --chown=nest:nodejs /app/dist /app/dist
COPY --from=builder --chown=nest:nodejs /app/node_modules /app/node_modules 
COPY --from=builder --chown=nest:nodejs /app/package.json /app/package.json
COPY --from=builder --chown=nest:nodejs /app/.env /app/.env
COPY --from=builder --chown=nest:nodejs /app/firebase.json /app/firebase.json
USER nest
EXPOSE 3000
CMD ["node","./dist/main"]

