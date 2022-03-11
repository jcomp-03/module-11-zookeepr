const $animalForm = document.querySelector('#animals-form');
const $displayArea = document.querySelector('#display-area');

const printResults = resultArr => {
  console.log(resultArr);

  const animalHTML = resultArr.map(({ id, name, personalityTraits, species, diet }) => {
    return `
  <div class="col-12 col-md-5 mb-3">
    <div class="card p-3" data-id=${id}>
      <h4 class="text-primary">${name}</h4>
      <p>Species: ${species.substring(0, 1).toUpperCase() + species.substring(1)}<br/>
      Diet: ${diet.substring(0, 1).toUpperCase() + diet.substring(1)}<br/>
      Personality Traits: ${personalityTraits
        .map(trait => `${trait.substring(0, 1).toUpperCase() + trait.substring(1)}`)
        .join(', ')}</p>
    </div>
  </div>
    `;
  });

  $displayArea.innerHTML = animalHTML.join('');
};


// if nothing is passed into the formData object, the request
// will be simply GET /api/animals. This is what runs on load
const getAnimals = (formData = {}) => {

  let queryUrl = '/api/animals?';

  Object.entries(formData).forEach(([key, value]) => {
    if(Array.isArray(value)){
      for(let i = 0; i < value.length; i++){
        let trait = value[i];
        queryUrl += `${key}=${trait}&`; 
      }
    } else {
        queryUrl += `${key}=${value}&`;
    }
  });

  console.log(queryUrl);

  // standard fetch() usage for making a GET request
  fetch(queryUrl)
  .then(response => {
    // if the ok property of response is false, return the error alert
    if (!response.ok) {
      return alert('Error: ' + response.statusText);
    }
    // if everything's ok, parse the response into readable JSON
    return response.json();
  })
  .then(animalData => {
    console.log(animalData);
    printResults(animalData);
  });

};



const handleGetAnimalsSubmit = event => {
  // prevent the webpage from automatically refreshing
  event.preventDefault();
  // select all the radio inputs with name="diet"
  const dietRadioHTML = $animalForm.querySelectorAll('[name="diet"]');
  let diet;
  // cycle through the diet radio buttons and assign the value
  // of the selected radio button to the variable 'diet'
  for (let i = 0; i < dietRadioHTML.length; i += 1) {
    if (dietRadioHTML[i].checked) {
      diet = dietRadioHTML[i].value;
    }
  }

  if (diet === undefined) {
    diet = '';
  }

  const personalityTraitArr = [];
  // assign the selected traits in the form to the variable 'selectedTraits'
  const selectedTraits = $animalForm.querySelector('[name="personality"]').selectedOptions;
  // push the selected trait values to the array personalityTraitArr
  for (let i = 0; i < selectedTraits.length; i += 1) {
    personalityTraitArr.push(selectedTraits[i].value);
  }
  // join all the items in the array into one single string var 'personalityTraits
  // const personalityTraits = personalityTraitArr.join(',');
  const personalityTraits = personalityTraitArr;
  // package the var 'diet' and 'personalityTraits' as one single variable
  const animalObject = { diet, personalityTraits }; // passing in the array rather than the string
  // run the function getAnimals
  getAnimals(animalObject);
};

$animalForm.addEventListener('submit', handleGetAnimalsSubmit);

getAnimals();
