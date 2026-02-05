# GupShup

Full-stack real-time chat application (React + Vite, Express + Socket.IO, MongoDB, Redis, Cloudinary) — Docker-enabled.

---

## Project Overview

GupShup is a modern real-time chat application implemented with a React (Vite) frontend and an Express backend using Socket.IO for real-time messaging. It supports one-to-one and group conversations, image uploads via Cloudinary, persistent storage in MongoDB, and Redis for pub/sub and potential caching.

Key features
- Real-time messaging (Socket.IO)
- Persistent conversations and message history (MongoDB)
- Group conversations with unread counters
- Image uploads (Cloudinary)
- Redis Pub/Sub for cross-instance message propagation
- Docker + docker-compose for local development

---

## Tech Stack

- Frontend: React (Vite), Tailwind (optional), Socket.IO client
- Backend: Node.js (ESM), Express.js, Socket.IO
- Database: MongoDB (Atlas or local)
- Pub/Sub & cache: Redis (ioredis)
- Media: Cloudinary
- Dev/Container: Docker, docker-compose

---

## System Architecture

Mermaid diagram (renderers that support mermaid will show this graph):

```mermaid
flowchart LR
  subgraph FE[Frontend]
    A[Browser / React (5174)]
  end

  subgraph BE[Backend]
    B[Express + Socket.IO (7000)]
    D[(Redis Pub/Sub)]
    M[(MongoDB Atlas)]
    C[Cloudinary]
  end

  A -- HTTP / WebSocket --> B
  B -- read/write --> M
  B -- publish/subscribe --> D
  B -- upload/download --> C
  D -- notify --> B

  style FE fill:#f9f,stroke:#333,stroke-width:1px
  style BE fill:#fffbcc,stroke:#333,stroke-width:1px
```

Architecture notes
- The frontend connects to the backend via HTTP for REST endpoints and uses Socket.IO for events like `send-message`, `receive-message`, and `message:seen`.
- Backend persists users, conversations, and messages in MongoDB. Redis is used for Pub/Sub to scale across multiple backend instances.
- Cloudinary stores uploaded images; the backend exposes `/public` to serve static content created during uploads.

---

## Repository Layout

- `backend/` — Express API, Socket.IO, database models, routes and controllers.
- `frontend/` — React (Vite) single-page app and socket client.
- `docker-compose.yml` — service orchestration for local development.

See specific files for implementation details, for example: `backend/index.js`, `frontend/src/socket.js`, `backend/models/*.js`.

---

## Environment & Configuration

Required environment variables (common)

```
PORT=7000
MONGODB_URL=<mongo connection string>
JWT_SECRET=<jwt secret>
# Cloudinary
CLOUD_NAME=<cloudinary cloud name>
API_KEY=<cloudinary api key>
API_SECRET=<cloudinary api secret>
# Redis (optional defaults used by ioredis if not provided)
REDIS_URL=redis://<host>:<port>
```

The project includes a `docker-compose.yml` with example values for quick local usage.

---

## Quick Start — Local (no Docker)

Prerequisites: Node 18+, npm, MongoDB (or Atlas), Redis (optional), Cloudinary account (optional)

1. Clone the repo and install dependencies

```bash
cd backend
npm install
cd ../frontend
npm install
```

2. Create a `.env` in `backend/` with the variables above.

3. Run backend and frontend in development

```bash
# Backend (hot-reload)
cd backend
npm run dev

# Frontend (Vite)
cd ../frontend
npm run dev
```

4. Open the frontend at `http://localhost:5174`.

Notes
- The frontend socket client connects to `http://localhost:7000` by default (`frontend/src/socket.js`). Ensure the backend `PORT` is set accordingly.

---

## Quick Start — Docker (recommended for parity)

Start with Docker Compose (from project root):

```bash
docker-compose up --build
```

This will build `backend` and `frontend` containers and expose ports configured in `docker-compose.yml` (frontend 5174, backend 7000).

---

## API Reference (routes)

Base path: `/api`

- Auth (`/api/auth`)
  - `POST /signup` — register new user
  - `POST /login` — login (returns JWT cookie)
  - `GET /logout` — clear auth cookie

- User (`/api/user`)
  - `GET /current` — get authenticated user (`isAuth` middleware)
  - `PUT /profile` — update profile (multipart: `image` via `multer`)
  - `GET /other` — get another user's details
  - `GET /all` — list users

