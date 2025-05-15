const hexagon = document.getElementById("hexagon");
const playerTurnDis = document.getElementById("display");
let  PlayerTurn= "Red",blue=0,red=0,blueS=0,redS=0,gameInt,turnInt,pause = false;
const rScore = document.getElementById("redscore");
const bScore = document.getElementById("bluescore");
const totTime = document.getElementById("gametimer");
const currTime = document.getElementById("turntimer");
const stop = document.getElementById("pause");
const continu = document.getElementById("resume");
const playerTime = 20;
let overallTime = 200;
gameOver = false;
currEle = null;

function game() {
    lockstatus = 3;
    elearr = [0, 0, 0];
    arr = [];
    edges = [{ from: 0, to: 1, weight: 8 }, { from: 1, to: 2, weight: 8 }, { from: 2, to: 3, weight: 9 }, { from: 3, to: 4, weight: 8 }, { from: 4, to: 5, weight: 8 }, { from: 5, to: 0, weight: 9 }, { from: 6, to: 7, weight: 5 }, { from: 7, to: 8, weight: 6 }, { from: 8, to: 9, weight: 4 }, { from: 9, to: 10, weight: 5 }, { from: 10, to: 11, weight: 6 }, { from: 11, to: 6, weight: 4 }, { from: 12, to: 13, weight: 1 }, { from: 13, to: 14, weight: 1 }, { from: 14, to: 15, weight: 3 }, { from: 15, to: 16, weight: 2 }, { from: 16, to: 17, weight: 1 }, { from: 17, to: 12, weight: 2 }];
    for (i = 1; i <= 3; i++) {
        for (j = 0; j < 6; j++) {
            const thetha = 60 * j;
            const [a, b] = nodes(120 * i, thetha);
            const point = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            point.setAttribute("cx", a);
             point.setAttribute("cy", b);
             point.setAttribute("r", 15);
             point.classList.add("node");
             point.dataset.occupied = "false";
             point.dataset.layer = i;
             point.addEventListener("click", function () {
                const layer = parseInt( point.dataset.layer);
                if ( point.dataset.occupied == "false" && layer == lockstatus && ((PlayerTurn == "Red" && red < 4) || (PlayerTurn == "Blue" && blue < 4)) && currEle == null) {
                     point.dataset.occupied = "true";
                    if (PlayerTurn == "Red") red++;
                    else blue++;
                    elearr[layer - 1]++;
                    if (elearr[layer - 1] == 6 && lockstatus > 1)
                        lockstatus--;
                     point.classList.add(`${PlayerTurn.toLowerCase()}`);
                    points();
                    if (elearr[0] == 6) gameComplete();
                    change();
                }
                else if ( point.dataset.occupied == "true" &&  point.classList.contains(PlayerTurn.toLowerCase())) {
                    if (currEle !=  point) {
                        if (currEle) {
                            currEle.classList.remove("selected");
                        }
                        currEle =  point;
                         point.classList.add("selected");
                    }
                    else {
                        currEle.classList.remove("selected");
                        currEle = null;
                    }
                }
                else if ( point.dataset.occupied == "false" && currEle) {
                    const fromI = arr.indexOf(currEle);
                    const toI = arr.indexOf( point);
                    const cnction = edges.some(e =>
                        (e.from == fromI && e.to == toI) || (e.to == fromI && e.from == toI)
                    )
                    if (cnction && layer >= lockstatus) {
                        currEle.dataset.occupied = "false";
                        currEle.classList.remove("selected", PlayerTurn.toLowerCase());
                         point.dataset.occupied = "true";
                         point.classList.add(PlayerTurn.toLowerCase());
                        currEle = null;
                        if (fromI - toI == 6 || fromI - toI == -6) {
                            elearr[layer - 1]++;
                        }
                        if (elearr[layer - 1] == 6 && lockstatus > 1 && layer == lockstatus)
                            lockstatus--;
                        points();
                        change();
                        if (elearr[0] == 6) gameComplete();
                    }
                }
                console.log(`red=${red}`);
                console.log(`blue=${blue}`);
                console.log(elearr);
                console.log(`lockstatus=${lockstatus}`);
            });
            hexagon.appendChild( point);
            arr.push( point);
        }
    }
    console.log(red);
    console.log(blue);
    console.log(arr);
    for (i = 0; i < 12; i = i + 2) {
        if (i == 6) i++;
        const from = i;
        const to = i + 6;
        const weight = 1;
        edges.push({ from, to, weight });
    }
    edges.forEach(e => {
        const fromm = arr[e.from];
        const too = arr[e.to];
        const a1 = parseFloat(fromm.getAttribute("cx"));
        const b1 = parseFloat(fromm.getAttribute("cy"));
        const a2 = parseFloat(too.getAttribute("cx"));
        const b2 = parseFloat(too.getAttribute("cy"));
        const aMid = (a1 + a2) / 2;
        const bMid = (b1 + b2) / 2;
        let am = 400 - aMid;
        let bm = 400 - bMid;
        const len = Math.sqrt(am * am + bm * bm);
        am /= len;
        bm /= len;
        const edge = document.createElementNS("http://www.w3.org/2000/svg", "line");
        edge.setAttribute("x1", fromm.getAttribute("cx"));
        edge.setAttribute("y1", fromm.getAttribute("cy"));
        edge.setAttribute("x2", too.getAttribute("cx"));
        edge.setAttribute("y2", too.getAttribute("cy"));
        hexagon.insertBefore(edge, hexagon.firstChild);
        const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        if ((fromm == arr[9] && too == arr[15]) || (fromm == arr[0] && too == arr[6])) {
            txt.setAttribute("x", aMid);
            txt.setAttribute("y", bMid - 14);
        }
        else if ((fromm == arr[2] && too == arr[8]) || (fromm == arr[4] && too == arr[10]) || (fromm == arr[11] && too == arr[17]) || (fromm == arr[7] && too == arr[13])) {
            txt.setAttribute("x", aMid + 14);
            txt.setAttribute("y", bMid);
        }
        else {
            txt.setAttribute("x", aMid + am * 14);
            txt.setAttribute("y", bMid + bm * 14);
        }
        txt.setAttribute("fill", "white");
        txt.setAttribute("font-size", "23");
        txt.setAttribute("text-anchor", "middle");
        txt.setAttribute("dominant-baseline", "middle");
        txt.textContent = e.weight;
        hexagon.appendChild(txt);
    });
    stop.addEventListener("click", function () {
        pause = true;
        stop.disabled = true;
        continu.disabled = false;
    });
    continu.addEventListener("click", function () {
        pause = false;
        continu.disabled = true;
        stop.disabled = false;
    });
}
function totalTime() {
    overallTime = 200;
    totTime.textContent = overallTime;
    gameInt = setInterval(() => {
        if (!pause) {
            overallTime--;
            totTime.textContent = overallTime;
            if (overallTime == 0) {
                clearInterval(gameInt);
                clearInterval(turnInt);
                gameComplete();
            }
        }
    }, 1000);
}
function currentTime() {
    let playerTime = 20;
    currTime.textContent = playerTime;
    if (turnInt) clearInterval(turnInt);
    turnInt = setInterval(() => {
        if (!pause) {
            playerTime--;
            currTime.textContent = playerTime;
            if (playerTime == 0) {
                change();
                currentTime();
            }
        }
    }, 1000);
}
function gameComplete() {
    gameOver = true;
    clearInterval(turnInt);
    clearInterval(gameInt);
    win = redS > blueS ? "Red" : (redS == blueS ? "Draw" : "Blue");
    if (win != "Draw") alert(`Game Over! Final Score: Red-${redS} Blue-${blueS} The winner is ${win}!!`);
    else alert(`Game Over! Final Score: Red-${redS} Blue-${blueS} It's a draw!!`)
    restart();
}
function points() {
    redS = 0;
    blueS = 0;
    edges.forEach(e => {
        const from = arr[e.from];
        const to = arr[e.to];
        const fromOcc = from.dataset.occupied == "true" ? (from.classList.contains("red") ? "red" : "blue") : null;
        const toOcc = to.dataset.occupied == "true" ? (to.classList.contains("red") ? "red" : "blue") : null;
        if (fromOcc && fromOcc == toOcc) {
            if (fromOcc == "red") redS += e.weight;
            else blueS += e.weight;
        }
    });
    rScore.textContent = redS;
    bScore.textContent = blueS;
}

function nodes(r, theta) {
    const rad = Math.PI * theta / 180;
    return [400 + (r * Math.cos(rad)), 400 + (r * Math.sin(rad))];
}
function restart() {
    hexagon.innerHTML = "";
    PlayerTurn = "Red";
    playerTurnDis.textContent = PlayerTurn;
    blue = 0;
    red = 0;
    redS = 0;
    blueS = 0;
    rScore.textContent = redS;
    bScore.textContent = blueS;
    pause = false;
    continu.disabled = true;
    stop.disabled = false;
    clearInterval(turnInt);
    clearInterval(gameInt);
    game();
    totalTime();
    currentTime();
}
function change() {
    PlayerTurn = PlayerTurn == "Red" ? "Blue" : "Red";
    playerTurnDis.textContent = PlayerTurn;
    currentTime();
}

game();
totalTime();
currentTime();