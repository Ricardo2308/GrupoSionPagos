import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  FiBook,
  FiSettings,
  FiUserCheck,
  FiUsers,
  FiShield,
  FiLayers,
  FiSend,
  FiFlag,
  FiMessageCircle,
  FiDelete,
  FiUserPlus,
  FiSlash,
  FiShuffle,
} from 'react-icons/fi'
import { BiUserCircle } from 'react-icons/bi'
import { MenuItem, SubMenu } from 'react-pro-sidebar'

const administracion = [
  {
    objeto: 'Modulo Usuarios',
    menu: (
      <MenuItem key="usuarios" icon={<FiUsers />}>
        Usuarios
        <Link to="/usuarios" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo Conectados',
    menu: (
      <MenuItem key="conectados" icon={<FiUsers />}>
        Conectados
        <Link to="/conectados" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo Perfiles',
    menu: (
      <MenuItem key="perfiles" icon={<BiUserCircle />}>
        Perfiles
        <Link to="/perfiles" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo Roles',
    menu: (
      <MenuItem key="roles" icon={<FiSettings />}>
        Roles
        <Link to="/roles" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo Permisos',
    menu: (
      <MenuItem key="permisos" icon={<FiUserCheck />}>
        Permisos
        <Link to="/permisos" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo Bitacora',
    menu: (
      <MenuItem key="bitacora" icon={<FiFlag />}>
        Bitacora
        <Link to="/bitacora" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo Politicas',
    menu: (
      <MenuItem key="politicas" icon={<FiBook />}>
        Políticas
        <Link to="/politicas" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo RestriccionEmpresa',
    menu: (
      <MenuItem key="restricionempresa" icon={<FiShield />}>
        Restricción a empresa
        <Link to="/restriccionempresa" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo RestriccionEmpresa',
    menu: (
      <MenuItem key="usuariorestricionempresa" icon={<FiUserCheck />}>
        Restricción a empresa por usuario
        <Link to="/usuariorestriccionempresa" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo CuentaGrupoAutorizacion',
    menu: (
      <MenuItem key="cuentagrupoautorizacion" icon={<FiLayers />}>
        Grupo autorización por cuenta
        <Link to="/cuentagrupoautorizacion" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo NotificacionLote',
    menu: (
      <MenuItem key="notificacionloteusuario" icon={<FiSend />}>
        Notificación de lotes a usuarios
        <Link to="/notificacionloteusuario" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo PrioridadChat',
    menu: (
      <MenuItem key="prioridadchat" icon={<FiMessageCircle />}>
        Prioridad usuario en chat
        <Link to="/prioridadchat" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo OcultarColumnas',
    menu: (
      <MenuItem key="ocultarcolumnas" icon={<FiDelete />}>
        Ocultar columnas a usuarios
        <Link to="/ocultarcolumnas" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo RecordatorioGrupo',
    menu: (
      <MenuItem key="recordatoriogrupo" icon={<FiUserPlus />}>
        Usuario para recordatorio por grupo
        <Link to="/recordatoriogrupo" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo BloqueoNotificacionCorreo',
    menu: (
      <MenuItem key="bloqueonotificacioncorreo" icon={<FiSlash />}>
        Bloqueo notificacion por correo
        <Link to="/bloqueonotificacioncorreo" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo Redireccion',
    menu: (
      <MenuItem key="redireccion" icon={<FiShuffle />}>
        Redirección para usuarios
        <Link to="/usuarioredireccion" />
      </MenuItem>
    ),
  },
]

export default administracion
