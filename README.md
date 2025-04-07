# React SPA Onboarding Project

.NET 8.0 React SPA with Pages for Talent Developers Onboarding Task

## Project Setup

### Prerequisites
- .NET 8.0 SDK
- Node.js (v16 or higher)
- Git
- SQLite or SQL Server Express (for local development)

### Initial Setup Steps

1. **Clone the Repository**:
   ```bash
   git clone https://mvpstudio.git.server/talent-onboarding/react-spa.git
   cd react-spa
   ```

2. **Install Dependencies**:
    - For backend:
      ```bash
      cd app.server
      dotnet restore
      ```
    - For frontend:
      ```bash
      cd app.client
      npm install
      ```

### Project Startup

1. **Start the .NET Server**:
    - Navigate to `app.server` directory and run:
      ```bash
      dotnet watch
      ```
    - This will start the API server on http://localhost:5158
    - dotnet watch / dotnet run both run the apps, watch will run the hot reload

2. **Start the React Client**:
    - Navigate to `app.client` directory and run:
      ```bash
      npm run dev
      ```
    - This will start the React development server on http://localhost:5173

3. **Database Setup**:
    - The application is configured to use SQLite by default. The connection string is in `appsettings.json`.
    - To initialize the database for the first time:
      ```bash
      cd app.server
      dotnet ef database update
      ```
    - To create a new migration after model changes:
      ```bash
      dotnet ef migrations add [MigrationName]
      dotnet ef database update
      ```

## Development Guidelines

### Goal:
- **Build an MVC Application**: Develop a robust application following MVC principles.
- **Use SQL Database**: Implement SQL Database for data storage and retrieval.
- **Database Setup**:
    - Choose between **code-first** or **db-first** approaches for creating and managing your database.
    - Follow best practices in table creation, indexing, and data modeling.
- **Front-End Development**:
    - Develop the front-end using **ReactJS**, powered by **Vite** for fast builds and hot-reloading.
    - Use Redux Toolkit to manage application state.
    - Create reusable components for consistent UI patterns.
- **Practice CRUD Operations**: Implement create, read, update, and delete functionalities across the application to enhance data management skills.

## Deployment

The recommended way to deploy this application is by using Docker Compose.

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

## Troubleshooting

### Common Issues

1. **CORS errors**:
    - Check that the CORS policy in `Program.cs` includes your client origin.

2. **Database connection issues**:
    - Verify your connection string in `appsettings.json`
    - Ensure the database exists and is accessible

3. **npm dependency issues**:
    - Try running `npm clean-install` to reinstall all dependencies

### Getting Help

If you encounter issues not covered here, please:
1. Discuss with fellow interns in your cohort
2. Check the documentation for specific technologies
3. Reach out to your mentor with specific questions

Happy coding!