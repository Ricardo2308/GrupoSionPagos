const API = `${process.env.REACT_APP_API_URL}usuarioperfil`

export function postPerfilUsuario(
  idUsuarioPerfil,
  idUsuario,
  perfiles,
  opcion,
  idPerfil,
  estado,
  id_usuario,
  token,
) {
  let ApiFinal = API
  let ApiWhere = ''

  var datos = {
    id_usuarioperfil: idUsuarioPerfil,
    idUsuario: idUsuario,
    id_perfil: idPerfil,
    perfiles: perfiles,
    opcion: opcion,
    activo: estado,
    id_usuario: id_usuario,
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
