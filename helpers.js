function createAnimeCard(anime, listeners) {
  const card = document.createElement('div')
  card.classList.add('body__card')
  card.append(createCardImage(anime.image, listeners.close))
  card.append(createCardDetails(anime, listeners.ratingListeners))

  return card
}

function createCardImage(image, closeListener) {
  const cardImage = document.createElement('div')
  cardImage.classList.add('card__image')
  if (image) cardImage.style.backgroundImage = `url(${image})`
  cardImage.append(createCloseButton(closeListener))

  return cardImage
}

function createCardDetails(anime, ratingListeners) {
  const details = document.createElement('div')
  details.classList.add('card__details')
  details.append(createDetailsLabel(anime.name))
  details.append(createDetailsText(anime.description))
  details.append(createDetailsRating(anime, ratingListeners))

  return details
}

function createDetailsRating(anime, ratingListeners) {
  const ratings = document.createElement('div')
  ratings.classList.add('details__rating')
  ratings.append(createDetailsLabel("Rating"))
  doFor(5, i => {
    ratings.append(createRatingStar(i+1, anime.id, ratingListeners))
  })

  return ratings
}

function createRatingStar(i, id, ratingListeners) {
  const star = document.createElement('img')
  star.classList.add(`${i}-star`)
  star.setAttribute('width', '20')
  star.setAttribute('alt', 'Rating star')
  star.setAttribute('src', 'images/empty-star.png')
  star.addEventListener('click', ratingListeners.generateRateListener(id, i))
  star.addEventListener('mouseenter', ratingListeners.hoverIn(i))
  star.addEventListener('mouseleave', ratingListeners.hoverOut(i))

  return star
}

function createDetailsLabel(label) {
  const detailsLabel = document.createElement('h3')
  detailsLabel.classList.add('details__label')
  detailsLabel.append(label)

  return detailsLabel
}

function createDetailsText(text) {
  const detailsText = document.createElement('p')
  detailsText.classList.add('details__text')
  detailsText.append(text)

  return detailsText
}

function createCloseButton(closeListener) {
  const close = document.createElement('img')
  close.classList.add('card__close')
  close.setAttribute('src', 'images/close.png')
  close.setAttribute('alt', 'Close button')
  close.addEventListener('click', closeListener)

  return close
}

function jsonize(response) {
  return response.json()
}

function handleFetchError(err) {
  console.log("FAAAAAK:", err)
}

function createZeroList(n) {
  const list = []
  doFor(n, () => list.push(0))

  return list
}

function doFor(n, fn) {
  let i = 0
  while(i < n) fn(i++)
}

function pickFrom(list) {
  const ITEM_COUNT = list.length
  const RANDOM_INDEX = getRandomInt(0, ITEM_COUNT)
  const SELECTED_ITEM = list[RANDOM_INDEX]

  return SELECTED_ITEM
}

/**
 * Returns a random integer between the specified values.
 * 
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 * @param {Number} min Smallest number that can be selected
 * @param {Number} max The largest number to be included, plus one
 * @returns Number The pseudorandomly generated integer
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}