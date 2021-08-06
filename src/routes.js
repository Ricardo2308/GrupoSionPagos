import React from 'react'

// examples

const Usuarios = React.lazy(() => import('./views/components/usuarios/usuarios/Usuarios'))
const Register = React.lazy(() => import('./views/components/usuarios/register/Register'))
const EditarUsuarios = React.lazy(() => import('./views/components/usuarios/editar/Editar'))
const PerfilUsuario = React.lazy(() => import('./views/components/usuarios/perfil/PerfilUsuarios'))
const ConsultaPU = React.lazy(() => import('./views/components/usuarios/perfil/ConsultaPU'))
const EditarPerfilUsuario = React.lazy(() =>
  import('./views/components/usuarios/perfil/EditarPerfilUsuario'),
)
const UsuarioGrupo = React.lazy(() =>
  import('./views/components/usuarios/usuariogrupo/UsuarioGrupo'),
)

const EditarPerfil = React.lazy(() => import('./views/components/perfil/editar/EditarPerfil'))
const NuevoPerfil = React.lazy(() => import('./views/components/perfil/nuevo/NuevoPerfil'))
const Perfiles = React.lazy(() => import('./views/components/perfil/perfiles/Perfiles'))
const PerfilRol = React.lazy(() => import('./views/components/perfil/perfilrol/PerfilRol'))
const ConsultaPR = React.lazy(() => import('./views/components/perfil/perfilrol/ConsultaPR'))
const EditarPerfilRol = React.lazy(() =>
  import('./views/components/perfil/perfilrol/EditarPerfilRol'),
)

const EditarRol = React.lazy(() => import('./views/components/roles/editar/EditarRol'))
const NuevoRol = React.lazy(() => import('./views/components/roles/nuevo/NuevoRol'))
const Roles = React.lazy(() => import('./views/components/roles/listado/Roles'))
const RolPermiso = React.lazy(() => import('./views/components/roles/rolpermiso/RolPermiso'))
const ConsultaRP = React.lazy(() => import('./views/components/roles/rolpermiso/ConsultaRP'))
const EditarRolPermiso = React.lazy(() =>
  import('./views/components/roles/rolpermiso/EditarRolPermiso'),
)

const NuevoPermiso = React.lazy(() => import('./views/components/permisos/nuevo/NuevoPermiso'))
const Permisos = React.lazy(() => import('./views/components/permisos/listar/Permisos'))
const EditarPermiso = React.lazy(() => import('./views/components/permisos/editar/EditarPermiso'))

const Politicas = React.lazy(() => import('./views/components/politicas/Politicas'))
const NuevaPolitica = React.lazy(() => import('./views/components/politicas/NuevaPolitica'))
const EditarPolitica = React.lazy(() => import('./views/components/politicas/EditarPolitica'))

const CondicionesAutorizacion = React.lazy(() =>
  import('./views/components/condicion/CondicionesAutorizacion'),
)
const NuevaCondicion = React.lazy(() => import('./views/components/condicion/NuevaCondicion'))
const EditarCondicion = React.lazy(() => import('./views/components/condicion/EditarCondicion'))
const CondicionGrupo = React.lazy(() =>
  import('./views/components/condicion/condiciongrupo/CondicionGrupo'),
)
const ConsultaCG = React.lazy(() =>
  import('./views/components/condicion/condiciongrupo/ConsultaCG'),
)
const EditarCondicionGrupo = React.lazy(() =>
  import('./views/components/condicion/condiciongrupo/EditarCondicionGrupo'),
)

const UsuarioAutorizacion = React.lazy(() =>
  import('./views/components/flujos/autorizacion/UsuarioAutorizacion'),
)
const ListaAutorizaciones = React.lazy(() =>
  import('./views/components/flujos/autorizacion/ListaAutorizaciones'),
)

const Grupos = React.lazy(() => import('./views/components/flujos/grupos/Grupos'))
const EditarGrupo = React.lazy(() => import('./views/components/flujos/grupos/EditarGrupo'))
const NuevoGrupo = React.lazy(() => import('./views/components/flujos/grupos/NuevoGrupo'))

const NuevoEstadoFlujo = React.lazy(() =>
  import('./views/components/flujos/estadoflujo/NuevoEstadoFlujo'),
)
const EstadosFlujo = React.lazy(() => import('./views/components/flujos/estadoflujo/EstadosFlujo'))
const EditarEstadoFlujo = React.lazy(() =>
  import('./views/components/flujos/estadoflujo/EditarEstadoFlujo'),
)

