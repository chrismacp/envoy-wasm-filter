.PHONY: release build-filter deploy-envoy-v2 deploy-envoy-v3 push-image

release:
	cargo build --target wasm32-unknown-unknown --release

build-filter: release	
	wasme build precompiled target/wasm32-unknown-unknown/release/authfilter.wasm --tag authfilter:v0.1

deploy-envoy-v2:
	wasme deploy envoy authfilter:v0.1 \
	  --envoy-image=envoyproxy/envoy-alpine:v1.17-latest \
		--envoy-run-args "--bootstrap-version 2" \
		--bootstrap=envoy-bootstrap-v22.yml

	#wasme deploy envoy hello_world:v0.1 --envoy-image=istio/proxyv2:1.5.1 --bootstrap=envoy-bootstrap-v2.yml

deploy-envoy-v3:
	wasme deploy envoy authfilter:v0.1 \
	  --envoy-image=envoyproxy/envoy-alpine:v1.19-latest \
		--bootstrap=envoy-bootstrap-v3.yml

push-image: 
	#wasme tag authfilter:v0.1 webassemblyhub.io/chrismacp/authfilter:v0.1
	#wasme push webassemblyhub.io/chrismacp/authfilter:v0.1

deploy-docker: 
	cd docker && docker-compose up