- Message (`/api/message`)
  - `POST /upload-image` — upload image for message (auth)
  - `POST /send/:reciever` — send direct message (auth)
  - `GET /get/:reciever` — get conversation messages with a receiver (auth)

- Group (`/api/group`)
  - `POST /create-group` — create a group (auth)
  # GupShup

  > Full-stack real-time chat application (React + Vite, Express + Socket.IO, MongoDB, Redis, Cloudinary) — Docker-enabled.

  ![Status](https://img.shields.io/badge/status-active-brightgreen) ![Node](https://img.shields.io/badge/node-%3E%3D18-blue) ![License](https://img.shields.io/badge/license-MIT-lightgrey)

  ---

  ## Table of Contents

  - [Project Overview](#project-overview)
  - [Tech Stack](#tech-stack)
  - [System Architecture](#system-architecture)
  - [Quick Start](#quick-start)
  - [Environment Variables (.env)](#environment-variables-env)
  - [API Reference & Examples](#api-reference--examples)
  - [Socket Events](#socket-events)
  - [Swagger / API Docs](#swagger--api-docs)
  - [Docker & Deployment](#docker--deployment)
  - [Production Notes & Scaling](#production-notes--scaling)
  - [Observability & Monitoring](#observability--monitoring)
  - [Contributing](#contributing)
  - [Troubleshooting](#troubleshooting)
  - [License](#license)

  ---

  ## Project Overview

  GupShup is a real-time chat application with support for direct and group messaging, image attachments, message read receipts, and persistent conversation history. It is designed for local development and can be scaled horizontally using Redis for Pub/Sub and a shared MongoDB datastore.

  ### Key features
  - Real-time messaging with Socket.IO
  - One-to-one and group conversations
  - Image attachments via Cloudinary
  - Persistent messages and conversation metadata in MongoDB
  - Unread counters per conversation (stored in a Map)
  - Redis Pub/Sub for cross-instance event propagation
  - Dockerized development via `docker-compose`

  ---

  ## Tech Stack

  - Frontend: React (Vite), React Router, Redux Toolkit, Socket.IO client
  - Backend: Node.js (ESM), Express, Socket.IO, Mongoose
  - Database: MongoDB (Atlas or local)
  - Pub/Sub & caching: Redis (ioredis)
  - Media storage: Cloudinary
  - Dev tools: Docker, docker-compose, nodemon

  ---

  ## System Architecture

  The backend exposes REST endpoints for user and message management and a Socket.IO server for real-time updates. Redis is used to synchronize messages across multiple backend instances (subscriber/publisher), while MongoDB stores users, messages, and conversations. Cloudinary stores uploaded images. The frontend connects using both HTTP (for REST) and WebSocket (Socket.IO) for real-time events.

  Mermaid diagram:

  ```mermaid
  flowchart LR
    Browser[Browser / React] -->|HTTP / WebSocket| Backend[Express + Socket.IO]
    Backend -->|read/write| Mongo[(MongoDB)]
    Backend -->|pub/sub| Redis[(Redis Pub/Sub)]
    Backend -->|upload/download| Cloudinary[(Cloudinary)]
    Redis --> Backend
  ```

  ---

  ## Quick Start

  Prerequisites: Node >= 18, npm, (optional) Docker, MongoDB/Atlas, Redis, Cloudinary account.

  Local (no Docker):

  ```bash
  # Backend
  cd backend
  npm install
  cp .env.example .env    # create .env and edit values
  npm run dev

  # Frontend
  cd ../frontend
  npm install
  npm run dev

  # Open http://localhost:5174
  ```

  Docker (recommended for parity):

  ```bash
  docker-compose up --build
  ```

  ---

  ## Environment Variables (.env)

  Create `backend/.env` with the following example values (keep secrets out of source control):

  ```env
  PORT=7000
  MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/GupShup?retryWrites=true&w=majority
  JWT_SECRET=change_this_to_a_strong_secret

  # Cloudinary
  CLOUD_NAME=your_cloud_name
  API_KEY=your_api_key
  API_SECRET=your_api_secret

  # Redis (optional)
  REDIS_URL=redis://localhost:6379

  # Optional: override socket client origin in frontend/src/socket.js if needed
  ```

  Add `.env` to `.gitignore` to avoid leaks.

  ---

  ## API Reference & Examples

  Base path: `/api`

  Authentication example (cURL)

  Register (signup):

  ```bash
  curl -X POST http://localhost:7000/api/auth/signup \
    -H "Content-Type: application/json" \
    -d '{"name":"Alice","userName":"alice","email":"alice@example.com","password":"pass123"}'
  ```

  Login (returns cookie):

  ```bash
  curl -i -X POST http://localhost:7000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"alice@example.com","password":"pass123"}'
  ```

  Get current user (requires cookie set by login):

  ```bash
  curl -X GET http://localhost:7000/api/user/current --cookie "connect.sid=<your_cookie_here>"
  ```

  Send a direct message (REST endpoint used by app; real-time send uses socket):

  ```bash
  curl -X POST http://localhost:7000/api/message/send/<receiverId> \
    -H "Authorization: Bearer <token>" \
    -F "message=Hello from curl"
  ```

  See controllers in [backend/controllers](backend/controllers) for exact response shapes.

  ---

  ## Socket Events (examples)

  Client -> Server
  - `join`: payload: `userId` — join a personal room
  - `send-message`: payload example (JSON):

  ```json
  {
    "senderId": "641...",
    "receiverId": "642...",
    "message": "Hi!",
    "image": null,
    "conversationId": null,
    "isGroup": false
  }
  ```

  - `message:seen`: `{ messageIds: ["m1","m2"], userId: "641..." }`

  Server -> Client
  - `receive-message`: new message object
  - `message:seen:update`: `{ messageId, seenBy }`

  ---

  ## Swagger / API Docs

  The project includes `swagger-autogen` (see `backend/swagger-autogen.js`). To generate docs:

  ```bash
  cd backend
  node swagger-autogen.js
  # This creates swagger-output.json; server will serve it at /api-docs
  ```

  After generation open `http://localhost:7000/api-docs`.

  ---

  ## Docker & Deployment

  Development: `docker-compose up --build` will start `frontend` and `backend` services with ports mapped (see `docker-compose.yml`).

  Production notes (summary):
  - Build optimized frontend (`npm run build` in `frontend`) and serve with Nginx or static host.
  - Run backend with process manager (PM2) behind a reverse proxy (Nginx) and enable HTTPS.
  - Use environment-specific configuration (secrets via env vars or secret store).

  Example Nginx reverse-proxy snippet:

  ```nginx
  server {
    listen 80;
    server_name example.com;

    location / {
      proxy_pass http://localhost:5174; # frontend build served by vite preview or static files
    }

    location /api/ {
      proxy_pass http://localhost:7000;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
      proxy_set_header Host $host;
    }
  }
  ```

  ---

  ## Production Notes & Scaling

  - Use Redis Pub/Sub (already wired via `backend/config/redis.js`) to broadcast messages across app instances when scaling horizontally.
  - Use indexes in MongoDB for common queries (e.g., messages by conversation, conversations by participants). Add compound indexes where needed.
  - Consider sharding or using managed MongoDB for large datasets.
  - Rate-limit endpoints to prevent abuse (e.g., `express-rate-limit`).

  ---

  ## Observability & Monitoring

  - Add structured logging (winston/pino) and forward logs to a centralized logging system.
  - Add healthcheck endpoints and readiness probes (for container orchestration).
  - Consider Sentry for error monitoring and Prometheus/Grafana for metrics.

  ---

  ## Troubleshooting

  - Socket not connecting: verify `frontend/src/socket.js` URL and that backend `PORT` is accessible.
  - Image uploads failing: check Cloudinary credentials in `.env` and that temp files are writable.
  - DB connection errors: confirm `MONGODB_URL` and network access to Atlas or local instance.

  If you hit an issue, check backend logs (`docker-compose logs backend` or console) and browser console/network tab.

  ---

  ## Contributing

  1. Fork and create a branch.
  2. Make changes in a feature branch with descriptive commit messages.
  3. Run linters and tests (if added).
  4. Submit a pull request.

  ---

  ## Roadmap / Ideas

  - End-to-end tests for critical flows
  - Typing indicators and presence status
  - Message search and pagination
  - Delivery receipts (delivered vs seen)
  - Mobile-friendly PWA

  ---

  ## License

  MIT — see LICENSE or add one if desired.

  ---

  


