document.getElementById("search-input").addEventListener("input", processSearch);
let recentComparisons = []

function processSearch(event) {
    var searchValue = event.target.value;
    console.log(searchValue);
    search(searchValue);
  }
  
function search(searchValue) {
    let filteredByName = [];
    if (!searchValue) {
        filteredByName = [...characterList];
    } else {
        filteredByName = characterList.filter(function(character) {
            return character.name.toLowerCase().includes(searchValue.toLowerCase());
        });
    }
    displayedList = filterByAttributes(filteredByName);
    refreshPage();
}

let selectedCharacters = []

function refreshPage() {
    var table = document.getElementById('character-table');
    while (table.rows.length > 1) {
        table.deleteRow(1);
    }

    if (displayedList.length === 0) {
        var row = table.insertRow(-1);
        var cell = row.insertCell(0);
        cell.textContent = "No characters found matching the criteria.";
    } else {
        displayedList.forEach(function (character, index) {
            var row = table.insertRow(-1);
            var name = row.insertCell(0);
            name.textContent = character.name;
            var strength = row.insertCell(1);
            strength.textContent = character.strength;
            var speed = row.insertCell(2);
            speed.textContent = character.speed;
            var skill = row.insertCell(3);
            skill.textContent = character.skill;
            var fearFactor = row.insertCell(4);
            fearFactor.textContent = character.fear_factor;
            var power = row.insertCell(5);
            power.textContent = character.power;
            var intelligence = row.insertCell(6);
            intelligence.textContent = character.intelligence;
            var wealth = row.insertCell(7);
            wealth.textContent = character.wealth;
            var selected = row.insertCell(8);
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = 'char-' + index;
            checkbox.checked = selectedCharacters.includes('character-' + index);
            checkbox.onchange = handleCheckboxChange;
            selected.appendChild(checkbox);
        });
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = selectedCharacters.includes(checkbox.id);
        });
    }
}

function updateCharacterInfoDisplay() {
    const character1Photo = document.getElementById('character1-photo');
    const character2Photo = document.getElementById('character2-photo');
    const nameContainer1 = document.getElementById('name-container1').querySelector('h3');
    const nameContainer2 = document.getElementById('name-container2').querySelector('h3');
    const character2Placeholder = document.getElementById('character2-placeholder');

    // Clear existing display
    character1Photo.style.display = 'block';
    character2Photo.style.display = 'block';
    character2Placeholder.style.display = 'block';
    nameContainer1.textContent = '';
    nameContainer2.textContent = '';

    if (selectedCharacters.length >= 1) {
        const char1Index = parseInt(selectedCharacters[0].split('-')[1]);
        const character1 = displayedList[char1Index];
        character1Photo.src = `images/${character1.name.toLowerCase().replace(/\s+/g, '')}.jpg`;
        character1Photo.style.display = 'block';
        nameContainer1.textContent = character1.name;

        if (selectedCharacters.length < 2) {
            nameContainer2.textContent = 'Unknown';
            character2Photo.src = 'images/question_mark.jpg';
            character2Photo.style.display = 'block';
        } else if (selectedCharacters.length == 2) {
            const char2Index = parseInt(selectedCharacters[1].split('-')[1]);
            const character2 = displayedList[char2Index];
            character2Photo.src = `images/${character2.name.toLowerCase().replace(/\s+/g, '')}.jpg`;
            character2Photo.style.display = 'block';
            nameContainer2.textContent = character2.name;
        }
    } else if(selectedCharacters.length == 0) {
        nameContainer1.textContent = 'Unknown';
        character1Photo.src = 'images/question_mark.jpg';
        nameContainer2.textContent = 'Unknown';
        character2Photo.src = 'images/question_mark.jpg';
    } else {
        nameContainer1.textContent = 'No characters found';
        nameContainer2.textContent = 'No characters found';
    }
}


