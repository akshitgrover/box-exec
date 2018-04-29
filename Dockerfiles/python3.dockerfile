FROM alpine:latest

MAINTAINER Akshit Grover

RUN apk update && \
apk add python3