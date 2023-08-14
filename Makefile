protobuf-gen:
	protoc --go_out=./auth_api --go-grpc_out=./auth_api proto/auth.proto
	protoc --go_out=./gateway --go-grpc_out=./gateway proto/auth.proto
