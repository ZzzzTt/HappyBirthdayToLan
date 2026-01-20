// script.js 文件

// 首先添加所有缺失的函数定义
function optimizeButtons() {
    console.log('优化按钮触摸反馈');

    const buttons = document.querySelectorAll('button');

    buttons.forEach(button => {
        // 添加触摸反馈
        button.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });

        button.addEventListener('touchend', function() {
            this.classList.remove('touch-active');
        });

        button.addEventListener('touchcancel', function() {
            this.classList.remove('touch-active');
        });

        // 防止双击缩放
        button.addEventListener('touchstart', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
    });
}

function setupResizeListener() {
    console.log('设置窗口大小变化监听');

    let resizeTimeout;

    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);

        resizeTimeout = setTimeout(function() {
            // 重新计算视口高度
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);

            // 更新页面高度
            const userInfoPage = document.querySelector('.user-info-page.simplified');
            if (userInfoPage) {
                userInfoPage.style.height = `${window.innerHeight}px`;
            }
        }, 250);
    });
}

function preventDoubleTapZoom() {
    console.log('防止双击缩放');

    let lastTouchEnd = 0;

    document.addEventListener('touchend', function(e) {
        const now = (new Date()).getTime();

        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }

        lastTouchEnd = now;
    }, false);
}

// 保留之前定义的 removeLoader 函数
function removeLoader() {
    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader) {
        // 先淡出动画
        pageLoader.style.opacity = '0';

        setTimeout(() => {
            // 然后隐藏元素
            pageLoader.style.display = 'none';

            // 确保用户信息页面显示
            const userInfoPage = document.getElementById('userInfoPage');
            if (userInfoPage) {
                userInfoPage.style.display = 'block';
                userInfoPage.style.opacity = '1';
                userInfoPage.style.visibility = 'visible';
            }
        }, 500);
    }
}

// 简化版的初始化函数，避免调用未定义的函数
function initAdaptiveFeatures() {
    console.log('初始化自适应功能');

    // 直接执行必要的初始化
    try {
        // 设置视口高度
        const setViewportHeight = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);

            // 更新用户信息页高度
            const userInfoPage = document.querySelector('.user-info-page.simplified');
            if (userInfoPage) {
                userInfoPage.style.height = `${window.innerHeight}px`;
            }
        };

        // 初始设置
        setViewportHeight();

        // 设备检测
        const ua = navigator.userAgent;
        const isIOS = /iPad|iPhone|iPod/.test(ua);
        const isAndroid = /Android/.test(ua);
        document.body.classList.add(isIOS ? 'ios' : isAndroid ? 'android' : 'desktop');

        // 优化输入框
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.style.fontSize = '16px'; // 防止iOS缩放

            // 添加焦点处理
            input.addEventListener('focus', function() {
                setTimeout(() => {
                    this.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 300);
            });
        });

        // 优化按钮
        optimizeButtons(); // 这个函数现在已定义

        // 设置resize监听
        setupResizeListener(); // 这个函数现在已定义

        // 防止双击缩放
        preventDoubleTapZoom(); // 这个函数现在已定义

        // 修复iOS Safari特定问题
        if (isIOS && /Safari/.test(ua) && !/Chrome/.test(ua)) {
            console.log('iOS Safari detected, applying special fixes');

            // 防止弹性滚动
            document.body.style.overscrollBehavior = 'none';

            // 监听方向变化
            window.addEventListener('orientationchange', function() {
                setTimeout(setViewportHeight, 100);
            });

            // 监听键盘事件
            document.addEventListener('focusin', function() {
                setTimeout(setViewportHeight, 100);
            });

            document.addEventListener('focusout', function() {
                setTimeout(setViewportHeight, 100);
            });
        }

        // 添加必要的CSS样式
        const style = document.createElement('style');
        style.textContent = `
      .touch-active {
        opacity: 0.7 !important;
        transform: scale(0.98) !important;
        transition: opacity 0.2s, transform 0.2s !important;
      }
      
      /* 确保表单页面正确显示 */
      .user-info-page.simplified {
        min-height: 100vh;
        min-height: -webkit-fill-available;
        min-height: 100dvh;
        display: flex !important;
        flex-direction: column !important;
      }
      
      /* 防止内容溢出 */
      .simplified-container {
        flex: 1;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      
      /* 修复iOS输入框问题 */
      input, textarea {
        -webkit-appearance: none;
        border-radius: 0;
      }
      
      /* 防止长按菜单 */
      * {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }
      
      input, textarea {
        -webkit-user-select: text;
        user-select: text;
      }
    `;
        document.head.appendChild(style);

        // 初始高度设置
        setTimeout(setViewportHeight, 100);

        // 移除加载器
        setTimeout(removeLoader, 300);

        console.log('自适应功能初始化完成');

    } catch (error) {
        console.error('初始化过程中出错:', error);
        // 无论如何都要移除加载器
        setTimeout(removeLoader, 100);
    }
}

