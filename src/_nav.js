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
import { RiBankLine } from 'react-icons/ri'
import { FaCoins } from 'react-icons/fa'
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
        icon: <FiUsers size={16} style={{ marginRight: '4px' }} />,
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
        icon: <BiUserCircle size={18} style={{ marginRight: '4px' }} />,
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
        icon: <FiSettings size={16} style={{ marginRight: '4px' }} />,
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
        icon: <FiUserCheck size={16} style={{ marginRight: '4px' }} />,
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
        icon: <FiBook size={16} style={{ marginRight: '4px' }} />,
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
        icon: <FiAlertOctagon size={16} style={{ marginRight: '4px' }} />,
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
        icon: <FiUsers size={16} style={{ marginRight: '4px' }} />,
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
        icon: <FiThumbsUp size={16} style={{ marginRight: '4px' }} />,
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
        icon: <FiGrid size={16} style={{ marginRight: '4px' }} />,
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
        icon: <FiGitPullRequest size={16} style={{ marginRight: '4px' }} />,
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
        icon: <FiFile size={16} style={{ marginRight: '4px' }} />,
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
        _component: 'CNavGroup',
        anchor: 'Bancos',
        icon: <RiBankLine size={18} style={{ marginRight: '4px' }} />,
        items: [
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Nuevo',
            to: '/bancos/nuevo',
          },
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Listar',
            to: '/bancos/bancos',
          },
        ],
      },
      {
        _component: 'CNavGroup',
        anchor: 'Monedas',
        icon: <FaCoins size={16} style={{ marginRight: '4px' }} />,
        items: [
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Nueva',
            to: '/monedas/nueva',
          },
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Listar',
            to: '/monedas/monedas',
          },
        ],
      },
      {
        _component: 'CNavGroup',
        anchor: 'Cuentas',
        icon: <FiCreditCard size={16} style={{ marginRight: '4px' }} />,
        items: [
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Nueva',
            to: '/cuentas/nueva',
          },
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Listar',
            to: '/cuentas/cuentas',
          },
        ],
      },
      {
        _component: 'CNavGroup',
        anchor: 'Autorizar Pagos',
        icon: <FiCreditCard size={16} style={{ marginRight: '4px' }} />,
        as: NavLink,
        items: [
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Bancaria',
            to: '/pagos/bancario',
          },
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Transferencia',
            to: '/pagos/transferencia',
          },
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Interna',
            to: '/pagos/interna',
          },
        ],
      },
      {
        _component: 'CNavGroup',
        anchor: 'Compensar Pagos',
        icon: <FiCreditCard size={17} />,
        as: NavLink,
        items: [
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Bancaria',
            to: '/compensacion/bancario',
          },
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Transferencia',
            to: '/compensacion/transferencia',
          },
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Interna',
            to: '/compensacion/interna',
          },
        ],
      },
    ],
  },
]

export default _nav
