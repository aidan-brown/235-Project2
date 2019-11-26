// Gen enum that allows for easy filtering
const gen = {
    I : 151,
    II : 251,
    III : 386,
    IV : 493,
    V : 649,
    VI : 721,
    VII : 802
}

// Type color enum that allows for easy styling based on the type of pokemon
const typeColors = {
    water : 'slateblue',
    fire : 'orange',
    grass : 'lightgreen',
    normal : 'lightgrey',
    rock : 'burlywood',
    poison : 'purple',
    flying : 'skyblue',
    bug : 'green',
    electric : 'yellow',
    ground : 'goldenrod',
    fairy : 'pink',
    psychic : 'violet',
    steel : 'grey',
    dark : 'darkslategrey',
    ghost : 'darkviolet',
    fighting : 'darkred',
    ice : 'cyan',
    dragon : 'orangered'
}

// Function to get all the pokemon's names and urls
function getPokemon(){
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}`;

    let req = new XMLHttpRequest();

    req.open('get', url, false);
    req.send();

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

// Function to get all the pokemon abilities and store them in the local storage
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
            dataReq.open('get', ability.url, false);
            dataReq.send();
        }

        localStorage.setItem('afb3535-abilities', JSON.stringify(pokemonAbilities));
    };
    req.open('get', `https://pokeapi.co/api/v2/ability?limit=${abilityLimit}`, true);
    req.send();
}

// Function to create a pokemon element and set the name and url appropriately
function createPokeElement(pokeData, id){
    let pokeElement = {name: pokeData.name[0].toUpperCase() + pokeData.name.slice(1), url: pokeData.url, data: null};
    if(pokeElement.name[pokeElement.name.length - 2] == '-'){
        pokeElement.name = pokeElement.name.slice(0, pokeElement.name.length - 1) + pokeElement.name[pokeElement.name.length - 1].toUpperCase();
    }
    pokeElements[id] = pokeElement;
}

// Function to get the data of each pokemon and append it to the end of the appropriate pokemon element. Also stores the pokemon elements in the local storage
async function getPokeData(){
    const p = getPokemon();
    await p;
    
    updateLinks(currentSearchTerm, currentGen, currentType1, currentType2);

    for(let i = 1; i < pokeElements.length; i++){
        let req = new XMLHttpRequest();

        req.onload = () => {
            setData(i, JSON.parse(req.responseText));
        };
        req.open('get', pokeElements[i].url, false);
        req.send();
    }

    localStorage.setItem('afb3535-elements', JSON.stringify(pokeElements));

    getAbilities();
}

// Function that appends data to the pokemon element at the given index
function setData(index, data){
    pokeElements[index].data = {abilities: data.abilities, id: data.id, species: data.species, stats: data.stats, types: data.types, sprites: {front_default: data.sprites['front_default']}};
}

