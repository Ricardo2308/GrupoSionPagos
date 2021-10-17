const API = `${process.env.REACT_APP_API_URL}cambiapassword`

export function postCambiarPassword(token, password) {
  var datos = {
    token: token,
    password: password,
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
