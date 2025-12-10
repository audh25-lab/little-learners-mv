// Auto-load A–Z uppercase letter images
const lettersContainer = document.getElementById("letters-container");

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

letters.forEach(letter => {
    const imgCard = document.createElement("div");
    imgCard.className = "letter-card";

    const img = document.createElement("img");
    img.src = `assets/letters/uppercase/${letter}.PNG`;
    img.alt = letter;

    const label = document.createElement("p");
    label.textContent = letter;

    imgCard.appendChild(img);
    imgCard.appendChild(label);
    lettersContainer.appendChild(imgCard);
});
