// Đường cơ sở của Việt Nam
// Tuyên bố ngày 12/11/1982 với 11 điểm (A1 đến A11)
// Dữ liệu xấp xỉ cho mục đích giáo dục
export const vietnamBaseline = {
  type: "Feature",
  properties: {
    name: "Đường cơ sở Việt Nam",
    note: "Tuyên bố ngày 12/11/1982 gồm 11 điểm từ A1 (Thổ Chu) đến A11 (Cồn Cỏ)"
  },
  geometry: {
    type: "LineString",
    coordinates: [
      [103.48, 9.15],   // A1 - Hòn Nhạn (Thổ Chu)
      [103.53, 8.63],   // A2 - Hòn Đá Lẻ
      [104.73, 8.22],   // A3 - Hòn Tài Lớn (Côn Đảo)
      [106.57, 8.68],   // A4 - Hòn Bông Lang
      [106.63, 8.64],   // A5 - Hòn Bảy Cạnh
      [108.20, 10.82],  // A6 - Hòn Hải (Bình Thuận)
      [109.05, 11.35],  // A7 - Hòn Đôi
      [109.42, 12.70],  // A8 - Mũi Đại Lãnh
      [109.15, 13.07],  // A9 - Hòn Ông Căn
      [109.10, 15.38],  // A10 - Đảo Lý Sơn
      [107.05, 17.10]   // A11 - Đảo Cồn Cỏ
    ]
  }
};

// Các điểm đường cơ sở kèm thông tin
export const baselinePoints = [
  { id: "A1", name: "Hòn Nhạn (Thổ Chu)", lat: 9.15, lng: 103.48 },
  { id: "A2", name: "Hòn Đá Lẻ", lat: 8.63, lng: 103.53 },
  { id: "A3", name: "Hòn Tài Lớn (Côn Đảo)", lat: 8.22, lng: 104.73 },
  { id: "A4", name: "Hòn Bông Lang", lat: 8.68, lng: 106.57 },
  { id: "A5", name: "Hòn Bảy Cạnh", lat: 8.64, lng: 106.63 },
  { id: "A6", name: "Hòn Hải (Bình Thuận)", lat: 10.82, lng: 108.20 },
  { id: "A7", name: "Hòn Đôi", lat: 11.35, lng: 109.05 },
  { id: "A8", name: "Mũi Đại Lãnh", lat: 12.70, lng: 109.42 },
  { id: "A9", name: "Hòn Ông Căn", lat: 13.07, lng: 109.15 },
  { id: "A10", name: "Đảo Lý Sơn", lat: 15.38, lng: 109.10 },
  { id: "A11", name: "Đảo Cồn Cỏ", lat: 17.10, lng: 107.05 }
];
