FROM golang:1.17.1 AS dev

ENV ROOT=/go/src/app
ENV CGO_ENABLED 0
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

EXPOSE 3000
CMD ["go", "run", "main.go"]


FROM golang:1.17.1 AS builder

ENV ROOT=/go/src/app
ENV CGO_ENABLED=0
ENV GOOS=linux

WORKDIR ${ROOT}

COPY go.mod go.sum ./
RUN go mod download

COPY . ${ROOT}
RUN go build -o $ROOT/binary


FROM scratch as prod

ENV ROOT=/go/src/app
WORKDIR ${ROOT}
COPY --from=builder ${ROOT}/binary ${ROOT}

EXPOSE 3000
CMD ["/go/src/app/binary"]
