const API = `${process.env.REACT_APP_API_URL}restriccionempresa`

export function getRestriccionEmpresa(idRestriccionEmpresa) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idRestriccionEmpresa !== null) {
    ApiWhere += '/' + idRestriccionEmpresa
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}

const APIDisponible = `${process.env.REACT_APP_API_URL}empresasdisponibles`

export function getEmpresaDisponible() {
  return fetch(APIDisponible)
    .then(function (response) {
      return response.json()
    })
    .catch((error) => error)
}
