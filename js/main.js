const letters = ["^", "1", "0", "a", "b", "c", "x", "y", "z"];
const states = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"];
const moves = ["R", "L", "0"];
const prime = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73];


function fillNumbers(id, end) {
    var select = document.getElementById(id);
    states.forEach(function (letter) {
        var option = document.createElement("option");
        option.text = letter;
        select.add(option);
    });
}

function fillLetters(selectId) {
    var select = document.getElementById(selectId);
    letters.forEach(function (letter) {
        var option = document.createElement("option");
        option.text = letter;
        select.add(option);
    });
}

function loadE() {
    fillNumbers("state", 21);
    fillNumbers("newstate", 21);
    fillLetters("symbol");
    fillLetters("newsymbol");
}
window.onload = loadE();

document.addEventListener("DOMContentLoaded", function () {
    var editBtn = document.getElementById("edit-btn");
    var stateSelect = document.getElementById("state");
    var symbolSelect = document.getElementById("symbol");
    var newsymbolSelect = document.getElementById("newsymbol");
    var newstateSelect = document.getElementById("newstate");
    var moveSelect = document.getElementById("move");
    var rulesTable = document.getElementById("rules");

    rulesTable.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-btn")) {
            var row = event.target.closest("tr");
            row.parentNode.removeChild(row);
        }
        updateButton();
        sortTable();
    });

    function checkForMatch() {
        editBtn.disabled = false;
        var rows = rulesTable.rows;
        for (var i = 0; i < rows.length; i++) {
            var tableState = rows[i].cells[0].innerText;
            var tableSymbol = rows[i].cells[1].innerText;
            var newSymbol =  rows[i].cells[2].innerText;
            var newState =  rows[i].cells[3].innerText;
            var move =  rows[i].cells[4].innerText;
            if (stateSelect.value === tableState && symbolSelect.value === tableSymbol) {
                if (newSymbol === newsymbolSelect.value && newstateSelect.value === newState && move === moveSelect.value){
                    editBtn.disabled = true;
                }
                return i;
            }
        }
        return -1;
    }

    function updateButton() {
        var matchIndex = checkForMatch();
        editBtn.textContent = matchIndex !== -1 ? "Change Rule" : "Add Rule";
        //editBtn.disabled = false;
    }

    function sortTable() {
        var rows = Array.from(rulesTable.rows);
        rows.sort(function (a, b) {
            var stateComparison = a.cells[0].innerText.localeCompare(b.cells[0].innerText);
            if (stateComparison === 0) {
                return a.cells[1].innerText.localeCompare(b.cells[1].innerText);
            }
            return stateComparison;
        });
        for (var i = 0; i < rows.length; i++) {
            rulesTable.appendChild(rows[i]);
        }
    }

    [stateSelect, symbolSelect, newsymbolSelect, newstateSelect, moveSelect].forEach(function (select) {
        select.addEventListener("change", function () {
            updateButton();
        });
    });

    updateButton();

    editBtn.addEventListener("click", function () {
        var matchIndex = checkForMatch();
        if (matchIndex !== -1) {
            // Change existing rule
            var row = rulesTable.rows[matchIndex];
            row.cells[2].innerText = newsymbolSelect.value;
            row.cells[3].innerText = newstateSelect.value;
            row.cells[4].innerText = moveSelect.value;
        } else {
            // Add new rule row
            var newRow = rulesTable.insertRow();
            newRow.innerHTML = `<td>${stateSelect.value}</td>
                               <td>${symbolSelect.value}</td>
                               <td>${newsymbolSelect.value}</td>
                               <td>${newstateSelect.value}</td>
                               <td>${moveSelect.value}</td>
                               <td><button class="delete-btn">Delete</button></td>`;
        }
        sortTable();
        updateButton();
    });


    var gordelBtn = document.getElementById("gordel-btn");

    gordelBtn.addEventListener("click", function () {
        var gordel = document.getElementById("gordel-number")

        var aList = [];
        var rows = rulesTable.rows
        for (var index = 0; index < rows.length; index++) {
            var row = rows[index];

            var i = (states.indexOf(row.cells[0].innerText))
            var j = (letters.indexOf(row.cells[1].innerText))
            var l = (letters.indexOf(row.cells[2].innerText))
            var k = (states.indexOf(row.cells[3].innerText))
            var x = (moves.indexOf(row.cells[4].innerText))

            // var GNa = (BigInt(11) ** BigInt(i)) * (BigInt(7) ** BigInt(j)) * (BigInt(5) ** BigInt(k)) *
            //     (BigInt(3) ** BigInt(l)) * (BigInt(2) ** BigInt(x))

            var GNa = Decimal.pow(11,i).times(Decimal.pow(7,j)).times(Decimal.pow(5,k)).times(Decimal.pow(3,l)).times(Decimal.pow(2,x));

            aList.push(GNa)
        }
        aList.sort();
        var bigSum = new Decimal(0);
        var output = "";
        for (var i = 0; i < aList.length; i++) {
            if (i != 0) {
                output += " × "
            }

            //bigSum += BigInt(prime[i]) ** BigInt(aList[i]);

            bigSum = Decimal.plus(Decimal.pow(prime[i],aList[i]), bigSum);
            console.log(aList[i]);
            output += prime[i] + "<sup>" + aList[i].toFixed(0) + "</sup>"
        }
        gordel.innerHTML = output + "</br>" + "=" + "</br>" + bigSum;
    });

});
