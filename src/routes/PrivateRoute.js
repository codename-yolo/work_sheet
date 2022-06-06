import { LOCAL_STORAGE } from '../components/constant/localStorage'
import React from 'react'
import { useLocation, Navigate, Outlet } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

const PrivateRoute = ({ allowedRoles }) => {
  const location = useLocation()

  const role = useSelector((state) => state.userInfo?.currentUser?.role)

  let auth = []
  if (role === 'Member') {
    auth = [1]
  } else if (role === 'Manager') {
    auth = [1, 2]
  } else if (role === 'Admin') {
    auth = [1, 3]
  } else {
    auth = []
  }

  const tokenAccess = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN)

  return auth?.find((role) => allowedRoles?.includes(role)) ? (
    <Outlet />
  ) : !tokenAccess ? (
    <Navigate to="/login" state={{ from: location }} replace />
  ) : (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  )
}

PrivateRoute.propTypes = {
  allowedRoles: PropTypes.array,
}

export default PrivateRoute
