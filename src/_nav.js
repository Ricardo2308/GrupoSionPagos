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
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'Usuarios',
        to: '/usuarios',
        icon: <FiUsers size={16} style={{ marginRight: '4px' }} />,
      },
      {
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'Perfiles',
        icon: <BiUserCircle size={18} style={{ marginRight: '4px' }} />,
        to: '/perfiles',
      },
      {
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'Roles',
        icon: <FiSettings size={16} style={{ marginRight: '4px' }} />,
        to: '/roles',
      },
      {
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'Permisos',
        icon: <FiUserCheck size={16} style={{ marginRight: '4px' }} />,
        to: 'permisos',
      },
      {
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'Políticas',
        icon: <FiBook size={16} style={{ marginRight: '4px' }} />,
        to: 'politicas',
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
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'Condiciones',
        icon: <FiAlertOctagon size={16} style={{ marginRight: '4px' }} />,
        to: '/condiciones',
      },
      {
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'Grupos',
        icon: <FiUsers size={16} style={{ marginRight: '4px' }} />,
        to: '/grupos',
      },
      {
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'Autorizacion',
        icon: <FiThumbsUp size={16} style={{ marginRight: '4px' }} />,
        to: '/autorizacion',
      },
      {
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'Estado Pago',
        icon: <FiGrid size={16} style={{ marginRight: '4px' }} />,
        to: '/estadosflujo',
      },
      {
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'Tipo Flujo',
        icon: <FiGitPullRequest size={16} style={{ marginRight: '4px' }} />,
        to: '/tipoflujo',
      },
      {
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'Archivos Pago',
        icon: <FiFile size={16} style={{ marginRight: '4px' }} />,
        to: '/archivoflujo',
      },
      {
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'Bancos',
        icon: <RiBankLine size={18} style={{ marginRight: '4px' }} />,
        to: '/bancos',
      },
      {
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'Monedas',
        icon: <FaCoins size={16} style={{ marginRight: '4px' }} />,
        to: '/monedas',
      },
      {
        _component: 'CNavItem',
        as: NavLink,
        anchor: 'Cuentas',
        icon: <FiCreditCard size={16} style={{ marginRight: '4px' }} />,
        to: '/cuentas',
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
