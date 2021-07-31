const API = `${process.env.REACT_APP_BACKEND_URL}post_condiciongrupo.php`

export function postCondicionGrupo(idCondicionGrupo, idCondicion, grupos, opcion, idGrupo, estado) {
  var datos = {
    id_condiciongrupo: idCondicionGrupo,
    id_condicion: idCondicion,
    grupos: grupos,
    opcion: opcion,
    grupo_crud: idGrupo,
    estado: estado,
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
