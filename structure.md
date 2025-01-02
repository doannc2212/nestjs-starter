## Source code structure

```
├── om-trm-backend
│   ├── migrations
│   │   └── some-migration.ts
│   ├── src
│   │   ├── application
│   │   │   └── usecase
│   │   │       └── agreement
│   │   ├── domain
│   │   │   ├── abstracts
│   │   │   ├── common
│   │   │   │   └── interfaces
│   │   │   ├── constants
│   │   │   ├── enums
│   │   │   ├── entities
│   │   │   ├── interfaces
│   │   │   │   ├── proto-gen
│   │   │   │   │   ├── base
│   │   │   │   │   ├── models
│   │   │   │   │   └── services
│   │   │   │   ├── request
│   │   │   │   └── response
│   │   │   └── usecase
│   │   │       └── agreement
│   │   ├── infrastructure
│   │   │   ├── common
│   │   │   │   ├── dto
│   │   │   │   └── enums
│   │   │   ├── config
│   │   │   ├── databases
│   │   │   │   ├── entities
│   │   │   │   ├── repositories
│   │   │   │   └── trm
│   │   │   ├── grpc
│   │   │   └── repositories
│   │   └── presentation
│   │       ├── common
│   │       │   └── interfaces
│   │       ├── grpc
│   │       │   └── agreement
│   │       └── interceptors
│   └── test
│       ├── application
│       │   └── usecase
│       │       └── agreement
│       ├── mockup
│       │   ├── modules
│       │   ├── repository
│       │   ├── services
│       │   └── usecases
│       └── presentation
│           ├── grpc
│           │   └── agreement
│           └── interceptors

```

## Using for function

1. src/application: Application Layer: This layer contains application logic, which focuses on processing specific operations of the application.

- usecase: Each Use Case usually represents a specific feature of the application (Implement).

- services: Services that support general business processing, can be reused in Use Cases.

- utils: Utility functions for general processing.

2. src/domain: Domain Layer: This is the core layer of the application, where core concepts related to the business are defined. All important business logic will reside here.

- abstracts: Contains abstract classes to define basic object base on business.

- constants: Contains commonly used constants used throughout the system.

- entities: Represents business entities, which model the main data and behavior of the system.

- enums: Defines enums related to business rules or processes.

- interfaces: Declares interfaces for domain services.

- repositories: Contains repository interfaces (not implementations) to abstract database operations.

- usecase: Abstracts use cases for high-level interaction definitions.

3. src/presentation: Presentation Layer: This layer manages the interaction with external systems or users (e.g., via APIs or gRPC endpoints).

- grpc: Implements handlers or controllers to process gRPC requests.

- interceptors: Contains interceptors for processing requests, responses, or middleware-like behaviors.

4. src/infrastructure: Infrastructure Layer: This layer handles technical implementations, such as integrations with external systems or databases.

- config: Configuration files for environment variables, databases, etc.

- databases: Database connections, schemas, or migration scripts.

- decorators: Custom decorators for various functionalities.

- grpc: Defines protocols and communication through gRPC (Remote Procedure Call).

- repositories: Implements repository interfaces from the domain layer.

4. app.module.ts: The root module file that ties all layers (application, domain, infrastructure, presentation) together.

## Using for unit test

- test/infrastructure: Tests for use cases in the application layer.

- test/presentation: Tests for API or gRPC interaction in the presentation layer.
