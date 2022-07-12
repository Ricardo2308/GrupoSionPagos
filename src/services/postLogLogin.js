const API = `${process.env.REACT_APP_API_URL}loglogin`

export function postLogLogin(idUsuario, maximo, token) {
  var datos = {
    id_usuario: idUsuario,
    maximo: maximo,
  }

  const data = JSON.stringify(datos)
  return fetch(API, {
    method: 'POST',
    body: data,
    headers: {
      Authorization: 'Bearer ' + token,
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
