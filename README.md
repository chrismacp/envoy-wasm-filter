# Rust WebAssembly Envoy Filter

I wanted to check out the status of WebAssembly and see how easy it is to create an Envoy filter. 
This is what I managed to piece together in August 2021. 

The Envoy filter is built using Rust (which I'm new to!) and added to a vanilla version of Envoy v1.19.x.

I followed guidance from these two posts, but more useful links posted at the bottom:
- [https://antweiss.com/blog/extending-envoy-with-wasm-and-rust/](https://antweiss.com/blog/extending-envoy-with-wasm-and-rust/)
- [https://blog.red-badger.com/extending-istio-with-rust-and-webassembly](https://blog.red-badger.com/extending-istio-with-rust-and-webassembly)

## Demo
There is a Docker Compose file which starts up a provider service behind envoy and a consumer service to consume from it.

The provider service checks for an auth token - **the aim is to move this to the filter in case you see this before I get that done**

Use the Makefile to start it up

![Alt text](https://g.gravizo.com/svg?digraph%20G%20%7B%0A%20%20%20%20compound%3Dtrue%3B%0A%20%20%20%20rankdir%3DLR%0A%20%20%20%20pad%3D%220.2%2C0.5%22%0A%20%20%20%20%0A%20%20%20%20subgraph%20cluster1%20%7B%0A%20%20%20%20%20%20style%3Dfilled%3B%0A%20%20%20%20%20%20color%3Dlightgrey%3B%0A%20%20%20%20%20%20node%20%5Bstyle%3Dfilled%2Ccolor%3Dwhite%5D%3B%0A%20%20%20%20%20%20wasmFilter%20%5Bshape%3Dbox%2C%20label%3D%22WASM%20Filter%22%5D%3B%0A%20%20%20%20%20%20label%3D%3CEnvoy%3CBR%20%2F%3E%3CFONT%20POINT-SIZE%3D%2210%22%3E%3A8200%3C%2FFONT%3E%3E%3B%0A%20%20%20%20%7D%0A%0A%20%20%20%20consumer%20%5Bshape%3Dbox%2C%20label%3D%3CConsumer%3CBR%20%2F%3E%3CFONT%20POINT-SIZE%3D%2210%22%3E%3A8100%3C%2FFONT%3E%3E%5D%3B%0A%20%20%20%20provider%20%5Bshape%3Dbox%2C%20label%3D%3CProvider%3CBR%20%2F%3E%3CFONT%20POINT-SIZE%3D%2210%22%3E%3A8300%3C%2FFONT%3E%3E%5D%3B%0A%20%20%20%20%0A%20%20%20%20consumer%20-%3E%20wasmFilter%20%5Blhead%3Dcluster1%5D%3B%0A%20%20%20%20wasmFilter%20-%3E%20provider%20%5Bltail%3Dcluster1%5D%3B%0A%20%20%7D)
<details> 
<summary></summary>
  digraph G {
    compound=true;
    rankdir=LR
    pad="0.2,0.5"
    
    subgraph cluster1 {
      style=filled;
      color=lightgrey;
      node [style=filled,color=white];
      wasmFilter [shape=box, label="WASM Filter"];
      label=<Envoy<BR /><FONT POINT-SIZE="10">:8200</FONT>>;
    }

    consumer [shape=box, label=<Consumer<BR /><FONT POINT-SIZE="10">:8100</FONT>>];
    provider [shape=box, label=<Provider<BR /><FONT POINT-SIZE="10">:8300</FONT>>];
    
    consumer -> wasmFilter [lhead=cluster1];
    wasmFilter -> provider [ltail=cluster1];
  }
</details>

## WASM Filter

The filter currently just adds two headers to the requests it handles:

**Request Header** called 'filter-added'

**Response Header** called 'filter-added'

## Makefile

Run
```
# build the WASM filter in Rust
make build 

# Deploy the demo 
make start 
```

## Make requests
```
# Successful request (default role = admin)
http localhost:8100/
curl localhost:8100/

# Unsuccessful request
http localhost:8100/ role==somethingelse
curl localhost:8100/?role=somethingelse

```

## Useful Links
- [https://github.com/proxy-wasm/proxy-wasm-rust-sdk](https://github.com/proxy-wasm/proxy-wasm-rust-sdk)
- [https://nodejs.org/api/crypto.html#crypto_crypto_sign_algorithm_data_key_callback](https://nodejs.org/api/crypto.html#crypto_crypto_sign_algorithm_data_key_callback)
- 