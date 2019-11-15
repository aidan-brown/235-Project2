let limit = 25;

function getPokemon(page){
    let content = document.querySelector('#content');

    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${page * limit}`;

    let req = new XMLHttpRequest();

    req.open('get', url, false);
    req.send();

    console.log(req.responseText)

    let data = JSON.parse(req.responseText).results;

    for(let pokemon of data){
        let pokeReq = new XMLHttpRequest();

        pokeReq.onload = createPokeElement;
        pokeReq.open('get', pokemon.url, false);
        pokeReq.send();
    }
}

function createPokeElement(e){
    let pokeData = JSON.parse(e.target.responseText);

    console.log(pokeData);

    let pokeInfo = document.createElement('section');
    pokeInfo.className = 'poke-info';
    pokeInfo.id = pokeData.id;

        let pokeName = document.createElement('h2');
        pokeName.classList = 'poke-name';
        pokeName.innerHTML = `#${pokeData.id} ` + pokeData.name[0].toUpperCase() + pokeData.name.slice(1);
        pokeInfo.append(pokeName);

        let pokeSprite = document.createElement('img');
        pokeSprite.classList = 'poke-sprite';
        pokeSprite.src = pokeData.sprites["front_default"];
        pokeInfo.append(pokeSprite);

        let pokeStats = document.createElement('div');
        pokeStats.classList = 'poke-stats';
        for(let i = 0; i < pokeData.stats.length; i++){
            let statElement = document.createElement('p');
            statElement.className = pokeData.stats[i].stat.name;
            statElement.innerHTML = pokeData.stats[i].stat.name[0].toUpperCase() + pokeData.stats[i].stat.name.slice(1) + ': ' + pokeData.stats[i].base_stat;
            pokeStats.append(statElement);
        }
        pokeInfo.append(pokeStats);

        let pokeTypes = document.createElement('div');
        pokeTypes.className = 'poke-types';
        for(let i = pokeData.types.length - 1; i >= 0; i--){
            let typeElement = document.createElement('p');
            typeElement.className = pokeData.types[i].type.name;
            typeElement.innerHTML = pokeData.types[i].type.name[0].toUpperCase() + pokeData.types[i].type.name.slice(1);
            pokeTypes.append(typeElement);
        }
        pokeInfo.append(pokeTypes);

    content.append(pokeInfo);
}

let numberOfPokemon;
let currentPage = 0;

let req = new XMLHttpRequest();
req.open('get', 'https://pokeapi.co/api/v2/pokemon', false);
req.send();
numberOfPokemon = JSON.parse(req.responseText).count;

let forwardArrows = document.querySelectorAll('.page-forward');
let backArrows = document.querySelectorAll('.page-back');

for(let button of forwardArrows){
    button.onclick = () => {
        if(Math.floor(numberOfPokemon / limit) > currentPage){
            currentPage++;
            document.querySelector('#content').innerHTML = '';
            getPokemon(currentPage);
            
        }
        console.log(numberOfPokemon);
    }
}

for(let button of backArrows){
    button.onclick = () => {
        if(0 < currentPage){
            currentPage--;
            document.querySelector('#content').innerHTML = '';
            getPokemon(currentPage);
        }
    }
}

getPokemon(currentPage);