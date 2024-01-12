// Obtém referências para os elementos do cronômetro e botões
const hourElement = document.getElementById('hour');
const minuteElement = document.getElementById('minute');
const secondElement = document.getElementById('second');
const millisecondElement = document.getElementById('millisecond');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');
const clearButton = document.getElementById('clearButton');
const videoElement = document.getElementById('cronogif');
const audioElement = document.getElementById('ticktock');

// Variáveis para controlar o intervalo do cronômetro e o tempo total decorrido
let timerInterval;
let totalMilliseconds = 0;
let tarefaEmAndamento = false;

// Inicia o cronômetro
function startTimer() {
    if (tarefaEmAndamento) {
        timerInterval = setInterval(updateTimer, 10);
        videoElement.play();
        audioElement.play();
    } else {
        alert("Adicione uma tarefa antes de iniciar o cronômetro.");
    }
}

// Pausa o cronômetro e atualiza o tempo decorrido na última tarefa
function pauseTimer() {
    clearInterval(timerInterval);
    videoElement.pause();
    audioElement.pause();
    audioElement.currentTime = 0;
    videoElement.currentTime = totalMilliseconds / 1000;
    atualizarTempoTarefa();
    tarefaEmAndamento = false;
}

// Reinicia o cronômetro e reseta o tempo total
function resetTimer() {
    clearInterval(timerInterval);
    totalMilliseconds = 0;
    updateTimer();
    videoElement.pause();
    audioElement.pause();
    videoElement.currentTime = 0;

    // Atualiza os elementos do cronômetro para 00:00:00:000
    hourElement.textContent = "00";
    minuteElement.textContent = "00";
    secondElement.textContent = "00";
    millisecondElement.textContent = "000";

    videoElement.load();

    tarefaEmAndamento = false;
}

// Atualiza o tempo do cronômetro a cada intervalo de 10 milissegundos
function updateTimer() {
    totalMilliseconds += 10;

    // Calcula horas, minutos, segundos e milissegundos
    const hours = Math.floor(totalMilliseconds / (3600 * 1000));
    const minutes = Math.floor((totalMilliseconds % (3600 * 1000)) / (60 * 1000));
    const seconds = Math.floor((totalMilliseconds % (60 * 1000)) / 1000);
    const milliseconds = totalMilliseconds % 1000;

    // Atualiza os elementos do cronômetro com os valores calculados
    hourElement.textContent = padNumber(hours);
    minuteElement.textContent = padNumber(minutes);
    secondElement.textContent = padNumber(seconds);
    millisecondElement.textContent = padNumber(milliseconds, 3);

    // Salva as tarefas a cada atualização do cronômetro
    salvarTarefas();
}

// Preenche um número com zeros à esquerda para atingir o comprimento desejado
function padNumber(number, length = 2) {
    return number.toString().padStart(length, '0');
}

// Adiciona uma nova tarefa à tabela e inicia o cronômetro
function adicionarTarefa() {
    resetTimer(); // Zera o cronômetro ao adicionar uma nova tarefa

    if (!tarefaEmAndamento) {
        var nomeTarefa = document.getElementById("nomeTarefa").value;
        if (nomeTarefa !== "") {
            adicionarLinhaTabela(nomeTarefa);
            limparCampoTexto();
        } else {
            alert("Digite o nome da tarefa antes de adicioná-la.");
        }
    } else {
        alert("Complete a tarefa atual antes de adicionar uma nova.");
    }
}

// Adiciona uma nova linha à tabela de tarefas
function adicionarLinhaTabela(nomeTarefa) {
    var table = document.getElementById("taskTable");
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = nomeTarefa;
    cell2.innerHTML = "0:00:00:000"; // Adiciona os milissegundos à tabela
    tarefaEmAndamento = true; // Define que há uma tarefa em andamento após adicioná-la.
}

// Atualiza o tempo decorrido na última tarefa
function atualizarTempoTarefa() {
    var table = document.getElementById("taskTable");
    var lastRow = table.rows[table.rows.length - 1];
    var tempoDecorrido = document.getElementById("hour").textContent + ":" +
        document.getElementById("minute").textContent + ":" +
        document.getElementById("second").textContent + ":" +
        document.getElementById("millisecond").textContent;
    lastRow.cells[1].innerHTML = tempoDecorrido;
}

// Salva as tarefas no armazenamento local (localStorage)
function salvarTarefas() {
    var tasks = [];
    var table = document.getElementById("taskTable");
    for (var i = 1; i < table.rows.length; i++) {
        var task = {
            nome: table.rows[i].cells[0].innerHTML,
            tempo: table.rows[i].cells[1].innerHTML
        };
        tasks.push(task);
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Carrega as tarefas salvas ao iniciar a página
function carregarTarefas() {
    var tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
        clearTable(); // Limpa a tabela antes de carregar as tarefas
        tasks.forEach(function (task) {
            adicionarLinhaTabela(task.nome);
            var table = document.getElementById("taskTable");
            var lastRow = table.rows[table.rows.length - 1];
            lastRow.cells[1].innerHTML = task.tempo;
        });
    }
}

// Limpa todas as tarefas da tabela e remove do armazenamento local
function clearTable() {
    var table = document.getElementById("taskTable");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    localStorage.removeItem('tasks'); // Remove todas as tarefas salvas
}

// Carrega as tarefas ao iniciar a página
carregarTarefas();

// Adiciona um ouvinte de evento ao botão "Limpar"
clearlineButton.addEventListener('click', clearLine);

function clearLine() {
    var table = document.getElementById("taskTable");

    if (table.rows.length > 1) {
        // Remove a última linha
        table.deleteRow(table.rows.length - 1);
        salvarTarefas(); // Salva as tarefas após a remoção
    } else {
        alert("Não há linhas para remover.");
    }
}