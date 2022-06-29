const std = @import("std");
const Builder = std.build.Builder;

pub fn build(b: *Builder) void {
    // don't overide target or release options
    const target = b.standardTargetOptions(.{});
    const mode = b.standardReleaseOptions();

    // create shared lib
    const lib = b.addSharedLibrary("rodan-native", "src/main/native/lib.zig", b.version(0, 0, 1));

    lib.setTarget(target);
    lib.setBuildMode(mode);
    lib.install();
}
