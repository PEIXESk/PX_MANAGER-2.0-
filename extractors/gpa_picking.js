function extrairDadosPicking() {
    const texto = document.body.innerText;
    const buscarCampo = (label) => {
        const colunas = document.querySelectorAll('.ant-col-xs-24, .ant-col-md-6, .ant-col-md-24');
        for (let col of colunas) {
            if (col.innerText.startsWith(label) || col.querySelector('b')?.innerText.includes(label)) {
                const ps = col.querySelectorAll('p');
                if (ps.length > 1) return ps[1].innerText.trim();
                return col.innerText.replace(label, "").trim();
            }
        }
        return "";
    };

    let ocr = buscarCampo("Tipo de Ocorrência");
    const descSite = buscarCampo("Descrição");
    if (buscarCampo("Categoria") === "CANCELAMENTO") ocr = "CANCELAMENTO";

    return {
        pedido: (texto.match(/Pedido Backoffice[:\s]+(\d+)/i) || texto.match(/(\d{8,12})/))[1] || "",
        loja: (texto.match(/Loja[:\s]+(\d+)/i) || texto.match(/Cód\.\s*Loja[:\s]+(\d+)/i))[1] || "",
        cliente: (texto.match(/Cliente[:\s]+([A-Za-zÀ-ÖØ-öø-ÿ\s]+)/i) || ["",""])[1].split('\n')[0].trim(),
        ocorrencia: ocr,
        detalhe: descSite || window.getSelection().toString()
    };
}