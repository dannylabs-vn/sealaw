export const keyStats = [
  { label: "Diện tích vùng biển", value: 1000000, suffix: " km²", icon: "waves" },
  { label: "Chiều dài bờ biển", value: 3260, suffix: " km", icon: "ruler" },
  { label: "Số lượng đảo", value: 3000, suffix: "+", icon: "mountain" },
  { label: "Vùng EEZ", value: 200, suffix: " hải lý", icon: "shield" },
  { label: "Diện tích đất liền", value: 331212, suffix: " km²", icon: "map" },
  { label: "Tỷ lệ biển/đất", value: 3, suffix: ":1", icon: "scale" }
];

export const seaZones = [
  { name: "Nội thủy", width: "Phía trong đường cơ sở", area: 27000, color: "#0ea5e9", description: "Vùng nước phía trong đường cơ sở, Việt Nam có chủ quyền hoàn toàn" },
  { name: "Lãnh hải", width: "12 hải lý", area: 50000, color: "#3b82f6", description: "Quốc gia có chủ quyền đầy đủ, tàu nước ngoài có quyền đi qua không gây hại" },
  { name: "Vùng tiếp giáp", width: "24 hải lý", area: 30000, color: "#6366f1", description: "Quốc gia có quyền kiểm soát hải quan, thuế, y tế, nhập cư" },
  { name: "Vùng đặc quyền kinh tế", width: "200 hải lý", area: 700000, color: "#8b5cf6", description: "Quyền chủ quyền về tài nguyên, quyền tài phán về nghiên cứu và bảo vệ môi trường" },
  { name: "Thềm lục địa", width: "Tối đa 350 hải lý", area: 200000, color: "#a855f7", description: "Quyền chủ quyền về thăm dò và khai thác tài nguyên đáy biển" }
];

export const islandsByRegion = [
  { region: "Vịnh Bắc Bộ", count: 2773, color: "#0ea5e9" },
  { region: "Miền Trung", count: 105, color: "#3b82f6" },
  { region: "Đông Nam Bộ", count: 82, color: "#6366f1" },
  { region: "Tây Nam", count: 158, color: "#8b5cf6" },
  { region: "Hoàng Sa", count: 37, color: "#dc2626" },
  { region: "Trường Sa", count: 148, color: "#ea580c" }
];

export const comparisonData = [
  { name: "Đất liền", value: 331212, color: "#16a34a" },
  { name: "Vùng biển", value: 1000000, color: "#0ea5e9" }
];
