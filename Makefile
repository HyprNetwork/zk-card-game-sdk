all: wasm_node contract_compile


wasm_web:
	wasm-pack build --target web

wasm_node:
	wasm-pack build --target nodejs
	
contract_compile:
	yarn compile

update:
	cargo update

clean:
	cargo clean
	- rm -rf pkg
	- rm -rf abi
	- rm -rf artifacts
	- rm -rf cache
	- rm -rf typechain-types
	- rm -rf build

fmt:
	cargo fmt
	yarn fmt

lint:
	cargo clippy
	yarn lint
