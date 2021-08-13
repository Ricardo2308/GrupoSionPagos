const API = `${process.env.REACT_APP_BACKEND_URL}post_bancos.php`

export function postCrudBancos(idBanco, nombre, direccion, estado, opcion) {
  var datos = {
    id_banco: idBanco,
    nombre: nombre,
    direccion: direccion,
    estado: estado,
    opcion: opcion,
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
