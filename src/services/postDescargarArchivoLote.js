import axios from 'axios'
const API = `${process.env.REACT_APP_API_URL}flujoarchivo`

export function postDescargarArchivoLote(id_lotepago, tipo_archivo) {
  let ApiFinal = API

  var datos = {
    id_lotepago: id_lotepago,
    tipo_archivo: tipo_archivo,
  }
  const data = JSON.stringify(datos)

  axios({
    method: 'post',
    url: API,
    data: datos,
    responseType: 'blob',
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    if (tipo_archivo == 'PDF') {
      link.setAttribute('download', 'PagosLote' + id_lotepago + '.pdf')
      document.body.appendChild(link)
      link.click()
    } else {
      link.setAttribute('download', 'PagosLote' + id_lotepago + '.xlsx')
      document.body.appendChild(link)
      link.click()
    }
  })

  /* return fetch(ApiFinal, {
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
    .catch((error) => error) */
}
