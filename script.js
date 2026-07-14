// ================= VARIÁVEIS PRINCIPAIS =================
let energiaBase = 4000;
let energiaLiberada = 80000;

let energiaMaxima = energiaBase;
let energiaAtual = energiaBase;

let outputGeral = 100;
let eficienciaRCT = 100;

let flowAtivo = false;
let flowTimer = 0;

let tecnicaLiberada = false;

let fornalhaPontos = 0;
const fornalhaMaxima = 500;

let dominioAtivo = false;
let dominioInterval = null;
let dominioDuracao = 0;

let blackFlashInterval = null;

let cooldowns = {};

let hpAtual = 100;

let defendendo = false;

// ================= CORTE QUE CORTA O MUNDO =================
let corteMundoCarregando = false;
let corteMundoEtapa = 0;

let corteMundoInterval = null;
let corteMundoCooldownInterval = null;

const canticos = [
    "🐉 Escamas do Dragão...",
    "💥 Repulsão...",
    "☄️ Estrelas Cadentes Gêmeas...",
    "⚔️ DESMANTELAR."
];

// ================= ELEMENTOS =================
const energiaDisplay = document.getElementById('energia');
const energiaMaxDisplay = document.getElementById('energiaMax');

const outputDisplay = document.getElementById('outputDisplay');
const rctDisplay = document.getElementById('rctDisplay');
const flowDisplay = document.getElementById('flowDisplay');

const hpDisplay = document.getElementById('hpDisplay');
const barraProgressoHP = document.getElementById('barraProgressoHP');

const logArea = document.getElementById('logs');

const cooldownsDisplay = document.getElementById('cooldownsLog');

const fornalhaPercentDisplay = document.getElementById('fornalhaPercent');
const barraFornalha = document.getElementById('barraProgressoFornalha');

const btnLiberar = document.getElementById("btnLiberar");
const btnReprimir = document.getElementById("btnReprimir");

// ================= ATUALIZAÇÕES =================
function atualizarEnergia() {

    energiaDisplay.textContent = Math.floor(energiaAtual);

    energiaMaxDisplay.textContent = Math.floor(energiaMaxima);
}

function atualizarStatus() {

    outputDisplay.textContent = Math.floor(outputGeral);

    rctDisplay.textContent = Math.floor(eficienciaRCT);

    if (flowAtivo) {

        flowDisplay.textContent = "FLOW (120%)";
        flowDisplay.style.color = "#ffd700";

    } else if (outputGeral >= 80) {

        flowDisplay.textContent = "Normal";
        flowDisplay.style.color = "#00ff00";

    } else if (outputGeral >= 50) {

        flowDisplay.textContent = "Cansado";
        flowDisplay.style.color = "#ffaa00";

    } else {

        flowDisplay.textContent = "Exausto";
        flowDisplay.style.color = "#ff0000";
    }
}

function atualizarHP() {

    hpDisplay.textContent = Math.floor(hpAtual);

    barraProgressoHP.style.width = hpAtual + "%";

    if (hpAtual <= 0) {

        hpAtual = 0;

        adicionarLog("💀 HP chegou a 0!");
    }
}

function adicionarLog(msg) {

    const p = document.createElement('p');

    p.textContent = msg;

    logArea.appendChild(p);

    logArea.scrollTop = logArea.scrollHeight;
}

function atualizarFornalha() {

    let porcentagem = Math.min(
        (fornalhaPontos / fornalhaMaxima) * 100,
        100
    );

    fornalhaPercentDisplay.textContent =
        porcentagem.toFixed(0) + "%";

    barraFornalha.style.width = porcentagem + "%";
}

function atualizarCooldownsDisplay() {

    cooldownsDisplay.innerHTML = "";

    if (Object.keys(cooldowns).length === 0) {

        cooldownsDisplay.innerHTML =
            "<p>Nenhum cooldown ativo.</p>";

        return;
    }

    for (let nome in cooldowns) {

        const p = document.createElement('p');

        p.textContent =
            `${nome}: ${cooldowns[nome]}s`;

        cooldownsDisplay.appendChild(p);
    }
}

// ================= REGENERAÇÃO =================
setInterval(() => {

    if (energiaAtual < energiaMaxima) {

        let regen = flowAtivo ? 3 : 1;

        energiaAtual = Math.min(
            energiaAtual + regen,
            energiaMaxima
        );

        atualizarEnergia();
    }

}, 1000);

