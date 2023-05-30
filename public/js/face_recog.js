
const MODEL_URL = 'models';
Promise.all([
    faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
]).then(OnReadyFaceAPI);

/* 이쪽이 안경 이미지 불러오는 코드입니다 */
var canvas = document.getElementById('canvas');
var glassesImage = new Image();
glassesImage.src = 'assets/2.png';
glassesImage.width = 300;
glassesImage.height = 150;

console.log("로드 끝");

function OnReadyFaceAPI() {
    const constraints = {
        video: true
    };

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var video = document.getElementById('video');
    const captureButton = document.getElementById("webcamBtn");

    captureButton.addEventListener("click", function () {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height); // 캡처한 이미지 그리기

        // 이미지를 네모 박스에 표시하기
        var newCanvas = document.createElement('canvas');
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;
        newCanvas.style.width = "100%";
        newCanvas.style.height = "100%";
        var ctx = newCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, 0);

        var imageContainer = document.getElementById("capturedImageContainer");
        imageContainer.innerHTML = ""; // 이미지를 표시하기 전에 기존 내용을 지움
        imageContainer.appendChild(newCanvas);

        AnalyzeFace(context, canvas, video, newCanvas, ctx);
    });

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
            var video = document.getElementById('video');
            video.srcObject = stream;
            video.play();
        });
    }
}

function AnalyzeFace(context, canvas, video, ouputCanvas, ouputContext) {
    setInterval(async () => {
        const options = getFaceDetectorOptions()
        const detections = await faceapi.detectAllFaces(canvas, options).withFaceLandmarks();

        clearCanvas(canvas);
        clearCanvas(ouputCanvas);
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        ouputContext.drawImage(video, 0, 0, canvas.width, canvas.height);

        detections.forEach((face) => {
            const box = face.detection.box;
            const landmarks = face.landmarks;

            const leftEye = landmarks.getLeftEye();
            const rightEye = landmarks.getRightEye();
            const nose = landmarks.getNose();

            drawPoints(context, leftEye);
            drawPoints(context, rightEye);
            drawPoints(context, nose);

            drawBox(context, box);

            const ouput = calculateEyePositionAndFaceAngle(landmarks.positions);

            drawImage(ouputCanvas, glassesImage, ouput.x, ouput.y, ouput.d);
        });
    }, 300);
}

function calculateEyePositionAndFaceAngle(landmarksData) {
    const leftEyeIndex = 36; // 왼쪽 눈
    const rightEyeIndex = 45; // 오른쪽 눈

    const leftEye = landmarksData[leftEyeIndex];
    const rightEye = landmarksData[rightEyeIndex];

    // 양눈 사이 점 위치계산
    const eyeCenterX = (leftEye.x + rightEye.x) / 2;
    const eyeCenterY = (leftEye.y + rightEye.y) / 2;

    // 얼굴의 기울기계산
    const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);

    return {
        x: eyeCenterX,
        y: eyeCenterY,
        d: angle
    };
}