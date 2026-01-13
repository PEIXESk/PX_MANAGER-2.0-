/**
 * PX MANAGER - Orquestrador Principal (Trava de Segurança Reforçada)
 */

function monitorarURL() {
    const url = window.location.href;
    
    // 1. TRAVA DE SEGURANÇA: Só funciona se for o domínio do Picking Admin
    const isDominioPicking = url.includes("picking-admin.backoffice.gpa.digital");
    
    // 2. REGRA DO BOTÃO: Aparece apenas na área de "/ocorrencias/bandeira"
    const regexAreaOcorrencias = /\/ocorrencias\/bandeira/;
    
    // 3. REGRA DE EXTRAÇÃO: Só ativa o scanner na página de detalhe final (PA ou EX)
    const regexPaginaDetalhe = /\/ocorrencias\/bandeira\/(PA|EX)\/pedido\/\d+\/detalhe\/\d+/;

    // Lógica de exibição baseada no domínio e na página
    if (isDominioPicking && regexAreaOcorrencias.test(url)) {
        
        // Garante que o botão e o frame existem (Função no ui/interface.js)
        garantirElementos(); 
        
        const btnElement = document.getElementById('px-btn-flutuante');
        if (btnElement) {
            btnElement.style.display = 'block'; // Mostra o botão
        }

        // Trava Automática: Se o usuário voltar para a listagem (sair do detalhe), 
        // o popup fecha sozinho para evitar dados antigos na tela.
        if (!regexPaginaDetalhe.test(url)) {
            fecharApp(); 
        }
        
    } else {
        // Se sair totalmente da área permitida ou mudar de site, esconde TUDO
        const btnElement = document.getElementById('px-btn-flutuante');
        const frameElement = document.getElementById('px-frame-app');
        
        if (btnElement) btnElement.style.display = 'none';
        if (frameElement) frameElement.style.display = 'none';
        
        // Garante que o app feche as transições se existir a função
        if (typeof fecharApp === "function") fecharApp();
    }
}

// Inicia o monitoramento (1 segundo para garantir performance)
setInterval(monitorarURL, 1000);

// Comunicação com o Popup (Scanner de Dados)
window.addEventListener("message", (event) => {
    if (event.data.type === "SOLICITAR_DADOS_PAGINA") {
        const url = window.location.href;
        const regexPaginaDetalhe = /\/ocorrencias\/bandeira\/(PA|EX)\/pedido\/\d+\/detalhe\/\d+/;

        // Só permite a extração se estiver exatamente na página de detalhe
        if (regexPaginaDetalhe.test(url)) {
            // Verifica se o extrator foi carregado corretamente
            if (typeof extrairDadosPicking === "function") {
                const dados = extrairDadosPicking(); 
                const frameApp = document.getElementById('px-frame-app');
                
                if (frameApp) {
                    frameApp.contentWindow.postMessage({ 
                        type: "DADOS_COLETADOS", 
                        payload: dados 
                    }, "*");
                }
            }
        } else {
            console.warn("PX Manager: Extração bloqueada. Você não está em uma página de detalhe válida.");
        }
    }
    
    if (event.data.type === "FECHAR_APP") {
        fecharApp();
    }
});