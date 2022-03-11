import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FiFile, FiCreditCard } from 'react-icons/fi'
import { MenuItem, SubMenu } from 'react-pro-sidebar'

const pagos = [
  {
    objeto: 'Modulo Archivos Pago',
    menu: (
      <MenuItem key="archivoflujo" icon={<FiFile />}>
        Archivos Pagos
        <Link to="/archivoflujo" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo Autorizacion Pagos',
    menu: (
      <SubMenu key="AutorizarPagos" icon={<FiCreditCard />} title="Autorizar Pagos">
        <MenuItem key="AutorizarPagos1">
          Bancaria
          <Link to="/pagos/bancario" />
        </MenuItem>
        <MenuItem key="AutorizarPagos2">
          Transferencia
          <Link to="/pagos/transferencia" />
        </MenuItem>
        <MenuItem key="AutorizarPagos3">
          Interna
          <Link to="/pagos/interna" />
        </MenuItem>
      </SubMenu>
    ),
  },
  {
    objeto: 'Modulo Compensacion Pagos',
    menu: (
      <SubMenu key="CompensarPagos" icon={<FiCreditCard />} title="Compensar Pagos">
        <MenuItem key="CompensarPagos1">
          Bancaria
          <Link to="/compensacion/bancario" />
        </MenuItem>
        <MenuItem key="CompensarPagos2">
          Transferencia
          <Link to="/compensacion/transferencia" />
        </MenuItem>
        <MenuItem key="CompensarPagos3">
          Interna
          <Link to="/compensacion/interna" />
        </MenuItem>
      </SubMenu>
    ),
  },
]

export default pagos