function updateAttributesComparison() {
    const attributesContainer1 = document.getElementById('attributes-container1');
    const attributesContainer2 = document.getElementById('attributes-container2');
    const attributesContainer3 = document.getElementById('attributes-container3');
    let ticksCount1 = 0;
    let ticksCount2 = 0;

    attributesContainer1.innerHTML = '';
    attributesContainer2.innerHTML = '';
    attributesContainer3.innerHTML = '';

    if (selectedCharacters.length === 2) {
        const char1Index = parseInt(selectedCharacters[0].split('-')[1]);
        const character1 = displayedList[char1Index];
        const char2Index = parseInt(selectedCharacters[1].split('-')[1]);
        const character2 = displayedList[char2Index];
        const comparisonResult = {
            character1: {
                name: character1.name,
            },
            character2: {
                name: character2.name,
            }
        };
        recentComparisons.unshift(comparisonResult);
        updatePreviousComparisonsDisplay();

        const attributes = ['strength', 'speed', 'skill', 'fear_factor', 'power', 'intelligence', 'wealth'];
        attributes.forEach(attr => {
            const value1 = character1[attr];
            const value2 = character2[attr];
            let mark1 = '', mark2 = '';

            if (value1 > value2) {
                mark1 = '✔';
                mark2 = '&nbsp;'
                ticksCount1++;
            } else if (value1 < value2) {
                mark2 = '✔';
                mark1 = '&nbsp;';
                ticksCount2++;
            } else {
                if (Math.random() < 0.5) {
                    mark1 = '✔';
                    mark2 = '&nbsp;'
                    ticksCount1++;
                } else {
                    mark2 = '✔';
                    mark1 = '&nbsp;';
                    ticksCount2++;
                }
            }

            attributesContainer1.innerHTML += `<p>${mark1}</p>`;
            attributesContainer2.innerHTML += `<p>${mark2}</p>`;
            attributesContainer3.innerHTML += `<p>${attr}</p>`;
        });


        updateBackgroundColors(ticksCount1, ticksCount2);
    }
}

function updateComparisonDisplay() {
    const comparisonContainer = document.getElementById('comparison-container');
    
    if (selectedCharacters.length < 1) {

        comparisonContainer.style.display = 'block';
    } else {
        comparisonContainer.style.display = 'block';
        
        updateCharacterInfoDisplay();
        updateAttributesComparison();
    }
}

function handleCheckboxChange(event) {
    const charId = event.target.id;
    if (event.target.checked) {
        if (selectedCharacters.length < 2) {
            selectedCharacters.push(charId);
        } else {
            alert("Only 2 characters can be selected for comparison.");
            event.target.checked = false;
            return;
        }
    } else {
        selectedCharacters = selectedCharacters.filter(id => id !== charId);
    }
    updateComparisonDisplay()
}

function updatePreviousComparisonsDisplay() {
    console.log("updatePreviousComparisonsDisplay is called");
    const container = document.getElementById('comparisons-list');
    container.innerHTML = '';
    recentComparisons.forEach((result, index) => {
        const comparisonDiv = document.createElement('div');
        comparisonDiv.className = 'previous-comparison';
        comparisonDiv.innerHTML = `
            <p>${result.character1.name}&nbsp;&nbsp;&nbsp;&nbsp;${result.character2.name}</p>
            <button class="recompare-button" data-index="${index}">Recompare</button>
        `;
        container.appendChild(comparisonDiv);
    });

    document.querySelectorAll('.recompare-button').forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'), 10);
            recompareCharacters(index);
        });
    });
}


function recompareCharacters(comparisonIndex) {
    const comparison = recentComparisons[comparisonIndex];
    const char1Index = displayedList.findIndex(character => character.name === comparison.character1.name);
    const char2Index = displayedList.findIndex(character => character.name === comparison.character2.name);

    selectedCharacters = [];
    if (char1Index !== -1) selectedCharacters.push(`char-${char1Index}`);
    if (char2Index !== -1) selectedCharacters.push(`char-${char2Index}`);

    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = selectedCharacters.includes(checkbox.id);
    });

    updateComparisonDisplay();
}



function updateBackgroundColors(ticksCount1, ticksCount2) {
    const character1Info = document.getElementById('attributes-container1');
    const character2Info = document.getElementById('attributes-container2');

    character1Info.style.backgroundColor = 'darkgray';
    character2Info.style.backgroundColor = 'darkgray';

    if (selectedCharacters.length === 2) {
        if (ticksCount1 > ticksCount2) {
            character1Info.style.backgroundColor = 'green';
            character2Info.style.backgroundColor = 'red';
        } else if (ticksCount1 < ticksCount2) {
            character1Info.style.backgroundColor = 'red';
            character2Info.style.backgroundColor = 'green';
        }
    }
}


