let selecoes = [];

function carregarJogos() {
    fetch('/api/jogos')
        .then(res => res.json())
        .then(data => mostrarJogos(data.dias[0].ligas));
}

function mostrarJogos(ligas) {
    const container = document.getElementById('jogos-container');
    container.innerHTML = '';
    ligas.forEach(liga => {
        const divLiga = document.createElement('div');
        divLiga.innerHTML = `<h3>${liga.nome}</h3>`;
        liga.jogos.forEach(jogo => {
            const divJogo = document.createElement('div');
            divJogo.innerHTML = `<strong>${jogo.time_casa} vs ${jogo.time_fora}</strong> (${jogo.hora})<br>`;
            for (let mercado in jogo.mercados) {
                const opcoes = jogo.mercados[mercado];
                divJogo.innerHTML += `<em>${mercado}:</em> `;
                for (let chave in opcoes) {
                    const odd = document.createElement('span');
                    odd.className = 'odd';
                    odd.textContent = `${chave} (${opcoes[chave]})`;
                    odd.onclick = () => adicionarAoBoletim(jogo, mercado, chave, opcoes[chave]);
                    divJogo.appendChild(odd);
                }
                divJogo.innerHTML += '<br>';
            }
            divLiga.appendChild(divJogo);
        });
        container.appendChild(divLiga);
    });
}

function adicionarAoBoletim(jogo, mercado, selecao, odd) {
    selecoes.push({ jogo, mercado, selecao, odd });
    atualizarBoletim();
}

function atualizarBoletim() {
    const lista = document.getElementById('selecoes');
    lista.innerHTML = '';
    selecoes.forEach((s, i) => {
        const li = document.createElement('li');
        li.textContent = `${s.jogo.time_casa} x ${s.jogo.time_fora} - ${s.mercado} - ${s.selecao} @ ${s.odd}`;
        lista.appendChild(li);
    });
    atualizarRetorno();
}

function atualizarRetorno() {
    const valor = parseFloat(document.getElementById('valorAposta').value || 0);
    const multiplicador = selecoes.reduce((acc, s) => acc * s.odd, 1);
    document.getElementById('retornoPotencial').textContent = (valor * multiplicador).toFixed(2);
}

function finalizarAposta() {
    const valor = parseFloat(document.getElementById('valorAposta').value || 0);
    const payload = {
        valor,
        retorno: parseFloat((valor * selecoes.reduce((acc, s) => acc * s.odd, 1)).toFixed(2)),
        selecoes,
        metodo: 'pix_ou_codigo',
        horario: new Date().toISOString()
    };
    fetch('/api/apostar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    }).then(res => res.json()).then(res => {
        alert(res.status || "Aposta enviada!");
        selecoes = [];
        atualizarBoletim();
        document.getElementById('valorAposta').value = '';
    });
}

carregarJogos();