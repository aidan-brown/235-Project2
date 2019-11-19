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
    
    updateLinks(currentGen, currentType1, currentType2);

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

function updateLinks(gen, type1, type2){
    let pokeLinks = document.querySelector('.poke-links');
    pokeLinks.innerHTML = '';
    for(let i = 1; i < pokeElements.length; i++){
        if(filterPokemon(i, gen, type1, type2)){
            let pokeLink = document.createElement('p');

            pokeLink.innerHTML = `#${i}: ` + pokeElements[i].name;

            pokeLink.className = 'poke-link';
            pokeLink.onclick = () => {
                currentId = i;
                updateDisplay(currentId);
            }

            pokeLinks.append(pokeLink);
        }
    }
}

function filterPokemon(pokemonId, generation, type1, type2){
    let pokemon = pokeElements[pokemonId];
    if(generation == 'none' && type1 == 'none' && type2 == 'none'){
        return true;
    }
    else{
        let check = false;

        switch(generation){
            case 'I':
                    if(pokemonId <= gen.I){
                        check = true;
                    }
                    else{
                        check = false;
                    }
                break;

            case 'II':
                    if(pokemonId > gen.I && pokemonId <= gen.II){
                        check = true;
                    }
                    else{
                        check = false;
                    }
                break;

            case 'III':
                    if(pokemonId > gen.II && pokemonId <= gen.III){
                        check = true;
                    }
                    else{
                        check = false;
                    }
                break;

            case 'IV':
                    if(pokemonId > gen.III && pokemonId <= gen.IV){
                        check = true;
                    }
                    else{
                        check = false;
                    }
                break;

            case 'V':
                    if(pokemonId > gen.IV && pokemonId <= gen.V){
                        check = true;
                    }
                    else{
                        check = false;
                    }
                break;

            case 'VI':
                    if(pokemonId > gen.V && pokemonId <= gen.VI){
                        check = true;
                    }
                    else{
                        check = false;
                    }
                break;

            case 'VII':
                if(pokemonId > gen.VI && pokemonId <= gen.VII){
                    check = true;
                }
                else{
                    check = false;
                }
                break;

            default:
                check = true;
                break;
        }

        if(pokemon.data.types.length > 1){
            if(type2 != type1){
                
                if(check && (
                    (type1 == 'none' && type2 == 'none') || (
                        (type1 == pokemon.data.types[1].type.name || type1 == 'none') &&
                        (type2 == pokemon.data.types[0].type.name || type2 == 'none')
                       )
                    )
                ){
                    check = true;
                }
                else{
                    check = false;
                }
            }
            else{
                check = false;
            }
        }
        else{
            if((check && type1 == 'none' && type2 == 'none') || type1 == pokemon.data.types[0].type.name){
                check = true;
            }
            else{
                check = false;
            }
        }

        

        return check;
    }
}

let currentId = 1;
let currentGen = 'none';
let currentType1 = 'none';
let currentType2 = 'none';

let forwardArrow = document.querySelector('.page-forward');
let backArrow = document.querySelector('.page-back');
let genSelect = document.querySelector('#gen');
let typeSelect1 = document.querySelector('#type1');
let typeSelect2 = document.querySelector('#type2');

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
    currentGen = genSelect.value;
    updateLinks(currentGen, currentType1, currentType2);
};

typeSelect1.onchange = () => {
    currentType1 = typeSelect1.value;
    updateLinks(currentGen, currentType1, currentType2);
}

typeSelect2.onchange = () => {
    currentType2 = typeSelect2.value;
    updateLinks(currentGen, currentType1, currentType2);
}


getPokeData();

setTimeout(() => {
    updateDisplay(currentId);
}, 500)