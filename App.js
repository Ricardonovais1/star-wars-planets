;(function() {
    'use strict'

    const planets = document.querySelectorAll('.planet');
    const planetsArray = Array.from(planets);
    const popupWrapper = document.querySelector('.popup-wrapper')
    const planetNamePopup = document.querySelector('.planet-name');
    const planetClimate = document.querySelector('.planet-climate');
    const planetPopulation = document.querySelector('.planet-population');
    const planetTerrain = document.querySelector('.planet-terrain');
    const searchPlanet = document.querySelector('.search-input');
    const btn = document.querySelector('.btn');
    const celebTitle = document.querySelector('.celeb-title');
    const residentsTbl = document.querySelector('.residents-tbl');
    const errorMessage = document.querySelector('.error');
    const search = document.querySelector('.search');


    searchPlanet.focus();

    search.style.width = `${planets.offsetWidth}px`;

    async function printPlanets() {

        let response = await fetch('https://swapi.dev/api/planets/');

        let {results} = await response.json();

        planetsArray.forEach(planet => {
            planet.addEventListener('click', () => {
                let planetName = planet.firstElementChild;

                planetsArray.forEach(p => {
                    p.classList.remove('whiteColor');
                    p.firstElementChild.classList.remove('blackColor');
                });

                let index = planetsArray.indexOf(planet)

                planet.classList.add('whiteColor');
                planetName.classList.add('blackColor');
                popupWrapper.classList.remove('show-hide');
                searchPlanet.value = '';

                displayPopupText(results, index)
            });
    });

        btn.addEventListener('click', () => {

            planetsArray.forEach(p => {
                p.classList.remove('whiteColor');
                p.firstElementChild.classList.remove('blackColor');
            });

            let planetSearched = searchPlanet.value;

            let resultsArray = Array.from(results);

            resultsArray.forEach((planet, i) => {
                if (planetSearched.toLowerCase() == planet.name.toLowerCase()){

                    popupWrapper.classList.remove('show-hide');

                    displayPopupText(results, i);
                } else {
                    errorMessage.classList.remove('show-hide');
                };
            });
        });
    };

    printPlanets()

    function displayPopupText(results, index) {

        celebTitle.textContent = '';

        planetNamePopup.textContent = results[index].name;

        let climate = results[index].climate;
        planetClimate.textContent = climate.charAt(0).toUpperCase() + climate.slice(1);

        planetPopulation.textContent = results[index].population;

        let terrain = results[index].terrain;
        planetTerrain.textContent = terrain.charAt(0).toUpperCase() + terrain.slice(1);

        while (residentsTbl.firstChild) {
            residentsTbl.removeChild(residentsTbl.firstChild);
        }
        document.querySelector('.division-line').classList.add('show-hide');

        if (results[index].residents.length > 0) {
            document.querySelector('.division-line').classList.remove('show-hide');

            celebTitle.textContent = `Celebridades do planeta ${results[index].name}:`;
            let tableHead = document.createElement('tr');
            residentsTbl.appendChild(tableHead);

            let tableHeadName = document.createElement('th');
            tableHeadName.textContent = 'Nome';
            tableHead.appendChild(tableHeadName);

            let tableHeadBirth = document.createElement('th');
            tableHeadBirth.textContent = 'Nascimento';
            tableHead.appendChild(tableHeadBirth);
        };


        let residents = Array.from(results[index].residents);


        residents.forEach(resident => {
            printResidents(resident)
        });
    };

    async function printResidents(link) {
          let responseResident = await fetch(link);
          let data = await responseResident.json();

          let line = document.createElement('tr');
          residentsTbl.appendChild(line);

          let residentName = document.createElement('td');
          residentName.className = 'resident-name';
          residentName.textContent = data.name;
          line.appendChild(residentName);

          let residentBirth = document.createElement('td');
          residentBirth.className = 'resident-year';
          residentBirth.textContent = data.birth_year;
          line.appendChild(residentBirth);
    };


    popupWrapper.addEventListener('click', (e) => {
          const clickedElement = e.target.classList[0];
          const classesToClose = ['popup-wrapper', 'modal-close'];
          const shouldClosePopup = classesToClose.some(classClose => classClose === clickedElement);

          if (shouldClosePopup) {
            popupWrapper.classList.add('show-hide');
            errorMessage.classList.add('show-hide');
            searchPlanet.value = '';
            searchPlanet.focus();
          };
    });
})()