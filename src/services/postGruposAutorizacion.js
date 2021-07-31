const API = `${process.env.REACT_APP_BACKEND_URL}post_gruposautorizacion.php`

export function postGruposAutorizacion(
  idGrupo,
  idGrupoPadre,
  identificador,
  descripcion,
  estado,
  opcion,
) {
  var datos = {
    id_grupo: idGrupo,
    id_grupopadre: idGrupoPadre,
    identificador: identificador,
    descripcion: descripcion,
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
