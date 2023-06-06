// Variáveis e elementos
const entradaDia = document.querySelector("#dia");
const entradaMes = document.querySelector("#mes");
const entradaAno = document.querySelector("#ano");
const inputs = document.querySelectorAll(".date-value");

const dataAtual = new Date();
let diaAtual = dataAtual.getDate();
let mesAtual = dataAtual.getMonth() + 1;
let anoAtual = dataAtual.getFullYear();

const btnSubmit = document.querySelector("#btn-submit");
const displayDiv = document.querySelector("#display");
const form = document.querySelector("#form-date");
const meses = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


// Eventos
form.addEventListener('submit', handleSubmit);

inputs.forEach(input => {
    input.addEventListener('blur', (e) => {
        let inputValor = input.value;
        if (isNaN(Number(inputValor)) || String(inputValor).length == 0) return;

        if (input.getAttribute('id') == 'anos') {
            input.value = formatarValor(inputValor, true);
        } else {
            input.value = formatarValor(inputValor, false);
        }
    });
});


function diasNoMes(mes, ano) {
    const data = new Date(ano, mes, 0);
    return data.getDate();
}

function dataValida(dia, mes, ano) {
    const diaMes = diasNoMes(mes, ano);
    return dia > 0 && dia <= diaMes;
}

function dataFuturo(dataUser, dataAtual) {
    return dataUser > dataAtual;
}

function mostrarErros(entrada, mensagem) {
    const parent = entrada.parentNode;
    const span = entrada.nextElementSibling;
    parent.classList.add("error");
    span.style.display = 'inline';
    span.textContent = mensagem;
}

function ocultarErros(entrada) {
    const parent = entrada.parentNode;
    const span = entrada.nextElementSibling;
    parent.classList.remove("error");
    span.textContent = "";
    span.style.display = 'none';
}

function formatarValor(valor, ano) {
    if (ano) {
        switch (String(valor).length) {
            case 1:
                return `000${valor}`;
            case 2:
                return `00${valor}`;
            case 3:
                return `0${valor}`;
            default:
                return valor;
        }
    } else {
        if (String(valor).length < 2) return `0${valor}`;
        return valor;
    }
}

function displayInfo(dias, meses, anos) {
    displayDiv.innerHTML = `
    <div class="time" id="display-year">
        <span class="dash">${anos}</span>Anos
    </div>
    <div class="time" id="display-month">
        <span class="dash">${meses}</span>Meses
    </div>
    <div class="time" id="display-day">
        <span class="dash">${dias}</span>Dias
    </div>
    `;
}

function validar() {
    let validator = true;

    inputs.forEach(input => {
        const diaUser = parseInt(entradaDia.value);
        const mesUser = parseInt(entradaMes.value);
        const anoUser = parseInt(entradaAno.value);
        const userString = `${anoUser}-${mesUser}-${diaUser}`;
        const dataUser = new Date(userString);

        if (!input.value) {
            ocultarErros(input);
            mostrarErros(input, "Valor é requerido");
            validator = false;
        } else if (diaUser <= 0 || diaUser > 31 || !dataValida(diaUser, mesUser, anoUser) || isNaN(diaUser)) {
            ocultarErros(input);
            mostrarErros(entradaDia, "O dia não é válido");
            validator = false;
        } else if (mesUser <= 0 || mesUser > 12 || isNaN(mesUser)) {
            ocultarErros(input);
            mostrarErros(entradaMes, "O mês não é válido");
            validator = false;
        } else if (anoUser > anoAtual) {
            ocultarErros(input);
            mostrarErros(entradaAno, "Deve estar no passado");
            validator = false;
        } else if (anoUser <= 0 || isNaN(entradaAno.value)) {
            ocultarErros(input);
            mostrarErros(entradaAno, "Ano não é válido");
            validator = false;
        } else if (dataFuturo(dataUser, dataAtual)) {
            ocultarErros(input);
            mostrarErros(input, "A data deve estar no passado");
            validator = false;
        } else {
            ocultarErros(input);
            validator = true;
        }
    });
    
    return validator;
}

function handleSubmit(e) {
e.preventDefault();
diaAtual = dataAtual.getDate();
mesAtual = dataAtual.getMonth() + 1;
anoAtual = dataAtual.getFullYear();
if (validar()) {
    if (entradaDia.value > diaAtual) {
        diaAtual = diaAtual + meses[mesAtual - 1];
        mesAtual = mesAtual - 1;
    }

    if (entradaMes.value > mesAtual) {
        mesAtual = mesAtual + 12;
        anoAtual = anoAtual - 1;
    }

    const d = diaAtual - entradaDia.value;
    const m = mesAtual - entradaMes.value;
    const y = anoAtual - entradaAno.value;

    displayInfo(d, m, y);
}
}