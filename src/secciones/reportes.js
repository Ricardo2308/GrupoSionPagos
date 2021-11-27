import React from 'react'
import { NavLink } from 'react-router-dom'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import { FaRegChartBar } from 'react-icons/fa'

const reportes = {
  _component: 'CNavGroup',
  as: NavLink,
  anchor: 'Reportes',
  to: '/to',
  icon: <FaRegChartBar size={20} style={{ marginRight: '20px', marginLeft: '7px' }} />,
  items: [
    {
      _component: 'CNavItem',
      as: NavLink,
      anchor: 'Pagos Pendientes',
      icon: <HiOutlineDocumentReport size={18} style={{ marginRight: '4px' }} />,
      to: '/reportependientes',
    },
    {
      _component: 'CNavItem',
      as: NavLink,
      anchor: 'Cancelados Origen',
      icon: <HiOutlineDocumentReport size={18} style={{ marginRight: '4px' }} />,
      to: '/reportecancelados',
    },
    {
      _component: 'CNavItem',
      as: NavLink,
      anchor: 'Pendientes Validación',
      icon: <HiOutlineDocumentReport size={18} style={{ marginRight: '4px' }} />,
      to: '/pendientesvalidacionreporte',
    },
  ],
}

export default reportes
