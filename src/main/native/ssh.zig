//const c = @import("c.zig");
//
//export fn testfn(env: c.napi_env, _: c.napi_callback_info) callconv(.C) c.napi_value {
//    var result: c.napi_value = undefined;
//    if (c.napi_create_int32(env, 42, &result) != 0) {
//        _ = c.napi_throw_error(env, null, "Failed to create return value");
//        return null;
//    }
//
//    return result;
//}

const std = @import("std");

const ssh = @cImport({
    @cInclude("libssh.h");
});

const SSHError = error{
    SessionConnectionFailed,
};

// open an ssh session
fn openSession() SSHError!ssh.ssh_session {
    const session = ssh.ssh_new();

    if (session == null) {
        return SSHError.SessionConnectionFailed;
    }

    return session;
}

// create a ssh tunnel
pub fn main() !void {
    const session = try openSession();
    // setup forwarding channel
    //var channel = ssh.ssh_channel_new(session);
    //defer ssh.ssh_channel_free(channel);

    _ = session;

    return;
}
