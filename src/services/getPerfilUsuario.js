const API = `${process.env.REACT_APP_API_URL}usuarioperfil`

export function getPerfilUsuario(idUsuario, opcion, objetos) {
  let array = ['0']

  if (objetos !== null) {
    var datos = {
      objetos: objetos,
      opcion: opcion,
      idUsuario: idUsuario,
    }
  } else {
    var datos = {
      objetos: array,
      opcion: opcion,
      idUsuario: idUsuario,
    }
  }
  const data = JSON.stringify(datos)
  return fetch(API, {
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
