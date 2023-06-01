//캔버스에 무언가를 그릴때 사용하는 메소드 모음입니다.


function drawPoints(ctx, points) {
    ctx.fillStyle = 'red';
    points.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 2, 0, 2 * Math.PI);
        ctx.fill();
    });
}

function drawBox(ctx, rect) {
    ctx.strokeStyle = "#BB0000";
    ctx.lineWidth = 4;
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
}

function drawImage(ctx, image, centerX, centerY, angle, dist) {

    console.log(dist)
    var imageWidth = dist * 1.3;
    var imageHeight = image.height * imageWidth / image.width * 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.drawImage(image, -imageWidth / 2, -imageHeight / 2, imageWidth, imageHeight);
    ctx.restore();
}

function clearCanvas(canvas) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}