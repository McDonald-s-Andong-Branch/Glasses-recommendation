
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

const virtualCanvas = document.createElement('canvas'); // 캔버스 엘리먼트를 생성합니다.

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

    var glassesInput = document.getElementById('glassesInput');
    glassesInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (readerEvent) => {
            glassesImage.src = readerEvent.target.result;

            glassesImage.onload = () => {
                // 업로드된 이미지를 사용하여 원하는 작업 수행
                console.log('이미지가 업로드되었습니다.');
            };
        };

        reader.readAsDataURL(file);
    });

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var video = document.getElementById('video');
    const captureButton = document.getElementById("webcamBtn");

    captureButton.addEventListener("click", function () {
    
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height); // 캡처한 이미지 그리기
        AnalyzeFace(context, canvas, video);
    });

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
            var video = document.getElementById('video');
            video.srcObject = stream;
            video.play();
        });
    }
}

async function AnalyzeFace(context, canvas, video) {

    const options = getFaceDetectorOptions()
    const detections = await faceapi.detectAllFaces(canvas, options).withFaceLandmarks();

    detections.forEach((face) => {
        const landmarks = face.landmarks;

        drawPoints(context, [landmarks.positions[16], landmarks.positions[0]]);

        /*
        const box = face.detection.box;

        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        const nose = landmarks.getNose();

        drawPoints(context, leftEye);
        drawPoints(context, rightEye);
        drawPoints(context, nose);

        drawBox(context, box);
        
        */

        const ouput = calculateEyePositionAndFaceAngle(landmarks.positions);

        drawImage(context, glassesImage, ouput.x, ouput.y, ouput.d, ouput.dist);
    });
}

function calculateEyePositionAndFaceAngle(landmarksData) {
    const leftEyeIndex = 36; // 왼쪽 눈
    const rightEyeIndex = 45; // 오른쪽 눈

    const leftIndex = 16; // 왼쪽 눈
    const rightIndex = 0; // 오른쪽 눈

    const leftEye = landmarksData[leftIndex];
    const rightEye = landmarksData[rightIndex];

    const dist = calculateDistance(leftEye.x, rightEye.x, leftEye.y, rightEye.y);

    // 양눈 사이 점 위치계산
    const eyeCenterX = (leftEye.x + rightEye.x) / 2;
    const eyeCenterY = (leftEye.y + rightEye.y) / 2;

    // 얼굴의 기울기계산
    const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);

    return {
        x: eyeCenterX,
        y: eyeCenterY,
        d: angle,
        dist: dist,
    };
}

function calculateDistance(x1, y1, x2, y2) {
    var deltaX = x2 - x1;
    var deltaY = y2 - y1;

    var distance = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

    return distance;
}
