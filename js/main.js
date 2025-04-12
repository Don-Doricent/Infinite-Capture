document.querySelector('#get-media-button').addEventListener('click', getFetch);
document.querySelector('#random-button').addEventListener('click', getRandomFetch);

let typewriterTimeout; // Store the timeout to cancel ongoing typewriting

function getFetch() {
  const choice = document.querySelector('input').value;
  fetchData(choice);
}

function getRandomFetch() {
  const randomDate = getRandomDate();
  document.querySelector('#date-input').value = randomDate; // Update the date input to show the random date
  fetchData(randomDate); // Fetch and display data for the random date
}

function fetchData(date) {
  const url = `https://api.nasa.gov/planetary/apod?api_key=wWgf6W7bgpC4sCjbP6nqPVUAVUFQjuEg5I2jEW6R&date=${date}`;

  fetch(url)
    .then(res => res.json()) // Parse response as JSON
    .then(data => {
      console.log(data);

      if (data.media_type === 'image') {
        document.querySelector('img').src = data.hdurl;
        document.querySelector('iframe').style.display = 'none'; // Hide iframe if video was shown before
        document.querySelector('img').style.display = 'block';   // Show image
      } else if (data.media_type === 'video') {
        document.querySelector('iframe').src = data.url;
        document.querySelector('iframe').style.display = 'block'; // Show video
        document.querySelector('img').style.display = 'none';    // Hide image
      }

      // Apply the typewriter effect for the explanation text with a 0.5s delay
      const explanationText = data.explanation;
      resetTypewriter(); // Ensure previous typewriting is stopped

      setTimeout(() => {
        typeWriter(explanationText, "explanation-text", 50); // Adjust speed as desired
      }, 500); // Delay the start of the typewriter effect by 0.5 seconds
    })
    .catch(err => {
      console.log(`error ${err}`);
    });
}

function getRandomDate() {
  const start = new Date(1995, 5, 16); // June 16th, 1995 (Months are 0-based in JavaScript)
  const end = new Date(); // Today's date
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  const randomDate = new Date(randomTime);

  // Format the date to YYYY-MM-DD for the API
  const year = randomDate.getFullYear();
  const month = String(randomDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(randomDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function typeWriter(text, elementId, speed) {
  let i = 0;
  const targetElement = document.getElementById(elementId);
  targetElement.innerHTML = ""; // Clear previous content

  function type() {
    if (i < text.length) {
      targetElement.innerHTML += text.charAt(i); // Add each character one at a time
      i++;
      typewriterTimeout = setTimeout(type, speed); // Store timeout ID
    }
  }

  type();
}

function resetTypewriter() {
  clearTimeout(typewriterTimeout); // Clear any ongoing typewriter effect
  const targetElement = document.getElementById("explanation-text");
  targetElement.innerHTML = ""; // Clear the text content before starting a new explanation
}

document.addEventListener('DOMContentLoaded', function() {
  const iframe = document.querySelector('iframe'); // Select your iframe
  iframe.classList.add('fade-in'); // Add the fade-in class

  // Use a timeout to add the show class after 100ms (adjust as needed)
  setTimeout(() => {
    iframe.classList.add('show'); // Add the show class to trigger the fade-in effect
  }, 100);
});