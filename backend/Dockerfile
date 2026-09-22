###############################################
#           NATIVE IMAGE (DEFAULT)
###############################################


# syntax=docker/dockerfile:1.7

# syntax=docker/dockerfile:1.7

# syntax=docker/dockerfile:1.7

FROM ghcr.io/graalvm/native-image-community:21 AS build

USER root

RUN microdnf install -y maven \
    && microdnf clean all

WORKDIR /workspace

COPY pom.xml ./

RUN --mount=type=cache,target=/root/.m2 \
    mvn -B -Pnative dependency:go-offline

COPY src ./src

RUN --mount=type=cache,target=/root/.m2 \
    mvn -B -Pnative clean package -DskipTests


FROM debian:bookworm-slim AS runtime

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        zlib1g \
    && rm -rf /var/lib/apt/lists/* \
    && useradd \
        --system \
        --uid 10001 \
        --create-home \
        --home-dir /app \
        appuser

WORKDIR /app

COPY --from=build \
    --chown=10001:10001 \
    /workspace/target/warrantyhub-api \
    /app/warrantyhub-api

USER 10001:10001

ENV TZ=UTC

EXPOSE 8080

ENTRYPOINT ["/app/warrantyhub-api"]



#######################################################################
#              SPRING BOOT JAR VERSION (COMMENTED)
#######################################################################

#FROM maven:3.9.12-eclipse-temurin-21 AS build
#
#WORKDIR /workspace
#
#COPY pom.xml .
#RUN mvn -B dependency:go-offline
#
#COPY src ./src
#
#RUN mvn -B clean package -DskipTests
#
#FROM eclipse-temurin:21-jre
#
#WORKDIR /app
#
#COPY --from=build /workspace/target/warrantyhub-0.0.1-SNAPSHOT.jar app.jar
#
#EXPOSE 8080
#
#ENTRYPOINT ["java","-jar","app.jar"]