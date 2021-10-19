const API = `${process.env.REACT_APP_API_URL}sesionusuario`

export function postSesionUsuario(IdUsuario, Navegador, IP, Opcion) {
  var datos = {
    IdUsuario: IdUsuario,
    Navegador: Navegador,
    IP: IP,
    Opcion: Opcion,
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
