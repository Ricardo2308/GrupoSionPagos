import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  FiLock,
  FiGitPullRequest,
  FiUsers,
  FiGrid,
  FiAlertOctagon,
  FiFile,
  FiThumbsUp,
  FiCreditCard,
} from 'react-icons/fi'
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
            anchor: 'Bancario',
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
        icon: <FiCreditCard size={17} style={{ marginRight: '4px' }} />,
        as: NavLink,
        items: [
          {
            _component: 'CNavItem',
            as: NavLink,
            anchor: 'Bancario',
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
