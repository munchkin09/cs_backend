# cs_ai_analyzer

## Description
Just a great idea being created

## Version
0.0.1

## Author
Ariadne & Munchkin

## License
SEE LICENSE IN LICENSE.MD

## Project Structure
```
.
├── .env.example
├── .gitignore
├── .nvmrc
├── jest.config.js
├── package-lock.json
├── package.json
├── README.MD
├── tsconfig.json
├── src/
│   ├── controllers/
│   │   ├── authentication.ts
│   │   ├── database.ts
│   │   └── gemini_implementation.ts
│   ├── controllers/db/
│   │   └── schemas.ts
│   ├── index.ts
│   ├── routes/
│   │   └── v1/
│   │       ├── auth.ts
│   │       └── user.ts
│   └── types/
│       ├── auth.ts
│       ├── database.ts
│       ├── index.ts
│       └── llm.ts
└── tests/
    └── tests.test.ts
```

## Dependencies
*   `@google/genai`: 1.4.0
*   `express`: 5.1.0
*   `express-session`: 1.18.1
*   `helmet`: 8.1.0
*   `mongoose`: 8.15.1
*   `passport`: 0.7.0
*   `passport-steam`: 1.0.18

## Development Dependencies
*   `@jest/globals`: 30.0.0-beta.3
*   `@types/express`: 5.0.3
*   `@types/express-session`: 1.18.2
*   `@types/passport-steam`: 1.0.6
*   `@types/typescript`: 0.4.29
*   `jest`: 29.7.0
*   `ts-jest`: 29.3.4
*   `tsx`: 4.19.4
*   `typescript`: 5.8.3

## Scripts
*   `test`: Run tests using Jest.
*   `test:watch`: Run tests in watch mode.
*   `test:coverage`: Generate test coverage report.
*   `test:coverage:watch`: Generate test coverage report in watch mode.
*   `start:dev`: (Script not defined in package.json)

## Endpoints

The application exposes the following endpoints:

*   `GET /`: Returns a JSON object with the message `API running`.
*   `/api/v1/auth`: Handles authentication-related routes (defined in `src/routes/v1/auth.ts`).
*   `/api/v1/users`: Handles user-related routes (defined in `src/routes/v1/user.ts`).
