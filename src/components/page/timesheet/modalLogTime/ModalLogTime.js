import React, { useEffect, useState } from 'react'
import { Modal, Skeleton } from 'antd'
import PropTypes from 'prop-types'
import { get } from '../../../service/requestApi'
import TableCS from '../../../common/table/Table'
import moment from 'moment'
import { dateTime, handleDateTime } from '../../../index'
import './ModalLogTime.scss'

const ModalLogTime = ({ modal, handleClose }) => {
  const [dateList, setDateList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getDateList = async () => {
      const response = await get(`time-log/?work_date=${modal.date}`)
      setDateList(response)
      setLoading(false)
    }
    getDateList()
  }, [])
  const columns = [
    {
      title: <h4>NO</h4>,
      dataIndex: 'id',
      key: 'id',
      render: (payload, records) => {
        return (
          <p className="resetMargin tb_center">
            <> {Number(records.key) + 1}</>
          </p>
        )
      },
    },
    {
      title: <h4>DATE</h4>,
      dataIndex: 'date',
      key: 'date',
      render: (payload) => {
        const check = moment(payload)
        return (
          <p className="resetMargin tb_center">{`${dateTime.formatDateTable(
            payload,
          )} ${check.format('ddd')}`}</p>
        )
      },
    },
    {
      title: <h4>CHECK TIME</h4>,
      dataIndex: 'checktime',
      key: 'checktime',
      render: (payload) => {
        return (
          <p className="resetMargin tb_center">
            {handleDateTime.checkInvalidTime(payload)}
          </p>
        )
      },
    },
  ]

  return (
    <>
      {' '}
      <Modal
        className="modalTimeLog"
        title={<h2>Time Logs</h2>}
        centered
        visible={modal.open}
        onCancel={() => handleClose()}
        width={1000}
      >
        {loading ? (
          <Skeleton active={true} />
        ) : (
          <TableCS
            scroll={{
              x: 500,
            }}
            className="modalTime"
            data={Array.isArray(dateList) ? dateList : []}
            columns={columns}
            width={{ id: '10%' }}
            pagination={{
              pageSize: 100,
            }}
          />
        )}
      </Modal>
    </>
  )
}

ModalLogTime.propTypes = {
  modal: PropTypes.object,
  handleClose: PropTypes.func,
}

export default ModalLogTime
