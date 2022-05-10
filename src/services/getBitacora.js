const API = `${process.env.REACT_APP_API_URL}bitacora`

export function getBitacora(idFlujo, token) {
  let ApiFinal = API
  let ApiWhere = ''

  if (idFlujo !== null) {
    ApiWhere += '/' + idFlujo
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
    },
  })
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}

export function getFlujoProceso(idFlujo, token) {
  let ApiFinal = `${process.env.REACT_APP_API_URL}flujoproceso`
  let ApiWhere = ''

  if (idFlujo !== null) {
    ApiWhere += '/' + idFlujo
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
    },
  })
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
