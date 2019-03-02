FROM microsoft/dotnet:2.2-sdk AS build
WORKDIR /source

RUN curl -sL https://deb.nodesource.com/setup_10.x |  bash -
RUN apt-get install -y nodejs

# Copy csproj and restore as distinct layers
COPY *.csproj .
RUN dotnet restore

# Copy everything else and build
COPY ./ ./

RUN dotnet publish "./CrosswordFeud.csproj" --output "./dist" --configuration Release --no-restore

# Build runtime image
FROM microsoft/dotnet:2.2-aspnetcore-runtime
WORKDIR /app
COPY --from=build /source/dist .
EXPOSE 80
ENTRYPOINT ["dotnet", "CrosswordFeud.dll"]