let resultPopup = null;
let closeResultPopup = null;
let viewPrizeDetailsBtn = null;
let shareResultBtn = null;
let confirmResultBtn = null;
let resultPopupPrizeName = null;
let resultPopupPrizeDesc = null;
let resultPrizeLevel = null;
let resultPrizeIcon = null;
let currentWonPrize = null;

// DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded 触发');

    // 立即显示用户信息页面（隐藏加载动画）
    const pageLoader = document.getElementById('pageLoader');
    const userInfoPage = document.getElementById('userInfoPage');

    if (pageLoader) {
        pageLoader.style.display = 'none';
    }

    if (userInfoPage) {
        userInfoPage.style.display = 'block';
        userInfoPage.style.opacity = '1';
    }

    // 隐藏其他页面
    const birthdayHome = document.getElementById('birthdayHome');
    const lotteryPage = document.getElementById('lotteryPage');
    if (birthdayHome) birthdayHome.style.display = 'none';
    if (lotteryPage) lotteryPage.style.display = 'none';

    // 初始化自适应功能
    setTimeout(initAdaptiveFeatures, 100);

    // 初始化表单验证
    initFormValidation();

    // 初始化变量
    let isSpinning = false;
    let hasSpun = false;
    let config = null;

    // DOM元素
    const birthdayPopup = document.getElementById('birthdayHome');
    const mainContent = document.getElementById('lotteryPage');
    const startBtn = document.getElementById('startLotteryBtn');
    const wheel = document.getElementById('wheel');
    const lotteryBtn = document.getElementById('lotteryBtn');
    const chancesElement = document.getElementById('chances');
    const resultCard = document.getElementById('resultCard');
    const resultText = document.getElementById('resultText');
    const resultActions = document.getElementById('resultActions');
    const viewPrizeBtn = document.getElementById('viewPrizeBtn');
    const prizePopup = document.getElementById('prizePopup');
    const prizesGrid = document.getElementById('prizesGrid');
    const closePopup = document.getElementById('closePopup');
    const confirmBtn = document.getElementById('confirmBtn');
    const popupTitle = document.getElementById('popupTitle');
    const prizeName = document.getElementById('prizeName');
    const prizeDetails = document.getElementById('prizeDetails');
    const prizeImage1 = document.getElementById('prizeImage1');
    const prizeImage2 = document.getElementById('prizeImage2');
    const videoLayer = document.getElementById('videoLayer');
    const birthdayVideo = document.getElementById('birthdayVideo');
    const videoOverlay = document.getElementById('videoOverlay');
    const unlockPrizeBtn = document.getElementById('unlockPrizeBtn');
    const closeVideo = document.getElementById('closeVideo');
    const confettiCanvas = document.getElementById('confettiCanvas');
    const fireworksContainer = document.getElementById('fireworksContainer');
    resultPopup = document.getElementById('resultPopup');
    closeResultPopup = document.getElementById('closeResultPopup');
    viewPrizeDetailsBtn = document.getElementById('viewPrizeDetailsBtn');
    shareResultBtn = document.getElementById('shareResultBtn');
    confirmResultBtn = document.getElementById('confirmResultBtn');
    resultPopupPrizeName = document.getElementById('resultPopupPrizeName');
    resultPopupPrizeDesc = document.getElementById('resultPopupPrizeDesc');
    resultPrizeLevel = document.getElementById('resultPrizeLevel');
    resultPrizeIcon = document.getElementById('resultPrizeIcon');
    let prizes =null;
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    let currentRotation = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 20;
    let logoImg = new Image();
    logoImg.src = '/image/logo.png';
    const targetPrizeIndex =8;

    // 初始化配置
    async function initConfig() {
        try {
            const response = await fetch('config.json');
            config = await response.json();
            prizes=config.wheelOptions;
            // 设置背景图
            document.documentElement.style.setProperty('--home-bg', `url('${config.backgrounds.home}')`);
            document.documentElement.style.setProperty('--lottery-bg', `url('${config.backgrounds.lottery}')`);

            // 初始化转盘
            initWheel();
            initPrizesGrid();
            initResultPopup();

            // 设置奖品图片
            prizeImage1.src = config.ultimatePrize.image;
            prizeImage2.src = config.ultimatePrize.travelImage;
            prizeDetails.innerHTML = config.ultimatePrize.details;

            // 设置视频源
            birthdayVideo.src = config.video.birthdayWishes;

            console.log('配置加载成功:', config);
        } catch (error) {
            console.error('加载配置失败:', error);
            // 使用默认配置
            config = {
                backgrounds: {
                    home: '',
                    lottery: ''
                },
                ultimatePrize: {
                    name: '颜人中南昌演唱会VIP门票 + 南昌两日游',
                    image: '',
                    travelImage: '',
                    description: '颜人中《》南昌演唱会VIP门票2张 + 南昌豪华两日游（含五星酒店住宿）',
                    details: '1. 颜人中演唱会VIP门票2张<br>2. 南昌两日游行程安排：滕王阁、八一广场、秋水广场、万达茂<br>3. 五星级酒店住宿1晚（含早餐）<br>4. 专车接送服务'
                },
                wheelOptions: [
                    { id: 1, name: '旅游大奖', color: '#A1C4FD', icon: '', isUltimate: false },
                    { id: 2, name: '演唱会门票', color: '#FF9A9E', icon: '', isUltimate: false },
                    { id: 3, name: '生日蛋糕', color: '#FFD89B', icon: '', isUltimate: false },
                    { id: 4, name: '神秘礼盒', color: '#D4A5E8', icon: '', isUltimate: false },
                    { id: 5, name: '祝福卡片', color: '#A8E6CF', icon: '', isUltimate: false },
                    { id: 6, name: '幸运红包', color: '#FFAAA5', icon: '', isUltimate: false },
                    { id: 7, name: '终极大奖', color: '#FF6B8B', icon: '', isUltimate: true, isSpecial: true }
                ]
            };
            initWheel();
        }
    }


