const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false';

document.addEventListener('DOMContentLoaded', () => {
    fetchDataWithThen();
    document.getElementById('search').addEventListener('input', searchHandler);
    document.getElementById('sortByMktCap').addEventListener('click', () => sortTable('market_cap'));
    document.getElementById('sortByPercentage').addEventListener('click', () => sortTable('price_change_percentage_24h'));
});

// Fetch data using .then
function fetchDataWithThen() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => renderTable(data))
        .catch(error => console.error('Error fetching data with then:', error));
}

// Fetch data using async/await
async function fetchDataWithAsyncAwait() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error('Error fetching data with async/await:', error);
    }
}

// Render data in the table
function renderTable(data) {
    const tableBody = document.querySelector('#cryptoTable tbody');
    tableBody.innerHTML = '';
    data.forEach(coin => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${coin.image}" alt="${coin.name}" class="coin-image">${coin.name}</td>
            <td>${coin.symbol.toUpperCase()}</td>
            <td>$${coin.current_price.toLocaleString()}</td>
            <td>$${coin.total_volume.toLocaleString()}</td>
            <td class="${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
                ${coin.price_change_percentage_24h.toFixed(2)}%
            </td>
            <td>$${coin.market_cap.toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Search and filter the data
function searchHandler(event) {
    const searchValue = event.target.value.toLowerCase();
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(coin => 
                coin.name.toLowerCase().includes(searchValue) || 
                coin.symbol.toLowerCase().includes(searchValue)
            );
            renderTable(filteredData);
        })
        .catch(error => console.error('Error during search:', error));
}

// Sort the table based on the provided key
function sortTable(key) {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.sort((a, b) => b[key] - a[key]);
            renderTable(data);
        })
        .catch(error => console.error('Error during sort:', error));
}
