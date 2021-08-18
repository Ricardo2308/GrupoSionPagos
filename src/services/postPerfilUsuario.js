const API = `${process.env.REACT_APP_API_URL}usuarioperfil`

export function postPerfilUsuario(idUsuarioPerfil, idUsuario, perfiles, opcion, idPerfil, estado) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_usuarioperfil: idUsuarioPerfil,
    id_usuario: idUsuario,
    id_perfil: idPerfil,
    perfiles: perfiles,
    opcion: opcion,
    activo: estado,
  }

  if (perfiles !== '') {
    ApiWhere += '/' + perfiles
  }
  if (idUsuarioPerfil !== '' && opcion !== '') {
    ApiWhere += '/' + idUsuarioPerfil + '/' + opcion
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
    .catch((error) => error)
}
