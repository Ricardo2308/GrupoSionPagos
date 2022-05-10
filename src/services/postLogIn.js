const API = `${process.env.REACT_APP_API_URL}login`

export function postLogIn(user, password) {
  var datos = {
    user: user,
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
      if (response.length !== undefined) {
        return response
      } else {
        return null
      }
    })
    .catch((error) => error)
}
