import React from 'react'
import { Link, NavLink } from 'react-router-dom'
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
import { MenuItem, SubMenu } from 'react-pro-sidebar'

const configuracion = [
  {
    objeto: 'Modulo Condiciones',
    menu: (
      <MenuItem key="condiciones" icon={<FiAlertOctagon />}>
        Condiciones
        <Link to="/condiciones" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo Grupos Autorizacion',
    menu: (
      <MenuItem key="grupos" icon={<FiUsers />}>
        Grupos
        <Link to="/grupos" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo Autorizacion',
    menu: (
      <MenuItem key="autorizacion" icon={<FiThumbsUp />}>
        Autorizacion
        <Link to="/autorizacion" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo Estados Pago',
    menu: (
      <MenuItem key="estadosflujo" icon={<FiGrid />}>
        Estado Pago
        <Link to="/estadosflujo" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo Tipos Flujo',
    menu: (
      <MenuItem key="tipoflujo" icon={<FiGitPullRequest />}>
        Tipo Flujo
        <Link to="/tipoflujo" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo Bancos',
    menu: (
      <MenuItem key="bancos" icon={<RiBankLine />}>
        Bancos
        <Link to="/bancos" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo Monedas',
    menu: (
      <MenuItem key="monedas" icon={<FaCoins />}>
        Monedas
        <Link to="/monedas" />
      </MenuItem>
    ),
  },
  {
    objeto: 'Modulo Cuentas',
    menu: (
      <MenuItem key="cuentas" icon={<FiCreditCard />}>
        Cuentas
        <Link to="/cuentas" />
      </MenuItem>
    ),
  },
]

export default configuracion
