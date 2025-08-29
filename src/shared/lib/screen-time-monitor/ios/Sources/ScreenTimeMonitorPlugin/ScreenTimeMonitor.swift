import Foundation

@objc public class ScreenTimeMonitor: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}