// ================= RECUPERAÇÃO PASSIVA =================
setInterval(() => {

    if (!flowAtivo && !dominioAtivo) {

        if (outputGeral < 100) {

            outputGeral = Math.min(
                outputGeral + 0.15,
                100
            );
        }

        if (eficienciaRCT < 100) {

            eficienciaRCT = Math.min(
                eficienciaRCT + 0.1,
                100
            );
        }

        atualizarStatus();
    }

}, 5000);

// ================= ATAQUE BÁSICO =================
function ataqueBasico() {

    if (energiaAtual < 1) {

        adicionarLog("⚠️ Energia insuficiente.");

        return;
    }

    energiaAtual -= 1;

    adicionarLog("👊 Ataque básico realizado!");

    atualizarEnergia();
}

// ================= DEFESA =================
function defender() {

    if (defendendo) {

        adicionarLog("🛡️ Você já está defendendo.");

        return;
    }

    defendendo = true;

    adicionarLog("🛡️ Defesa ativada por 3 segundos!");

    setTimeout(() => {

        defendendo = false;

        adicionarLog("⚠️ Defesa encerrada.");

    }, 3000);
}

// ================= BLACK FLASH =================
function blackFlash() {

    flowAtivo = true;

    flowTimer = 300;

    outputGeral = 120;
    eficienciaRCT = 120;

    adicionarLog("⚡ BLACK FLASH!");

    atualizarStatus();

    if (blackFlashInterval) {
        clearInterval(blackFlashInterval);
    }

    blackFlashInterval = setInterval(() => {

        flowTimer--;

        if (flowTimer <= 0) {

            clearInterval(blackFlashInterval);

            flowAtivo = false;

            outputGeral = 100;
            eficienciaRCT = 100;

            adicionarLog("🌊 Estado de Flow terminou.");

            atualizarStatus();
        }

    }, 1000);
}

// ================= USAR RCT =================
function usarRCT() {

    if (hpAtual >= 100) {

        adicionarLog("✅ HP já está cheio.");

        return;
    }

    if (energiaAtual < 60) {

        adicionarLog("⚠️ Energia insuficiente.");

        return;
    }

    const eficiencia = eficienciaRCT / 100;

    const curaReal = Math.floor(25 * eficiencia);

    const custoEnergia =
        Math.floor(70 + (100 - eficienciaRCT) * 1.2);

    energiaAtual -= custoEnergia;

    hpAtual = Math.min(
        100,
        hpAtual + curaReal
    );

    eficienciaRCT = Math.max(
        eficienciaRCT - 9,
        25
    );

    adicionarLog(`🩹 Curou ${curaReal}% de HP!`);

    atualizarEnergia();
    atualizarHP();
    atualizarStatus();
}

// ================= HABILIDADES =================
function usarHabilidade(nome) {

    let desgasteOutput = 0;

    switch(nome) {

        case 'desmantelar':

            if (energiaAtual >= 50) {

                energiaAtual -= 50;

                fornalhaPontos += 5;

                desgasteOutput = 1.2;

                adicionarLog("⚔️ Desmantelar usado!");
            }

        break;

        case 'cleavar':

            if (energiaAtual >= 100) {

                energiaAtual -= 100;

                fornalhaPontos += 10;

                desgasteOutput = 2.5;

                adicionarLog("🩸 Cleaver usado!");
            }

        break;

        case 'blackFlash':

            blackFlash();

        return;

        case 'kaminoFuga':

            if (fornalhaPontos >= 250) {

                fornalhaPontos = 0;

                desgasteOutput = 4;

                adicionarLog("🔥 Kamino Fuga ativado!");

            } else {

                adicionarLog("⚠️ Fornalha insuficiente!");
            }

        break;

        case 'expansaoDominio':

            if (dominioAtivo) return;

            dominioAtivo = true;

            dominioDuracao = 60;

            cooldowns["Santuário Malevolente"] = dominioDuracao;

            atualizarCooldownsDisplay();

            adicionarLog("🌌 Expansão de Domínio ativada!");

            dominioInterval = setInterval(() => {

                if (
                    dominioDuracao <= 0 ||
                    energiaAtual < 8
                ) {

                    pararExpansaoDominio();

                    return;
                }

                energiaAtual -= 8;

                fornalhaPontos += 3;

                dominioDuracao--;

                cooldowns["Santuário Malevolente"] = dominioDuracao;

                atualizarEnergia();
                atualizarFornalha();
                atualizarCooldownsDisplay();

            }, 1000);

        break;
    }

    if (desgasteOutput > 0) {

        outputGeral = Math.max(
            outputGeral - desgasteOutput,
            35
        );
    }

    atualizarEnergia();
    atualizarStatus();
    atualizarFornalha();
}

