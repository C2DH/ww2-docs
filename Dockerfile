FROM node:22 AS builder

ARG GIT_TAG
ARG GIT_BRANCH
ARG GIT_REVISION

WORKDIR /app

COPY package.json .
COPY package-lock.json .


RUN npm install

COPY LICENSE .
COPY vite.config.js .
COPY .eslintrc.cjs .
COPY public public
COPY src src
COPY docs docs
COPY index.html .
COPY docs.html .


ENV NODE_ENV production


RUN npm run build

RUN echo '{' \
        '"gitTag": "'${GIT_TAG}'",' \
        '"gitBranch": "'${GIT_BRANCH}'",' \
        '"gitRevision": "'${GIT_REVISION}'"' \
        '}' > dist/version.json

FROM busybox:stable
WORKDIR /app

COPY --from=builder /app/dist ./
