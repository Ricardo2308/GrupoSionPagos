const API = `${process.env.REACT_APP_API_URL}bitacora`

export function getBitacora(idFlujo) {
  let ApiFinal = API
  let ApiWhere = ''

  if (idFlujo !== null) {
    ApiWhere += '/' + idFlujo
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}

export function getFlujoProceso(idFlujo) {
  let ApiFinal = `${process.env.REACT_APP_API_URL}flujoproceso`
  let ApiWhere = ''

  if (idFlujo !== null) {
    ApiWhere += '/' + idFlujo
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