// ================= RECEBER DANO =================
function receberDano(valor) {

    if (defendendo) {

        valor = Math.floor(valor / 2);

        adicionarLog("🛡️ Dano reduzido pela metade!");
    }

    hpAtual = Math.max(
        0,
        hpAtual - valor
    );

    const desgastePorDano =
        Math.floor(valor * 0.35);

    outputGeral = Math.max(
        outputGeral - desgastePorDano,
        30
    );

    adicionarLog(`💥 Recebeu ${valor}% de dano!`);

    atualizarHP();
    atualizarStatus();
}

// ================= CORTE QUE CORTA O MUNDO =================
function iniciarCorteMundo() {

    if (
        corteMundoCarregando ||
        cooldowns["Corte que Corta o Mundo"]
    ) return;

    if (energiaAtual < 50) {

        adicionarLog("⚠️ Energia insuficiente!");

        return;
    }

    corteMundoCarregando = true;

    corteMundoEtapa = 0;

    adicionarLog("🩸 Iniciando ritual...");

    corteMundoInterval = setInterval(() => {

        if (corteMundoEtapa < canticos.length) {

            adicionarLog(canticos[corteMundoEtapa]);

            corteMundoEtapa++;

        } else {

            energiaAtual -= 50;

            adicionarLog("🌍 O mundo foi cortado.");

            iniciarCooldownCorteMundo();

            cancelarCorteMundo();

            atualizarEnergia();
        }

    }, 1000);
}

function cancelarCorteMundo() {

    if (!corteMundoCarregando) return;

    clearInterval(corteMundoInterval);

    corteMundoInterval = null;

    if (corteMundoEtapa < canticos.length) {

        adicionarLog("❌ Ritual interrompido.");
    }

    corteMundoCarregando = false;
}

function iniciarCooldownCorteMundo() {

    let tempo = 120;

    cooldowns["Corte que Corta o Mundo"] = tempo;

    atualizarCooldownsDisplay();

    corteMundoCooldownInterval = setInterval(() => {

        tempo--;

        cooldowns["Corte que Corta o Mundo"] = tempo;

        atualizarCooldownsDisplay();

        if (tempo <= 0) {

            clearInterval(corteMundoCooldownInterval);

            delete cooldowns["Corte que Corta o Mundo"];

            atualizarCooldownsDisplay();
        }

    }, 1000);
}

// ================= DOMÍNIO =================
function pararExpansaoDominio() {

    clearInterval(dominioInterval);

    dominioInterval = null;

    dominioAtivo = false;

    delete cooldowns["Santuário Malevolente"];

    atualizarCooldownsDisplay();

    adicionarLog("🌌 Domínio encerrado.");
}

// ================= LIBERAÇÃO =================
function liberarTecnicaInata() {

    if (tecnicaLiberada) return;

    tecnicaLiberada = true;

    energiaMaxima = energiaLiberada;
    energiaAtual = energiaLiberada;

    btnLiberar.style.display = "none";
    btnReprimir.style.display = "inline-block";

    atualizarEnergia();

    adicionarLog("🔥 Técnica liberada!");
}

function reprimirTecnicaInata() {

    tecnicaLiberada = false;

    energiaMaxima = energiaBase;

    if (energiaAtual > energiaMaxima) {

        energiaAtual = energiaMaxima;
    }

    btnLiberar.style.display = "inline-block";
    btnReprimir.style.display = "none";

    atualizarEnergia();

    adicionarLog("🔒 Técnica reprimida.");
}

// ================= RESET =================
function resetarTudo() {

    if (blackFlashInterval) {
        clearInterval(blackFlashInterval);
    }

    if (dominioInterval) {
        clearInterval(dominioInterval);
    }

    if (corteMundoInterval) {
        clearInterval(corteMundoInterval);
    }

    if (corteMundoCooldownInterval) {
        clearInterval(corteMundoCooldownInterval);
    }

    energiaMaxima = energiaBase;
    energiaAtual = energiaBase;

    outputGeral = 100;
    eficienciaRCT = 100;

    flowAtivo = false;

    fornalhaPontos = 0;

    tecnicaLiberada = false;

    hpAtual = 100;

    defendendo = false;

    cooldowns = {};

    atualizarEnergia();
    atualizarStatus();
    atualizarHP();
    atualizarFornalha();
    atualizarCooldownsDisplay();

    btnLiberar.style.display = "inline-block";
    btnReprimir.style.display = "none";

    logArea.innerHTML = "";

    adicionarLog("🔄 Tudo resetado.");
}

function limparLog() {

    logArea.innerHTML = "";
}

// ================= INICIALIZAÇÃO =================
atualizarEnergia();
atualizarStatus();
atualizarHP();
atualizarFornalha();
atualizarCooldownsDisplay();
