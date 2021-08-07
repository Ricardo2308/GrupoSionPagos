import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  FiBook,
  FiLock,
  FiSettings,
  FiGitPullRequest,
  FiUserCheck,
  FiUsers,
  FiGrid,
  FiAlertOctagon,
  FiFile,
  FiThumbsUp,
  FiCreditCard,
} from 'react-icons/fi'
import { BiUserCircle } from 'react-icons/bi'
import logo from './assets/icons/GrupoSion.png'

const _nav = [
  {
    _component: 'CNavItem',
    as: NavLink,
    anchor: 'Dashboard',
    to: '/dashboard',
    icon: <img src={logo} style={{ width: '15%', marginRight: '15px', marginLeft: '30px' }} />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    _component: 'CNavTitle',
    anchor: 'Módulos',
  },
  {
    _component: 'CNavItem',
    anchor: 'Seguridad',
    to: '/dashboard',
    icon: <FiLock size={20} style={{ marginRight: '20px', marginLeft: '7px' }} />,
  },
  {
    _component: 'CNavGroup',
    as: NavLink,
    anchor: 'Pagos',
    to: '/to',
    icon: <FiCreditCard size={20} style={{ marginRight: '20px', marginLeft: '7px' }} />,
    items: [
      {
        _component: 'CNavGroup',
        anchor: 'Condiciones',
        icon: <FiAlertOctagon size={20} style={{ marginRight: '20px', marginLeft: '7px' }} />,
        items: [
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Nuevo',
            to: '/condiciones/nueva',
            badge: {
              color: 'success',
              text: 'NEW',
            },
          },
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Listar',
            to: '/condiciones/condiciones',
          },
        ],
      },
      {
        _component: 'CNavGroup',
        anchor: 'Grupos',
        icon: <FiUsers size={20} style={{ marginRight: '20px', marginLeft: '7px' }} />,
        items: [
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Nuevo',
            to: '/grupos/nuevo',
            badge: {
              color: 'success',
              text: 'NEW',
            },
          },
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Listar',
            to: '/grupos/grupos',
          },
        ],
      },
      {
        _component: 'CNavGroup',
        anchor: 'Autorizacion',
        icon: <FiThumbsUp size={20} style={{ marginRight: '20px', marginLeft: '7px' }} />,
        items: [
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Nueva',
            to: '/autorizacion/autorizacion',
          },
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Listar',
            to: '/autorizacion/listado',
          },
        ],
      },
      {
        _component: 'CNavGroup',
        anchor: 'Estado Pago',
        icon: <FiGrid size={20} style={{ marginRight: '20px', marginLeft: '7px' }} />,
        items: [
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Nuevo',
            to: '/estadoflujo/nuevo',
            badge: {
              color: 'success',
              text: 'NEW',
            },
          },
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Listar',
            to: '/estadoflujo/estados',
          },
        ],
      },
      {
        _component: 'CNavGroup',
        anchor: 'Tipo Flujo',
        icon: <FiGitPullRequest size={20} style={{ marginRight: '20px', marginLeft: '7px' }} />,
        items: [
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Nuevo',
            to: '/tipoflujo/nuevo',
            badge: {
              color: 'success',
              text: 'NEW',
            },
          },
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Listar',
            to: '/tipoflujo/tipos',
          },
        ],
      },
      {
        _component: 'CNavGroup',
        anchor: 'Archivos Pago',
        icon: <FiFile size={20} style={{ marginRight: '20px', marginLeft: '7px' }} />,
        items: [
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Listar',
            to: '/archivoflujo/archivos',
          },
        ],
      },
      {
        _component: 'CNavItem',
        anchor: 'Pagos',
        icon: <FiCreditCard size={20} style={{ marginRight: '20px', marginLeft: '7px' }} />,
        as: NavLink,
        to: '/pagos',
      },
    ],
  },
]

export default _nav