function getJsonObject(path, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
              if (success) success(JSON.parse(xhr.responseText));
          } else {
              if (error) error(xhr);
          }
      }
  };
  xhr.open("GET", path, true);
  xhr.send();
}

characterList = []; // character list container
displayedList = [];characterList
getJsonObject('data.json',
    function(data) {
        characterList = data.Characters; // store the character list into characterList
        displayedList = [...characterList];
        console.log(characterList); // print it into console (developer tools)
        console.log(characterList[0]); // print the first character object to the console 
        refreshPage();
    },
    function(xhr) { console.error(xhr); }
);

function updateOutput(inputId, outputId) {
    const input = document.getElementById(inputId);
    const output = document.getElementById(outputId);
    output.textContent = input.value;
    input.oninput = function() {
        output.value = this.value;
    };
}



document.addEventListener('DOMContentLoaded', function() {
    const rangeInputs = document.querySelectorAll('input[type="range"]');
    rangeInputs.forEach(function(input) {
        const outputId = input.id + '-output';
        updateOutput(input.id, outputId);
        input.addEventListener('input', function() {
            updateOutput(input.id, outputId);
            const searchValue = document.getElementById("search-input").value;
            search(searchValue);
        });
    });
});


function filterByAttributes(characterList) {
    const filters = {
        strength: { min: parseInt(document.getElementById('strength-min').value, 10), max: parseInt(document.getElementById('strength-max').value, 10) },
        speed: { min: parseInt(document.getElementById('speed-min').value, 10), max: parseInt(document.getElementById('speed-max').value, 10) },
        skill: { min: parseInt(document.getElementById('skill-min').value, 10), max: parseInt(document.getElementById('skill-max').value, 10) },
        fear_factor: { min: parseInt(document.getElementById('fearFactor-min').value, 10), max: parseInt(document.getElementById('fearFactor-max').value, 10) },
        power: { min: parseInt(document.getElementById('power-min').value, 10), max: parseInt(document.getElementById('power-max').value, 10) },
        intelligence: { min: parseInt(document.getElementById('intelligence-min').value, 10), max: parseInt(document.getElementById('intelligence-max').value, 10) },
        wealth: { min: parseInt(document.getElementById('wealth-min').value, 10), max: parseInt(document.getElementById('wealth-max').value, 10) },
    };

    return characterList.filter(character => {
        return Object.keys(filters).every(attr => {
            if (!character.hasOwnProperty(attr)) return true;
            const value = character[attr];
            const filter = filters[attr];
            return value >= filter.min && value <= filter.max;
        });
    });
}
  
document.addEventListener('DOMContentLoaded', function() {
    function attachSliderOutput(sliderId, outputId) {
        const slider = document.getElementById(sliderId);
        const output = document.getElementById(outputId);

        function updateSliderOutput() {
            const sliderValue = slider.value;
            output.textContent = sliderValue;
            const percent = sliderValue / (slider.max - slider.min);
            const width = slider.offsetWidth;
            const outputPosition = percent * width;
            output.style.left = `${slider.offsetLeft + outputPosition - output.offsetWidth / 2}px`;
            output.style.top = `${slider.offsetTop - 20}px`;
        }

        slider.addEventListener('input', updateSliderOutput);
        updateSliderOutput();
    }

    const sliders = [
        {slider: "strength-min", output: "strength-min-output"},
        {slider: "strength-max", output: "strength-max-output"},
        {slider: "speed-min", output: "speed-min-output"},
        {slider: "speed-max", output: "speed-max-output"},
        {slider: "skill-min", output: "skill-min-output"},
        {slider: "skill-max", output: "skill-max-output"},
        {slider: "fearFactor-min", output: "fearFactor-min-output"},
        {slider: "fearFactor-max", output: "fearFactor-max-output"},
        {slider: "power-min", output: "power-min-output"},
        {slider: "power-max", output: "power-max-output"},
        {slider: "intelligence-min", output: "intelligence-min-output"},
        {slider: "intelligence-max", output: "intelligence-max-output"},
        {slider: "wealth-min", output: "wealth-min-output"},
        {slider: "wealth-max", output: "wealth-max-output"}
    ];

    sliders.forEach(({ slider, output }) => attachSliderOutput(slider, output));
});


