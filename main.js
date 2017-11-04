const recommendAnime = (RATINGS, ANIME_LIST) => {
  const {factorizeMatrix, buildCompletedMatrix} = matrixFactorization
  const USER_RATINGS_INDEX = RATINGS.length - 1
  const FACTORS = factorizeMatrix(RATINGS)
  const COMPLETED_MATRIX = buildCompletedMatrix(FACTORS)
  const recommendations = COMPLETED_MATRIX[USER_RATINGS_INDEX]

  return recommendations
          .map((rating, i) => [i, rating])
          .sort((a, b) => b[1] - a[1])
          .map(item => ANIME_LIST[item[0]])
}

const DATA_URL = "https://www.jasonbase.com/things/E1k4.json"

fetch(DATA_URL)
  .then(jsonize)
  .then(initializeApp)
  .catch(handleFetchError)

function initializeApp(data) {
  const ANIME_LIST = data.anime
  const ANIME_COUNT = ANIME_LIST.length
  const RATINGS = data.ratings
  const USER_COUNT = RATINGS.length
  const RECOMMENDATIONS_THRESHOLD = 10

  let isReadyToRecommend = false
  let ratedAnimeCount = 0
  let animeOnDisplay = [pickFrom(ANIME_LIST), pickFrom(ANIME_LIST), pickFrom(ANIME_LIST)]
  let displayedAnime = [...animeOnDisplay.map(anime => anime.id)]
  let currentRatings = createZeroList(ANIME_COUNT)
  let recommendations = null
  const bodyContainer = document.querySelector('.body__container')

  // Define event listeners
  const eventListeners = {
    close: e => {
      replaceCard(e)
    },
    ratingListeners: {
      generateRateListener: (id, rating) => e => {
        currentRatings[id] = rating
        if (!isReadyToRecommend) isReadyToRecommend = ++ratedAnimeCount >= RECOMMENDATIONS_THRESHOLD ? true : false
        replaceCard(e)
      },
      hoverIn: i => e => {
        const parentCard = e.target.closest('.body__card')
        const stars = [...parentCard.querySelectorAll('.details__rating img')]
        const targetStars = stars.slice(0, i)
        targetStars.forEach(star => {
          star.setAttribute('src', 'images/filled-star.png')
        })
      },
      hoverOut: i => e => {
        const parentCard = e.target.closest('.body__card')
        const stars = [...parentCard.querySelectorAll('.details__rating img')]
        const targetStars = stars.slice(0, i)
        targetStars.forEach(star => {
          star.setAttribute('src', 'images/empty-star.png')
        })
      }
    }
  }

  // Display initial picks
  animeOnDisplay.map(anime => createAnimeCard(anime, eventListeners)).forEach(animeCard => {
    bodyContainer.append(animeCard)
  })

  function replaceCard(e) {
    // Remove card
    const parentCard = e.target.closest('.body__card')
    parentCard.parentNode.removeChild(parentCard)

    // Select random anime
    let selectedAnime = pickFrom(ANIME_LIST)

    if (!isReadyToRecommend) {

      // Make sure the anime selected was not displayed before
      while (displayedAnime.includes(selectedAnime.id)) selectedAnime = pickFrom(ANIME_LIST)

      // Add selected anime to list of anime displayed before
      displayedAnime.push(selectedAnime.id)

      // If all anime are already displayed, display them all again
      if (displayedAnime.length === ANIME_LIST.length) displayedAnime = []
    } else {

      // If there are no recommendations
      if (!(recommendations && recommendations.length > 0)) {

        // Generate recommendations
        recommendations = recommendAnime([...RATINGS, currentRatings], ANIME_LIST)
        swal("Recommendations Generated!", "The following anime will be recommendations.", "success")
      }

      // Get top anime recommendation
      selectedAnime = recommendations.shift()
    }
    
    // Add selected anime
    bodyContainer.append(createAnimeCard(selectedAnime, eventListeners))
  }
}