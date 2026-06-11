import SwiftUI
import RoomPlan
import Foundation

// Models to match our Next.js ProjectState
struct ProjectState: Codable {
    var room: RoomState
    var furnitureItems: [FurnitureItemState]
}

struct RoomState: Codable {
    var width: Double
    var depth: Double
    var wallHeight: Double
    var wallThickness: Double
}

struct FurnitureItemState: Codable {
    var id: String
    var type: String
    var name: String
    var position: [Double]
    var rotation: [Double]
    var scale: [Double]
}

class RoomScannerViewModel: ObservableObject {
    @Published var isScanning = false
    @Published var scanComplete = false
    @Published var uploadStatus = "Hazır"
    
    // Değiştirin: Mac'inizin IP adresi (Next.js uygulaması port 3000'de)
    let macIP = "http://192.168.1.100:3000/api/ar"
    
    func uploadScannedRoom(capturedRoom: CapturedRoom) {
        DispatchQueue.main.async { self.uploadStatus = "Oda çevriliyor..." }
        
        var items: [FurnitureItemState] = []
        
        // Kapıları dönüştür
        for door in capturedRoom.doors {
            let item = FurnitureItemState(
                id: UUID().uuidString,
                type: "door",
                name: "AR Kapı",
                position: [Double(door.transform.columns.3.x), Double(door.transform.columns.3.y), Double(door.transform.columns.3.z)],
                // Basitleştirilmiş rotasyon (Sadece Y ekseni)
                rotation: [0, Double(atan2(door.transform.columns.0.z, door.transform.columns.0.x)), 0],
                scale: [Double(door.dimensions.x), Double(door.dimensions.y), Double(door.dimensions.z)]
            )
            items.append(item)
        }
        
        // Pencereleri dönüştür
        for window in capturedRoom.windows {
            let item = FurnitureItemState(
                id: UUID().uuidString,
                type: "window",
                name: "AR Pencere",
                position: [Double(window.transform.columns.3.x), Double(window.transform.columns.3.y), Double(window.transform.columns.3.z)],
                rotation: [0, Double(atan2(window.transform.columns.0.z, window.transform.columns.0.x)), 0],
                scale: [Double(window.dimensions.x), Double(window.dimensions.y), Double(window.dimensions.z)]
            )
            items.append(item)
        }
        
        // Mobilyaları dönüştür (Object)
        for object in capturedRoom.objects {
            var type = "wardrobe"
            if object.category == .sofa { type = "sofa" }
            else if object.category == .table { type = "table" }
            else if object.category == .chair { type = "chair" }
            else if object.category == .bed { type = "bed" }
            
            let item = FurnitureItemState(
                id: UUID().uuidString,
                type: type,
                name: "AR \(type)",
                position: [Double(object.transform.columns.3.x), Double(object.transform.columns.3.y), Double(object.transform.columns.3.z)],
                rotation: [0, Double(atan2(object.transform.columns.0.z, object.transform.columns.0.x)), 0],
                scale: [Double(object.dimensions.x), Double(object.dimensions.y), Double(object.dimensions.z)]
            )
            items.append(item)
        }
        
        // Duvarları analiz edip oda genişliğini bulma (Basitleştirilmiş)
        var minX: Float = 0, maxX: Float = 0, minZ: Float = 0, maxZ: Float = 0, height: Float = 2.8
        if let firstWall = capturedRoom.walls.first {
            height = firstWall.dimensions.y
        }
        for wall in capturedRoom.walls {
            let x = wall.transform.columns.3.x
            let z = wall.transform.columns.3.z
            if x < minX { minX = x }
            if x > maxX { maxX = x }
            if z < minZ { minZ = z }
            if z > maxZ { maxZ = z }
        }
        
        let width = abs(maxX - minX) == 0 ? 5.0 : Double(abs(maxX - minX) + 1.0)
        let depth = abs(maxZ - minZ) == 0 ? 5.0 : Double(abs(maxZ - minZ) + 1.0)
        
        let state = ProjectState(
            room: RoomState(width: width, depth: depth, wallHeight: Double(height), wallThickness: 0.2),
            furnitureItems: items
        )
        
        // POST İsteği At
        DispatchQueue.main.async { self.uploadStatus = "Gönderiliyor..." }
        
        guard let url = URL(string: macIP) else { return }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        
        do {
            request.httpBody = try JSONEncoder().encode(state)
        } catch {
            DispatchQueue.main.async { self.uploadStatus = "JSON Hata" }
            return
        }
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    self.uploadStatus = "Hata: \(error.localizedDescription)"
                } else {
                    self.uploadStatus = "Başarıyla Web'e Aktarıldı! ✅"
                }
            }
        }.resume()
    }
}

// SwiftUI Arayüzü (RoomCaptureView Controller ile)
// ... Bu kodun devamı standart RoomCaptureView Controller wrapper'ıdır.
