I was unable to retrieve the current `README.md` file. Let's start with creating a new one. Here is a draft:

---

# NestJS Starter

## Overview

This repository is a starter template for NestJS applications. It includes several essential features and configurations to help you get started quickly.

## Features

- **TypeORM Migration**: Seamlessly manage database migrations using TypeORM.
- **CLEAN Architecture**: Implement a clean architecture to maintain scalable and maintainable code.
- **gRPC**: Integrate gRPC for efficient communication between microservices.
- **GraphQL**: Use GraphQL to build flexible and efficient APIs.
- **Example API**: Includes examples for pagination, create, update, delete, and read operations.
- **Error Handling and Interceptors**: Centralized error handling and custom interceptors for enhanced functionality.

## Getting Started

### Prerequisites

- Node.js
- Bun
- Docker (optional for running databases)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/doannc2212/nestjs-starter.git
   cd nestjs-starter
   ```

2. Install dependencies:

   ```bash
   bun install
   ```

3. Configure environment variables by copying `.env.example` to `.env` and updating the values as needed.

### Running the Application

To start the application, use the following command:

```bash
bun start:dev
```

### Database Migration

To run database migrations, use the following command:

```bash
bun migration:run
```

To create database migrations, use the following command:

```bash
NAME=<migration-name> bun migration:create
```

### Using gRPC

To use gRPC, configure your services and proto files, and start the gRPC server:

### Using GraphQL

To use GraphQL, navigate to `/graphql` endpoint in your browser to access the GraphQL playground.

## Example API

### Pagination

Example code for pagination:

```typescript
@Get()
async findAll(@Query() query: PaginationQueryDto) {
  return this.service.findAll(query);
}
```

### Create, Update, Delete, Read Operations

Example code for creating a record:

```typescript
@Post()
async create(@Body() createDto: CreateDto) {
  return this.service.create(createDto);
}
```

## Error Handling and Interceptors

Centralized error handling and custom interceptors are configured to manage responses and errors efficiently.

## Features

- [x] Infrastrucutre
- [x] Aggregate
- [x] Repository
- [x] Presentation (graphql and grpc)
- [x] Service communication
- [ ] Pagination
- [ ] Observability
- [ ] Linter config (commitlint and eslint)
- [ ] Formatter
- [ ] First api example

## License

This project is licensed under the MIT License.

---

Feel free to update or add any specific details as needed.

---
