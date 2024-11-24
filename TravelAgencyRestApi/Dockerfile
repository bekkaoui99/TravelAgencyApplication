FROM maven:3.8.7-openjdk-18 as builder
WORKDIR /build
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

FROM amazoncorretto:17
WORKDIR /app
COPY --from=builder /build/target/*.jar /app/
EXPOSE 8888
CMD java -jar TravelAgencyRestApi.jar