FROM golang:1.17.1 AS dev

ENV GOPAHT /go
ENV ROOT /go/src/app
ENV CGO_ENABLED 0
ENV GO111MODULE on
WORKDIR ${ROOT}

RUN apt-get update -qq && apt-get install -y protobuf-compiler
COPY . ${ROOT}
RUN go mod download
RUN go get github.com/uudashr/gopkgs/v2/cmd/gopkgs \
  github.com/ramya-rao-a/go-outline \
  github.com/nsf/gocode \
  github.com/acroca/go-symbols \
  github.com/fatih/gomodifytags \
  github.com/josharian/impl \
  github.com/haya14busa/goplay/cmd/goplay \
  github.com/go-delve/delve/cmd/dlv \
  golang.org/x/lint/golint \
  golang.org/x/tools/gopls

EXPOSE ${PORT}
CMD ["/bin/sh", "-c", "go run main.go $PORT"]

# -------------------------------

FROM golang:1.17.1-alpine3.14 AS builder

ENV GO_ENV production
ENV GOPAHT /go
ENV ROOT /go/src/app
ENV CGO_ENABLED 0
ENV GOOS linux
ENV GO111MODULE on
ENV GOARCH amd64

WORKDIR ${ROOT}

COPY . ${ROOT}
RUN go mod download

# RUN go build -o ${ROOT}/binary
RUN go build -o ${ROOT}/binary

FROM alpine:3.14 as prod

ENV ROOT=/go/src/app
WORKDIR ${ROOT}
COPY --from=builder ${ROOT}/binary ${ROOT}

EXPOSE ${PORT}
CMD ["/bin/sh", "-c", "/go/src/app/binary $PORT"]
