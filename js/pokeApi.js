const gen = {
    I : 151,
    II : 251,
    III : 386,
    IV : 493,
    V : 649,
    VI : 721,
    VII : 802
}

const pokeElements = new Array();
let limit = 802;

const pokemonMoves = {};
let moveLimit = 746;

const pokemonAbilities = {};
let abilityLimit = 233;

let content = document.querySelector('#content');


function getPokemon(){
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
            dataReq.onload = () => {
                let pokeData = JSON.parse(dataReq.responseText);
                setData(i, pokeData);
            };
            dataReq.open('get', pokeElements[i].url, true);
            dataReq.send();
        }

        if(i == data.length - 1){
            return new Promise(resolve => {
                resolve("p");
            });
        }
    }

    
}

function getMoves(){
    let req = new XMLHttpRequest();

    req.onload = () => {
        let data = JSON.parse(req.responseText).results;

        for(let move of data){
            let dataReq = new XMLHttpRequest();

            dataReq.onload = () => {
                let moveData = JSON.parse(dataReq.responseText);
                pokemonMoves[move.name] = {id: moveData.id, type: moveData.type.name[0].toUpperCase() + moveData.type.name.slice(1), damageType: moveData.damage_class.name[0].toUpperCase() + moveData.damage_class.name, power: moveData.power, pp: moveData.pp, accuracy: moveData.accuracy}
            }; 
            dataReq.open('get', move.url, true);
            dataReq.send();
        }

        
    };
    req.open('get', `https://pokeapi.co/api/v2/move?limit=${moveLimit}`, true);
    req.send();
}

function getAbilities(){
    let req = new XMLHttpRequest();

    req.onload = () => {
        let data = JSON.parse(req.responseText).results;

        for(let ability of data){
            let dataReq = new XMLHttpRequest();

            dataReq.onload = () => {
                let abilityData = JSON.parse(dataReq.responseText);
                pokemonAbilities[ability.name] = abilityData.effect_entries[0].effect;
            }; 
            dataReq.open('get', ability.url, true);
            dataReq.send();
        }

        
    };
    req.open('get', `https://pokeapi.co/api/v2/ability?limit=${abilityLimit}`, true);
    req.send();
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

    getAbilities();
}

function setData(index, data){
    pokeElements[index].data = data;
}

