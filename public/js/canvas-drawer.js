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