// 初始化中奖结果弹窗
    function initResultPopup() {
        // 关闭弹窗
        closeResultPopup.addEventListener('click', function() {
            hideResultPopup();
        });

        // 点击弹窗外部关闭
        resultPopup.addEventListener('click', function(e) {
            if (e.target === resultPopup) {
                hideResultPopup();
            }
        });

        // 查看奖品详情按钮
        viewPrizeDetailsBtn.addEventListener('click', function() {
            // 如果是一等奖，显示详细信息
            if (currentWonPrize && currentWonPrize.isUltimate) {
                hideResultPopup();
                playBirthdayVideo();
            } else {
                alert('奖品详情：' + (currentWonPrize?.description || '请等待工作人员联系您确认奖品领取事宜。'));
            }
        });

        // 分享按钮
        shareResultBtn.addEventListener('click', function() {
            shareResult();
        });

        // 确认领取按钮
        confirmResultBtn.addEventListener('click', function() {
            confirmPrize();
        });
    }

    // 添加新函数：播放生日视频
    function playBirthdayVideo() {
        // // 显示视频层
        // prizePopup.style.display = 'none';
        // videoLayer.style.display = 'flex';
        //
        // // 重置视频状态
        // birthdayVideo.currentTime = 0;
        //
        // // 播放视频
        // birthdayVideo.play().catch(e => {
        //     console.error('视频播放失败:', e);
        //     // 如果视频播放失败，直接显示奖品详情
        //     videoLayer.style.display = 'none';
        //     setTimeout(() => {
        //         showPrizePopup(currentWonPrize);
        //     }, 300);
        // });

        console.log('开始播放视频，视频源:', birthdayVideo.src);
        console.log('视频元素状态:', birthdayVideo);

        // 显示视频层
        videoLayer.style.display = 'flex';

        // 重置视频状态
        birthdayVideo.currentTime = 0;
        videoOverlay.style.display = 'none';

        // 确保视频元素可见
        birthdayVideo.style.display = 'block';
        birthdayVideo.style.opacity = '1';
        birthdayVideo.style.visibility = 'visible';
        birthdayVideo.style.width = '100%';
        birthdayVideo.style.height = '100%';

        // 添加事件监听器
        birthdayVideo.addEventListener('loadeddata', function() {
            console.log('视频数据已加载，时长:', this.duration);
        });

        birthdayVideo.addEventListener('error', function(e) {
            console.error('视频加载错误:', e);
            console.error('错误详情:', this.error);

            // 使用备用视频
            birthdayVideo.src = 'https://assets.mixkit.co/videos/preview/mixkit-happy-birthday-balloons-4887-large.mp4';
            birthdayVideo.load();
            birthdayVideo.play();
        });

        birthdayVideo.addEventListener('canplay', function() {
            console.log('视频可以播放了');
        });

        // 尝试播放
        const playPromise = birthdayVideo.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('视频播放成功');
            }).catch(e => {
                console.error('视频播放失败:', e);
                // 如果自动播放失败，显示播放按钮
                videoOverlay.style.display = 'block';
                unlockPrizeBtn.textContent = '点击播放视频';
            });
        }
        // 监听视频结束事件
        birthdayVideo.onended = function() {
            videoOverlay.style.display = 'block';
        };
    }

    // 初始化奖品展示区域
    function initPrizesGrid() {
        if (!config || !config.wheelOptions) return;

        prizesGrid.innerHTML = '';
        const options = config.wheelOptions;

        options.forEach((option, index) => {
            const prizeCard = document.createElement('div');
            prizeCard.className = 'prize-card';
            if (option.isSpecial) {
                prizeCard.classList.add('ultimate');
            }
            prizeCard.style.background = `linear-gradient(135deg, ${option.color}, ${adjustColor(option.color, -20)})`;

            // 创建图标
            const icon = document.createElement('img');
            icon.className = 'prize-card-icon';
            icon.src = option.icon || getDefaultIcon(option.name);
            icon.alt = option.name;

            // 创建标题
            const title = document.createElement('h3');
            title.textContent = option.name;

            // 创建描述
            const description = document.createElement('p');
            description.textContent = option.description ;

            // 如果是终极大奖，添加特殊标记
            if (option.isSpecial) {
                const badge = document.createElement('div');
                badge.className = 'ultimate-badge';
                badge.textContent = '终极大奖';
                prizeCard.appendChild(badge);
            }

            prizeCard.appendChild(icon);
            prizeCard.appendChild(title);
            prizeCard.appendChild(description);
            prizesGrid.appendChild(prizeCard);
        });
    }
    // 初始化轮盘
    function initWheel() {
        drawWheel();
    }

    // 绘制轮盘
    function drawWheel() {
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const totalPrizes = prizes.length;
        const angleStep = (2 * Math.PI) / totalPrizes;

        // 绘制每个扇形
        prizes.forEach((prize, index) => {
            const startAngle = index * angleStep + currentRotation;
            const endAngle = (index + 1) * angleStep + currentRotation;

            // 绘制扇形
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = prize.color;
            ctx.fill();

            // 绘制扇形边框
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // 绘制文本和图标
            drawPrizeText(prize, startAngle, endAngle);
        });

        // 绘制中心圆
        ctx.beginPath();
        ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI);
        ctx.fillStyle = '#FF6B8B';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 8;
        ctx.stroke();

        // 绘制圆形logo，填充整个中心圆区域
        if (logoImg.complete && logoImg.naturalHeight !== 0) {
            // 保存上下文状态
            ctx.save();

            // 创建圆形裁剪区域（与中心圆相同大小）
            ctx.beginPath();
            ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.clip();

            // 计算logo的绘制尺寸，确保完全覆盖中心圆
            // 中心圆直径是100px，但为了覆盖边框，我们稍微扩大一点
            const logoSize = 100; // 与中心圆直径相同

            // 计算位置，使logo居中
            const logoX = centerX - logoSize / 2;
            const logoY = centerY - logoSize / 2;

            // 绘制logo图片
            ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

            // 恢复上下文状态
            ctx.restore();

            // 可选：在logo外面再绘制一个白色边框，使其更清晰
            ctx.beginPath();
            ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 4;
            ctx.stroke();
        } else {
            // 如果图片还未加载完成，显示加载中文字
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('加载中...', centerX, centerY);

            // 图片加载完成后重新绘制
            logoImg.onload = function() {
                drawWheel();
            };
        }
    }

    // 绘制奖品文本和图标
    function drawPrizeText(prize, startAngle, endAngle) {
        const midAngle = startAngle + (endAngle - startAngle) / 2;
        const textRadius = radius * 0.7;
        const iconRadius = radius * 0.5;

        // 计算文本位置
        const textX = centerX + Math.cos(midAngle) * textRadius;
        const textY = centerY + Math.sin(midAngle) * textRadius;

        // 计算图标位置
        const iconX = centerX + Math.cos(midAngle) * iconRadius;
        const iconY = centerY + Math.sin(midAngle) * iconRadius;

        // 保存上下文状态
        ctx.save();

        // 旋转文本使其可读
        ctx.translate(textX, textY);
        ctx.rotate(midAngle + Math.PI / 2);

        // 绘制奖品名称
        ctx.fillStyle = '#333';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 处理长文本换行
        const maxWidth = 100;
        const name = prize.name;
        const lines = [];
        let line = '';

        for (let i = 0; i < name.length; i++) {
            if (ctx.measureText(line + name[i]).width > maxWidth && line.length > 0) {
                lines.push(line);
                line = name[i];
            } else {
                line += name[i];
            }
        }
        lines.push(line);

        // 绘制多行文本
        lines.forEach((line, index) => {
            ctx.fillText(line, 0, index * 20 - (lines.length - 1) * 10);
        });

        // 恢复上下文状态
        ctx.restore();

        // 绘制图标
        ctx.save();
        ctx.translate(iconX, iconY);
        ctx.rotate(midAngle + Math.PI / 2);

        // 使用Font Awesome图标
        const iconSize = 24;
        ctx.font = `24px FontAwesome`;
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 映射图标名称到Font Awesome字符
        const iconMap = {
            'fas fa-plane': '✈',
            'fas fa-music': '♪',
            'fas fa-birthday-cake': '🎂',
            'fas fa-gift': '🎁',
            'fas fa-heart': '❤',
            'fas fa-money-bill-wave': '💰',
            'fas fa-trophy': '🏆'
        };

        const iconChar = iconMap[prize.icon] || '🎁';
        ctx.fillText(iconChar, 0, 0);

        ctx.restore();
    }

    // 转动轮盘
    function spinWheel() {
        if (isSpinning) return;

        // 设置状态
        isSpinning = true;
        lotteryBtn.disabled = true;

        // 随机选择一个奖品（可以改为从服务器获取结果）
        const selectedPrizeIndex =targetPrizeIndex;
        const selectedPrize = prizes[selectedPrizeIndex];

        // 计算旋转角度（确保指针指向所选奖品）
        const totalPrizes = prizes.length;
        const angleStep = 360 / totalPrizes;
        // 旋转多圈后再停在选中的奖品
        const extraRotation = 5 * 360; // 额外旋转5圈
        const targetRotation = extraRotation - (selectedPrizeIndex * angleStep) - (angleStep / 2);

        // 动画参数
        let startTime = null;
        const duration = 4000; // 4秒
        const startRotation = currentRotation;

        // 动画函数
        function animateSpin(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // 使用缓动函数使旋转更自然
            const easeOut = 1 - Math.pow(1 - progress, 3);
            currentRotation = startRotation + (targetRotation * easeOut * Math.PI / 180);

            drawWheel();

            if (progress < 1) {
                requestAnimationFrame(animateSpin);
            } else {
                // 动画结束
                isSpinning = false;
                lotteryBtn.disabled = false;

            }
        }

        // 开始动画
        requestAnimationFrame(animateSpin);
    }

    // 辅助函数：获取默认图标
    function getDefaultIcon(name) {
        const icons = {
            '演唱会门票': 'https://cdn-icons-png.flaticon.com/128/3142/3142022.png',
            '两日游': 'https://cdn-icons-png.flaticon.com/128/2838/2838912.png',
            '生日蛋糕': 'https://cdn-icons-png.flaticon.com/128/3199/3199893.png',
            '神秘礼盒': 'https://cdn-icons-png.flaticon.com/128/3082/3082012.png',
            '祝福卡片': 'https://cdn-icons-png.flaticon.com/128/2107/2107845.png',
            '幸运红包': 'https://cdn-icons-png.flaticon.com/128/3135/3135715.png',
            '许愿星': 'https://cdn-icons-png.flaticon.com/128/2582/2582605.png',
            '终极大奖': 'https://cdn-icons-png.flaticon.com/128/2582/2582576.png'
        };
        return icons[name] || 'https://cdn-icons-png.flaticon.com/128/3767/3767084.png';
    }

    function adjustColor(hex, lum) {
        hex = hex.replace(/^#/, '');
        let r = parseInt(hex.substr(0, 2), 16);
        let g = parseInt(hex.substr(2, 2), 16);
        let b = parseInt(hex.substr(4, 2), 16);

        r = Math.max(0, Math.min(255, r + lum));
        g = Math.max(0, Math.min(255, g + lum));
        b = Math.max(0, Math.min(255, b + lum));

        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
    }

    // 开始按钮事件
    startBtn.addEventListener('click', function() {
        birthdayPopup.style.display = 'none';
        mainContent.style.display = 'block';
        initConfig();
    });


    document.getElementById('lotteryBtn').addEventListener('click', function() {
        // 防止重复点击
        if (isSpinning || hasSpun) return;

        spinWheel()
        // 6. 模拟网络延迟后显示结果
        setTimeout(() => {
            const wonPrize = config.wheelOptions[6]; // 根据上面的索引获取奖品名
            const greetingName = document.getElementById('greetingName');

            // 显示结果
            showResult(wonPrize)
            // 显示“查看我的大奖”按钮
            resultActions.style.display = 'block';

            // 触发礼花特效 (如果您的 triggerFireworks 函数已定义)
            if (typeof triggerFireworks === 'function') {
                triggerFireworks();
            }

            // 恢复按钮状态
            lotteryBtn.innerHTML = '<i class="fas fa-check"></i> 已抽奖';
            isSpinning = false;
            // 显示中奖结果弹窗
            setTimeout(() => {
                handleLotteryResult(wonPrize);
            }, 1500); // 延迟显示弹窗，让用户先看到转盘结果

        }, 4000); // 与CSS动画时长匹配
    });

    // 显示抽奖结果
    function showResult(prize) {
        resultText.textContent = `恭喜您获得：${prize.name}`;
        resultCard.style.background = `linear-gradient(135deg, ${prize.color}, ${adjustColor(prize.color, -20)})`;
        resultCard.style.color = 'white';
        resultCard.style.border = '2px solid white';

        // 添加动画效果
        resultCard.style.transform = 'scale(1.05)';
        setTimeout(() => {
            resultCard.style.transform = 'scale(1)';
        }, 300);
    }

    // 触发礼花特效
    function triggerFireworks() {
        // 显示礼花容器
        fireworksContainer.style.display = 'block';

        // 使用canvas-confetti库
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1003 };

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
                fireworksContainer.style.display = 'none';
                return;
            }

            const particleCount = 50 * (timeLeft / duration);

            // 多位置发射
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
            confetti({
                ...defaults,
                particleCount: particleCount / 2,
                scalar: 1.5,
                origin: { x: 0.5, y: 0.5 }
            });
        }, 250);
    }


