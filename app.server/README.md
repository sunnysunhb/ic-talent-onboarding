# Entity Framework Core Setup for .NET Core 8

This guide shows how to set up Entity Framework Core with Code First approach in a .NET Core 8 application. We provide two database options that work well for development.

## Option 1: SQL Server

SQL Server is the recommended option for Windows users and those familiar with Microsoft's database technology.

### Installation Steps

1. **Add required packages**:

```bash
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.SqlServer
```

2. **Install EF Core command-line tools**:

```bash
dotnet tool install --global dotnet-ef
```

3. **Configure your DbContext in Program.cs**:

```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

4. **Add connection string in appsettings.json**:

For Windows:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost\\SQLEXPRESS;Database=YourDatabase;Trusted_Connection=True;TrustServerCertificate=True"
}
```

For Mac users wanting to use SQL Server:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost,1433;Database=YourDatabase;User Id=sa;Password=YourStrongPassword!;TrustServerCertificate=True"
}
```

*Note: Mac users will need additional solutions for SQL Server such as Azure SQL Database, remote connections, or VMs.*

## Option 2: SQLite (Especially suitable for Mac users)

SQLite is a lightweight, file-based database that requires no installation or configuration. It's ideal for development and learning Entity Framework, especially on Mac.

### Installation Steps

1. **Add required packages**:

```bash
dotnet add package Microsoft.EntityFrameworkCore
dotnet add package Microsoft.EntityFrameworkCore.Tools
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Microsoft.EntityFrameworkCore.Sqlite
```

2. **Install EF Core command-line tools**:

```bash
dotnet tool install --global dotnet-ef
```

3. **Configure your DbContext in Program.cs**:

```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));
```

4. **Add connection string in appsettings.json**:

```json
"ConnectionStrings": {
  "DefaultConnection": "Data Source=app.db"
}
```

## Creating Models and DbContext (Same for Both Options)

1. **Create a models folder and add your entity classes**:

```csharp
public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Price { get; set; }
}
```

2. **Create a DbContext class**:

```csharp
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }
    
    public DbSet<Product> Products { get; set; }
}
```

## Using Entity Framework Migrations (Same for Both Options)

1. **Create your first migration**:

```bash
dotnet ef migrations add InitialCreate
```

2. **Apply the migration to create your database**:

```bash
dotnet ef database update
```

## Important Notes

- Both options work the same way with Entity Framework Core APIs - your C# code is identical
- LINQ queries work the same way with both providers
- Code First patterns are identical regardless of the database provider
- Windows users can easily use SQL Server directly
- Mac users may find SQLite simpler to set up without additional configuration

## Basic LINQ Usage

LINQ is built into .NET Core - no additional installations needed. Simply use:

```csharp
using System.Linq;

// Example LINQ query with EF Core
var expensiveProducts = await _context.Products
    .Where(p => p.Price > 100)
    .OrderBy(p => p.Name)
    .ToListAsync();
```
 

 