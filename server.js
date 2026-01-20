const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// 读取配置文件
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// 提供配置API
app.get('/api/config', (req, res) => {
    res.json(config);
});

// 抽奖API端点 - 仅可抽一次，恒定抽中终极大奖
app.get('/api/lottery', (req, res) => {
    // 模拟一些延迟，增加真实感
    setTimeout(() => {
        // 找到终极大奖
        const ultimatePrize = config.wheelOptions.find(option => option.isUltimate);

        res.json({
            success: true,
            prize: ultimatePrize,
            message: '恭喜您抽中了终极大奖！',
            isUltimate: true
        });
    }, 2000);
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`首页背景图: ${config.backgrounds.home}`);
    console.log(`抽奖页背景图: ${config.backgrounds.lottery}`);
});