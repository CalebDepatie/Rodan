const std = @import("std");
const builtin = @import("builtin");
const Builder = std.build.Builder;

pub fn build(b: *Builder) void {
    // don't overide target or release options
    const target = b.standardTargetOptions(.{});
    const mode = b.standardReleaseOptions();

    // create shared lib
    //const lib = b.addSharedLibrary("rodan-native", "src/main/native/lib.zig", b.version(0, 0, 1));

    // temporarily creating .exe to run as a process
    const lib = b.addExecutable("rodan-tunnel",  "src/main/native/ssh.zig");

    // link libs
    lib.linkLibC();

    switch (builtin.os.tag) {
        .windows => {
            //lib.addIncludeDir("C:\\Users\\Caleb\\AppData\\Local\\node-gyp\\Cache\\14.17.1\\include\\node");
            //lib.addLibPath("C:\\Users\\Caleb\\AppData\\Local\\node-gyp\\Cache\\14.17.1\\x64");
            //lib.linkSystemLibraryName("node");

            lib.addIncludeDir("C:\\Users\\Caleb\\Documents\\vcpkg\\packages\\libssh_x86-windows\\include");
            lib.addLibPath("C:\\Users\\Caleb\\Documents\\vcpkg\\packages\\libssh_x86-windows\\bin");
            lib.addLibPath("C:\\Users\\Caleb\\Documents\\vcpkg\\packages\\libssh_x86-windows\\lib");
            lib.linkSystemLibraryName("ssh");
        },
        .linux => {
            lib.linkSystemLibrary("ssh");
        },
        else => @compileError("OS not included in build script"),
    }

    // set build
    //lib.emit_bin = .{ .emit_to = "rodan-native.node"};
    lib.setTarget(target);
    lib.setBuildMode(mode);
    lib.install();
}
