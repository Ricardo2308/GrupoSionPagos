import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  FiGitPullRequest,
  FiUsers,
  FiGrid,
  FiAlertOctagon,
  FiThumbsUp,
  FiCreditCard,
} from 'react-icons/fi'
import { RiBankLine } from 'react-icons/ri'
import { FaCoins } from 'react-icons/fa'

const configuracion = [
  {
    _component: 'CNavItem',
    as: NavLink,
    anchor: 'Condiciones',
    icon: <FiAlertOctagon size={16} style={{ marginRight: '4px' }} />,
    to: '/condiciones',
    objeto: 'Modulo Condiciones',
  },
  {
    _component: 'CNavItem',
    as: NavLink,
    anchor: 'Grupos',
    icon: <FiUsers size={16} style={{ marginRight: '4px' }} />,
    to: '/grupos',
    objeto: 'Modulo Grupos Autorizacion',
  },
  {
    _component: 'CNavItem',
    as: NavLink,
    anchor: 'Autorizacion',
    icon: <FiThumbsUp size={16} style={{ marginRight: '4px' }} />,
    to: '/autorizacion',
    objeto: 'Modulo Autorizacion',
  },
  {
    _component: 'CNavItem',
    as: NavLink,
    anchor: 'Estado Pago',
    icon: <FiGrid size={16} style={{ marginRight: '4px' }} />,
    to: '/estadosflujo',
    objeto: 'Modulo Estados Pago',
  },
  {
    _component: 'CNavItem',
    as: NavLink,
    anchor: 'Tipo Flujo',
    icon: <FiGitPullRequest size={16} style={{ marginRight: '4px' }} />,
    to: '/tipoflujo',
    objeto: 'Modulo Tipos Flujo',
  },
  {
    _component: 'CNavItem',
    as: NavLink,
    anchor: 'Bancos',
    icon: <RiBankLine size={18} style={{ marginRight: '4px' }} />,
    to: '/bancos',
    objeto: 'Modulo Bancos',
  },
  {
    _component: 'CNavItem',
    as: NavLink,
    anchor: 'Monedas',
    icon: <FaCoins size={16} style={{ marginRight: '4px' }} />,
    to: '/monedas',
    objeto: 'Modulo Monedas',
  },
  {
    _component: 'CNavItem',
    as: NavLink,
    anchor: 'Cuentas',
    icon: <FiCreditCard size={16} style={{ marginRight: '4px' }} />,
    to: '/cuentas',
    objeto: 'Modulo Cuentas',
  },
]

export default configuracion
