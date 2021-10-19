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
const Conectados = React.lazy(() => import('./views/components/usuarios/conectados/Conectados'))
const Historico = React.lazy(() => import('./views/components/usuarios/conectados/Historico'))
const ConsultaUG = React.lazy(() => import('./views/components/usuarios/usuariogrupo/ConsultaUG'))
const AgregarGrupo = React.lazy(() =>
  import('./views/components/usuarios/usuariogrupo/AgregarGrupo'),
)
const EditarUsuarioGrupo = React.lazy(() =>
  import('./views/components/usuarios/usuariogrupo/EditarUsuarioGrupo'),
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
const GridBancario = React.lazy(() => import('./views/components/flujos/flujo/Bancario'))
const Transferencia = React.lazy(() => import('./views/components/flujos/flujo/Transferencia'))
const GridInterna = React.lazy(() => import('./views/components/flujos/flujo/Interna'))
const ArchivosFlujoF = React.lazy(() => import('./views/components/flujos/flujo/ArchivosFlujoF'))
const DetalleFlujo = React.lazy(() => import('./views/components/flujos/flujo/DetalleFlujo'))
const ArchivosFlujoU = React.lazy(() =>
  import('./views/components/flujos/archivoflujo/ArchivosFlujoU'),
)
const NuevoArchivoFlujo = React.lazy(() =>
  import('./views/components/flujos/archivoflujo/NuevoArchivoFlujo'),
)
const CompensacionBancario = React.lazy(() =>
  import('./views/components/flujos/flujo/PagoBancario'),
)
const CompensacionTransferencia = React.lazy(() =>
  import('./views/components/flujos/flujo/PagoTransferencia'),
)
const CompensacionInterna = React.lazy(() => import('./views/components/flujos/flujo/PagoInterna'))
const CompensacionTabs = React.lazy(() =>
  import('./views/components/flujos/flujo/CompensacionTabs'),
)
const Compensados = React.lazy(() => import('./views/components/flujos/flujo/Compensados'))
const EditarArchivoFlujo = React.lazy(() =>
  import('./views/components/flujos/archivoflujo/EditarArchivoFlujo'),
)
const FlujoGrupo = React.lazy(() => import('./views/components/flujos/flujo/FlujoGrupo'))

const Bancos = React.lazy(() => import('./views/components/flujos/bancos/Bancos'))
const EditarBancos = React.lazy(() => import('./views/components/flujos/bancos/EditarBancos'))
const NuevoBanco = React.lazy(() => import('./views/components/flujos/bancos/NuevoBanco'))

const Monedas = React.lazy(() => import('./views/components/flujos/monedas/Monedas'))
const EditarMonedas = React.lazy(() => import('./views/components/flujos/monedas/EditarMonedas'))
const NuevaMoneda = React.lazy(() => import('./views/components/flujos/monedas/NuevaMoneda'))

const Cuentas = React.lazy(() => import('./views/components/flujos/cuentas/Cuentas'))
const EditarCuentas = React.lazy(() => import('./views/components/flujos/cuentas/EditarCuentas'))
const NuevaCuenta = React.lazy(() => import('./views/components/flujos/cuentas/NuevaCuenta'))

const Autorizados = React.lazy(() => import('./views/components/flujos/flujo/Autorizados'))
const Rechazados = React.lazy(() => import('./views/components/flujos/flujo/Rechazados'))

// const Login = React.lazy(() => import('./views/examples/pages/login/Login'))
// const Register = React.lazy(() => import('./views/examples/pages/register/Register'))
// const Page404 = React.lazy(() => import('./views/examples/pages/page404/Page404'))
// const Page500 = React.lazy(() => import('./views/examples/pages/page500/Page500'))

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

const routes = [
  { path: '/home', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/usuarios', name: 'Usuarios', component: Usuarios, exact: true },
  { path: '/usuarios/registro', name: 'Nuevo', component: Register },
  { path: '/usuarios/editar', name: 'Modificación', component: EditarUsuarios },
  { path: '/usuarios/perfilusuario', name: 'Perfil', component: PerfilUsuario },
  { path: '/usuarios/consulta', name: 'Perfil Usuario', component: ConsultaPU },
  { path: '/usuarios/editarPU', name: 'Editar Perfil Usuario', component: EditarPerfilUsuario },
  { path: '/usuarios/usuariogrupo', name: 'Usuario Grupo Autorización', component: ConsultaUG },
  { path: '/usuarios/agregargrupo', name: 'Usuario Grupo Autorización', component: AgregarGrupo },
  {
    path: '/usuarios/editarusuariogrupo',
    name: 'Usuario Grupo Autorización',
    component: EditarUsuarioGrupo,
  },
  { path: '/conectados', name: 'Usuarios Conectados', component: Conectados, exact: true },
  { path: '/conectados/historico', name: 'Histórico', component: Historico },
  { path: '/perfiles', name: 'Perfiles', component: Perfiles, exact: true },
  { path: '/perfiles/nuevo', name: 'Nuevo', component: NuevoPerfil },
  { path: '/perfiles/editar', name: 'Modificación', component: EditarPerfil },
  { path: '/perfiles/perfilrol', name: 'Perfil Rol', component: PerfilRol },
  { path: '/perfiles/consulta', name: 'Perfil Rol', component: ConsultaPR },
  { path: '/perfiles/editarPR', name: 'Editar Perfil Rol', component: EditarPerfilRol },
  { path: '/roles/editar', name: 'Modificación', component: EditarRol },
  { path: '/roles/nuevo', name: 'Nuevo Rol', component: NuevoRol },
  { path: '/roles', exact: true, name: 'Roles', component: Roles },
  { path: '/roles/rolpermiso', name: 'Rol Permiso', component: RolPermiso },
  { path: '/roles/consulta', name: 'Rol Permiso', component: ConsultaRP },
  { path: '/roles/editarRP', name: 'Editar Rol Permiso', component: EditarRolPermiso },
  { path: '/permisos', name: 'Permisos', component: Permisos, exact: true },
  { path: '/permisos/nuevo', name: 'Nuevo', component: NuevoPermiso },
  { path: '/permisos/editar', name: 'Modificación', component: EditarPermiso },
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
  { path: '/condiciones/nueva', name: 'Nueva Condición', component: NuevaCondicion },
  { path: '/condiciones/editar', name: 'Modificación', component: EditarCondicion },
  { path: '/condiciones/condiciongrupo', name: 'Condición Grupos', component: CondicionGrupo },
  { path: '/condiciones/consulta', name: 'Condición Grupos', component: ConsultaCG },
  {
    path: '/condiciones/editarCG',
    name: 'Editar Condición Grupos',
    component: EditarCondicionGrupo,
  },
  { path: '/autorizacion', exact: true, name: 'Autorizaciones', component: ListaAutorizaciones },
  {
    path: '/autorizacion/nueva',
    exact: true,
    name: 'Usuario Autorizacion',
    component: UsuarioAutorizacion,
  },
  { path: '/grupos', exact: true, name: 'Grupos Autorizacion', component: Grupos },
  { path: '/grupos/editar', name: 'Modificación', component: EditarGrupo },
  { path: '/grupos/nuevo', name: 'Nuevo', component: NuevoGrupo },
  { path: '/estadosflujo', exact: true, name: 'Estado Flujo', component: EstadosFlujo },
  { path: '/estadosflujo/nuevo', name: 'Nuevo', component: NuevoEstadoFlujo },
  { path: '/estadosflujo/editar', name: 'Modificación', component: EditarEstadoFlujo },
  { path: '/tipoflujo', exact: true, name: 'Tipo Flujo', component: TiposFlujo },
  { path: '/tipoflujo/nuevo', name: 'Nuevo', component: NuevoTipoFlujo },
  { path: '/tipoflujo/editar', name: 'Modificación', component: EditarTipoFlujo },
  { path: '/bancos', exact: true, name: 'Bancos', component: Bancos },
  { path: '/bancos/editar', name: 'Modificación', component: EditarBancos },
  { path: '/bancos/nuevo', name: 'Nuevo', component: NuevoBanco },
  { path: '/monedas', exact: true, name: 'Monedas', component: Monedas },
  { path: '/monedas/editar', name: 'Modificación', component: EditarMonedas },
  { path: '/monedas/nueva', name: 'Nueva', component: NuevaMoneda },
  { path: '/cuentas', exact: true, name: 'Cuentas', component: Cuentas },
  { path: '/cuentas/editar', name: 'Modificación', component: EditarCuentas },
  { path: '/cuentas/nueva', name: 'Nueva', component: NuevaCuenta },
  { path: '/pagos', exact: true, name: 'Autorización Pagos', component: GridBancario },
  { path: '/pagos/bancario', name: 'Bancaria', component: GridBancario },
  { path: '/pagos/transferencia', name: 'Transferencia', component: Transferencia },
  { path: '/pagos/interna', name: 'Interna', component: GridInterna },
  { path: '/pagos/tabs', name: 'Detalle Pagos', component: PagoTabs },
  { path: '/pagos/archivos', name: 'Cargar Archivo', component: ArchivosFlujoF },
  { path: '/pagos/flujogrupo', name: 'Flujo Grupo Autorización', component: FlujoGrupo },
  { path: '/pagos/detalle', name: 'Detalle Flujo', component: DetalleFlujo },
  { path: '/pagos/autorizados', name: 'Autorizados', component: Autorizados },
  { path: '/pagos/rechazados', name: 'Rechazados', component: Rechazados },
  { path: '/pagos/compensados', name: 'Rechazados', component: Compensados },
  {
    path: '/compensacion',
    exact: true,
    name: 'Compensación Pagos',
    component: CompensacionBancario,
  },
  { path: '/compensacion/bancario', name: 'Bancaria', component: CompensacionBancario },
  {
    path: '/compensacion/transferencia',
    name: 'Transferencia',
    component: CompensacionTransferencia,
  },
  { path: '/compensacion/interna', name: 'Interna', component: CompensacionInterna },
  { path: '/compensacion/tabs', name: 'Detalle Pagos', component: CompensacionTabs },
  { path: '/archivoflujo', exact: true, name: 'Archivos Pagos', component: ArchivosFlujoU },
  { path: '/archivoflujo/nuevo', name: 'Nuevo', component: NuevoArchivoFlujo },
  { path: '/archivoflujo/editar', name: 'Nuevo', component: EditarArchivoFlujo },
  // { path: '/login', name: 'Login', component: Login },
  // { path: '/register', name: 'Register', component: Register },
  // { path: '/404', name: '404', component: Page404 },
  // { path: '/500', name: '500', component: Page500 },
]

export default routes
