const API = `${process.env.REACT_APP_API_URL}flujodetalle`

export function getBitacora(idFlujo, Comentario, idUsuario, Tipo) {
  let array = ['0']
  let ApiFinal = API
  let ApiWhere = ''

  if (Comentario !== null) {
    var datos = {
      comentarios: Comentario,
    }
  } else {
    var datos = {
      comentarios: array,
    }
  }

  if (idFlujo !== null) {
    ApiWhere += '/' + idFlujo + '/' + idUsuario + '/0'
  }
  if (Comentario !== null) {
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
    .catch((err) => {
      if (err.message == 'Failed to fetch') {
        alert('Error de conexión. Revise si está conectado a Internet.')
      }
    })
}
