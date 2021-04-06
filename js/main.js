(() => {
  const wrapper = document.querySelector('.field');
  const startButton = document.querySelector('.start-btn');
  const gridSizeInput = document.querySelector('.grid-size-input');
  const counter = document.querySelector('.counter');
  let timer;

  startButton.addEventListener('click', function(e) {
    e.preventDefault();
    resizeFieldGrid();
    unlockField();
    timer = setInterval(count, 1000);
    startButton.innerText = 'начать заново';
  });

  function createCard(cardFront) {
    const card = document.createElement('div');
    const backFace = document.createElement('div');
    const frontFace = document.createElement('div');

    card.classList.add('card');
    backFace.classList.add('back-face');
    frontFace.classList.add('front-face');

    card.addEventListener('click', flipCard(card));

    card.append(backFace);
    card.append(frontFace);

    frontFace.textContent = cardFront;
    card.dataset.number = cardFront;

    return card;
  }

  function createCards(gridSize = 4) {
    const container = document.querySelector('.container');
    container.style.maxWidth = calcContainerWidth(gridSize);
    const cardFrontFaces = generateCardFrontFacesArr(gridSize);

    for (let i = 0; i < cardFrontFaces.length; i++) {
      const card = createCard(cardFrontFaces[i]);
      wrapper.append(card);
    }
  }

  function flipCard (card) {
    return () => {
      card.classList.toggle('flip');
      checkForMatch();
    };
  }

  function generateCardFrontFacesArr(initialAmount) {
    const frontFacesArr = [];
    let amount;

    if (initialAmount >= 2 && initialAmount <= 10 && initialAmount % 2 === 0) {
      amount = initialAmount ** 2;
      gridSizeInput.value = initialAmount;
    } else {
      amount = 4 ** 2;
      gridSizeInput.value = 4;
    }

    for (let i = 1; i <= amount / 2; i++) {
      for (let j = 0; j < 2; j++) {
        frontFacesArr.push(i);
      }
    }

    return shuffleCards(frontFacesArr);
  }

  function shuffleCards(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function checkForMatch() {
    const flippedCards = document.querySelectorAll('.flip');
    const firstCard = flippedCards[0];
    const secondCard = flippedCards[1];

    if (flippedCards.length === 2) {
      lockField();
      if (firstCard.dataset.number === secondCard.dataset.number) {

        firstCard.removeEventListener('click', flipCard(firstCard));
        secondCard.removeEventListener('click', flipCard(secondCard));

        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        checkAllCards();

      } else {
        setTimeout(() => {
          firstCard.classList.remove('flip');
          secondCard.classList.remove('flip');
        }, 1000);
      }
      setTimeout(() => {
        unlockField();
      }, 1000);
    }
  }

  function lockField() {
    wrapper.classList.add('locked');
  }

  function unlockField() {
    wrapper.classList.remove('locked');
  }

  function clearField(gridSize = 4) {
    wrapper.innerHTML = '';
    if (timer) {
      clearInterval(timer);
    }
    counter.innerHTML = 60;
    createCards(gridSize);
  }

  function count () {
    let currentCounterValue = parseInt(counter.innerText);
    if (currentCounterValue < 1) {
      clearInterval(timer);
      lockField();
      startButton.innerText = 'начать игру';
    } else {
      currentCounterValue--;
      counter.innerHTML = currentCounterValue;
    }
  }

  function calcContainerWidth (gridSize) {
    const validGridSize = gridSize >= 2 && gridSize <= 10 && gridSize % 2 === 0 ? gridSize : 4;
    return 150 * validGridSize + 10 * (validGridSize + 1) + 'px';
  }

  function resizeFieldGrid () {
    let userGridSize = parseInt(gridSizeInput.value);
    clearField(userGridSize);
  }

  function checkAllCards() {
    if (Array.from(wrapper.querySelectorAll('.card')).every(card => card.classList.contains('matched'))) {
      clearInterval(timer);
      lockField();
    }
  }

  createCards();

})();

