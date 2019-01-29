FROM alpine:latest

MAINTAINER Akshit Grover

RUN apk add openjdk8 && \
rm -rf /var/cache/apk

ENV PATH "/usr/lib/jvm/java-1.8-openjdk/bin:$PATH"
