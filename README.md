.
├── apps
│   └── api                # Hono backend app (this repo)
│       ├── src
│       │   ├── config     # Config & env loaders
│       │   │   ├── env.ts
│       │   │   └── index.ts
│       │   ├── db         # Drizzle ORM schema & queries
│       │   │   ├── schema
│       │   │   │   ├── users.ts
│       │   │   │   ├── products.ts
│       │   │   │   └── ...
│       │   │   ├── migrations
│       │   │   ├── drizzle.config.ts
│       │   │   └── index.ts
│       │   ├── lib        # Core libraries (db, redis, minio, tus, jwt)
│       │   │   ├── drizzle.ts
│       │   │   ├── redis.ts
│       │   │   ├── minio.ts
│       │   │   ├── tus.ts
│       │   │   ├── jwt.ts
│       │   │   └── logger.ts
│       │   ├── services   # Core business logic grouped by domain
│       │   │   ├── auth
│       │   │   │   ├── auth.service.ts
│       │   │   │   ├── auth.controller.ts
│       │   │   │   ├── auth.routes.ts
│       │   │   │   └── auth.types.ts
│       │   │   ├── store
│       │   │   │   ├── store.service.ts
│       │   │   │   ├── store.controller.ts
│       │   │   │   ├── store.routes.ts
│       │   │   │   └── store.types.ts
│       │   │   └── admin
│       │   │       ├── admin.service.ts
│       │   │       ├── admin.controller.ts
│       │   │       ├── admin.routes.ts
│       │   │       └── admin.types.ts
│       │   ├── middleware # Global & route middlewares
│       │   │   ├── auth.ts
│       │   │   ├── errorHandler.ts
│       │   │   └── cors.ts
│       │   ├── sockets    # Socket.IO handlers
│       │   │   ├── index.ts
│       │   │   └── events
│       │   │       ├── chat.ts
│       │   │       ├── notifications.ts
│       │   │       └── ...
│       │   ├── utils      # Shared utilities
│       │   │   ├── password.ts
│       │   │   ├── date.ts
│       │   │   └── ...
│       │   ├── app.ts     # Hono instance & routes mounting
│       │   └── server.ts  # HTTP + WebSocket server entry
│       ├── package.json
│       ├── tsconfig.json
│       └── bunfig.toml
├── packages               # Shared packages for monorepo
│   ├── types              # Shared TypeScript types/interfaces
│   ├── config             # Shared config utilities
│   └── utils              # Generic helper functions
├── docker
│   ├── docker-compose.yml # PostgreSQL, Redis, MinIO, etc.
│   ├── minio.config
│   ├── redis.config
│   └── ...
└── package.json
