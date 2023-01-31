const URL = 'https://localhost:44349';

function getData(link, onSuccsess, onError) {
  fetch(`${URL}/${link}`)
    .then(response => {
      if (response.ok) {
        response.json();
      } else throw new Error()
    })
    .then(data => onSuccsess(data))
    .catch((err => onError(err)))
}


function sendData(link, data, onSuccsess, onError) {
  fetch(`${URL}/${link}`, data)
    .then(response => {
      if (response.ok) {
        onSuccsess();
      } else throw new Error()
    })
    .catch((err => onError(err)))
}

export function sendReview(shortName, body) {
  sendData(`api/anime/${shortName}/review`, body,)
}

