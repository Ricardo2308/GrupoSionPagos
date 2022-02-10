import React from 'react'
import { NavLink } from 'react-router-dom'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import { FaRegChartBar } from 'react-icons/fa'

const reportes = {
  _component: 'CNavGroup',
  as: NavLink,
  anchor: 'Reportes',
  to: '/to',
  icon: <FaRegChartBar size={20} style={{ marginRight: '10px', marginLeft: '7px' }} />,
  items: [
    {
      _component: 'CNavItem',
      as: NavLink,
      anchor: 'Pagos Pendientes',
      icon: <HiOutlineDocumentReport size={16} style={{ marginRight: '1px' }} />,
      to: '/reportependientes',
    },
    {
      _component: 'CNavItem',
      as: NavLink,
      anchor: 'Pendientes Validación',
      icon: <HiOutlineDocumentReport size={16} style={{ marginRight: '1px' }} />,
      to: '/pendientesvalidacionreporte',
    },
    {
      _component: 'CNavItem',
      as: NavLink,
      anchor: 'Cancelados',
      icon: <HiOutlineDocumentReport size={16} style={{ marginRight: '1px' }} />,
      to: '/reportecancelados',
    },
    {
      _component: 'CNavItem',
      as: NavLink,
      anchor: 'Rechazados',
      icon: <HiOutlineDocumentReport size={16} style={{ marginRight: '1px' }} />,
      to: '/reporterechazados',
    },
  ],
}

export default reportes
