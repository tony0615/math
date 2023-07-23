const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 设置画布尺寸
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const explosions = []; // 存储爆炸效果的数组
// 玩家和目标的初始位置
const bullets = [];
let playerLv = 2;

const compassCenterX = canvas.width / 2;
const compassCenterY = canvas.height;

// 角度设置
let angle = -Math.PI / 2; // 初始角度朝上

// 风向和风速
let windDirection = 1; // 1表示右侧风，-1表示左侧风
let windSpeed = 2; // 风速

// 射出的箭的速度
const arrowSpeed = 16;

// 是否正在射击
let isShooting = false;
let score = 0;
let shootTime = 0;

const bullet = { speedX: 0, speedY: 0, x: compassCenterX, y: compassCenterY }
// 子弹是否就位
let bulletReady = true;
// 是否命中
let ishit = false, boomR = 30, globalAlpha = 1;;
// 绘制游戏画面
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);


  // 绘制目标
  if (target) target.draw();

  ctx.globalAlpha = 1;
  // 绘制风向和风速
  ctx.fillStyle = 'black';
  ctx.font = '16px Arial';
  ctx.fillText(`风向：${windDirection === 1 ? '右' : '左'}`, 10, 30);
  ctx.fillText(`风速：${windSpeed}`, 10, 50);
  ctx.fillText(`射击：${shootTime}`, 10, 70);
  ctx.fillText(`得分：${score}`, 10, 90);

  // 绘制仪表盘
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(compassCenterX, compassCenterY, canvas.width / 8, Math.PI, 0); // 画半圆，朝上
  ctx.stroke();
  ctx.beginPath();
  const pointerX = compassCenterX + (canvas.width / 7) * Math.cos(angle);
  const pointerY = compassCenterY + (canvas.width / 7) * Math.sin(angle);
  ctx.moveTo(compassCenterX, compassCenterY);
  ctx.lineTo(pointerX, pointerY);
  ctx.stroke();

}

// 控制射击方向
function shoot() {
  if (!bulletReady) return false;
  shootTime++;
  bullet.speedX = Math.cos(angle) * arrowSpeed + (windSpeed * windDirection);
  bullet.speedY = Math.sin(angle) * arrowSpeed
  bulletReady = false;

  let bangle = angle - (playerLv - 1) * 0.05
  for (let i = 0; i < playerLv; i++) {
    const mbullet = new Bullet(compassCenterX, compassCenterY, bangle + i * 0.1, getRandomColor());
    bullets.push(mbullet);
  }

}

// 生成随机颜色
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
// 把rgb(#FFFFFF格式)转化为rgba
function generateRGBAColor(color, alpha) {
  const rgb = color.substring(1); // 去除颜色值开头的'#'
  const r = parseInt(rgb.substring(0, 2), 16);
  const g = parseInt(rgb.substring(2, 4), 16);
  const b = parseInt(rgb.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// 监听鼠标按下和移动事件
canvas.addEventListener('mousedown', function (event) {
  const rect = canvas.getBoundingClientRect();
  const centerX = rect.left + compassCenterX;
  const centerY = rect.top + compassCenterY;
  angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
  isShooting = true;
});

document.addEventListener('mousemove', function (event) {
  if (isShooting) {
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + compassCenterX;
    const centerY = rect.top + compassCenterY;
    angle = Math.atan2(event.clientY - centerY, event.clientX - centerX);
  }
});

document.addEventListener('mouseup', function (event) {
  console.log('mouseup', event);
  if (isShooting) {
    shoot();
    isShooting = false;
  }
});

// 主循环
let lasttime = new Date().getTime();
function gameLoop() {
  draw();

  // 更新和绘制子弹
  bullets.forEach((bullet, index) => {
    bullet.update();
    bullet.draw(ctx);

    // 检查子弹是否碰撞目标
    if (bullet.checkCollision(target.x, target.y, target.size)) {
      score++;
      target.dead();

      bullets.splice(index, 1); // 从数组中删除子弹

    }

    // 如果子弹超出画布范围，从数组中删除它，节省内存
    if (bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
      bullets.splice(index, 1);
    }
  });

  let newtime = new Date().getTime();

  if (newtime - lasttime > 1000 - 100 * playerLv) {
    bulletReady = true;
    lasttime = newtime;
  }
  requestAnimationFrame(gameLoop);
}



// 绘制圆形图片
function drawCircularImage(image, x, y, radius) {
  // 创建一个临时Canvas
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  tempCanvas.width = radius * 2;
  tempCanvas.height = radius * 2;

  // 在临时Canvas上绘制圆形图像
  tempCtx.beginPath();
  tempCtx.arc(radius, radius, radius, 0, 2 * Math.PI);
  tempCtx.closePath();
  tempCtx.clip();
  tempCtx.drawImage(image, 0, 0, radius * 2, radius * 2);

  // 将临时Canvas上的图像复制到目标坐标上
  ctx.drawImage(tempCanvas, x-radius, y - radius);
}


class Player {
  constructor(ctx, x, y, image) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.image = image;
    this.size = 30;
    this.ishit = false;
    this.mode = 1;
    this.explosions = [];
  }
  // 更新目标的位置
  updatePosition() {
    this.x += windSpeed * windDirection;
    // 检查目标是否碰到画布边缘，如果是，改变风向
    if (this.x <= 0 || this.x >= canvas.width) {
      windDirection *= -1;
      windSpeed = Math.round(Math.random()*4)+2;
      this.x += windSpeed * windDirection;
    }
  }
  // 被击中死亡
  dead() {
    const explosion = new Explosion(target.x, target.y, ctx);
    this.explosions.push(explosion);
    windSpeed = Math.round(Math.random()*4)+2;
  }
  draw() {
    if (this.mode == 1) this.updatePosition();
    const ctx = this.ctx;

    // 更新和绘制爆炸效果
    this.explosions.forEach((explosion, index) => {
      explosion.update();
      explosion.draw();

      // 爆炸效果持续一段时间后从数组中删除，节省内存
      if (explosion.particles.every((particle) => particle.life <= 0)) {
        this.explosions.splice(index, 1);
      }
    });
    if (this.explosions.length == 0) { //不爆炸的时候重新生成
      // 绘制目标
      if (this.image) {
        ctx.moveTo(this.x, this.y);
        drawCircularImage(this.image, this.x, this.y, this.size);
      } else {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.globalAlpha = 1;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

      }
    }
  }
}
class Bullet {
  constructor(x, y, angle, color) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.color = color;
    this.speed = 13;
    this.size = 5;
    this.tailLength = 8; // 尾巴长度
    this.tail = []; // 存储尾巴效果的数组
  }

  update() {
    // 更新子弹位置
    this.x += this.speed * Math.cos(this.angle); // 加上风的偏移 + (windSpeed * windDirection)
    this.y += this.speed * Math.sin(this.angle);

    // 添加尾巴效果
    this.tail.push({ x: this.x, y: this.y, alpha: 1 });

    // 控制尾巴长度
    if (this.tail.length > this.tailLength) {
      this.tail.shift(); // 删除最早的尾巴粒子
    }

    // 控制尾巴粒子的透明度逐渐减小，实现渐隐效果
    this.tail.forEach((particle, index) => {
      particle.alpha = 1 - index / this.tailLength;
    });
  }
  // 碰撞检测
  checkCollision(targetX, targetY, targetR) {
    const dx = this.x - targetX;
    const dy = this.y - targetY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < targetR;
  }
  draw(ctx) {
    // 绘制子弹本体
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    // 绘制尾巴效果
    for (let i = 0; i < this.tail.length; i++) {
      const particle = this.tail[i];
      ctx.fillStyle = generateRGBAColor(this.color, particle.alpha);
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, this.size * Math.sin(0.5 * Math.PI * i / this.tail.length), 0, Math.PI * 2);
      ctx.fill();
    }
    // this.tail.forEach((particle) => {
    //   ctx.fillStyle = `rgba(${this.color},${particle.alpha})`;
    //   ctx.beginPath();
    //   ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
    //   ctx.fill();
    // });
  }
  
}

