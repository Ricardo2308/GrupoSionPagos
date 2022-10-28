import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { FiFile, FiCreditCard, FiEye } from 'react-icons/fi'
import { MenuItem, SubMenu } from 'react-pro-sidebar'
import { FaFlag } from 'react-icons/fa'

const pagos = [
  {
    objeto: 'Modulo Archivos Pago',
    menu: (
      <MenuItem key="flujosconarchivo" icon={<FiFile />}>
        Archivos Pagos
        <Link to="/flujosconarchivo" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo Reasignador',
    menu: (
      <MenuItem key="reasignacionresponsable" icon={<FaFlag />}>
        Reasignación de responsable
        <Link to="/reasignacion" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo Consultor',
    menu: (
      <MenuItem key="consultor" icon={<FiEye />}>
        Consultor de pagos
        <Link to="/consultor" />
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
        <MenuItem key="AutorizarPagos3">
          Interna
          <Link to="/pagos/interna" />
        </MenuItem>
        <MenuItem key="AutorizarPagos2">
          Transferencia
          <Link to="/pagos/transferencia" />
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
        <MenuItem key="CompensarPagos3">
          Interna
          <Link to="/compensacion/interna" />
        </MenuItem>
        <MenuItem key="CompensarPagos2">
          Transferencia
          <Link to="/compensacion/transferencia" />
        </MenuItem>
      </SubMenu>
    ),
  },
]

export default pagos
