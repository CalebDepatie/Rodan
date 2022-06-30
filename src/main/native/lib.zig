const c = @import("c.zig");

const ssh = @import("./ssh.zig");

// register functions
export fn napi_register_module_v1(env: c.napi_env, exports: c.napi_value) c.napi_value {
    _ = env; 
    return exports;
}