// Function that updates the display given a pokemon at a certain index
function updateDisplay(index){
    let currentPokemon = pokeElements[index];

    let pokeName = document.querySelector('.poke-name');
    let name = '';
    if(currentPokemon.data){
        name = currentPokemon.data.species.name[0].toUpperCase() + currentPokemon.data.species.name.slice(1);
    }
    else{
        name = currentPokemon.name[0].toUpperCase() + currentPokemon.name.slice(1);
    }
    
    while(name.indexOf('-') != -1){
        let hyIndex = name.indexOf('-');

        name = name.slice(0, hyIndex) + ' ' + name[hyIndex + 1].toUpperCase() + name.slice(hyIndex + 2);
    }

    if(currentPokemon.data){
        if(currentPokemon.name.toLowerCase() != currentPokemon.data.species.name.toLowerCase()){
            let form = currentPokemon.name.slice(currentPokemon.data.species.name.length + 1);
            form = `(${form[0].toUpperCase() + form.slice(1)} Form)`;
    
            name += ` ${form}`;
        }
    }

    pokeName.innerHTML = name;

    let pokeWiki = document.querySelector('.poke-wiki');
    let linkName = '';
    if(currentPokemon.data){
        linkName = currentPokemon.data.species.name.toLowerCase();
    }
    else{
        linkName = currentPokemon.name.toLowerCase();
    }

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
        pokeStats.innerHTML = `
        <div><p>HP:</p><p>${currentPokemon.data.stats[5].base_stat}</p></div>
        <div><p>Attack:</p><p>${currentPokemon.data.stats[4].base_stat}</p></div>
        <div><p>Defense:</p><p>${currentPokemon.data.stats[3].base_stat}</p></div>
        <div><p>SP. ATK:</p><p>${currentPokemon.data.stats[2].base_stat}</p></div>
        <div><p>SP. DEF:</p><p>${currentPokemon.data.stats[1].base_stat}</p></div>
        <div><p>Speed:</p><p>${currentPokemon.data.stats[0].base_stat}</p></div>
        `;

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
    }

    if(currentPokemon.data.types.length > 1){
        document.querySelectorAll('.poke-display>div').forEach(element => element.style.borderColor = typeColors[currentPokemon.data.types[1].type.name]);
        document.querySelector('.poke-sprite p').style.backgroundColor = typeColors[currentPokemon.data.types[1].type.name];
        document.querySelector('.poke-wiki').style.backgroundColor = typeColors[currentPokemon.data.types[1].type.name];
    }
    else{
        document.querySelectorAll('.poke-display>div').forEach(element => element.style.borderColor = typeColors[currentPokemon.data.types[0].type.name]);
        document.querySelector('.poke-sprite p').style.backgroundColor = typeColors[currentPokemon.data.types[0].type.name];
        document.querySelector('.poke-wiki').style.backgroundColor = typeColors[currentPokemon.data.types[0].type.name];
    }
}

// Function that updates the list of pokemon based on certain filters
function updateLinks(name, gen, type1, type2){
    let pokeLinks = document.querySelector('.poke-links');
    pokeLinks.innerHTML = '';
    for(let i = 1; i < pokeElements.length; i++){
        if(filterPokemon(i, name, gen, type1, type2)){
            let pokeLink = document.createElement('p');

            let name = pokeElements[i].name[0].toUpperCase() + pokeElements[i].name.slice(1);
            while(name.indexOf('-') != -1){
                let hyIndex = name.indexOf('-');

                name = name.slice(0, hyIndex) + ' ' + name[hyIndex + 1].toUpperCase() + name.slice(hyIndex + 2);
            }
            pokeLink.innerHTML = `#${i}<br/>${name}`;

            pokeLink.className = 'poke-link';
            pokeLink.onclick = () => {
                currentId = i;
                updateDisplay(currentId);

                for(let i = 0; i < links.length; i++){
                    if(links[i] == pokeLink){
                        currentIndex = i;
                        break;
                    }
                }

                for(let link of links){
                    link.style.color = 'darkslateblue';
                }

                pokeLink.style.color = 'slateblue';
            }

            pokeLinks.append(pokeLink);
        }
    }

    links = document.querySelectorAll('.poke-link');
}

// Function that filters pokemon based on a search term, generation, primary type, and secondary type
function filterPokemon(pokemonId, name, generation, type1, type2){
    let pokemon = pokeElements[pokemonId];
    if(!name && generation == 'none' && type1 == 'none' && type2 == 'none'){
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

        if(name && !pokemon.name.toLowerCase().includes(name.toLowerCase())){
            check = false;
        }

        return check;
    }
}

// Function that resets the display so that it is blank
function resetDisplay(){
    let wiki = document.querySelector('.poke-wiki');
    let name = document.querySelector('.poke-name');
    let sprite = document.querySelector('.poke-sprite');
    let types = document.querySelector('.poke-types');
    let stats = document.querySelector('.poke-stats');
    let abilities = document.querySelector('.poke-abilities');

    wiki.style.background = 'none';
    wiki.href = '#';
    name.innerHTML = '';
    sprite.style.backgroundImage = 'none';
    sprite.style.borderColor = 'rgba(0, 0, 0, 0)';
    sprite.innerHTML = '';
    types.innerHTML = '';
    stats.style.borderColor = 'rgba(0, 0, 0, 0)';
    stats.innerHTML = '';
    abilities.style.borderColor = 'rgba(0, 0, 0, 0)';
    abilities.innerHTML = '';
}

// Defines variables that are used throughout the app
let pokeElements = new Array();
let limit = 802;

let pokemonAbilities = {};
let abilityLimit = 233;

