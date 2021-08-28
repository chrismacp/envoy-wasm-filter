
build:
	cargo build --target wasm32-unknown-unknown --release

start: stop
	cd docker && docker-compose up --build -d

stop: 
	cd docker && docker-compose down

.PHONY: build start stop