// 显示中奖结果弹窗
    function showResultPopup(prize) {
        if (!prize || !resultPopup) return;

        currentWonPrize = prize;

        // 设置弹窗内容
        resultPopupPrizeName.textContent = prize.name;

        // 设置奖品描述
        if (prize.description) {
            resultPopupPrizeDesc.textContent = prize.description;
        } else {
            resultPopupPrizeDesc.textContent = `恭喜您获得了${prize.name}！`;
        }

        // 设置奖品等级
        const levelBadge = resultPrizeLevel.querySelector('.level-badge');
        if (prize.isUltimate) {
            levelBadge.textContent = '特等奖';
            levelBadge.style.background = 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)';
            resultPrizeIcon.className = 'fas fa-crown';
        } else {
            // 根据奖品ID或其他逻辑设置等级
            const levels = ['一等奖', '二等奖', '三等奖', '四等奖', '五等奖', '六等奖', '七等奖'];
            const levelIndex = Math.min(prize.id - 1, levels.length - 1);
            levelBadge.textContent = levels[levelIndex] || '参与奖';

            // 设置图标
            const iconMap = {
                1: 'fas fa-plane',       // 旅游大奖
                2: 'fas fa-music',       // 演唱会门票
                3: 'fas fa-birthday-cake', // 生日蛋糕
                4: 'fas fa-gift',        // 神秘礼盒
                5: 'fas fa-heart',       // 祝福卡片
                6: 'fas fa-money-bill-wave', // 幸运红包
                7: 'fas fa-star'         // 许愿星
            };
            resultPrizeIcon.className = iconMap[prize.id] || 'fas fa-gift';
        }



        // 显示弹窗
        resultPopup.style.display = 'flex';

        // 触发礼花特效
        setTimeout(() => {
            triggerResultConfetti();
        }, 300);

    }

