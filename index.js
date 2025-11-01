// --- PHẦN 1: CÀI ĐẶT WEB SERVER (Để UptimeRobot ping) ---
const express = require("express");
const app = express();
const port = 3000; // Cổng mặc định của Replit

app.get("/", (req, res) => {
    // Khi UptimeRobot truy cập, nó sẽ thấy dòng này
    res.send("Bot AFK đang chạy!");
});

app.listen(port, () => {
    console.log(`[Web Server] Đã khởi chạy tại http://localhost:${port}`);
});

// --- PHẦN 2: CÀI ĐẶT BOT MINECRAFT (Mineflayer) ---
const mineflayer = require("mineflayer");

// Cấu hình bot
const bot = mineflayer.createBot({
    host: "vanillaservergg.aternos.me", // <-- THAY ĐỊA CHỈ IP/TÊN SERVER CỦA BẠN
    port: 57533, // <-- THAY PORT (nếu không phải 25565)
    username: "BotAFK", // <-- THAY TÊN BOT BẠN MUỐN

    // password: 'MatKhau',     // (Chỉ dùng nếu server yêu cầu mật khẩu)
});

// --- PHẦN 3: CÁC HÀNH ĐỘNG CỦA BOT ---

// Khi bot đăng nhập thành công
bot.on("login", () => {
    console.log("[Bot] Đã đăng nhập vào server!");
    // Ví dụ: Tự động chat khi vào game
    // bot.chat('/login MatKhauCuaBan'); // Bỏ dấu // nếu server yêu cầu lệnh login
    bot.chat("Bot AFK đã vào!");
    bot.chat("Không giết bot này nhé!");
});

// Chống AFK: Tự động đung đưa tay 30 giây một lần
setInterval(() => {
    bot.swingArm();
    console.log("[Bot] Chống AFK...");
}, 30000); // 30000 mili-giây = 30 giây

// Xử lý khi bị kick
bot.on("kicked", (reason) => {
    console.log("[Bot] Đã bị kick! Lý do:", reason);
    // Tự động thử kết nối lại sau 1 phút
    setTimeout(() => bot.quit(), 60000);
});

// Xử lý khi mất kết nối
bot.on("end", () => {
    console.log("[Bot] Mất kết nối. Thử kết nối lại sau 1 phút...");
    // Tự động thử kết nối lại sau 1 phút
    setTimeout(() => bot.quit(), 60000);
});

// Xử lý lỗi
bot.on("error", (err) => {
    console.log("[Bot] Gặp lỗi:", err);
});
