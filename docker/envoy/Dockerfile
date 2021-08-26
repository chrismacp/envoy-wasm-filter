FROM envoyproxy/envoy-alpine:v1.17-latest
ENTRYPOINT /usr/local/bin/envoy -c /etc/envoy.yaml -l debug --bootstrap-version 2 --service-cluster proxy 