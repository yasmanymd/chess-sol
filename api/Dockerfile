FROM mcr.microsoft.com/dotnet/sdk:7.0 AS development
# Use native linux file polling for better performance
ENV DOTNET_USE_POLLING_FILE_WATCHER 1
WORKDIR /usr/src/app

COPY api.csproj ./
RUN dotnet restore

EXPOSE 5000

ENTRYPOINT dotnet watch run --urls=http://+:5000