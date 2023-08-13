FROM golang:1.21.0-bookworm AS dev

ENV ROOT /app
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

EXPOSE 50051

CMD ["go", "run", "main.go"]

# -------------------------------

FROM golang:1.21.0-bookworm AS builder

ENV ROOT /app
ENV GOOS linux
ENV GOARCH amd64

WORKDIR ${ROOT}

COPY . ${ROOT}
RUN go mod download && go build -o ${ROOT}/server

# -------------------------------

FROM bookworm-slim:12.1

ENV GO_ENV production
COPY --chown=nobody:nobody --from=builder ${ROOT}/server /usr/local/bin/${ROOT}

EXPOSE 50051
CMD ["server"]
