const API = `${process.env.REACT_APP_API_URL}flujodetalle`

export function getBitacora(idFlujo, Comentario, idUsuario, Tipo) {
  let ApiFinal = API
  let ApiWhere = ''
  if (idFlujo !== null) {
    ApiWhere += '/' + idFlujo + '/0/' + idUsuario + '/0'
  }
  if (Comentario !== null) {
    ApiWhere += '/0/' + Comentario + '/' + idUsuario + '/' + Tipo
  }
  ApiFinal += ApiWhere
  return fetch(ApiFinal)
    .then(function (response) {
      return response.json()
    })
    .catch((err) => err)
}
