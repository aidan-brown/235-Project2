let pokeElements = new Array();
let limit = 807;

function getPokemon(){
    let content = document.querySelector('#content');

    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}`;

    let req = new XMLHttpRequest();

    req.open('get', url, false);
    req.send();

    console.log(req.responseText)

    let data = JSON.parse(req.responseText).results;

    updateLinks(data);

    for(let i = 0; i < data.length; i++){
        createPokeElement(data[i], i + 1);
        if(i == 1){
            let dataReq = new XMLHttpRequest();

            req.onload = () => console.log(dataReq.responseText);
            req.open('get', pokeElements[i].url, true);
            req.send();
        }
    }

    return new Promise(resolve => {
        resolve("p");
        console.log('resolved p');
    });
}

function createPokeElement(pokeData, id){
    let pokeElement = {name: pokeData.name[0].toUpperCase() + pokeData.name.slice(1), url: pokeData.url, data: null};
    if(pokeElement.name[pokeElement.name.length - 2] == '-'){
        pokeElement.name = pokeElement.name.slice(0, pokeElement.name.length - 1) + pokeElement.name[pokeElement.name.length - 1].toUpperCase();
    }
    pokeElements[id] = pokeElement;
}

async function getPokeData(){
    const p = getPokemon();

    await p;

    for(let i = 1; i < pokeElements.length; i++){
        let req = new XMLHttpRequest();

        req.onload = () => setData(i, JSON.parse(req.responseText))
        req.open('get', pokeElements[i].url, true);
        req.send();
    }
}

function setData(index, data){
    pokeElements[index].data = data;
}

function updateDisplay(index){
    let currentPokemon = pokeElements[index];

    let pokeDisplay = document.querySelector('.poke-display');
    pokeDisplay.innerHTML = '';

    let pokeName = document.createElement('h2');
    pokeName.className = 'poke-name';
    pokeName.innerHTML = currentPokemon.name;
    pokeDisplay.append(pokeName);

    if(currentPokemon.data){
        let pokeSprite = document.createElement('img');
        pokeSprite.className = 'poke-sprite'
        pokeSprite.src = currentPokemon.data.sprites['front_default'];
        pokeDisplay.append(pokeSprite);

        let pokeTypes = document.createElement('div');
        pokeTypes.className = 'poke-types';
        for(let i = currentPokemon.data.types.length - 1; i >= 0; i--){
            let pokeType = document.createElement('p');
            pokeType.className = currentPokemon.data.types[i].type.name;
            pokeType.innerHTML = currentPokemon.data.types[i].type.name[0].toUpperCase() + currentPokemon.data.types[i].type.name.slice(1);
            pokeTypes.append(pokeType);
        }
        pokeDisplay.append(pokeTypes);

        let pokeStats = document.createElement('p');
        pokeStats.className = 'poke-stats';
        for(let i = 0; i < currentPokemon.data.stats.length; i++){
            pokeStats.innerHTML += `${currentPokemon.data.stats[i].stat.name[0].toUpperCase() + currentPokemon.data.stats[i].stat.name.slice(1)}: ${currentPokemon.data.stats[i].base_stat}<br/>`;
        }
        pokeDisplay.append(pokeStats);
    }

    content.append(pokeDisplay);
}

function updateLinks(data){
    let pokeLinks = document.querySelector('.poke-links');
    pokeLinks.innerHTML = '';

    for(let i = 0; i < data.length; i++){
        let pokeLink = document.createElement('p');
        pokeLink.innerHTML = data[i].name[0].toUpperCase() + data[i].name.slice(1);

        pokeLink.onclick = () => {
            currentId = i + 1;
        }

        pokeLinks.append(pokeLink);
    }
}

let currentId = 1;

let forwardArrow = document.querySelector('.page-forward');
let backArrow = document.querySelector('.page-back');

forwardArrow.onclick = () => {
    if(limit > currentId){
        currentId++;

        updateDisplay(currentId);
    }
};

backArrow.onclick = () => {
    if(1 < currentId){
        currentId--;

        updateDisplay(currentId);
    }
};


getPokeData();

setTimeout(() => {
    updateDisplay(currentId);
}, 500)
