import React from 'react'
import { NavLink } from 'react-router-dom'
import { FiFile, FiCreditCard } from 'react-icons/fi'

const pagos = [
  {
    _component: 'CNavItem',
    as: NavLink,
    anchor: 'Archivos Pagos',
    icon: <FiFile size={16} style={{ marginRight: '4px' }} />,
    to: '/archivoflujo',
    objeto: 'Modulo Archivos Pago',
  },
  {
    _component: 'CNavGroup',
    anchor: 'Autorizar Pagos',
    icon: <FiCreditCard size={16} style={{ marginRight: '4px' }} />,
    as: NavLink,
    objeto: 'Modulo Autorizacion Pagos',
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
    objeto: 'Modulo Compensacion Pagos',
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
]

export default pagos
