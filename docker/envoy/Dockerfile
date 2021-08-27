FROM envoyproxy/envoy-alpine:v1.19-latest
ENTRYPOINT /usr/local/bin/envoy -c /etc/envoy.yaml -l debug --service-cluster proxy 