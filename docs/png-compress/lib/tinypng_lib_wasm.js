
import { __wbg_set_wasm, __wbindgen_error_new, __wbindgen_throw } from "./tinypng_lib_wasm_bg.js";

export * from "./tinypng_lib_wasm_bg.js";

// 异步加载WASM文件
export async function initWasm() {
  try {
    console.log("WebAssembly available:", typeof WebAssembly !== 'undefined');
    console.log("Fetching WASM file...");
    
    const response = await fetch("./lib/tinypng_lib_wasm_bg.wasm");
    console.log("Response status:", response.status);
    
    const arrayBuffer = await response.arrayBuffer();
    console.log("WASM file loaded as array buffer");
    
    console.log("Instantiating WASM module...");
    // 提供必要的导入对象
    const wasmModule = await WebAssembly.instantiate(arrayBuffer, {
      "./tinypng_lib_wasm_bg.js": {
        __wbindgen_error_new,
        __wbindgen_throw
      }
    });
    console.log("WASM module instantiated successfully");
    console.log("WASM exports:", Object.keys(wasmModule.instance.exports));
    
    __wbg_set_wasm(wasmModule.instance.exports);
    console.log("WASM module set successfully");
    return true;
  } catch (error) {
    console.error("Failed to load WASM module:", error);
    console.error("Error stack:", error.stack);
    return false;
  }
}
