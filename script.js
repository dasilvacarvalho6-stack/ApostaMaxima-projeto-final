async function carregarJogos() {
  const res = await fetch("api_jogos.json");
  const jogos = await res.json();
  exibirJogos(jogos);
}

function exibirJogos(jogos) {
  const container = document.getElementById("lista-jogos");
  container.innerHTML = "";
  jogos.forEach(jogo => {
    const card = document.createElement("div");
    card.className = "jogo-card";
    card.innerHTML = `
      <div>${jogo.timeCasa} vs ${jogo.timeFora}</div>
      <div>
        <button onclick="selecionarOdd(${jogo.odds.casa})">${jogo.odds.casa}</button>
        <button onclick="selecionarOdd(${jogo.odds.empate})">${jogo.odds.empate}</button>
        <button onclick="selecionarOdd(${jogo.odds.fora})">${jogo.odds.fora}</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function selecionarOdd(odd) {
  // adicionar odd no boletim e atualizar o retorno
}
