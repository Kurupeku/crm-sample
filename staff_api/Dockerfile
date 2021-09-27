FROM golang:1.17.1 AS dev

ENV ROOT=/go/src/app
ENV CGO_ENABLED 0
WORKDIR ${ROOT}

COPY go.mod go.sum ./
RUN go mod download
EXPOSE 8080

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

EXPOSE 8080
CMD ["/go/src/app/binary"]
