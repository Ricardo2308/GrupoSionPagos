import React from 'react'
import { NavLink } from 'react-router-dom'
import { FiBook, FiSettings, FiUserCheck, FiUsers } from 'react-icons/fi'
import { BiUserCircle } from 'react-icons/bi'

const administracion = [
  {
    _component: 'CNavItem',
    as: NavLink,
    anchor: 'Usuarios',
    to: '/usuarios',
    icon: <FiUsers size={16} style={{ marginRight: '4px' }} />,
    objeto: 'Modulo Usuarios',
  },
  {
    _component: 'CNavItem',
    as: NavLink,
    anchor: 'Conectados',
    to: '/conectados',
    icon: <FiUsers size={16} style={{ marginRight: '4px' }} />,
    objeto: 'Modulo Conectados',
  },
  {
    _component: 'CNavItem',
    as: NavLink,
    anchor: 'Perfiles',
    icon: <BiUserCircle size={18} style={{ marginRight: '4px' }} />,
    to: '/perfiles',
    objeto: 'Modulo Perfiles',
  },
  {
    _component: 'CNavItem',
    as: NavLink,
    anchor: 'Roles',
    icon: <FiSettings size={16} style={{ marginRight: '4px' }} />,
    to: '/roles',
    objeto: 'Modulo Roles',
  },
  {
    _component: 'CNavItem',
    as: NavLink,
    anchor: 'Permisos',
    icon: <FiUserCheck size={16} style={{ marginRight: '4px' }} />,
    to: '/permisos',
    objeto: 'Modulo Permisos',
  },
  {
    _component: 'CNavItem',
    as: NavLink,
    anchor: 'Políticas',
    icon: <FiBook size={16} style={{ marginRight: '4px' }} />,
    to: '/politicas',
    objeto: 'Modulo Politicas',
  },
]

export default administracion
