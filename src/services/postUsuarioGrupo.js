const API = `${process.env.REACT_APP_API_URL}usuariogrupo`

export function postUsuarioGrupo(
  idUsuarioGrupo,
  idUsuario,
  opcion,
  idGrupo,
  nivel,
  estado,
  id_usuario,
  token,
) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_usuariogrupo: idUsuarioGrupo,
    id_usuario: idUsuario,
    opcion: opcion,
    id_grupoautorizacion: idGrupo,
    nivel: nivel,
    activo: estado,
    id_usuario_s: id_usuario,
  }

  if (idUsuarioGrupo !== '' && opcion !== '') {
    ApiWhere += '/' + idUsuarioGrupo + '/' + opcion
  }
  ApiFinal += ApiWhere

  const data = JSON.stringify(datos)
  return fetch(ApiFinal, {
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
