document.addEventListener('DOMContentLoaded', function() {
    const quantityInput = document.getElementById('quantityInput');
    const searchButton = document.getElementById('searchButton');
    const pokemonContainer = document.getElementById('pokemonContainer');
    
    // Função para buscar Pokémon
    async function fetchPokemon(id) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            
            if (!response.ok) {
                throw new Error('Pokémon não encontrado');
            }
            
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    }
    
    // Função para obter a classe CSS baseada no tipo
    function getTypeClass(type) {
        return `type-${type.toLowerCase()}`;
    }
    
    // Função para exibir o Pokémon em um card
    function displayPokemon(pokemon) {
        if (!pokemon) return;
        
        const card = document.createElement('div');
        card.className = 'pokemon-card';
        
        const typeElements = pokemon.types.map(typeInfo => {
            const typeName = typeInfo.type.name;
            const typeElement = document.createElement('div');
            typeElement.className = `pokemon-type ${getTypeClass(typeName)}`;
            typeElement.textContent = typeName.charAt(0).toUpperCase() + typeName.slice(1);
            return typeElement.outerHTML;
        }).join('');
        
        card.innerHTML = `
            <div class="pokemon-id">#${pokemon.id.toString().padStart(3, '0')}</div>
            <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" 
                 alt="${pokemon.name}" 
                 class="pokemon-img">
            <h2 class="pokemon-name">${pokemon.name}</h2>
            ${typeElements}
        `;
        
        pokemonContainer.appendChild(card);
    }
    
    // Função para carregar os Pokémon
    async function loadPokemons(quantity) {
        pokemonContainer.innerHTML = '<p class="loading">Carregando Pokémon...</p>';
        
        // Validação do input
        if (quantity < 1 || quantity > 898) {
            pokemonContainer.innerHTML = '<p class="error-message">Por favor, digite um número entre 1 e 898</p>';
            return;
        }
        
        const pokemonPromises = [];
        
        // Busca os Pokémon de 1 até a quantidade especificada
        for (let i = 1; i <= quantity; i++) {
            pokemonPromises.push(fetchPokemon(i));
        }
        
        try {
            const pokemons = await Promise.all(pokemonPromises);
            
            // Limpa o container e exibe os Pokémon
            pokemonContainer.innerHTML = '';
            pokemons.forEach(pokemon => displayPokemon(pokemon));
            
            // Se nenhum Pokémon foi encontrado
            if (pokemons.every(p => p === null)) {
                pokemonContainer.innerHTML = '<p class="error-message">Nenhum Pokémon encontrado</p>';
            }
        } catch (error) {
            pokemonContainer.innerHTML = `<p class="error-message">Ocorreu um erro: ${error.message}</p>`;
        }
    }
    
    // Evento de clique no botão
    searchButton.addEventListener('click', function() {
        const quantity = parseInt(quantityInput.value);
        loadPokemons(quantity);
    });
    
    // Evento de pressionar Enter no input
    quantityInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const quantity = parseInt(quantityInput.value);
            loadPokemons(quantity);
        }
    });
    
    // Carrega os 10 primeiros Pokémon inicialmente
    loadPokemons(10);
});
