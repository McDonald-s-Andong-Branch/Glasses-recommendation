/*!
* Start Bootstrap - Creative v7.0.7 (https://startbootstrap.com/theme/creative)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-creative/blob/master/LICENSE)
*/
//
// Scripts
// 
const video = document.getElementById('video');
const canvas = document.createElement('canvas'); // 캔버스 요소 생성
const startBtn = document.getElementById('captureBtn');
const excelBtn = document.getElementById('excelBtn');
const table = document.querySelector('table tbody');
const img = document.createElement('img');
let isCanvasCreated = false; // 캔버스 요소 생성 여부

function startVideo() // 웹캠 실행
{
    navigator.getUserMedia(
        { video: {} },
        stream => video.srcObject = stream,
        err => console.error(err)
    );
}

startBtn.addEventListener("click",() => {
    capture();
});

startVideo();

function capture() // 캡처 함수
{
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height); // 캡처한 이미지 그리기
}

function capturePicture() // 사진 캡처 버튼이 클릭될 경우 실행되는 함수
{
    if (!isCanvasCreated) // 최초 캔버스 생성
    {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        isCanvasCreated = true;
    }

    capture(); // 캡처한 이미지 그리기
    img.src = canvas.toDataURL(); // 캔버스에서 그린 이미지를 img 요소의 src 속성에 할당

    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="2"><img src="${img.src}" /></td>`; // tr 요소 생성 및 추가

    const firstRow = table.querySelector('tr:first-child');
    table.replaceChild(tr, firstRow); // 테이블 첫 번째 행 tr로 대체
}

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    // Activate SimpleLightbox plugin for portfolio items
    new SimpleLightbox({
        elements: '#portfolio a.portfolio-box'
    });

});
