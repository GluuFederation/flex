import React, { useEffect } from 'react'
import { getUsers } from '../../redux/actions/UserActions'
import { useDispatch } from 'react-redux'
const UserList = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUsers({}))
  }, [])
  return <div></div>
}
export default UserList
