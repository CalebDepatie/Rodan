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
const process = std.process;

const ssh = @cImport({
    @cInclude("libssh/libssh.h");
});

const SSHConError = error{
    OpeningFailed,
    ConnectionFailed,
    SettingOptionFailed,
    AuthenticationFailed,
};

const SSHHostError = error{
    KeyChanged,
    KeyNotFound,
    HostsFileMissing,
    UnknownServer,
    ServerError
};

const sshArgs = struct {
    hostname: []const u8,
    port: i16,
    username: []const u8,
    password: []const u8,
};

const ArgsErrors = process.ArgIterator.InitError || process.ArgIterator.NextError;

fn getArgs() !sshArgs {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    const allocator = gpa.allocator();

    var args: process.ArgIterator = try process.argsWithAllocator(allocator);
    defer args.deinit();

    // skip program name
    _ = args.skip();

    // get hostname
    const hostname = try args.next(allocator) orelse @panic("No Hostname Given");

    // get port
    const port = try args.next(allocator) orelse @panic("No Port Given");

    // get username
    const user = try args.next(allocator) orelse @panic("No Username Given");

    // get password
    const pass = try args.next(allocator) orelse @panic("No Password Given");

    return sshArgs{
        .hostname = hostname,
        .port = try std.fmt.parseInt(i16, port, 0),
        .username = user,
        .password = pass
    };
}

fn verifyHost(session: ssh.ssh_session) !void {
    _ = session;
}

// open an ssh session
fn openSession(env: sshArgs) SSHConError!ssh.ssh_session {
    const session = ssh.ssh_new();

    if (session == null)
        return SSHConError.OpeningFailed;

    // setup session args
    var err = ssh.ssh_options_set(session, ssh.SSH_OPTIONS_HOST, env.hostname.ptr);
    if (err != 0)
        return SSHConError.SettingOptionFailed;

    err = ssh.ssh_options_set(session, ssh.SSH_OPTIONS_PORT, &env.port);
    if (err != 0)
        return SSHConError.SettingOptionFailed;

    err = ssh.ssh_options_set(session, ssh.SSH_OPTIONS_USER, env.username.ptr);
    if (err != 0)
        return SSHConError.SettingOptionFailed;

    // connect session
    err = ssh.ssh_connect(session);
    if (err != ssh.SSH_OK)
        return SSHConError.ConnectionFailed;

    // verify host
    try verifyHost(session);

    // authenticate
    err = ssh.ssh_userauth_password(session, null, env.password.ptr);
    if (err != ssh.SSH_AUTH_SUCCESS)
        return SSHConError.AuthenticationFailed;

    return session;
}

// create a ssh tunnel
pub fn main() !void {
    const env = getArgs() catch @panic("f for the args");

    const session = try openSession(env);
    defer ssh.ssh_disconnect(session);
    defer ssh.ssh_free(session);

    // setup forwarding channel
    //var channel = ssh.ssh_channel_new(session);
    //defer ssh.ssh_channel_free(channel);

    return;
}
