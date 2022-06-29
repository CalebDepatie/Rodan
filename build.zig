const std = @import("std");
const Builder = std.build.Builder;

pub fn build(b: *Builder) void {
    _ = b;
    std.debug.print("Hello, {s}!\n", .{"World"});
}
