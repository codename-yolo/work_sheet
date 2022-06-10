import React, { useState } from 'react'
import { Form, Input, Button } from 'antd'
import { useDispatch } from 'react-redux'
import styles from './Login.module.scss'
import { typePopup } from '../../index'
import { LOCAL_STORAGE } from '../../constant/localStorage'
import { useNavigate } from 'react-router-dom'
import { loginAccess } from './slice/sliceLogin'
import { login } from '../../service/authService'

const Login = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const onSubmit = async (values) => {
    try {
      setLoading(true)
      const res = await login(values)
      setLoading(false)
      await dispatch(
        loginAccess({
          role: res.data.role,
          tokenAccess: res.access_token,
        }),
      )
      await localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, res.access_token)
      await localStorage.setItem(LOCAL_STORAGE.ROLE, res.data.role)
      await localStorage.setItem(
        LOCAL_STORAGE.INF_USER,
        JSON.stringify({
          avatar: res.data.avatar,
          name: res.data.full_name,
        }),
      )
      typePopup.popupNotice(
        typePopup.SUCCESS_MESSAGE,
        'Success',
        'Login Successful',
      )
      navigate('/', { replace: true })
    } catch (e) {
      typePopup.popupNotice(typePopup.ERROR_MESSAGE, 'Failed', 'Login Failed')
      setLoading(false)
    }
  }

  return (
    <>
      <div className={styles.LoginContainer}>
        <Form
          name="basic"
          initialValues={{}}
          onFinish={(values) => onSubmit(values)}
          autoComplete="off"
        >
          <h1 style={{ textAlign: 'center' }}>LOGIN</h1>
          <Form.Item
            name="email"
            className={styles.InputField}
            labelAlign="left"
            rules={[
              {
                required: true,
                message: 'Required to enter email!',
              },
              {
                type: 'email',
                message: 'Enter a valid email address!',
              },
            ]}
          >
            <Input className={styles.Input} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            labelAlign="left"
            rules={[
              {
                required: true,
                message: 'Required to enter password!!',
              },
            ]}
          >
            <Input.Password className={styles.Input} placeholder="Password" />
          </Form.Item>

          <Form.Item className={styles.ItemSignin}>
            <Button
              className={styles.Button}
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Sign in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  )
}

export default Login