// 隐藏中奖结果弹窗
    function hideResultPopup() {
        if (resultPopup) {
            resultPopup.style.display = 'none';
        }
    }

// 触发弹窗内的礼花特效
    function triggerResultConfetti() {
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#FFD700', '#FFA500', '#FF6B8B', '#4A00E0']
            });

            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#00C9FF', '#92FE9D', '#26d0ce', '#1a2980']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        // 中心大礼花
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FFD700', '#FF6B8B', '#00C9FF', '#4A00E0']
            });
        }, 500);
    }

// 分享中奖结果
    function shareResult() {
        const userName = localStorage.getItem('userName') || '幸运用户';
        const prizeName = currentWonPrize?.name || '神秘大奖';

        const shareText = `${userName}在LAN²KING生日幸运抽奖中获得了${prizeName}！快来参与吧！`;

        if (navigator.share) {
            // 使用Web Share API
            navigator.share({
                title: '我中奖了！',
                text: shareText,
                url: window.location.href
            }).then(() => {
                console.log('分享成功');
            }).catch(err => {
                console.log('分享失败:', err);
                fallbackShare(shareText);
            });
        } else {
            // 降级处理
            fallbackShare(shareText);
        }
    }

    function fallbackShare(text) {
        // 复制到剪贴板
        navigator.clipboard.writeText(text).then(() => {
            alert('分享内容已复制到剪贴板！\n\n' + text);
        }).catch(err => {
            // 如果clipboard API不可用
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('分享内容已复制到剪贴板！\n\n' + text);
        });
    }

