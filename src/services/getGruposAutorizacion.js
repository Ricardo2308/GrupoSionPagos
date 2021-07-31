const API = `${process.env.REACT_APP_BACKEND_URL}grupos_autorizacion.php`

export function getGruposAutorizacion(idGrupo, idGrupoPadre) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idGrupo !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&id_grupo=' + idGrupo
    } else {
      ApiWhere += '?id_grupo=' + idGrupo
    }
  }
  if (idGrupoPadre !== null) {
    if (ApiWhere.length > 0) {
      ApiWhere += '&id_grupopadre=' + idGrupoPadre
    } else {
      ApiWhere += '?id_grupopadre=' + idGrupoPadre
    }
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((err) => err)
}
