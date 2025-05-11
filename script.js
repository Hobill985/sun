// 更新当前时间
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });
    document.getElementById('current-time').textContent = timeString;
}

// 获取位置信息
async function getLocation() {
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const location = `${data.city}, ${data.country_name}`;
        document.getElementById('location').textContent = location;
        return data;
    } catch (error) {
        console.error('获取位置信息失败:', error);
        document.getElementById('location').textContent = '无法获取位置信息';
    }
}

// 获取日出日落时间
async function getSunTimes(latitude, longitude) {
    try {
        const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&formatted=0`);
        const data = await response.json();
        
        if (data.status === 'OK') {
            const sunrise = new Date(data.results.sunrise);
            const sunset = new Date(data.results.sunset);
            
            document.getElementById('sunrise-time').textContent = sunrise.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            
            document.getElementById('sunset-time').textContent = sunset.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
        }
    } catch (error) {
        console.error('获取日出日落时间失败:', error);
        document.getElementById('sunrise-time').textContent = '--:--';
        document.getElementById('sunset-time').textContent = '--:--';
    }
}

// 抛硬币相关变量
let flipCount = 0;
const maxFlips = 6;
const results = [];

// 抛硬币动画和逻辑
function flipCoin() {
    if (flipCount >= maxFlips) {
        return;
    }

    const coin = document.getElementById('coin');
    const button = document.getElementById('flip-button');
    button.disabled = true;

    // 随机决定结果
    const result = Math.random() < 0.5 ? 1 : 0;
    results.push(result);

    // 计算最终旋转角度
    // 如果是正面(1)，旋转到0度；如果是反面(0)，旋转到180度
    const finalRotation = result === 1 ? 0 : 180;
    
    // 重置动画
    coin.style.animation = 'none';
    coin.offsetHeight; // 触发重绘
    
    // 设置动画和初始状态
    coin.style.animation = 'flip 1s ease-in-out';
    
    // 动画结束后设置最终状态
    setTimeout(() => {
        coin.style.animation = 'none';
        coin.style.transform = `rotateX(${finalRotation}deg)`;
        updateResults();
        flipCount++;
        
        if (flipCount >= maxFlips) {
            button.textContent = '已完成6次';
        } else {
            button.disabled = false;
        }
    }, 1000);
}

// 更新结果显示
function updateResults() {
    const resultList = document.getElementById('result-list');
    resultList.innerHTML = results.map(result => 
        `<div class="result-item">${result}</div>`
    ).join('');
}

// 初始化
async function init() {
    // 立即更新一次时间
    updateTime();
    // 每秒更新一次时间
    setInterval(updateTime, 1000);
    
    // 获取位置信息
    const locationData = await getLocation();
    if (locationData) {
        // 获取日出日落时间
        await getSunTimes(locationData.latitude, locationData.longitude);
    }
}

// 等待 DOM 加载完成后再添加事件监听
document.addEventListener('DOMContentLoaded', () => {
    // 添加抛硬币按钮事件监听
    const flipButton = document.getElementById('flip-button');
    if (flipButton) {
        flipButton.addEventListener('click', flipCoin);
    }
    
    // 启动应用
    init();
}); 