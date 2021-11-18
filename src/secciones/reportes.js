import React from 'react'
import { NavLink } from 'react-router-dom'
import { FiCreditCard } from 'react-icons/fi'
import { FaRegListAlt } from 'react-icons/fa'

const reportes = [
  {
    _component: 'CNavItem',
    as: NavLink,
    anchor: 'Pagos Pendientes',
    icon: <FiCreditCard size={16} style={{ marginRight: '4px' }} />,
    to: '/reportependientes',
  },
  {
    _component: 'CNavItem',
    as: NavLink,
    anchor: 'Días Conectados',
    icon: <FaRegListAlt size={16} style={{ marginRight: '4px' }} />,
    to: '/to',
  },
]

export default reportes
