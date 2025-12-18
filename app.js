document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('flavorWheel');
  const resBox = document.getElementById('flavorResult');
  if (!canvas || !resBox) return;

  const ctx = canvas.getContext('2d');
  const center = { x: canvas.width / 2, y: canvas.height / 2 };
  const radius = 220;

  const slices = [
    { key:'fruit',  label:'果香',  color:'#ff6b6b' },
    { key:'floral', label:'花香',  color:'#c084fc' },
    { key:'citrus', label:'柑橘',  color:'#ffd166' },
    { key:'nutty',  label:'堅果',  color:'#d1a46b' },
    { key:'cocoa',  label:'可可',  color:'#8b5e3c' },
    { key:'spice',  label:'香料',  color:'#e07a5f' },
  ];

  const angle = (Math.PI * 2) / slices.length;

  // 畫出分區
  slices.forEach((s, i) => {
    const start = i * angle;
    const end = start + angle;
    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.arc(center.x, center.y, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = s.color;
    ctx.globalAlpha = 0.9;
    ctx.fill();

    const mid = start + angle / 2;
    const lx = center.x + Math.cos(mid) * (radius * 0.65);
    const ly = center.y + Math.sin(mid) * (radius * 0.65);
    ctx.fillStyle = '#fff';
    ctx.font = '600 14px system-ui';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(s.label, lx, ly);
  });

  // 點擊事件
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - center.x;
    const y = e.clientY - rect.top - center.y;
    const dist = Math.sqrt(x*x + y*y);
    if (dist > radius) return;

    let theta = Math.atan2(y, x);
    if (theta < 0) theta += Math.PI * 2;
    const index = Math.floor(theta / angle);
    const picked = slices[index];

    const cards = document.querySelectorAll('.card');
    let count = 0;
    cards.forEach(card => {
      const flavors = (card.getAttribute('data-flavors') || '').split(',');
      const match = flavors.includes(picked.key);
      card.style.opacity = match ? 1 : 0.28;
      card.style.transform = match ? 'scale(1.0)' : 'scale(0.98)';
      if (match) count++;
    });

    resBox.innerHTML = `
      <h3>你的即時篩選</h3>
      <p>已套用「${picked.label}」風味關聯，共 ${count} 款符合。</p>
    `;
  });
});
