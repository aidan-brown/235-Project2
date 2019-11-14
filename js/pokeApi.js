function getPokemon(){
    let content = document.querySelector('#content');

    let url = 'https://pokeapi.co/api/v2/pokemon'

    let req = new XMLHttpRequest();

    req.open('get', url, false);
    req.send();

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
    pokeName.innerHTML = pokeData.name[0].toUpperCase() + pokeData.name.slice(1);
    pokeInfo.append(pokeName);

    let pokeSprite = document.createElement('img');
    pokeSprite.src = pokeData.sprites["front_default"];
    pokeInfo.append(pokeSprite);

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

getPokemon();