# Hobbyist Haven Backend

Express.js backend API for the Hobbyist Haven project, featuring Prisma ORM, PostgreSQL database, and Clerk authentication.

## Prerequisites

- Node.js 18+
- PostgreSQL database
- Clerk account for authentication

## Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/hobbyist-haven-backend.git
cd hobbyist-haven-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/hobbyist_haven"
CLERK_SECRET_KEY=your_clerk_secret_key_here
CORS_ORIGIN=http://localhost:8080
PORT=3000
```

5. Set up the database:
```bash
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Documentation

Once the server is running, you can access the Swagger API documentation at:
http://localhost:3000/api-docs

## Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build the project
- `npm start`: Start production server
- `npm run prisma:generate`: Generate Prisma client
- `npm run prisma:migrate`: Run database migrations

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `CLERK_SECRET_KEY`: Clerk authentication secret key
- `CORS_ORIGIN`: Frontend URL for CORS (default: http://localhost:8080)
- `PORT`: Server port (default: 3000)

## Project Structure

```
├── prisma/
│   └── schema.prisma    # Database schema
├── src/
│   ├── index.ts         # Application entry point
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── swagger.ts       # API documentation
└── package.json
```

## API Routes

### Projects
- `GET /api/projects`: Get all projects
- `GET /api/projects/:id`: Get project by ID
- `POST /api/projects`: Create new project (requires authentication)
- `PUT /api/projects/:id`: Update project (requires authentication)
- `DELETE /api/projects/:id`: Delete project (requires authentication)

### Users
- `GET /api/users`: Get all users (requires admin)
- `PUT /api/users/:id/role`: Update user role (requires admin)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request