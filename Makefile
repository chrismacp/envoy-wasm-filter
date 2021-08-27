

build:
	cargo build --target wasm32-unknown-unknown --release


deploy-docker: 
	cd docker && docker-compose up --build

.PHONY: build build-filter-image push-filter-image deploy-docker