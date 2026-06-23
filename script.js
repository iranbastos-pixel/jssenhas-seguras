const senhaInput = document.getElementById('campo-senha');
const sliderTamanho = document.getElementById('slider-tamanho');
const valorTamanho = document.getElementById('valor-tamanho');
const checkboxMinusculas = document.getElementById('checkbox-minusculas');
const checkboxMaiusculas = document.getElementById('checkbox-maiusculas');
const checkboxNumeros = document.getElementById('checkbox-numeros');
const checkboxSimbolos = document.getElementById('checkbox-simbolos');
const forcaSenha = document.getElementById('forca-senha');
const botaoGerar = document.getElementById('botao-gerar');
const botaoCopiar = document.getElementById('botao-copiar');

const caracteres = {
    minusculas: 'abcdefghijklmnopqrstuvwxyz',
    maiusculas: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numeros: '0123456789',
    simbolos: '!@#$%&*()-_=+[]{};:,.<>?/'
};

function getRandomInt(max) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
}

function construirPool() {
    let pool = '';

    if (checkboxMinusculas.checked) pool += caracteres.minusculas;
    if (checkboxMaiusculas.checked) pool += caracteres.maiusculas;
    if (checkboxNumeros.checked) pool += caracteres.numeros;
    if (checkboxSimbolos.checked) pool += caracteres.simbolos;

    return pool;
}

function gerarSenha(tamanho) {
    const pool = construirPool();
    if (!pool) {
        return '';
    }

    let senha = '';
    for (let i = 0; i < tamanho; i += 1) {
        senha += pool[getRandomInt(pool.length)];
    }

    return senha;
}

function calcularForca() {
    const tamanho = Number(sliderTamanho.value);
    const tiposSelecionados = [
        checkboxMinusculas.checked,
        checkboxMaiusculas.checked,
        checkboxNumeros.checked,
        checkboxSimbolos.checked
    ].filter(Boolean).length;

    if (tiposSelecionados === 0) {
        forcaSenha.textContent = 'Selecione pelo menos uma característica da senha.';
        forcaSenha.className = 'forca-senha forca-senha--alerta';
        return;
    }

    let pontos = 0;
    if (tamanho >= 8) pontos += 1;
    if (tamanho >= 12) pontos += 1;
    if (tamanho >= 16) pontos += 1;
    if (tiposSelecionados >= 2) pontos += 1;
    if (tiposSelecionados >= 3) pontos += 1;

    const niveis = ['Muito fraca', 'Fraca', 'Média', 'Forte', 'Muito forte'];
    const nivel = niveis[Math.min(pontos, niveis.length - 1)];

    forcaSenha.textContent = `${nivel} — ${tamanho} caracteres, ${tiposSelecionados} tipos selecionados.`;
    forcaSenha.className = `forca-senha forca-senha--${nivel.replace(' ', '-').toLowerCase()}`;
}

function atualizarInterface() {
    valorTamanho.textContent = sliderTamanho.value;
    calcularForca();
}

botaoGerar.addEventListener('click', () => {
    const tamanho = Number(sliderTamanho.value);
    const senha = gerarSenha(tamanho);

    if (!senha) {
        senhaInput.value = '';
        forcaSenha.textContent = 'Selecione pelo menos uma característica antes de gerar a senha.';
        forcaSenha.className = 'forca-senha forca-senha--alerta';
        return;
    }

    senhaInput.value = senha;
    botaoCopiar.disabled = false;
    atualizarInterface();
});

botaoCopiar.addEventListener('click', async () => {
    if (!senhaInput.value) {
        return;
    }

    try {
        await navigator.clipboard.writeText(senhaInput.value);
        botaoCopiar.textContent = 'Copiado!';
        setTimeout(() => {
            botaoCopiar.textContent = 'Copiar';
        }, 1400);
    } catch (error) {
        console.error('Falha ao copiar para área de transferência:', error);
    }
});

sliderTamanho.addEventListener('input', atualizarInterface);
checkboxMinusculas.addEventListener('change', atualizarInterface);
checkboxMaiusculas.addEventListener('change', atualizarInterface);
checkboxNumeros.addEventListener('change', atualizarInterface);
checkboxSimbolos.addEventListener('change', atualizarInterface);

atualizarInterface();
