.PHONY: build client server

build: client server

client:
	yarn --cwd client/ build
	
server:
	cd server; \
	go build