function updateDisplay(index){
    let currentPokemon = pokeElements[index];

    let pokeName = document.querySelector('.poke-name');
    let name = currentPokemon.name[0].toUpperCase() + currentPokemon.name.slice(1);
    while(name.indexOf('-') != -1){
        let hyIndex = name.indexOf('-');

        name = name.slice(0, hyIndex) + ' ' + name[hyIndex + 1].toUpperCase() + name.slice(hyIndex + 2);
    }
    pokeName.innerHTML = name;

    let pokeWiki = document.querySelector('.poke-wiki');
    let linkName = currentPokemon.name.toLowerCase();
    if(linkName.slice(linkName.length - 2) == '-f'){
        linkName += 'emale';
    }
    else if(linkName.slice(linkName.length - 2) == '-m'){
        linkName += 'ale';
    }
    pokeWiki.href = `https://www.pokemon.com/us/pokedex/${linkName}`;

    if(currentPokemon.data){
        let pokeSprite = document.querySelector('.poke-sprite');
        if(currentPokemon.data.types.length > 1){
            pokeSprite.style.backgroundImage = `url(../images/types/${currentPokemon.data.types[1].type.name}.png)`;
        }
        else{
            pokeSprite.style.backgroundImage = `url(../images/types/${currentPokemon.data.types[0].type.name}.png)`;
        }
        pokeSprite.innerHTML = `<p>#${index}</p><img src=${currentPokemon.data.sprites['front_default']} />`

        let pokeTypes = document.querySelector('.poke-types');
        pokeTypes.innerHTML = '';
        for(let i = currentPokemon.data.types.length - 1; i >= 0; i--){
            let pokeType = document.createElement('p');
            pokeType.className = currentPokemon.data.types[i].type.name;
            pokeType.innerHTML = currentPokemon.data.types[i].type.name[0].toUpperCase() + currentPokemon.data.types[i].type.name.slice(1);
            pokeTypes.append(pokeType);
        }

        let pokeStats = document.querySelector('.poke-stats');
        pokeStats.innerHTML = '';
        let stats = document.createElement('p');
        for(let i = currentPokemon.data.stats.length - 1; i >= 0; i--){
            stats.innerHTML += `${currentPokemon.data.stats[i].stat.name[0].toUpperCase() + currentPokemon.data.stats[i].stat.name.slice(1)}: ${currentPokemon.data.stats[i].base_stat}<br/>`;
        }
        pokeStats.append(stats);

        if(pokemonAbilities){
            let pokeAbilities = document.querySelector('.poke-abilities');
            pokeAbilities.innerHTML = '';
            for(let ability of currentPokemon.data.abilities){
                let pokeAbility = document.createElement('p');
                let name = ability.ability.name[0].toUpperCase() + ability.ability.name.slice(1);
                while(name.indexOf('-') != -1){
                    let hyIndex = name.indexOf('-');

                    name = name.slice(0, hyIndex) + ' ' + name[hyIndex + 1].toUpperCase() + name.slice(hyIndex + 2);
                }
                if(pokemonAbilities[ability.ability.name]){
                    pokeAbility.innerHTML += `<strong>${name}</strong></br>       ${pokemonAbilities[ability.ability.name]}</br>`;
                }
                else{
                    let req = new XMLHttpRequest();

                    req.open('get', ability.ability.url, false);
                    req.send();

                    pokeAbility.innerHTML += `<strong>${name}</strong></br>       ${JSON.parse(req.responseText).effect_entries[0].effect}</br>`;
                }
                pokeAbilities.append(pokeAbility);
            }
        }

        // if(pokemonMoves){
        //     let pokeMoves = document.querySelector('.poke-moves');
        //     pokeMoves.innerHTML = '';
        //     for(let move of currentPokemon.data.moves){
        //         let pokeMove = document.createElement('p');
        //         let name = move.move.name[0].toUpperCase() + move.move.name.slice(1);
        //         while(name.indexOf('-') != -1){
        //             let hyIndex = name.indexOf('-');

        //             name = name.slice(0, hyIndex) + ' ' + name[hyIndex + 1].toUpperCase() + name.slice(hyIndex + 2);
        //         }

        //         pokeMove.innerHTML += `<strong>${name}</strong></br>  Type: ${pokemonMoves[move.move.name].type}</br>  `;
        //         pokeMoves.append(pokeMove);
        //     }
        // }
        
    }
}

function updateLinks(gen, type1, type2){
    let pokeLinks = document.querySelector('.poke-links');
    pokeLinks.innerHTML = '';
    for(let i = 1; i < pokeElements.length; i++){
        if(filterPokemon(i, gen, type1, type2)){
            let pokeLink = document.createElement('p');

            let name = pokeElements[i].name[0].toUpperCase() + pokeElements[i].name.slice(1);
            while(name.indexOf('-') != -1){
                let hyIndex = name.indexOf('-');

                name = name.slice(0, hyIndex) + ' ' + name[hyIndex + 1].toUpperCase() + name.slice(hyIndex + 2);
            }
            pokeLink.innerHTML = `#${i}: ` + name;

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

        

        if(type1 != 'none' || type2 != 'none'){
            if(pokemon.data.types.length > 1){
                if(type2 != type1){
                    
                    if(check && ((type1 == pokemon.data.types[1].type.name && type2 == pokemon.data.types[0].type.name) || (type1 == pokemon.data.types[1].type.name && type2 == 'none') || (type1 == 'none' && type2 == pokemon.data.types[0].type.name))){
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
                if(check && type1 == pokemon.data.types[0].type.name && (type2 == 'none' || type2 == type1)){
                    check = true;
                }
                else{
                    check = false;
                }
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
}, 200)