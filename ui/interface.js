/**
 * UI COMPONENTS - Responsável pelo Botão Flutuante e Frame (Inteligente)
 */
let btn = null;
let frame = null;
let xOffset = 0, yOffset = 0, initialX, initialY, isDragging = false;

function garantirElementos() {
    if (document.getElementById('px-btn-flutuante')) return;

    btn = document.createElement('div');
    btn.id = 'px-btn-flutuante';
    const iconUrl = chrome.runtime.getURL('icon.png');

    btn.style.cssText = `
        position: fixed !important; bottom: 20px !important; right: 20px !important; 
        width: 60px !important; height: 60px !important; 
        background-color: #441F54 !important; background-image: url('${iconUrl}'); 
        background-size: cover; border: 3px solid #53C14B !important; border-radius: 50% !important; 
        cursor: move !important; z-index: 2147483647 !important; 
        box-shadow: 0 0 15px rgba(83, 193, 75, 0.6);
    `;

    frame = document.createElement('iframe');
    frame.id = 'px-frame-app';
    frame.src = chrome.runtime.getURL('popup.html');
    frame.style.cssText = `
        position: fixed !important; width: 450px !important; height: 680px !important; 
        border: none !important; border-radius: 15px !important; 
        z-index: 2147483646 !important; display: none; opacity: 0; 
        transition: opacity 0.2s ease, transform 0.2s ease !important;
        transform: scale(0.95); box-shadow: 0 10px 40px rgba(0,0,0,0.8) !important;
    `;

    document.body.appendChild(btn);
    document.body.appendChild(frame);
    initEventos();
}

function initEventos() {
    btn.addEventListener("mousedown", (e) => {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        if (e.target === btn) isDragging = true;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            xOffset = e.clientX - initialX;
            yOffset = e.clientY - initialY;
            btn.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            if(frame.style.display === 'block') ajustarPosicaoFrame();
        }
    });

    document.addEventListener("mouseup", () => isDragging = false);

    btn.addEventListener('click', (e) => {
        if (!isDragging) {
            e.stopPropagation();
            if (frame.style.display !== 'block') {
                ajustarPosicaoFrame();
                frame.style.display = 'block';
                setTimeout(() => { 
                    frame.style.opacity = "1"; 
                    frame.style.transform = "scale(1)"; 
                }, 10);
            } else {
                fecharApp();
            }
        }
    });

    // FECHAR AO CLICAR FORA
    document.addEventListener('mousedown', (e) => {
        if (frame && frame.style.display === 'block') {
            if (!frame.contains(e.target) && e.target !== btn) {
                fecharApp();
            }
        }
    });
}

function ajustarPosicaoFrame() {
    const rect = btn.getBoundingClientRect();
    const vW = window.innerWidth;
    const vH = window.innerHeight;

    // Lógica Direita ou Esquerda
    if (rect.left + 30 > vW / 2) {
        frame.style.left = "auto"; 
        frame.style.right = (vW - rect.right) + "px";
    } else {
        frame.style.right = "auto"; 
        frame.style.left = rect.left + "px";
    }

    // Lógica Cima ou Baixo
    if (rect.top < 350) {
        frame.style.bottom = "auto"; 
        frame.style.top = (rect.bottom + 10) + "px";
    } else {
        frame.style.top = "auto"; 
        frame.style.bottom = (vH - rect.top + 10) + "px";
    }
}

function fecharApp() {
    if (frame) {
        frame.style.opacity = "0";
        frame.style.transform = "scale(0.95)";
        setTimeout(() => { frame.style.display = 'none'; }, 200);
    }
}