// 确认领取奖品
    function confirmPrize() {
        const userName = localStorage.getItem('userName') || '用户';
        const userPhone = localStorage.getItem('userPhone') || '';
        const prizeName = currentWonPrize?.name || '奖品';

        // 这里可以添加实际的领取逻辑，比如发送到服务器
        console.log('确认领取:', { userName, userPhone, prizeName });

        // 显示确认信息
        hideResultPopup();

        // 显示领取成功提示
        const successMsg = `
    <div style="text-align:center;padding:20px;">
      <h3 style="color:#4CAF50;"><i class="fas fa-check-circle"></i> 领取成功！</h3>
      <p>恭喜您已成功领取<span style="font-weight:bold;color:#FF6B8B;">${prizeName}</span></p>
      <p>我们的工作人员将在24小时内通过电话与您联系</p>
      <p>联系电话：<span style="font-weight:bold;">${userPhone}</span></p>
      <br>
      <p style="font-size:12px;color:#666;">如联系方式有误，请联系客服：400-XXX-XXXX</p>
    </div>
  `;

        // 创建一个简单的提示框
        const alertDiv = document.createElement('div');
        alertDiv.innerHTML = successMsg;
        alertDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 15px;
    padding: 0;
    z-index: 10001;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
    animation: popupIn 0.3s ease;
    min-width: 300px;
    max-width: 90%;
  `;

        // 添加关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.style.cssText = `
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    color: #666;
    font-size: 18px;
    cursor: pointer;
  `;
        closeBtn.onclick = function() {
            document.body.removeChild(alertDiv);
            document.body.removeChild(overlay);
        };
        alertDiv.appendChild(closeBtn);

        // 添加半透明背景
        const overlay = document.createElement('div');
        overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.7);
    z-index: 10000;
  `;
        overlay.onclick = function() {
            document.body.removeChild(alertDiv);
            document.body.removeChild(overlay);
        };

        document.body.appendChild(overlay);
        document.body.appendChild(alertDiv);
    }

    // 修改您的抽奖结果处理函数
    // 在 spinWheel 函数或抽奖按钮事件处理中调用
    function handleLotteryResult(prize) {

        // 然后显示中奖弹窗
        setTimeout(() => {
            showResultPopup(prize);
        }, 1000); // 延迟1秒显示弹窗，让用户先看到转盘结果
    }
    // 显示中奖弹窗
    function showPrizePopup(prize) {
        // 设置弹窗内容
        popupTitle.innerHTML = `<i class="fas fa-crown"></i> ${prize.name}`;
        prizeName.textContent = config.ultimatePrize.name;

        // 显示弹窗
        prizePopup.style.display = 'flex';

        // 弹窗内也触发一些礼花
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }, 500);
    }

    // 查看大奖按钮事件
    viewPrizeBtn.addEventListener('click', function() {
        prizePopup.style.display = 'none';
        videoLayer.style.display = 'flex';

        // 播放视频
        birthdayVideo.play().catch(e => {
            console.error('视频播放失败:', e);
            // 如果视频播放失败，显示备用视频
            birthdayVideo.src = config.video.fallbackVideo || 'https://assets.mixkit.co/videos/preview/mixkit-happy-birthday-balloons-4887-large.mp4';
            birthdayVideo.play();
        });

        // 监听视频结束事件
        birthdayVideo.onended = function() {
            videoOverlay.style.display = 'block';
        };
    });

    // 解锁奖品按钮事件
    unlockPrizeBtn.addEventListener('click', function() {
        videoLayer.style.display = 'none';
        prizePopup.style.display = 'flex';
    });

    // 关闭弹窗
    closePopup.addEventListener('click', function() {
        prizePopup.style.display = 'none';
    });

    confirmBtn.addEventListener('click', function() {
        prizePopup.style.display = 'none';
        alert('恭喜您已成功领取终极大奖！我们将在24小时内联系您确认奖品领取事宜。');
    });

    closeVideo.addEventListener('click', function() {
        videoLayer.style.display = 'none';
        birthdayVideo.pause();
        birthdayVideo.currentTime = 0;
    });

    // 点击弹窗外部关闭
    prizePopup.addEventListener('click', function(e) {
        if (e.target === prizePopup) {
            prizePopup.style.display = 'none';
        }
    });

    videoLayer.addEventListener('click', function(e) {
        if (e.target === videoLayer) {
            videoLayer.style.display = 'none';
            birthdayVideo.pause();
            birthdayVideo.currentTime = 0;
        }
    });

    // 初始化
    initConfig();
});

