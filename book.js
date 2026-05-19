// Vercel Serverless Function - 处理预约表单提交
const SENDKEY = 'SCT349373Te3BheZcMdy78z1DEIXwRkyuw';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: '仅支持POST' });
  }
  
  try {
    const data = req.body;
    
    // 构建推送消息
    const msg = `🔔 膳粮人新预约！
    
📛 姓名：${data.name}
📞 电话：${data.phone}
👥 人数：${data.people}
📅 日期：${data.date}
⏰ 时间：${data.time}
📍 地址：${data.address}
🛒 代买菜：${data.needBuy === 'yes' ? '需要' : '不需要'}
💁 服务员：${data.needServer !== '0' ? data.needServer + '位' : '不需要'}
🧹 保洁员：${data.needCleaner !== '0' ? data.needCleaner + '位' : '不需要'}
💰 预算：${data.budget || '未填'}
📝 备注：${data.note || '无'}`;

    const pushRes = await fetch(`https://sctapi.ftqq.com/${SENDKEY}.send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `🔔 新预约 - ${data.name} (${data.phone})`,
        desp: msg
      })
    });
    
    const pushResult = await pushRes.json();
    console.log('Server酱推送结果:', pushResult);
    
    return res.status(200).json({
      ok: true,
      message: '✅ 预约已提交！卢师傅会尽快微信联系你'
    });
  } catch (e) {
    console.error('处理预约失败:', e);
    return res.status(200).json({
      ok: true,
      message: '✅ 预约已记录！请加微信 luzhukun001 确认'
    });
  }
}
