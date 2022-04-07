import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FiBook, FiSettings, FiUserCheck, FiUsers, FiShield } from 'react-icons/fi'
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
]

export default administracion
