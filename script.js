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

// 启动应用
init(); 