let content = document.querySelector('#content');

let displayDefaultStyle = document.querySelector('.poke-display').style;

let links = null;

let currentIndex = 0;
let currentGen = 'none';
let currentType1 = 'none';
let currentType2 = 'none';
let currentSearchTerm = '';

let buttons = document.querySelector('.buttons');
let forwardArrow = document.querySelector('.page-forward');
let backArrow = document.querySelector('.page-back');
let upArrow = document.querySelector('.page-up');
let downArrow = document.querySelector('.page-down');

let genSelect = document.querySelector('#gen');
let typeSelect1 = document.querySelector('#type1');
let typeSelect2 = document.querySelector('#type2');
let searchInput = document.querySelector('#search')

// Sets the mouse events for each of the 4 buttons
forwardArrow.onmousedown = () => {
    buttons.style.backgroundImage = 'url(../images/buttons-shadow-pressed-right.svg)';

    if(links.length > currentIndex){
        currentIndex++;

        links[currentIndex].click();
    }
};

forwardArrow.onmouseup = () => {
    buttons.style.backgroundImage = 'url(../images/buttons-shadow.svg)';
};

backArrow.onmousedown = () => {
    buttons.style.backgroundImage = 'url(../images/buttons-shadow-pressed-left.svg)';

    if(0 < currentIndex){
        currentIndex--;

        links[currentIndex].click();
    }
};

backArrow.onmouseup = () => {
    buttons.style.backgroundImage = 'url(../images/buttons-shadow.svg)';
};

upArrow.onmousedown = () => {
    buttons.style.backgroundImage = 'url(../images/buttons-shadow-pressed-up.svg)';

    if(1 < currentIndex){
        currentIndex -= 2;

        links[currentIndex].click();
    }
};

upArrow.onmouseup = () => {
    buttons.style.backgroundImage = 'url(../images/buttons-shadow.svg)';
};

downArrow.onmousedown = () => {
    buttons.style.backgroundImage = 'url(../images/buttons-shadow-pressed-down.svg)';

    if(links.length - 1 > currentIndex){
        currentIndex += 2;

        links[currentIndex].click();
    }
};

downArrow.onmouseup = () => {
    buttons.style.backgroundImage = 'url(../images/buttons-shadow.svg)';
};

// Sets on change events that update the list of pokemon based on the values of the filters
genSelect.onchange = () => {
    currentGen = genSelect.value;
    updateLinks(currentSearchTerm, currentGen, currentType1, currentType2);

    links = document.querySelectorAll('.poke-link');
    currentIndex = 0;
    if(links.length > 0){
        links[currentIndex].click();
    }
    else{
        resetDisplay();
    }
};

typeSelect1.onchange = () => {
    currentType1 = typeSelect1.value;
    updateLinks(currentSearchTerm, currentGen, currentType1, currentType2);

    links = document.querySelectorAll('.poke-link');
    currentIndex = 0;
    if(links.length > 0){
        links[currentIndex].click();
    } 
    else{
        resetDisplay();
    }
}

typeSelect2.onchange = () => {
    currentType2 = typeSelect2.value;
    updateLinks(currentSearchTerm, currentGen, currentType1, currentType2);

    links = document.querySelectorAll('.poke-link');
    currentIndex = 0;
    if(links.length > 0){
        links[currentIndex].click();
    } 
    else{
        resetDisplay();
    }
}

searchInput.oninput = () => {
    currentSearchTerm = searchInput.value;
    updateLinks(currentSearchTerm, currentGen, currentType1, currentType2);

    links = document.querySelectorAll('.poke-link');
    currentIndex = 0;
    if(links.length > 0){
        links[currentIndex].click();
    } 
    else{
        resetDisplay();
    }
};

// If the data hasn't been stored yet getPokeData() is called, otherwise the localStorage items are used
if(!JSON.parse(localStorage.getItem('afb3535-abilities')) || !JSON.parse(localStorage.getItem('afb3535-elements'))){
    getPokeData();
}
else{
    pokemonAbilities = JSON.parse(localStorage.getItem('afb3535-abilities'));
    pokeElements = JSON.parse(localStorage.getItem('afb3535-elements'));

    updateLinks(currentSearchTerm, currentGen, currentType1, currentType2);
}