const TiposFlujo = React.lazy(() => import('./views/components/flujos/tipoflujo/TiposFlujo'))
const NuevoTipoFlujo = React.lazy(() =>
  import('./views/components/flujos/tipoflujo/NuevoTipoFlujo'),
)
const EditarTipoFlujo = React.lazy(() =>
  import('./views/components/flujos/tipoflujo/EditarTipoFlujo'),
)

const PagoTabs = React.lazy(() => import('./views/components/flujos/flujo/PagoTabs'))
const GridPagos = React.lazy(() => import('./views/components/flujos/flujo/GridPagos'))
const ArchivosFlujoF = React.lazy(() => import('./views/components/flujos/flujo/ArchivosFlujoF'))
const DetalleFlujo = React.lazy(() => import('./views/components/flujos/flujo/DetalleFlujo'))
const ArchivosFlujoU = React.lazy(() =>
  import('./views/components/flujos/archivoflujo/ArchivosFlujoU'),
)
const NuevoArchivoFlujo = React.lazy(() =>
  import('./views/components/flujos/archivoflujo/NuevoArchivoFlujo'),
)
const EditarArchivoFlujo = React.lazy(() =>
  import('./views/components/flujos/archivoflujo/EditarArchivoFlujo'),
)

const Navs = React.lazy(() => import('./views/components/usuarios/navs/Navs'))
const Popovers = React.lazy(() => import('./views/components/usuarios/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/components/usuarios/progress/Progress'))
const FormControl = React.lazy(() => import('./views/components/permisos/form-control/FormControl'))
const Layout = React.lazy(() => import('./views/components/permisos/layout/Layout'))
const Select = React.lazy(() => import('./views/components/permisos/select/Select'))
const Validation = React.lazy(() => import('./views/components/permisos/validation/Validation'))

const Alerts = React.lazy(() => import('./views/components/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/components/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/components/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/components/notifications/toasts/Toasts'))

