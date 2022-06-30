import React, { useState, useEffect } from 'react'
import { Modal, Row, Col, Select, Button } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import { get, put } from '../../../service/requestApi'
import PropTypes from 'prop-types'
import { typePopup } from '../../../index'
import './ChangeShift.scss'
import { checkShift } from './checkShift'
const ModalChangeShift = ({ modal, handleClose, handleUpdate }) => {
  const [shift, setShift] = useState(modal.data.shift_id)
  const [shiftList, setShiftList] = useState([])
  const [loading, setLoading] = useState(false)

  const { Option } = Select

  useEffect(() => {
    const getShiftList = async () => {
      const response = await get('admin/shift/index')
      setShiftList(response.data)
    }
    getShiftList()
  }, [])

  const handleChange = (value) => {
    setShift(value)
  }

  const handleSubmit = async () => {
    setLoading(true)
    const response = await put(`admin/shift/update/${modal.data.id}`, {
      shift_id: shift,
    })
    if (response.status) {
      typePopup.popupNotice(
        typePopup.SUCCESS_MESSAGE,
        'Update Success',
        'Change Shift',
      )
      setLoading(false)
      handleUpdate()
      handleClose()
    } else {
      typePopup.popupNotice(
        typePopup.ERROR_MESSAGE,
        'Update Failed',
        'Change Shift',
      )
    }
  }
  const confirm = () => {
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
        handleClose()
      },
    })
  }
  return (
    <>
      <Modal
        wrapClassName="change_Shift"
        okText="Submit"
        title={<h2>Change Shift</h2>}
        visible={modal.isOpen}
        footer={[
          <Button
            loading={loading}
            key="submit"
            type="primary"
            onClick={handleSubmit}
          >
            Submit
          </Button>,
          <Button key="cancel" onClick={confirm}>
            Cancel
          </Button>,
        ]}
        width={500}
        onCancel={confirm}
        onOk={handleSubmit}
      >
        <div className="userInfo">
          <Row>
            <Col xl={24} className="dFlex">
              <Col xl={8}>Member Name:</Col>
              <Col xl={16}>{modal.data.member_name}</Col>
            </Col>
          </Row>
          <Row>
            <Col xl={24} className="dFlex">
              <Col xl={8}>Email:</Col>
              <Col xl={16}> {modal.data.email}</Col>
            </Col>
          </Row>
          <Row>
            <Col xl={24} className="dFlex">
              <Col xl={8}> Division:</Col>
              <Col xl={16}> {modal.data.division_name}</Col>
            </Col>
          </Row>
          <Row style={{ margin: 0 }}>
            <Col xl={24} className="dFlex">
              <Col xl={8} style={{ alignSelf: 'center' }}>
                Shift:
              </Col>
              <Col xl={16}>
                <Select
                  defaultValue={`${modal.data.shift_name} - (${modal.data.check_in} - ${modal.data.check_out})`}
                  style={{
                    width: 155,
                  }}
                  onChange={handleChange}
                >
                  {shiftList &&
                    shiftList.map((item) => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {checkShift(
                            item.shift_name,
                            item.check_in,
                            item.check_out,
                          )}
                        </Option>
                      )
                    })}
                </Select>
              </Col>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  )
}
ModalChangeShift.propTypes = {
  modal: PropTypes.object,
  handleClose: PropTypes.func,
  handleUpdate: PropTypes.func,
}

export default ModalChangeShift
