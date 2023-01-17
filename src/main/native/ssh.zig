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
// const network = @import("network"); // using library for cross platform sockets

const ssh = @cImport({
    @cInclude("libssh/libssh.h");
});

//pub const io_mode = .evented;

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
    ServerError,
    CantUpdateHost,
    UnknownError
};

const SSHChanError = error {
    OpeningFailed,
    ForwardingFailed
};

const SSHError = SSHConError || SSHHostError || SSHChanError;

const sshArgs = struct {
    hostname: []const u8,
    port: i16,
    username: []const u8,
    password: []const u8,
    forwardedPort: i16
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
    const hostname = args.next() orelse @panic("No Hostname Given");

    // get port
    const port = args.next() orelse @panic("No Port Given");

    // get port to foward
    const fport = args.next() orelse @panic("No Forwarding Port Given");

    // get username
    const user = args.next() orelse @panic("No Username Given");

    // get password
    const pass = args.next() orelse @panic("No Password Given");

    return sshArgs{
        .hostname = hostname,
        .port = try std.fmt.parseInt(i16, port, 0),
        .username = user,
        .password = pass,
        .forwardedPort = try std.fmt.parseInt(i16, fport, 0)
    };
}

fn verifyHost(session: ssh.ssh_session) !void {
    const state = ssh.ssh_session_is_known_server(session);

    switch (state) {
        ssh.SSH_KNOWN_HOSTS_OK => return,
        ssh.SSH_KNOWN_HOSTS_CHANGED => return SSHHostError.KeyChanged,
        ssh.SSH_KNOWN_HOSTS_OTHER => return SSHHostError.KeyNotFound,
        ssh.SSH_KNOWN_HOSTS_NOT_FOUND, ssh.SSH_KNOWN_HOSTS_UNKNOWN => {
            const stdin = std.io.getStdIn().reader();
            const stdout = std.io.getStdOut().writer();

            var buf: []u8 = undefined;

            try stdout.print("Host is unknown\nAdd key to hosts file? [y/n]: ", .{});

            var addFile: bool = undefined;

            if (try stdin.readUntilDelimiterOrEof(buf, '\n')) |user_input| {
                if (user_input[0] == 'y') {
                    addFile = true;
                } else {
                    addFile = false;
                }
            } else {
                addFile = false;
            }

            if (addFile) {
                const err = ssh.ssh_session_update_known_hosts(session);
                if (err < 0)
                    return SSHHostError.UnknownServer;

            } else {
                return SSHHostError.UnknownServer;
            }
        },
        ssh.SSH_KNOWN_HOSTS_ERROR => return SSHHostError.ServerError,
        else => return SSHHostError.UnknownError
    }
}

// open an ssh session
fn openSession(env: sshArgs) !ssh.ssh_session {
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

// function to keep the process alive
fn keepAlive() void {
    while (true) {}
}

// create a ssh tunnel
pub fn main() !void {
    // try network.init();
    // defer network.deinit();

    const env = getArgs() catch @panic("Args could not be collected");

    const session = try openSession(env);
    defer ssh.ssh_disconnect(session);
    defer ssh.ssh_free(session);

    // setup forwarding channel
    const channel = ssh.ssh_channel_new(session);
    defer _ = ssh.ssh_channel_close(channel);
    defer ssh.ssh_channel_free(channel);

    if (channel == null)
        return SSHChanError.OpeningFailed;

    var err = ssh.ssh_channel_open_forward(channel,
                "localhost", env.forwardedPort, //client forward
                "localhost", 0); // server forward

    if (err != ssh.SSH_OK)
        return SSHChanError.ForwardingFailed;

    // setup socket
    // var sock = try network.Socket.create(.ipv4, .tcp);
    // defer sock.close();
    //
    // try sock.bind(.{
    //     .address = .{ .ipv4 = network.Address.IPv4.any },
    //     .port = @intCast(u16, env.forwardedPort),
    // });
    //
    // try sock.listen();

    keepAlive();

    return;
}