// const Login = React.lazy(() => import('./views/examples/pages/login/Login'))
// const Register = React.lazy(() => import('./views/examples/pages/register/Register'))
// const Page404 = React.lazy(() => import('./views/examples/pages/page404/Page404'))
// const Page500 = React.lazy(() => import('./views/examples/pages/page500/Page500'))

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const routes = [
  { path: '/home', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/base', name: 'Usuarios', component: Usuarios, exact: true },
  { path: '/base/usuarios', name: 'Listado', component: Usuarios },
  { path: '/base/registro', name: 'Nuevo', component: Register },
  { path: '/base/editar', name: 'Modificación', component: EditarUsuarios },
  { path: '/base/perfilusuario', name: 'Perfil', component: PerfilUsuario },
  { path: '/base/consulta', name: 'Perfil Usuario', component: ConsultaPU },
  { path: '/base/editarPU', name: 'Editar Perfil Usuario', component: EditarPerfilUsuario },
  { path: '/perfiles/perfilrol', name: 'Perfil Rol', component: PerfilRol },
  { path: '/perfiles/consulta', name: 'Perfil Rol', component: ConsultaPR },
  { path: '/perfiles/editarPR', name: 'Editar Perfil Rol', component: EditarPerfilRol },
  { path: '/base/usuariogrupo', name: 'Usuario Grupo Autorización', component: UsuarioGrupo },
  { path: '/perfiles', name: 'Perfiles', component: Perfiles, exact: true },
  { path: '/perfiles/nuevo', name: 'Nuevo', component: NuevoPerfil },
  { path: '/perfiles/perfiles', name: 'Listado', component: Perfiles },
  { path: '/perfiles/editar', name: 'Modificación', component: EditarPerfil },
  { path: '/roles/editar', name: 'Modificación', component: EditarRol },
  { path: '/roles/nuevo', name: 'Nuevo Rol', component: NuevoRol },
  { path: '/roles', exact: true, name: 'Roles', component: Roles },
  { path: '/roles/roles', name: 'Listado', component: Roles },
  { path: '/roles/rolpermiso', name: 'Rol Permiso', component: RolPermiso },
  { path: '/roles/consulta', name: 'Rol Permiso', component: ConsultaRP },
  { path: '/roles/editarRP', name: 'Editar Rol Permiso', component: EditarRolPermiso },
  { path: '/permisos', name: 'Permisos', component: Permisos, exact: true },
  { path: '/permisos/form-control', name: 'Form Control', component: FormControl },
  { path: '/permisos/select', name: 'Select', component: Select },
  { path: '/permisos/nuevo', name: 'Nuevo', component: NuevoPermiso },
  { path: '/permisos/editar', name: 'Modificación', component: EditarPermiso },
  { path: '/permisos/permisos', name: 'Listado', component: Permisos },
  { path: '/permisos/layout', name: 'Layout', component: Layout },
  { path: '/permisos/validation', name: 'Validation', component: Validation },
  { path: '/politicas', exact: true, name: 'Roles', component: Politicas },
  { path: '/politicas/politicas', name: 'Politicas', component: Politicas },
  { path: '/politicas/nueva', name: 'Nueva Politica', component: NuevaPolitica },
  { path: '/politicas/editar', name: 'Modificación', component: EditarPolitica },
  {
    path: '/condiciones',
    exact: true,
    name: 'Condiciones Autorización',
    component: CondicionesAutorizacion,
  },
  { path: '/condiciones/condiciones', name: 'Listado', component: CondicionesAutorizacion },
  { path: '/condiciones/nueva', name: 'Nueva Condición', component: NuevaCondicion },
  { path: '/condiciones/editar', name: 'Modificación', component: EditarCondicion },
  { path: '/condiciones/condiciongrupo', name: 'Condición Grupos', component: CondicionGrupo },
  { path: '/condiciones/consulta', name: 'Condición Grupos', component: ConsultaCG },
  {
    path: '/condiciones/editarCG',
    name: 'Editar Condición Grupos',
    component: EditarCondicionGrupo,
  },
  { path: '/autorizacion', exact: true, name: 'Autorizacion', component: UsuarioAutorizacion },
  {
    path: '/autorizacion/autorizacion',
    exact: true,
    name: 'Usuario Autorizacion',
    component: UsuarioAutorizacion,
  },
  {
    path: '/autorizacion/listado',
    exact: true,
    name: 'Autorizaciones del Usuario',
    component: ListaAutorizaciones,
  },
  { path: '/grupos', exact: true, name: 'Grupos Autorizacion', component: Grupos },
  { path: '/grupos/grupos', name: 'Listado', component: Grupos },
  { path: '/grupos/editar', name: 'Modificación', component: EditarGrupo },
  { path: '/grupos/nuevo', name: 'Nuevo', component: NuevoGrupo },
  { path: '/estadoflujo', exact: true, name: 'Estado Flujo', component: NuevoEstadoFlujo },
  { path: '/estadoflujo/nuevo', name: 'Nuevo', component: NuevoEstadoFlujo },
  { path: '/estadoflujo/estados', name: 'Listado', component: EstadosFlujo },
  { path: '/estadoflujo/editar', name: 'Modificación', component: EditarEstadoFlujo },
  { path: '/tipoflujo', exact: true, name: 'Tipo Flujo', component: TiposFlujo },
  { path: '/tipoflujo/tipos', name: 'Listado', component: TiposFlujo },
  { path: '/tipoflujo/nuevo', name: 'Nuevo', component: NuevoTipoFlujo },
  { path: '/tipoflujo/editar', name: 'Modificación', component: EditarTipoFlujo },
  { path: '/pagos', exact: true, name: 'Pagos', component: GridPagos },
  { path: '/pagos/tabs', name: 'Detalle Flujos', component: PagoTabs },
  { path: '/pagos/archivos', name: 'Archivos Flujo', component: ArchivosFlujoF },
  { path: '/pagos/detalle', name: 'Archivos Flujo', component: DetalleFlujo },
  { path: '/archivoflujo', exact: true, name: 'Archivos Flujo', component: ArchivosFlujoU },
  { path: '/archivoflujo/archivos', name: 'Listado', component: ArchivosFlujoU },
  { path: '/archivoflujo/nuevo', name: 'Nuevo', component: NuevoArchivoFlujo },
  { path: '/archivoflujo/editar', name: 'Nuevo', component: EditarArchivoFlujo },

  { path: '/notifications', name: 'Notifications', component: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  { path: '/notifications/badges', name: 'Badges', component: Badges },
  { path: '/notifications/modals', name: 'Modals', component: Modals },
  { path: '/notifications/toasts', name: 'Toasts', component: Toasts },
  { path: '/base/navs', name: 'Navs', component: Navs },
  { path: '/base/popovers', name: 'Popovers', component: Popovers },
  { path: '/base/progress', name: 'Progress', component: Progress },
  // { path: '/login', name: 'Login', component: Login },
  // { path: '/register', name: 'Register', component: Register },
  // { path: '/404', name: '404', component: Page404 },
  // { path: '/500', name: '500', component: Page500 },
]

export default routes
