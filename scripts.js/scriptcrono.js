const hourElement = document.getElementById('hour');
const minuteElement = document.getElementById('minute');
const secondElement = document.getElementById('second');
const millisecondElement = document.getElementById('millisecond');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const resetButton = document.getElementById('resetButton');
const clearButton = document.getElementById('clearButton');
const videoElement = document.getElementById('cronogif');


let timerInterval;
let totalMilliseconds = 0;
let tarefaEmAndamento = false;


function startTimer() {
    if (tarefaEmAndamento) {
        timerInterval = setInterval(updateTimer, 10);
        videoElement.play();
    } else {
        alert("Adicione uma tarefa antes de iniciar o cronômetro.");
    }
}


function pauseTimer() {
    clearInterval(timerInterval);
    videoElement.pause();
    videoElement.currentTime = totalMilliseconds / 1000;
    atualizarTempoTarefa();
    tarefaEmAndamento = false;
}

function resetTimer() {
    clearInterval(timerInterval);
    totalMilliseconds = 0;
    updateTimer();
    videoElement.pause();
    videoElement.currentTime = 0;
    hourElement.textContent = "00";
    minuteElement.textContent = "00";
    secondElement.textContent = "00";
    millisecondElement.textContent = "000";
    videoElement.load();
    tarefaEmAndamento = false;
}

function updateTimer() {
    totalMilliseconds += 10;
    const hours = Math.floor(totalMilliseconds / (3600 * 1000));
    const minutes = Math.floor((totalMilliseconds % (3600 * 1000)) / (60 * 1000));
    const seconds = Math.floor((totalMilliseconds % (60 * 1000)) / 1000);
    const milliseconds = totalMilliseconds % 1000;

    hourElement.textContent = padNumber(hours);
    minuteElement.textContent = padNumber(minutes);
    secondElement.textContent = padNumber(seconds);
    millisecondElement.textContent = padNumber(milliseconds, 3);
    salvarTarefas();
}

function padNumber(number, length = 2) {
    return number.toString().padStart(length, '0');
}

function adicionarTarefa() {
    resetTimer();

    if (!tarefaEmAndamento) {
        var nomeTarefa = document.getElementById("nomeTarefa").value;
        if (nomeTarefa !== "") {
            adicionarLinhaTabela(nomeTarefa);
            limparCampoTexto();
            tarefaEmAndamento = true;
        } else {
            alert("Digite o nome da tarefa antes de adicioná-la.");
        }
    } else {
        alert("Complete a tarefa atual antes de adicionar uma nova.");
    }
}

function adicionarLinhaTabela(nomeTarefa) {
    var table = document.getElementById("taskTable");
    var row = table.insertRow(-1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = nomeTarefa;
    cell2.innerHTML = "0:00:00:000";
}

function atualizarTempoTarefa() {
    var table = document.getElementById("taskTable");
    var lastRow = table.rows[table.rows.length - 1];
    var tempoDecorrido = document.getElementById("hour").textContent + ":" +
        document.getElementById("minute").textContent + ":" +
        document.getElementById("second").textContent + ":" +
        document.getElementById("millisecond").textContent;
    lastRow.cells[1].innerHTML = tempoDecorrido;
}

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

function carregarTarefas() {
    var tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
        clearTable();
        tasks.forEach(function (task) {
            adicionarLinhaTabela(task.nome);
            var table = document.getElementById("taskTable");
            var lastRow = table.rows[table.rows.length - 1];
            lastRow.cells[1].innerHTML = task.tempo;
        });
    }
}

function clearTable() {
    var table = document.getElementById("taskTable");
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }
    localStorage.removeItem('tasks');
}

carregarTarefas();

clearlineButton.addEventListener('click', clearLine);

function clearLine() {
    var table = document.getElementById("taskTable");

    if (table.rows.length > 1) {
        table.deleteRow(table.rows.length - 1);
        salvarTarefas();
    } else {
        alert("Não há linhas para remover.");
    }
}
