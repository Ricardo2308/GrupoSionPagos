const API = `${process.env.REACT_APP_API_URL}restriccionempresa`

export function getRestriccionEmpresa(idRestriccionEmpresa, token) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idRestriccionEmpresa !== null) {
    ApiWhere += '/' + idRestriccionEmpresa
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

const APIDisponible = `${process.env.REACT_APP_API_URL}empresasdisponibles`

export function getEmpresaDisponible(token) {
  return fetch(APIDisponible, {
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
