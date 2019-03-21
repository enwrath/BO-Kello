var taulu, aika, nimi, saveArea;
var timerIDs = [];
var secsGone = 0;

function init() {
  taulu = document.getElementById('taulu');
  aika = document.getElementById('aika');
  nimi = document.getElementById('nimi');
  saveArea = document.getElementById('saveArea');
  for (k in Object.keys(localStorage)) {
    var key = localStorage.key(k);
    var data = JSON.parse(localStorage.getItem(key));
    console.log(key);
    var button = document.createElement("button");
    button.id = key;
    button.textContent = key;
    button.addEventListener ("click", function() {
      loadData(this.id);
    });
    saveArea.appendChild(button);
  }
}

function deleteRow(btn) {
  var row = btn.parentNode.parentNode;
  row.parentNode.removeChild(row);
}

function addRow(s, m, t) {
  var newRow = taulu.insertRow(-1);
  var c1 = newRow.insertCell(0);
  var c2 = newRow.insertCell(1);
  var c3 = newRow.insertCell(2);
  var c4 = newRow.insertCell(3);

  var delbtn = document.createElement("button");
  delbtn.textContent = "Remove";
  delbtn.addEventListener ("click", function() {
    deleteRow(delbtn);
  });

  c1.appendChild(document.createTextNode(s));
  c2.appendChild(document.createTextNode(m));
  c3.appendChild(document.createTextNode(t));
  c4.appendChild(delbtn);
  c1.contentEditable = true;
  c2.contentEditable = true;
  c3.contentEditable = true;
}

function deleteBuild() {
  var key = nimi.textContent;
  localStorage.removeItem(key);

  var btn = document.getElementById(key);
  if (btn != null) btn.parentNode.removeChild(btn);
}

function saveData() {
  var d = [];
  var id = nimi.textContent;
  for (var i = 1; i < taulu.rows.length; i++) {
    var secs = taulu.rows[i].cells[0].textContent;
    var mins = taulu.rows[i].cells[1].textContent;
    var text = taulu.rows[i].cells[2].textContent;
    d.push(secs,mins,text);
  }
  var data = JSON.stringify(d);
  console.log(data);
  var resave = false;
  if (localStorage.getItem(id) != null) resave = true;
  localStorage.setItem(id, data);

  if (!resave) {
    var button = document.createElement("button");
    button.id = id;
    button.textContent = id;
    button.addEventListener ("click", function() {
      loadData(this.id);
    });
    saveArea.appendChild(button);
  }
}

function loadData(key) {
  var d = localStorage.getItem(key);
  console.log(key);
  var data = JSON.parse(d);
  nimi.textContent = key;
  while (taulu.rows.length > 1) {
    taulu.deleteRow(1);
  }
  while (data.length > 0) {
    var secs = data.shift();
    var mins = data.shift();
    var text = data.shift();
    addRow(secs, mins, text);
  }
}

function start() {
  stop()
  for (var i = 1; i < taulu.rows.length; i++) {
    var secs = parseInt(taulu.rows[i].cells[0].textContent) * 60 + parseInt(taulu.rows[i].cells[1].textContent);
    var tid = window.setTimeout(say, secs*1000, taulu.rows[i].cells[2].textContent);
    timerIDs.push(tid);
  }
  var tid = window.setInterval(updateTime, 1000);
  timerIDs.push(tid);
}

function updateTime() {
  secsGone += 1;
  aika.textContent = Math.floor(secsGone / 60) + ":" + (secsGone % 60).toString().padStart(2, '0');
}

function stop() {
  while (timerIDs.length > 0) {
    var tid = timerIDs.pop();
    clearTimeout(tid);
  }
  secsGone = -1;
  updateTime();
}

function say(text) {
  var msg = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(msg);
}