// 碎片化的爆炸效果类
class Explosion {
  constructor(x, y, ctx, image) {
    this.x = x;
    this.y = y;
    this.ctx = ctx;
    this.image = image;
    this.particles = []; // 存储碎片的数组
    this.particleCount = 20; // 碎片数量
    this.initParticles();
    this.life = 30;
  }

  initParticles() {
    if (this.image) {
      // 如果爆炸目标是图片
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = this.image.width;
      canvas.height = this.image.height;
      ctx.drawImage(this.image, 0, 0);

      // 使用getImageData获取图像像素数据
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // 计算每个碎片的大小
      const fragmentWidth = canvas.width / this.particleCount;
      const fragmentHeight = canvas.height / this.particleCount;

      for (let i = 0; i < this.particleCount; i++) {
        for (let j = 0; j < this.particleCount; j++) {
          const fragmentX = i * fragmentWidth;
          const fragmentY = j * fragmentHeight;
          const rotation = Math.random() * 2 * Math.PI; // 随机旋转角度

          const fragmentImageData = ctx.getImageData(fragmentX, fragmentY, fragmentWidth, fragmentHeight);
          const fragmentCanvas = document.createElement('canvas');
          const fragmentCtx = fragmentCanvas.getContext('2d');
          fragmentCanvas.width = fragmentWidth;
          fragmentCanvas.height = fragmentHeight;
          fragmentCtx.putImageData(fragmentImageData, 0, 0);

          const fragmentImage = new Image();
          fragmentImage.src = fragmentCanvas.toDataURL(); // 将canvas转换成图片

          const speed = Math.random() * 3 + 1; // 随机速度
          this.particles.push({
            x: this.x,
            y: this.y,
            vx: speed * Math.cos(rotation),
            vy: speed * Math.sin(rotation),
            life: 30,
            rotation: rotation,
            rotationStep: (Math.round(Math.random() * 6) - 3) * 0.1,
            image: fragmentImage,
          });
        }
      }
    } else {
      // 如果爆炸目标不是图片
      for (let i = 0; i < this.particleCount; i++) {
        const angle = Math.random() * 2 * Math.PI; // 随机角度
        const speed = Math.random() * 3 + 1; // 随机速度
        this.particles.push({
          x: this.x,
          y: this.y,
          vx: speed * Math.cos(angle),
          vy: speed * Math.sin(angle),
          life: 30,
        });
      }
    }
  }

  update() {
    this.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
      if (particle.rotation) particle.rotation += particle.rotationStep;
    });
  }

  draw() {
    this.particles.forEach((particle) => {
      if (particle.life > 0) {
        if (this.image) {
          ctx.save();
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.rotation);

          ctx.globalAlpha = particle.life / this.life; // 设置碎片的透明度

          ctx.drawImage(
            particle.image,
            -particle.image.width / 2,
            -particle.image.height / 2
          );
          ctx.restore();
        } else {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = 'red'; // 碎片颜色
          ctx.fill();
        }
      }
    });
  }
}


let target = new Player(ctx, canvas.width / 2, 50, null);
const targetImg = new Image();
targetImg.src = 'player1.png';
targetImg.onload = () => {
  target = new Player(ctx, canvas.width / 2, 50, targetImg);
}
// 仪表盘中心位置

// 启动游戏循环
gameLoop();