const container = document.querySelector('.container')


if ('geolocation' in navigator) {
  navigator.geolocation.watchPosition((position) => {

    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${position.coords.latitude}&lon=${position.coords.longitude}&exclude=minutely&appid=dc8c9152e8adaad0ec8bf635818c0d42&units=metric`
    axios.get(url)
       .then(requete => {
        blockInfo(requete)
        hourlyTemp(requete)
        dailyTemp(requete)
      })
      .catch(error =>
        container.innerHTML = 
        `<p class="errorMsg"> Une erreur ses produite veiller revenir plutard</p>`
      )

  }, error)

}
else {
  alert("Votre navigateur ne supporte pas la geolocalisation")

}

function error() {

  container.innerHTML = 
  `<p class="errorMsg"> Vous avez refuser la geolocalisation</p>`
}

const temperature = document.querySelector('.temperature')
const position = document.querySelector('.position')
const img = document.querySelector('img')

function blockInfo(requete) {

  position.textContent = requete.data.timezone
  temperature.textContent = `${Math.round(requete.data.current.temp)}°`
  const src = requete.data.current.weather[0].icon
  img.src = `ressources/${src}.svg`

}

function hourlyTemp(requete) {
  const hour = requete.data.hourly.map(el => el.dt)
  const temp = requete.data.hourly.map(el => Math.round(el.temp))
  hour.shift()
  temp.shift()

  const result = []
  const time = hour.forEach(element => {
  const hours = new Date(element * 1000)
  const time = hours.getHours()
  result.push(time)
  });

  ShowHourlyResult(result, temp)
}

const hourTemperatures = document.querySelectorAll(".hour-temp")
const hourNameBlocks   = document.querySelectorAll(".hour-name")

function ShowHourlyResult(hour, temp) {

  hourNameBlocks.forEach((block, index,) => {
    if (hour[index] === 0) {
      hourNameBlocks[index].textContent = "00h";
    }
    else {
      hourNameBlocks[index].textContent = `${hour[index * 3]}h`
    }

    hourTemperatures[index].textContent = `${Math.round(temp[index * 3])}°`
  })

}


function dailyTemp(requete) {
  const days = requete.data.daily.map(el => el.dt)
  const temp = requete.data.daily.map(el => Math.round(el.temp.day))
  days.shift()
  temp.shift()

  const result = []

  days.forEach((element, index) => {
    const date = new Date(element * 1000).toLocaleDateString("fr-FR", {
      weekday: 'short',
    }).split(".")[0]
    result.push(date)
  })

  showDaysResult(result, temp)

}
const daysNameBlock = document.querySelectorAll(".day-name")
const daysTemperature = document.querySelectorAll(".day-temp")

function showDaysResult(days, temp) {

  daysNameBlock.forEach((element, index) => {
  daysNameBlock[index].textContent = days[index]
  daysTemperature[index].textContent = `${temp[index]}°`
  })
}

const hourBtn = document.querySelector('.heures')
const preBtn  = document.querySelector('.prevision')



hourBtn.addEventListener('click', handelHourBtnClick)
preBtn.addEventListener('click', handelpreBtnClick)

const dayForecast = document.querySelector(".day-forecast")
const hourForcast = document.querySelector(".hour-forecast")
const forecast = document.querySelectorAll(".forecast")
dayForecast.style.display = "none"

function handelHourBtnClick(e) {

  e.preventDefault()
  dayForecast.style.display = "none"
  hourForcast.style.display = "flex"
  preBtn.style.opacity  = .5
  hourBtn.style.opacity = 10


}

function handelpreBtnClick(e) {
  e.preventDefault()
  dayForecast.style.display = "flex"
  hourForcast.style.display = "none"
  hourBtn.style.opacity = .5
  preBtn.style.opacity  = 10
}
