FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["app.server/app.server.csproj", "app.server/"]
RUN dotnet restore "app.server/app.server.csproj"
COPY . .
WORKDIR "/src/app.server"
RUN dotnet build "app.server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "app.server.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "app.server.dll"]
