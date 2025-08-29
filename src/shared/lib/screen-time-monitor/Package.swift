// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "ScreenTimeMonitor",
    platforms: [.iOS(.v14)],
    products: [
        .library(
            name: "ScreenTimeMonitor",
            targets: ["ScreenTimeMonitorPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "7.0.0")
    ],
    targets: [
        .target(
            name: "ScreenTimeMonitorPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/ScreenTimeMonitorPlugin"),
        .testTarget(
            name: "ScreenTimeMonitorPluginTests",
            dependencies: ["ScreenTimeMonitorPlugin"],
            path: "ios/Tests/ScreenTimeMonitorPluginTests")
    ]
)