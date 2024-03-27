const continentSelect = document.getElementById('continent-select')
const countryList = document.getElementById('countries-list')

queryFetch(`
query {
    continents {
        name, code
    }
}
`, { code: "" }).then(data => {
    console.log(data, 'data');
    data.data.continents.forEach(continent => {
        const option = document.createElement('option')
        option.value = continent.code
        option.innerText = continent.name
        continentSelect.append(option)
    })
})

continentSelect.addEventListener('change', (e) => {
    console.log('event listener invoked');
    const continentCode = e.target.value
    getCountries(continentCode).then((countries) => {
        console.log(countries, 'countries');
        countryList.innerHTML = ''
        countries.forEach(country => {
            const element = document.createElement('div')
            element.innerText = country.name
            countryList.append(element)
        })
    })
})

async function getCountries(continentCode) {
    return queryFetch(`
        query getCountries($code: ID!) {
            continent(code: $code) {
                countries {
                    name
                }
            }
        }
    
    `, { code: continentCode })
    .then(data => data.data.continent.countries)
}

async function queryFetch(query, variables) {
    return await fetch('https://countries.trevorblades.com/', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables })
    }).then(res => res.json())
}