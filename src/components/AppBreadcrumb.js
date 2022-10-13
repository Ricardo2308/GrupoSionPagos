import React from 'react'
import { useLocation } from 'react-router-dom'

import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname

  const getRouteName = (pathname, routes) => {
    let currentRoute = routes.find((route) => route.path === pathname)
    if (currentRoute === undefined) {
      currentRoute = routes.find((route) => pathname.includes(route.path))
    }
    return currentRoute.name
  }

  const getBreadcrumbs = (location) => {
    const breadcrumbs = []
    if (location.includes('pagos/tabs-notificacion')) {
      breadcrumbs.push({
        pathname: 'pagos/tabs-notificacion',
        name: 'Detalle de pago',
        active: true,
      })
    } else {
      location.split('/').reduce((prev, curr, index, array) => {
        const currentPathname = `${prev}/${curr}`
        breadcrumbs.push({
          pathname: currentPathname,
          name: getRouteName(currentPathname, routes),
          active: index + 1 === array.length ? true : false,
        })
        return currentPathname
      })
    }
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="m-0 ms-2" style={{ zIndex: '0' }}>
      <CBreadcrumbItem style={{ textDecoration: 'none' }} active>
        Inicio
      </CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem style={{ textDecoration: 'none' }} key={index} active>
            {breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
