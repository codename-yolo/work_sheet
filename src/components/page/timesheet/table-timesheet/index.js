import React, { useState, useEffect } from 'react'
import { Table, Space, Button, Typography, Modal } from 'antd'
import 'antd/dist/antd.min.css'
import './table-timesheet.scss'
import axios from 'axios'
import ForgetModal from '../../forgetModal/forgetModal'
import LeaveModal from '../../leaveModal/leaveModal'
import moment from 'moment'
import ModalLogTimesheet from '../modalLogtimesheet/ModalLogTimesheet'
const { Text } = Typography

export default function Timesheet({ row }) {
  const [isOpen, setIsOpen] = useState({
    isOpenForget: false,
    isOpenLeave: false,
  })
  const [visible, setVisible] = useState(false)
  const [dataTable, setDataTable] = useState([])
  const getTimeSheet = async () => {
    const res = await axios(`http://127.0.0.1:8000/api/worksheet`)
    setDataTable(res.data)
  }
  useEffect(() => {
    getTimeSheet()
  }, [])

  const handleClickModal = (type) => {
    const modalType = type.toUpperCase()
    switch (modalType) {
      case 'FORGET':
        setIsOpen({
          ...isOpen,
          isOpenForget: !isOpen.isOpenForget,
        })
        break
      case 'LEAVE':
        setIsOpen({
          ...isOpen,
          isOpenLeave: !isOpen.isOpenLeave,
        })
        break
      default:
        throw new Error('err')
    }
  }

  const columns = [
    {
      title: 'No',
      dataIndex: 'key',
      key: 'no',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date) => {
        return (
          <Text onClick={() => setVisible(true)}>
            {moment(date).format('DD/MM/YYYY , ddd')}{' '}
          </Text>
        )
      },
    },
    {
      title: 'Check in',
      dataIndex: 'checkin_original',
      key: 'checkin_original',
    },
    {
      title: 'Check out',
      dataIndex: 'checkout_original',
      key: 'checkout_original',
    },
    {
      title: 'Late',
      dataIndex: 'late',
      key: 'late',
      render: (late) => {
        if (late === '') {
          return ''
        } else return <Text type="danger">{late}</Text>
      },
    },
    {
      title: 'Early',
      dataIndex: 'early',
      key: 'early',
      render: (early) => {
        if (early === '') {
          return ''
        } else return <Text type="danger">{early}</Text>
      },
    },
    {
      title: 'In office',
      dataIndex: 'in_office',
      key: 'in_office',
      render: (inoffice) => {
        if (inoffice < 50) {
          return <Text type="danger">{inoffice}</Text>
        } else return <Text type="default">{inoffice}</Text>
      },
    },
    {
      title: 'Ot',
      dataIndex: 'ot',
      key: 'ot',
    },
    {
      title: 'Work time',
      dataIndex: 'work_time',
      key: 'work_time',
      render: (workTime) => {
        if (workTime < 50) {
          return <Text type="danger">{workTime}</Text>
        } else return <Text type="default">{workTime}</Text>
      },
    },
    {
      title: 'Lack',
      dataIndex: 'lack',
      key: 'lack',
    },
    {
      title: 'Comp',
      dataIndex: 'comp',
      key: 'comp',
    },
    {
      title: 'Pleave',
      dataIndex: 'paid_leave',
      key: 'paid_leave',
    },
    {
      title: 'Uleave',
      dataIndex: 'unpaid_leave',
      key: 'unpaid_leave',
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space>
          <Button
            onClick={() => {
              handleClickModal('forget')
            }}
          >
            Forget
          </Button>

          <Button>Late/Early</Button>

          <Button
            onClick={() => {
              handleClickModal('leave')
            }}
          >
            Leave
          </Button>
        </Space>
      ),
    },
  ]
  return (
    <>
      <Table
        columns={columns}
        dataSource={row}
        pagination={{
          defaultCurrent: 1,
        }}
        sx={{ align: 'center' }}
      />
      <Modal
        title="Time Logs"
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        width={1000}
      >
        <ModalLogTimesheet />
      </Modal>
      {isOpen.isOpenForget && (
        <ForgetModal
          isOpen={isOpen.isOpenForget}
          row={dataTable.map((item) => {
            return item
          })}
          handleCloseForget={() => {
            setIsOpen((isOpen.isOpenForget = false))
          }}
        ></ForgetModal>
      )}
      {isOpen.isOpenLeave && (
        <LeaveModal
          isOpen={isOpen.isOpenLeave}
          row={dataTable}
          handleCloseLeave={() => {
            setIsOpen((isOpen.isOpenLeave = false))
          }}
        ></LeaveModal>
      )}
    </>
  )
}
