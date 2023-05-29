
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
        var capturedImage = new Image();
        capturedImage.src = canvas.toDataURL(); // 캔버스의 이미지를 데이터 URL로 가져옴
        capturedImage.style.width = "100%";
        capturedImage.style.height = "100%";

        var imageContainer = document.getElementById("capturedImageContainer");
        imageContainer.innerHTML = ""; // 이미지를 표시하기 전에 기존 내용을 지움
        imageContainer.appendChild(capturedImage);

        AnalyzeFace(context, canvas);
    });

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
            var video = document.getElementById('video');
            video.srcObject = stream;
            video.play();
        });
    }
}

function AnalyzeFace(context, canvas) {
    setInterval(async () => {
        const options = getFaceDetectorOptions()
        const detections = await faceapi.detectAllFaces(canvas, options).withFaceLandmarks();
        console.log(detections);
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
        });
    }, 300);
}