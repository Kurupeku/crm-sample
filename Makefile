protobuf-gen:
	protoc --go_out=./auth_api --go-grpc_out=./auth_api proto/auth.proto
	protoc --go_out=./gateway --go-grpc_out=./gateway proto/auth.proto

create-kind-cluster:
	kind create cluster --config=k8s/kind-config.yaml

delete-kind-cluster:
	kind delete cluster

apply-local:
	kubectl apply -k k8s/override/local
	kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
	sleep 3
	kubectl wait --namespace ingress-nginx --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller --timeout=90s

delete-local:
	kubectl delete -k k8s/override/local
	kubectl delete -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml
