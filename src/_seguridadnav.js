import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  FiBook,
  FiLock,
  FiSettings,
  FiGitPullRequest,
  FiUserCheck,
  FiUsers,
  FiActivity,
  FiGrid,
} from 'react-icons/fi'
import { BiUserCircle } from 'react-icons/bi'
import logo from './assets/icons/GrupoSion.png'

const _seguridadnav = [
  {
    _component: 'CNavGroup',
    as: NavLink,
    anchor: 'Seguridad',
    to: '/to',
    icon: <FiLock size={20} style={{ marginRight: '20px', marginLeft: '7px' }} />,
    items: [
      {
        _component: 'CNavGroup',
        as: NavLink,
        anchor: 'Usuarios',
        to: '/to',
        icon: <FiUsers size={20} style={{ marginRight: '20px', marginLeft: '7px' }} />,
        items: [
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Nuevo',
            to: '/base/registro',
          },
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Listar',
            to: '/base/usuarios',
          },
        ],
      },
      {
        _component: 'CNavGroup',
        anchor: 'Perfiles',
        icon: <BiUserCircle size={23} style={{ marginRight: '19px', marginLeft: '6px' }} />,
        items: [
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Nuevo',
            to: '/perfiles/nuevo',
          },
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Listar',
            to: '/perfiles/perfiles',
          },
        ],
      },
      {
        _component: 'CNavGroup',
        anchor: 'Roles',
        icon: <FiSettings size={20} style={{ marginRight: '20px', marginLeft: '7px' }} />,
        items: [
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Nuevo',
            to: '/roles/nuevo',
          },
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Listar',
            to: '/roles/roles',
          },
        ],
      },
      {
        _component: 'CNavGroup',
        anchor: 'Permisos',
        icon: <FiUserCheck size={20} style={{ marginRight: '20px', marginLeft: '7px' }} />,
        items: [
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Nuevo',
            to: '/permisos/nuevo',
          },
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Listar',
            to: '/permisos/permisos',
          },
        ],
      },
      {
        _component: 'CNavGroup',
        anchor: 'Políticas',
        icon: <FiBook size={20} style={{ marginRight: '20px', marginLeft: '7px' }} />,
        items: [
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Nueva',
            to: '/politicas/nueva',
          },
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Listar',
            to: '/politicas/politicas',
          },
        ],
      },
    ],
  },
]

export default _seguridadnav
