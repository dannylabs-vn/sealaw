export const islandsGeo = {
  type: "FeatureCollection",
  features: [
    // === QUẦN ĐẢO HOÀNG SA ===
    {
      type: "Feature",
      properties: {
        name: "Đảo Hoàng Sa (Pattle)",
        note: "Đảo chính quần đảo Hoàng Sa, có trạm khí tượng do Pháp xây từ 1938",
        category: "hoang_sa",
        area: "0.3 km²"
      },
      geometry: { type: "Point", coordinates: [111.6, 16.53] }
    },
    {
      type: "Feature",
      properties: {
        name: "Đảo Phú Lâm (Woody)",
        note: "Đảo lớn nhất Hoàng Sa, TQ xây dựng trái phép sân bay và cơ sở quân sự",
        category: "hoang_sa",
        area: "2.1 km²"
      },
      geometry: { type: "Point", coordinates: [112.33, 16.83] }
    },
    {
      type: "Feature",
      properties: {
        name: "Đảo Lincoln",
        note: "Đảo thuộc nhóm An Vĩnh, quần đảo Hoàng Sa",
        category: "hoang_sa",
        area: "0.15 km²"
      },
      geometry: { type: "Point", coordinates: [112.73, 16.67] }
    },
    {
      type: "Feature",
      properties: {
        name: "Đảo Tri Tôn (Triton)",
        note: "Đảo cực tây nam Hoàng Sa, nơi xảy ra Hải chiến Hoàng Sa 1974",
        category: "hoang_sa",
        area: "0.12 km²"
      },
      geometry: { type: "Point", coordinates: [111.2, 15.78] }
    },
    {
      type: "Feature",
      properties: {
        name: "Đảo Quang Hòa (Duncan)",
        note: "Đảo nơi diễn ra trận chiến chính trong Hải chiến Hoàng Sa 19/1/1974",
        category: "hoang_sa",
        area: "0.48 km²"
      },
      geometry: { type: "Point", coordinates: [111.72, 15.8] }
    },
    {
      type: "Feature",
      properties: {
        name: "Đảo Duy Mộng (Drummond)",
        note: "Đảo thuộc nhóm Lưỡi Liềm, quần đảo Hoàng Sa",
        category: "hoang_sa",
        area: "0.41 km²"
      },
      geometry: { type: "Point", coordinates: [111.78, 16.47] }
    },

    // === QUẦN ĐẢO TRƯỜNG SA ===
    {
      type: "Feature",
      properties: {
        name: "Đảo Trường Sa Lớn (Spratly)",
        note: "Đảo lớn nhất do Việt Nam quản lý tại Trường Sa, có sân bay, trường học",
        category: "truong_sa",
        area: "0.15 km²",
        status: "Việt Nam quản lý"
      },
      geometry: { type: "Point", coordinates: [111.92, 8.65] }
    },
    {
      type: "Feature",
      properties: {
        name: "Đảo Song Tử Tây (Southwest Cay)",
        note: "Đảo có ngọn hải đăng cao nhất Trường Sa (36m), đặt tại cực bắc",
        category: "truong_sa",
        area: "0.12 km²",
        status: "Việt Nam quản lý"
      },
      geometry: { type: "Point", coordinates: [114.33, 11.43] }
    },
    {
      type: "Feature",
      properties: {
        name: "Đảo Sinh Tồn (Sin Cowe)",
        note: "Đảo thuộc cụm Sinh Tồn, có đồn biên phòng và trường học",
        category: "truong_sa",
        area: "0.08 km²",
        status: "Việt Nam quản lý"
      },
      geometry: { type: "Point", coordinates: [114.33, 9.88] }
    },
    {
      type: "Feature",
      properties: {
        name: "Đảo Nam Yết (Namyit)",
        note: "Đảo thuộc cụm Nam Yết, có nhiều cây xanh, là căn cứ hậu cần quan trọng",
        category: "truong_sa",
        area: "0.06 km²",
        status: "Việt Nam quản lý"
      },
      geometry: { type: "Point", coordinates: [114.37, 10.18] }
    },
    {
      type: "Feature",
      properties: {
        name: "Đảo Sơn Ca (Sand Cay)",
        note: "Đảo thuộc cụm Nam Yết, có hải đăng phục vụ hàng hải quốc tế",
        category: "truong_sa",
        area: "0.07 km²",
        status: "Việt Nam quản lý"
      },
      geometry: { type: "Point", coordinates: [114.48, 10.38] }
    },
    {
      type: "Feature",
      properties: {
        name: "Đá Lát (Ladd Reef)",
        note: "Bãi đá thuộc cụm Trường Sa, Việt Nam đặt nhà giàn DK1",
        category: "truong_sa",
        area: "Bãi đá",
        status: "Việt Nam quản lý"
      },
      geometry: { type: "Point", coordinates: [111.67, 8.67] }
    },
    {
      type: "Feature",
      properties: {
        name: "Đảo An Bang (Amboyna Cay)",
        note: "Đảo cực nam trong các đảo Việt Nam quản lý tại Trường Sa",
        category: "truong_sa",
        area: "0.02 km²",
        status: "Việt Nam quản lý"
      },
      geometry: { type: "Point", coordinates: [112.23, 7.88] }
    },
    {
      type: "Feature",
      properties: {
        name: "Đảo Len Đao (Lansdowne Reef)",
        note: "Bãi đá thuộc cụm Sinh Tồn, Việt Nam xây dựng công trình bảo vệ",
        category: "truong_sa",
        area: "Bãi đá",
        status: "Việt Nam quản lý"
      },
      geometry: { type: "Point", coordinates: [114.37, 9.77] }
    },

    // === ĐẢO VEN BỜ ===
    {
      type: "Feature",
      properties: {
        name: "Côn Đảo",
        note: "Quần đảo 16 hòn đảo, từng là nhà tù thời Pháp thuộc, nay là vườn quốc gia",
        category: "ven_bo",
        area: "76 km²",
        status: "Việt Nam quản lý - Bà Rịa Vũng Tàu"
      },
      geometry: { type: "Point", coordinates: [106.6, 8.68] }
    },
    {
      type: "Feature",
      properties: {
        name: "Phú Quốc",
        note: "Đảo lớn nhất Việt Nam, thành phố đảo đầu tiên, trung tâm du lịch",
        category: "ven_bo",
        area: "589.23 km²",
        status: "Việt Nam quản lý - Kiên Giang"
      },
      geometry: { type: "Point", coordinates: [103.97, 10.22] }
    },
    {
      type: "Feature",
      properties: {
        name: "Đảo Lý Sơn",
        note: "Đảo tiền tiêu miền Trung, nơi xuất phát đội Hoàng Sa thời Nguyễn",
        category: "ven_bo",
        area: "10 km²",
        status: "Việt Nam quản lý - Quảng Ngãi"
      },
      geometry: { type: "Point", coordinates: [109.1, 15.38] }
    },
    {
      type: "Feature",
      properties: {
        name: "Đảo Cát Bà",
        note: "Đảo lớn nhất vịnh Hạ Long, khu dự trữ sinh quyển thế giới UNESCO",
        category: "ven_bo",
        area: "285 km²",
        status: "Việt Nam quản lý - Hải Phòng"
      },
      geometry: { type: "Point", coordinates: [107.05, 20.73] }
    },
    {
      type: "Feature",
      properties: {
        name: "Đảo Bạch Long Vĩ",
        note: "Đảo xa bờ nhất vịnh Bắc Bộ, có vị trí chiến lược quan trọng",
        category: "ven_bo",
        area: "3.2 km²",
        status: "Việt Nam quản lý - Hải Phòng"
      },
      geometry: { type: "Point", coordinates: [107.73, 20.13] }
    },
    {
      type: "Feature",
      properties: {
        name: "Đảo Thổ Chu",
        note: "Quần đảo thuộc vịnh Thái Lan, điểm A1 đường cơ sở Việt Nam",
        category: "ven_bo",
        area: "14 km²",
        status: "Việt Nam quản lý - Kiên Giang"
      },
      geometry: { type: "Point", coordinates: [103.47, 9.28] }
    },
    {
      type: "Feature",
      properties: {
        name: "Đảo Cô Tô",
        note: "Quần đảo phía đông bắc, gồm hơn 50 hòn đảo lớn nhỏ",
        category: "ven_bo",
        area: "47.3 km²",
        status: "Việt Nam quản lý - Quảng Ninh"
      },
      geometry: { type: "Point", coordinates: [107.77, 21.03] }
    }
  ]
};

export const islandCategories = {
  hoang_sa: { label: "Quần đảo Hoàng Sa", color: "#dc2626", description: "    trái phép" },
  truong_sa: { label: "Quần đảo Trường Sa", color: "#ea580c", description: "Việt Nam thực thi chủ quyền" },
  ven_bo: { label: "Đảo ven bờ", color: "#16a34a", description: "Hệ thống đảo ven bờ biển Việt Nam" }
};
