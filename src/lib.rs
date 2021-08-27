use log::info;
use proxy_wasm as wasm;
use proxy_wasm::types::Action;
use wasm::types::LogLevel;

#[no_mangle]
pub fn _start() {
    proxy_wasm::set_log_level(LogLevel::Trace);
    proxy_wasm::set_http_context(
        |context_id, _root_context_id| -> Box<dyn wasm::traits::HttpContext> {
            Box::new(HelloWorld { context_id })
        },
    )
}

struct HelloWorld {
    context_id: u32,
}

impl wasm::traits::Context for HelloWorld {}

impl wasm::traits::HttpContext for HelloWorld {
    fn on_http_request_headers(&mut self, num_headers: usize) -> Action {
        info!("Got {} HTTP headers in #{}.", num_headers, self.context_id);
        
        let headers = self.get_http_request_headers();
        
        let mut authority = "";
        
        for (name, value) in &headers {
            info!("Header {} = {}", name, value);
            if name == ":authority" {
                authority = value;
            }
        }

        self.set_http_request_header("filter-added", Some(&format!("Hello from {}", authority)));

        Action::Continue
    }

    fn on_http_response_headers(&mut self, _: usize) -> Action {
        self.set_http_response_header("filter-added", Some("Proxy processed this request"));
        Action::Continue
    }
}