// 初始化表单验证
function initFormValidation() {
    console.log('初始化表单验证');

    const form = document.getElementById('userInfoForm');
    if (!form) {
        console.error('找不到表单元素');
        return;
    }

    // 表单提交事件
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('表单提交');

        // 获取表单数据
        const userName = document.getElementById('userName').value.trim();
        const userPhone = document.getElementById('userPhone').value.trim();
        const agreeTerms = document.getElementById('agreeTerms').checked;

        // 验证姓名
        const nameError = document.getElementById('nameError');
        if (!userName) {
            nameError.textContent = '请输入您的姓名';
            nameError.style.display = 'block';
            return false;
        } else {
            nameError.textContent = '';
            nameError.style.display = 'none';
        }

        // 验证手机号
        const phoneError = document.getElementById('phoneError');
        const phonePattern = /^1[3-9]\d{9}$/;
        if (!userPhone) {
            phoneError.textContent = '请输入手机号码';
            phoneError.style.display = 'block';
            return false;
        } else if (!phonePattern.test(userPhone)) {
            phoneError.textContent = '请输入有效的11位手机号码';
            phoneError.style.display = 'block';
            return false;
        } else {
            phoneError.textContent = '';
            phoneError.style.display = 'none';
        }

        // 验证协议
        const termsError = document.getElementById('termsError');
        if (!agreeTerms) {
            termsError.textContent = '请同意用户协议和隐私政策';
            termsError.style.display = 'block';
            return false;
        } else {
            termsError.textContent = '';
            termsError.style.display = 'none';
        }

        // 验证通过
        console.log('表单验证通过，用户名:', userName);

        // 保存用户信息
        localStorage.setItem('userName', userName);
        localStorage.setItem('userPhone', userPhone);

        // 跳转到生日页面
        showBirthdayPage(userName);

        return true;
    });

    // 实时验证
    const userNameInput = document.getElementById('userName');
    const userPhoneInput = document.getElementById('userPhone');
    const agreeTermsCheckbox = document.getElementById('agreeTerms');

    if (userNameInput) {
        userNameInput.addEventListener('input', function() {
            const nameError = document.getElementById('nameError');
            if (this.value.trim()) {
                nameError.textContent = '';
                nameError.style.display = 'none';
            }
        });
    }

    if (userPhoneInput) {
        userPhoneInput.addEventListener('input', function() {
            const phoneError = document.getElementById('phoneError');
            if (this.value.trim()) {
                phoneError.textContent = '';
                phoneError.style.display = 'none';
            }
        });
    }

    if (agreeTermsCheckbox) {
        agreeTermsCheckbox.addEventListener('change', function() {
            const termsError = document.getElementById('termsError');
            if (this.checked) {
                termsError.textContent = '';
                termsError.style.display = 'none';
            }
        });
    }
}

