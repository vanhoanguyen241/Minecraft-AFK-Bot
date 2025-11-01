// --- PHẦN 1: CÀI ĐẶT WEB SERVER (Để UptimeRobot ping) ---
// (Phần này giữ nguyên, nó đã chạy đúng)
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Bot AFK đang chạy!');
});

app.listen(port, () => {
  console.log(`[Web Server] Đã khởi chạy tại http://localhost:${port}`);
});

// --- PHẦN 2: CÀI ĐẶT BOT MINECRAFT (Mineflayer) ---
const mineflayer = require('mineflayer');
let antiAfkInterval = null; // Biến để lưu trữ bộ đếm chống AFK

// --- PHẦN 3: TẠO HÀM KẾT NỐI (SỬA LỖI TỰ ĐỘNG KẾT NỐI) ---
function createBotConnection() {
    console.log("[Bot] Đang thử kết nối đến server...");

    const bot = mineflayer.createBot({
        host: 'vanillaservergg.aternos.me',     // <-- KIỂM TRA LẠI CHÍNH XÁC MỤC NÀY
        port: 57533,                // <-- KIỂM TRA LẠI CHÍNH XÁC MỤC NÀY
        username: 'BotAFK',   // <-- KIỂM TRA LẠI CHÍNH XÁC MỤC NÀY
        // Không cần 'version', để bot tự phát hiện là tốt nhất
    });

    // SỬA LỖI LOGIC: Chỉ chạy chống AFK KHI bot đã vào game
    bot.on('spawn', () => {
        console.log('[Bot] Đã spawn (hiện hình) vào thế giới!');
        // bot.chat('/login MatKhauCuaBan'); // Bỏ dấu // nếu server yêu cầu lệnh login
        bot.chat('Bot AFK đã vào!');

        // Xóa bộ đếm cũ (nếu có) và tạo bộ đếm mới
        if (antiAfkInterval) clearInterval(antiAfkInterval); 
        antiAfkInterval = setInterval(() => {
            bot.swingArm();
            console.log('[Bot] Chống AFK...');
        }, 30000); // 30 giây
    });

    // Hàm dọn dẹp khi mất kết nối
    function stopAndReconnect() {
        if (antiAfkInterval) clearInterval(antiAfkInterval); // Dừng chống AFK
        console.log("[Bot] Mất kết nối. Thử lại sau 1 phút...");
        setTimeout(createBotConnection, 60000); // Thử kết nối lại sau 1 phút
    }

    // Xử lý khi bị kick
    bot.on('kicked', (reason) => {
        console.log('[Bot] Đã bị kick! Lý do:', reason);
        stopAndReconnect();
    });

    // Xử lý khi mất kết nối
    bot.on('end', (reason) => {
        console.log('[Bot] Mất kết nối. Lý do:', reason);
        stopAndReconnect();
    });

    // Xử lý lỗi (bao gồm cả ECONNRESET)
    bot.on('error', (err) => {
        console.log(`[Bot] Gặp lỗi kết nối: ${err.code || err}`);
        // Không cần làm gì ở đây, vì lỗi 'end' hoặc 'kicked' sẽ tự động chạy theo sau
    });
}

// --- Bắt đầu chạy bot lần đầu tiên ---
createBotConnection();
