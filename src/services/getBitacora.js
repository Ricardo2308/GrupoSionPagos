const API = `${process.env.REACT_APP_API_URL}flujodetalle`

export function getBitacora(idFlujo, Comentario, idUsuario, Tipo) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    comentarios: Comentario,
  }

  if (idFlujo !== null) {
    ApiWhere += '/' + idFlujo + '/' + idUsuario + '/0'
  }
  if (Comentario[0] !== '0') {
    ApiWhere += '/0/' + idUsuario + '/' + Tipo
  }
  ApiFinal += ApiWhere
  const data = JSON.stringify(datos)
  return fetch(ApiFinal, {
    method: 'POST',
    body: data,
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json;charset=UTF-8',
    },
  })
    .then((response) => response.json())
    .then((response) => {
      return response
    })
    .catch((error) => error)
}
