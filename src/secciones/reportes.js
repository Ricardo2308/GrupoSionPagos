import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { HiOutlineDocumentReport } from 'react-icons/hi'
import { FaRegChartBar } from 'react-icons/fa'
import { MenuItem, SubMenu } from 'react-pro-sidebar'

const reportes = (
  <SubMenu key="Reportes" icon={<FaRegChartBar />} title="Reportes">
    <MenuItem key="Reportes1" icon={<HiOutlineDocumentReport />}>
      Pagos Pendientes
      <Link to="/reportependientes" />
    </MenuItem>
    <MenuItem key="Reportes2" icon={<HiOutlineDocumentReport />}>
      Pendientes Validación
      <Link to="/pendientesvalidacionreporte" />
    </MenuItem>
    <MenuItem key="Reportes3" icon={<HiOutlineDocumentReport />}>
      Cancelados
      <Link to="/reportecancelados" />
    </MenuItem>
    <MenuItem key="Reportes4" icon={<HiOutlineDocumentReport />}>
      Rechazados
      <Link to="/reporterechazados" />
    </MenuItem>
    <MenuItem key="Reportes5" icon={<HiOutlineDocumentReport />}>
      Compensados
      <Link to="/reportecompensados" />
    </MenuItem>
    <MenuItem key="Reportes6" icon={<HiOutlineDocumentReport />}>
      No Visados
      <Link to="/reportenovisados" />
    </MenuItem>
    <MenuItem key="Reportes7" icon={<HiOutlineDocumentReport />}>
      Reemplazos
      <Link to="/reportereemplazos" />
    </MenuItem>
  </SubMenu>
)

export default reportes
