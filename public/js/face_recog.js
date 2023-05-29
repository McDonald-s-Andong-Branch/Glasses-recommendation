// 이미지를 API에 업로드하는 함수
function uploadImageToAPI(imageData) {
    const endpoint = "https://naveropenapi.apigw.ntruss.com/vision/v1/face";

    fetch(endpoint, {
        method: "POST",
        credentials: 'same-origin',
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache',
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": '*',
            "X-NCP-APIGW-API-KEY-ID": "5uo4zdnh1p",
            "X-NCP-APIGW-API-KEY": "DHGLMw6esaBEoYZXnMlglZVydrRTAtMNuitKMVy1",
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify({
            image: imageData,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            // API 응답 처리
            console.log(data);
        })
        .catch((error) => {
            // 에러 처리
            console.error("Error:", error);
        });
}