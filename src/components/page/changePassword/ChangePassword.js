import React, { useState } from 'react'
import { Form, Input, Modal, Button } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import { typePopup } from '../../index'
import './ChangePassword.scss'
import { patch } from '../../service/requestApi'
import { LOCAL_STORAGE } from '../../constant/localStorage'

const ChangePassword = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [form] = Form.useForm()

  const onFinish = async (values) => {
    const {
      old_password: oldPassword,
      new_password: newPass,
      new_password_confirmation: passConfirm,
    } = values
    setLoading(true)

    try {
      const res = await patch('/change-password', {
        old_password: oldPassword,
        new_password: newPass,
        new_password_confirmation: passConfirm,
      })
      setLoading(false)
      if (res.status === 'success') {
        setIsModalVisible(false)
        setLoading(false)
        form.resetFields()
        typePopup.popupNotice(
          typePopup.SUCCESS_MESSAGE,
          'Success',
          'Change Password Successful',
        )
      }
    } catch (e) {
      setLoading(false)
      setError(true)
      form.resetFields()
      typePopup.popupNotice(
        typePopup.ERROR_MESSAGE,
        'Failed',
        'Change Password Failed',
      )
    }
  }

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
    setError(false)
  }

  const confirmCancel = () => {
    Modal.confirm({
      title: 'Modal',
      icon: <CloseCircleOutlined />,
      content: 'Do you want close modal ?',
      okText: 'Cancel',
      cancelText: 'OK',
      okButtonProps: {
        type: 'default',
      },
      cancelButtonProps: {
        style: { padding: '0 28px' },
        type: 'primary',
      },
      onCancel() {
        handleCancel()
      },
    })
  }

  const emailUser = JSON.parse(localStorage.getItem(LOCAL_STORAGE.INF_USER))

  return (
    <div>
      <h3 onClick={showModal}>Change Password</h3>
      <Modal
        title={<h3 style={{ color: 'white', margin: '0' }}>Change Password</h3>}
        className="ChangePassword"
        visible={isModalVisible}
        onCancel={confirmCancel}
        footer={[
          <Button
            type="primary"
            htmlType="submit"
            key="submit"
            form="myForm"
            loading={loading}
          >
            Submit
          </Button>,
          <Button
            style={{ marginLeft: 20 }}
            onClick={confirmCancel}
            key="cancel"
          >
            Cancel
          </Button>,
        ]}
        width={600}
      >
        <Form
          form={form}
          id="myForm"
          name="basic"
          labelAlign="left"
          labelCol={{
            span: 7,
          }}
          wrapperCol={{
            span: 15,
          }}
          initialValues={{
            email: emailUser?.email,
            Password: '',
          }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="Email" name="email" rules={[]} className="email">
            <Input disabled={true} />
          </Form.Item>

          <Form.Item
            label="Old Password: "
            name="old_password"
            rules={[
              {
                required: true,
                message: 'Required to enter password!!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          {error && (
            <p
              style={{
                color: 'red',
                paddingLeft: '29.16666667%',
                position: 'relative',
                top: '-20px',
              }}
            >
              Wrong old password !!!
            </p>
          )}

          <Form.Item
            label="New Password:"
            name="new_password"
            rules={[
              {
                required: true,
                message: 'Required to enter password!!',
              },
              {
                min: 6,
                message: 'Min length 6!!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="new_password_confirmation"
            label="Confirm Password:"
            dependencies={['new_password']}
            hasFeedback
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('new_password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(
                    new Error(
                      'The two passwords that you entered do not match!',
                    ),
                  )
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ChangePassword
