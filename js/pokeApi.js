const gen = {
    I : 151,
    II : 251,
    III : 386,
    IV : 493,
    V : 649,
    VI : 721,
    VII : 802
}

let pokeElements = new Array();
let limit = 802;

function getPokemon(){
    let content = document.querySelector('#content');

    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}`;

    let req = new XMLHttpRequest();

    req.open('get', url, false);
    req.send();

    console.log(req.responseText)

    let data = JSON.parse(req.responseText).results;

    updateLinks(data, genSelect.value, typeSelect1.value, typeSelect2.value);

    for(let i = 0; i < data.length; i++){
        createPokeElement(data[i], i + 1);
        if(i == 1){
            let dataReq = new XMLHttpRequest();
            req.open('get', pokeElements[i].url, true);
            req.send();
        }

        if(i == data.length - 1){
            return new Promise(resolve => {
                resolve("p");
            });
        }
    }

    
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
}

function updateLinks(data, gen, type1, type2){
    let pokeLinks = document.querySelector('.poke-links');
    pokeLinks.innerHTML = '';

    for(let i = 0; i < data.length; i++){
        
        let pokeLink = document.createElement('p');

        pokeLink.innerHTML = `#${i+1}: ` + data[i].name[0].toUpperCase() + data[i].name.slice(1);
        if(pokeLink.innerHTML[pokeLink.innerHTML.length - 2] == '-'){
            pokeLink.innerHTML = pokeLink.innerHTML.slice(0, pokeLink.innerHTML.length - 1) + pokeLink.innerHTML[pokeLink.innerHTML.length - 1].toUpperCase();
        }

        pokeLink.className = 'poke-link';
        pokeLink.onclick = () => {
            currentId = i + 1;
            updateDisplay(currentId);
        }

        pokeLinks.append(pokeLink);
    }
}

function filterPokemon(pokemonId, gen, type1, type2){
    
}

let currentId = 1;

let forwardArrow = document.querySelector('.page-forward');
let backArrow = document.querySelector('.page-back');
let genSelect = document.querySelector('#gen');
let typeSelect1 = document.querySelector('type1');
let typeSelect2 = document.querySelector('type2');

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

genSelect.onchange = () => {
    console.log(genSelect.value);
};


getPokeData();

setTimeout(() => {
    updateDisplay(currentId);
}, 500)