// 显示生日页面
function showBirthdayPage(userName) {
    console.log('显示生日页面，用户名:', userName);

    // 隐藏用户信息页面
    const userInfoPage = document.getElementById('userInfoPage');
    const birthdayHome = document.getElementById('birthdayHome');

    if (!userInfoPage || !birthdayHome) {
        console.error('找不到必要的页面元素');
        return;
    }

    // 确保两个页面都有正确的初始状态类
    userInfoPage.classList.remove('active');
    userInfoPage.classList.add('hidden');

    // 设置用户名
    const displayName = document.getElementById('displayName');
    const greetingName = document.getElementById('greetingName');

    if (displayName) displayName.textContent = userName;
    if (greetingName) greetingName.textContent = userName;

    // 显示生日页面
    birthdayHome.classList.remove('hidden');
    birthdayHome.classList.add('active');

    // 可选：使用 CSS 过渡动画
    setTimeout(() => {
        userInfoPage.style.display = 'none';
        birthdayHome.style.display = 'block';

        // 触发入场动画
        birthdayHome.style.opacity = '1';
        birthdayHome.style.transform = 'translateY(0)';
    }, 10);
}

// 页面完全加载后的处理
window.addEventListener('load', function() {
    console.log('window.load 触发');

    // 确保加载器被隐藏
    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader && pageLoader.style.display !== 'none') {
        pageLoader.style.display = 'none';
    }

    // 最终检查，如果用户信息页面未显示，则显示它
    const userInfoPage = document.getElementById('userInfoPage');
    if (userInfoPage && userInfoPage.style.display === 'none') {
        userInfoPage.style.display = 'block';
    }
});

// 备用方案：5秒后无论如何都显示页面
setTimeout(function() {
    console.log('备用方案：强制显示页面');

    const pageLoader = document.getElementById('pageLoader');
    if (pageLoader && pageLoader.style.display !== 'none') {
        pageLoader.style.display = 'none';
    }

    const userInfoPage = document.getElementById('userInfoPage');
    if (userInfoPage && userInfoPage.style.display === 'none') {
        userInfoPage.style.display = 'block';
    }
}, 5000);

