const API = `${process.env.REACT_APP_API_URL}flujodetalle`

export function getBitacora(idFlujo, Comentario, idUsuario) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idFlujo !== null) {
    ApiWhere += '/' + idFlujo + '/0/' + idUsuario
  }
  if (Comentario !== null) {
    ApiWhere += '/0/' + Comentario + '/' + idUsuario
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((err) => err)
}
