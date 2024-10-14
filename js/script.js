let currentBg = 4;
let score = 0;
let localStorage = window.localStorage;
let timeouts = []
let anime = {
    left: null,
    right: null
}

if (!localStorage.getItem('anime-high-score')) localStorage.setItem('anime-high-score', 0);

function start() {
    document.getElementById('high-score').innerHTML = `High Score: ${localStorage.getItem('anime-high-score')}`

    score = 0;
    currentBg = 4;

    resetAnimeList()

    document.getElementById('home-container').style.opacity = 0;
    document.getElementById('home-container').style.pointerEvents = 'none'

    let gameCont = document.getElementById('game-container');
    gameCont.style.pointerEvents = 'inherit'
    gameCont.style.transition = "opacity 1s"
    gameCont.style.opacity = 1

    anime.left = randomAnime();
    anime.right = randomAnime();

    setInfo(0, anime.left)
    setInfo(1, anime.right)

    setButtons(1)
}

function randomAnime() {
    if (animeList.length == 0) {
        resetAnimeList();
    }

    return animeList.splice(Math.floor(Math.random() * (animeList.length - 1)), 1)[0];
}

function setInfo(number, info) {
    document.getElementById('anime-' + number).innerHTML = `
    <div class="anime-container">
        <div id="${number}-anime" class="anime-img"></div>

        <div style="height: 225px" id="${number}-info">
            <div id="${number}-title" class="text-large"></div>
            <div id="${number}-has" class="text-small"></div>
            <div id="${number}-rating" class="text-large"></div>
            <div id="${number}-score" class="text-small"></div>
            <div id="${number}-buttons" style="display: none">
                <button class="higher-btn" onclick="higherLower(true, ${number})">Higher ▲</button>
                <br />
                <button class="lower-btn" onclick="higherLower(false, ${number})">Lower ▼</button>
            </div>
        </div>
    </div>`

    document.getElementById(number + '-title').innerHTML = `"${info.title}"`
    document.getElementById(number + '-rating').innerHTML = `${info.score}`
    document.getElementById(number + '-score').innerHTML = 'percent rating'
    document.getElementById(number + '-has').innerHTML = 'has'
    document.getElementById(number + '-anime').innerHTML = `<img src="${info.image_url}"></img>`
}

function setButtons(number) {
    document.getElementById(number + '-has').style.display = "none"
    document.getElementById(number + '-score').style.display = "none"
    document.getElementById(number + '-rating').style.display = "none"
    document.getElementById(number + '-buttons').style.display = "block"
}

function higherLower(higher, number) {
    const answer = parseInt(anime.left.score) < parseInt(anime.right.score);
    let win = (answer == higher || parseInt(anime.left.score) == parseInt(anime.right.score))

    const interval = 50
    const animTime = 750;
    let frame = 0;
    const tween = Math.ceil(anime.right.score / interval)
    let current = 0;

    document.getElementById(number + '-buttons').style.display = 'none'

    let viewDisp = document.getElementById(number + '-rating')
    viewDisp.style.display = 'block';

    document.getElementById(number + '-has').style.display = 'block'
    document.getElementById(number + '-score').style.display = 'block'

    function numAnim() {
        current += tween;
        viewDisp.innerHTML = current.toString();
        frame++;

        if (frame < interval) timeouts.push(setTimeout(() => numAnim(), animTime/interval));
        else onEnd()
    }

    function onEnd() {
        viewDisp.innerHTML = anime.right.score;
        if (win) document.getElementById((score + 1) + '-rating').classList = `text-large score-bump`

        timeouts.push(setTimeout(() => {
            if (win) {
                currentBg++;
                if (currentBg == 5) currentBg = 1;

                document.getElementById((score + 1) + '-rating').classList = `text-large`

                score++;
                document.getElementById('score').innerHTML = `Score: ${score}`
                document.getElementById('score').classList = `score-bump`
                document.getElementById('score').classList = `score-bump`

                if (localStorage.getItem('anime-high-score') < score) {
                    document.getElementById('high-score').innerHTML = `High Score: ${score}`
                    localStorage.setItem('anime-high-score', score)
                    document.getElementById('high-score').classList = `score-bump`
                }


                document.getElementById('anime-container').innerHTML += `<div id="anime-${score + 1}" class="anime-pos anim2" style="background: url('/images/bg-${currentBg}.png');"></div>`
                document.getElementById('anime-' + (score)).classList = 'anime-pos anim1'
                document.getElementById('anime-' + (score - 1)).classList = 'anime-pos anim0'

                anime.left = anime.right;
                anime.right = randomAnime()

                setInfo(score + 1, anime.right)
                setButtons(score + 1)

                timeouts.push(setTimeout(() => {
                    document.getElementById('anime-' + (score - 1)).remove()
                    document.getElementById('score').classList = ``
                    document.getElementById('high-score').classList = ``
                }, 250))
            } else timeouts.push(setTimeout(() => lose(), 500));
        }, 1000));
    }
    numAnim()
}

function lose() {
    resetGameCont()
    document.getElementById('lose-container').style.display = 'block'
    document.getElementById('lose-score').innerHTML = `You got a score of ${score}!`
}

function home() {
    resetGameCont()

    document.getElementById('lose-container').style.display = 'none';
    document.getElementById('home-container').style.opacity = '1';
    document.getElementById('home-container').style.pointerEvents = 'inherit';
}

function resetGameCont() {
    document.getElementById('game-container').style.opacity = '0'
    document.getElementById('game-container').style.transition = 'opacity 0s'
    document.getElementById('game-container').style.pointerEvents = 'none'

    document.getElementById('anime-container').innerHTML = `<div id="anime-0" class="anime-pos anim1" style="background: url('/images/bg-3.png');"></div>
    <div id="anime-1" class="anime-pos anim2" style="background: url(images/bg-4.png);"></div>`
    document.getElementById('score').innerHTML = `Score: 0`

    timeouts.forEach(x => {
        clearTimeout(x)
    })
}