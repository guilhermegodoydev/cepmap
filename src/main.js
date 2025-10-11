import { GerarMapa, GerarMarcador, MarcarAreaMapa, RedimensionarMapa } from "./modules/mapa.js";
import { ValidarCep, BuscarEndereco, BuscarCepPorEndereco, BuscarGeo } from "./modules/cep.js";
import { AlterarEstadoInputs, ExibirMsgErro, MontarEnderecoCompleto, RemoverAcentos } from "./modules/utils.js";

const estados = [
  { nome: "Acre", sigla: "AC" },
  { nome: "Alagoas", sigla: "AL" },
  { nome: "Amapá", sigla: "AP" },
  { nome: "Amazonas", sigla: "AM" },
  { nome: "Bahia", sigla: "BA" },
  { nome: "Ceará", sigla: "CE" },
  { nome: "Distrito Federal", sigla: "DF" },
  { nome: "Espírito Santo", sigla: "ES" },
  { nome: "Goiás", sigla: "GO" },
  { nome: "Maranhão", sigla: "MA" },
  { nome: "Mato Grosso", sigla: "MT" },
  { nome: "Mato Grosso do Sul", sigla: "MS" },
  { nome: "Minas Gerais", sigla: "MG" },
  { nome: "Pará", sigla: "PA" },
  { nome: "Paraíba", sigla: "PB" },
  { nome: "Paraná", sigla: "PR" },
  { nome: "Pernambuco", sigla: "PE" },
  { nome: "Piauí", sigla: "PI" },
  { nome: "Rio de Janeiro", sigla: "RJ" },
  { nome: "Rio Grande do Norte", sigla: "RN" },
  { nome: "Rio Grande do Sul", sigla: "RS" },
  { nome: "Rondônia", sigla: "RO" },
  { nome: "Roraima", sigla: "RR" },
  { nome: "Santa Catarina", sigla: "SC" },
  { nome: "São Paulo", sigla: "SP" },
  { nome: "Sergipe", sigla: "SE" },
  { nome: "Tocantins", sigla: "TO" }
];

const input = document.getElementById('entrada');
const label = document.getElementById('lblEntrada');
const rdCEP = document.getElementById('porCEP');
const rdEndereco = document.getElementById('porEndereco');
const msgErro = document.getElementById('erro');
const form = document.querySelector('form');
const saida = document.getElementById('saida');
const formCep = document.getElementById('formCep');
const formEndereco = document.getElementById('formEndereco');
const botao = document.getElementById('btnform');
const btnZoom = document.getElementById('btnZoom');
const mapSection = document.getElementById('mapSection');
const continerEstados = document.getElementById('estados');

let tipoConsulta = 'cep';
let geo;

// Alguns navegadores não disparam 'resize' ao ativar o modo responsivo no F12
let widthAtual = window.innerWidth;
setInterval(() => {
  if (window.innerWidth !== widthAtual) {
    widthAtual = window.innerWidth;
    ajustarAlturaMap();
  }
});

window.addEventListener('resize', ajustarAlturaMap());
window.addEventListener('load', ajustarAlturaMap());

GerarMapa();

console.log(continerEstados);
estados.forEach(est => {
  let option = document.createElement('option');
  option.value = est.sigla;
  option.textContent = est.nome;

  continerEstados.appendChild(option);
});

form.addEventListener('submit', async function(e) {
  e.preventDefault();

  if (botao) botao.disabled = true;

  msgErro.textContent = '';
  let geo, enderecoExibicao;

  try {
    if (tipoConsulta == 'cep') {
      const cep = input.value.replace(/\D/g, '');
      if (!ValidarCep(cep)) {
        ExibirMsgErro('Digite um CEP válido', msgErro, input);
        return;
      }
      const dataCep = await BuscarEndereco(cep);
      enderecoExibicao = MontarEnderecoCompleto(dataCep);
      saida.textContent = 'Endereço: ' + enderecoExibicao;
      geo = await BuscarGeo(enderecoExibicao);
    } else {
      const estado = continerEstados.value;
      const cidade = document.getElementById('cidade').value;
      const rua = document.getElementById('rua').value;

      if (/\d/.test(rua)) {
        ExibirMsgErro('Digite o nome da Rua sem o número', msgErro, input);
        return;
      }

      const cepLocal = await BuscarCepPorEndereco(RemoverAcentos(estado), RemoverAcentos(cidade), RemoverAcentos(rua));
      saida.textContent = 'CEP: ' + cepLocal;
      const dataCep = await BuscarEndereco(cepLocal);
      enderecoExibicao = MontarEnderecoCompleto(dataCep);
      geo = await BuscarGeo(enderecoExibicao);
    }

    GerarMarcador(geo.lat, geo.lon);
    MarcarAreaMapa(geo.limitesbox.lat1, geo.limitesbox.lon1, geo.limitesbox.lat2, geo.limitesbox.lon2);
  } catch (error) {
    ExibirMsgErro('Erro ao Buscar dados. <br> Verifique as informações e tente novamente', msgErro, input);
    console.error(error);
  }
  finally {
    if (botao) botao.disabled = false;
  }
});

function AlternarConsulta(tipo) {
  if (tipo === 'cep') {
    label.textContent = 'CEP:';
    input.placeholder = '00000-000';
    tipoConsulta = 'cep';
    AlterarEstadoInputs(formCep, true);
    AlterarEstadoInputs(formEndereco, false);
    formCep.classList.remove('escondido');
    formEndereco.classList.add('escondido');
  } else {
    label.textContent = 'Endereço:';
    input.placeholder = 'Rua, Bairro, Cidade';
    tipoConsulta = 'endereco';
    AlterarEstadoInputs(formCep, false);
    AlterarEstadoInputs(formEndereco, true);
    formCep.classList.add('escondido');
    formEndereco.classList.remove('escondido');
  }
  input.value = '';
  msgErro.textContent = '';
}

rdCEP.addEventListener('change', () => AlternarConsulta('cep'));
rdEndereco.addEventListener('change', () => AlternarConsulta('endereco'));

input.addEventListener('input', () => {
  if (rdCEP.checked) {
    let novoValue = input.value.replace(/\D/g, '').slice(0,8);

    if (novoValue.length > 5)
      novoValue = novoValue.replace(/(\d{5})(\d{1})/, '$1-$2');

    input.value = novoValue;
  }
});

btnZoom.addEventListener('click', () => {
  const mapContainer = document.getElementById('mapContainer');
  mapContainer.classList.toggle('zoomMapa');
  RedimensionarMapa();
});

function ajustarAlturaMap() {
  if (window.matchMedia('(max-width: 1000px)').matches) {
    mapSection.style.height = `calc(100vh - ${form.offsetHeight}px)`;
  }
  else {
    mapSection.style.height = '';
  }
}