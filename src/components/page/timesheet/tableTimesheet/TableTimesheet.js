import React, { useState, useEffect } from 'react'
import { Button, Typography } from 'antd'
import ForgetModal from '../../forgetModal/ForgetModal'
import LeaveModal from '../../leaveModal/LeaveModal'
import RegisterOT from '../../registerOT/RegisterOT'
import LateEarlyModal from '../../lateEarlyModal/index/Index'
import moment from 'moment'
import ModalLogTime from '../modalLogTime/ModalLogTime'
import PropTypes from 'prop-types'
import TableCS from '../../../common/table/Table'
import { useDispatch } from 'react-redux'
import { getTimeSheet } from '../slice/slice'
import distance from '../../../utils/distance'
import { handleDateTime } from '../../../index'
import {
  DoubleLeftOutlined,
  LeftOutlined,
  DoubleRightOutlined,
  RightOutlined,
} from '@ant-design/icons'
const { Text } = Typography
import './TableTimesheet.scss'

const TableTimesheet = ({ row, params }) => {
  const [isOpen, setIsOpen] = useState({
    isOpenForget: false,
    isOpenLeave: false,
    isOpenOT: false,
    isOpenLateEarly: false,
  })
  const [checkModal, setCheckModal] = useState({
    row: [],
    name: '',
  })
  const [heightTable, setHeightTable] = useState(0)
  const [modal, setModal] = useState({ open: false, date: '' })
  const dispatch = useDispatch()

  useEffect(() => {
    const height = distance('WorkSheet', 70)
    setHeightTable(height.heightTable)
  }, [])

  const handleModal = () => {
    setModal({ open: false, date: '' })
  }

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
      case 'OT':
        setIsOpen({
          ...isOpen,
          isOpenOT: !isOpen.isOpenOT,
        })
        break
      case 'LATE_EARLY':
        setIsOpen({
          ...isOpen,
          isOpenLateEarly: !isOpen.isOpenLateEarly,
        })
        break
      default:
        throw new Error('err')
    }
  }
  const columns = [
    {
      title: 'NO',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      render: (payload, records) => {
        return <p>{(row.current_page - 1) * 10 + Number(records.key) + 1}</p>
      },
    },
    {
      title: 'DATE',
      dataIndex: 'work_date',
      key: 'work_date',
      fixed: 'left',
      render: (date) => {
        return <Text>{moment(date).format('DD/MM/YYYY ddd')} </Text>
      },
    },
    {
      title: 'CHECK IN',
      dataIndex: 'checkin_original',
      key: 'checkin_original',

      render: (payload, record) => {
        const checkIn = record.checkin
          ? record.checkin
          : payload
          ? payload
          : null
        return <p>{handleDateTime.checkInvalidTime(checkIn)}</p>
      },
    },
    {
      title: 'CHECK OUT',
      dataIndex: 'checkout_original',
      key: 'checkout_original',

      render: (payload, record) => {
        const checkOut = record.checkout
          ? record.checkout
          : payload
          ? payload
          : null
        return <p>{handleDateTime.checkInvalidTime(checkOut)}</p>
      },
    },
    {
      title: 'LATE',
      dataIndex: 'late',
      key: 'late',
      render: (late, record) => {
        let color = 'red'
        if (record.note) {
          const check = record.note.split('|')
          check.map((item) => {
            const element = item.split(' ')
            if (element[0] === 'Late/Early' && element[1] === ' Approved') {
              color = 'black'
            }
          })
        }
        return <p style={{ color: color }}>{late ? late : ''}</p>
      },
    },
    {
      title: 'EARLY',
      dataIndex: 'early',
      key: 'early',
      render: (early, record) => {
        let color = 'red'
        if (record.note) {
          const check = record.note.split('|')
          check.map((item) => {
            const element = item.split(' ')
            if (element[0] === 'Late/Early' && element[1] === ' Approved') {
              color = 'black'
            }
          })
        }
        return <p style={{ color: color }}>{early ? early : ''}</p>
      },
    },
    {
      title: 'IN OFFICE',
      dataIndex: 'in_office',
      key: 'in_office',
      render: (office) => {
        return <p>{office ? office : '--:--'}</p>
      },
    },
    {
      title: 'OT',
      dataIndex: 'ot_time',
      key: 'ot_time',
      render: (ot) => {
        return <p>{ot ? ot : '00:00'}</p>
      },
    },
    {
      title: 'WORK TIME',
      dataIndex: 'work_time',
      key: 'work_time',
      render: (workTime) => {
        return (
          <p
            style={{
              color: workTime === '08:00' ? 'black' : 'red',
            }}
          >
            {workTime ? workTime : ''}
          </p>
        )
      },
    },
    {
      title: 'LACK',
      dataIndex: 'lack',
      key: 'lack',
      render: (payload, record) => {
        let color = null
        if (record.note) {
          const check = record.note.split('|')
          check.map((item) => {
            const status = item.split(' ')
            if (status[1] === 'Approved') {
              const lackTime = payload ? payload : '00:00'
              const compensation = record.compensation
                ? record.compensation
                : '00:00'
              const checkTime =
                Number(lackTime.replace(':', '')) <
                Number(compensation.replace(':', ''))
              color = checkTime ? 'black' : '#ffaa02'
            }
          })
        } else {
          color = 'red'
        }
        return <p style={{ color: color }}>{payload}</p>
      },
    },
    {
      title: <h4>COMP</h4>,
      dataIndex: 'compensation',
      key: 'compensation',
    },
    {
      title: <h4>PLEAVE</h4>,
      dataIndex: 'paid_leave',
      key: 'paid_leave',
    },
    {
      title: <h4>ULEAVE</h4>,
      dataIndex: 'unpaid_leave',
      key: 'unpaid_leave',
    },
    {
      title: <h4>NOTE</h4>,
      dataIndex: 'note',
      key: 'note',
      render: (record) => {
        let arrayNote = record
        if (arrayNote) {
          arrayNote = record.split('|')
          arrayNote = arrayNote.map((item) => {
            const status = item.split(' ')
            return {
              name: status[0],
              status: status[1],
            }
          })
        }
        return (
          <div className="note">
            {record ? (
              <>
                <h4 style={{ margin: 0 }}>
                  {arrayNote.length === 1 ? (
                    <div className="formGroup">
                      <span>{arrayNote[0].name}: </span>
                      <h4
                        style={{
                          color:
                            arrayNote[0].status === 'Approved'
                              ? '#17de17'
                              : arrayNote[0].status === 'Confirmed'
                              ? '#3030ed'
                              : 'red',
                          margin: '0 0 0 10px',
                          position: 'relative',
                        }}
                      >
                        {arrayNote[0].status}
                      </h4>
                    </div>
                  ) : (
                    <div className="formGroup">
                      <span>{arrayNote[0].name}:</span>
                      <h4
                        style={{
                          color:
                            arrayNote[0].status === 'Approved'
                              ? '#17de17'
                              : arrayNote[0].status === 'Confirmed'
                              ? '#3030ed'
                              : 'red',
                          margin: '0 0 0 10px',
                          position: 'relative',
                        }}
                      >
                        {arrayNote[0].status}
                        ...
                      </h4>
                    </div>
                  )}
                  <div className="note__status">
                    {arrayNote.map((item, index) => {
                      const color =
                        item.status === 'Approved'
                          ? '#17de17'
                          : item.status === 'Confirmed'
                          ? '#3030ed'
                          : 'red'
                      return (
                        index !== 0 && (
                          <div className="formGroup" key={index}>
                            <span>{item.name}:</span>
                            <h4 style={{ color: color, margin: ' 0 0 0 5px' }}>
                              {item.status}
                            </h4>
                          </div>
                        )
                      )
                    })}
                  </div>
                </h4>
              </>
            ) : (
              ''
            )}
          </div>
        )
      },
    },
    {
      title: <h4>ACTION</h4>,
      key: 'action',
      fixed: 'right',
      render: (record) => (
        <div className="action">
          <label
            className="action_false"
            size="small"
            onClick={() => {
              setCheckModal((prev) => {
                return {
                  row: record,
                  name: 'forget',
                }
              })
              handleClickModal('forget')
            }}
          >
            <span className="action_false"> Forget</span>
          </label>

          <label
            className="action_false"
            size="small"
            onClick={() => {
              setCheckModal((prev) => {
                return {
                  row: record,
                  name: 'late_early',
                }
              })
              handleClickModal('late_early')
            }}
          >
            <span className="action_false"> Late/Early</span>
          </label>

          <label
            className="action_false"
            size="small"
            onClick={() => {
              setCheckModal((prev) => {
                return {
                  row: record,
                  name: 'leave',
                }
              })
              handleClickModal('leave')
            }}
          >
            <span className="action_false"> Leave</span>
          </label>
          <label
            className="action_false"
            size="small"
            onClick={() => {
              setCheckModal((prev) => {
                return {
                  row: record,
                  name: 'ot',
                }
              })
              handleClickModal('ot')
            }}
          >
            <span className="action_false"> OT</span>
          </label>
        </div>
      ),
    },
  ]

  const onShowSizeChange = (page, size) => {
    dispatch(getTimeSheet({ ...params, page: page, perPage: size }))
  }

  const onChange = (size, page) => {
    dispatch(getTimeSheet({ ...params, page: size, perPage: page }))
  }

  const itemRender = (_, type, originalElement) => {
    if (type === 'prev') {
      return (
        <>
          <Button
            icon={<DoubleLeftOutlined />}
            disabled={row.current_page === 1}
            onClick={(e) => {
              e.stopPropagation()
              dispatch(
                getTimeSheet({ ...params, page: 1, perPage: row.per_page }),
              )
            }}
            className="ant-pagination-item"
          ></Button>
          <Button
            className="ant-pagination-item"
            disabled={row.current_page === 1}
            icon={<LeftOutlined />}
          ></Button>
        </>
      )
    }

    if (type === 'next') {
      return (
        <>
          <Button
            className="ant-pagination-item"
            disabled={row.current_page === row.last_page}
            icon={<RightOutlined />}
          ></Button>
          <Button
            disabled={row.current_page === row.last_page}
            icon={<DoubleRightOutlined />}
            onClick={(e) => {
              e.stopPropagation()
              dispatch(
                getTimeSheet({
                  ...params,
                  page: row.last_page,
                  perPage: row.per_page,
                }),
              )
            }}
            className="ant-pagination-item"
          ></Button>
        </>
      )
    }

    return originalElement
  }

  return (
    <>
      <TableCS
        className="tableTimeSheet"
        loading={row.isLoading}
        scroll={{
          x: 1400,
          y: heightTable,
        }}
        rowClassName={(record) => {
          const checkDate = moment(record.work_date).format('dddd')
          return checkDate === 'Saturday' || checkDate === 'Sunday'
            ? 'row-null'
            : ''
        }}
        columns={columns}
        data={row ? row.data : []}
        width={{
          id: '5%',
          work_date: '12%',
          note: '15%',
          checkin_original: '6%',
          checkout_original: '6%',
          unpaid_leave: '6%',
          paid_leave: '6%',
          in_office: '6%',
          work_time: '6%',
          ot_time: '6%',
          late: '6%',
          early: '6%',
          lack: '6%',
          compensation: '6%',
          paid_leave: '6%',
          unpaid_leave: '6%',
          action: '25%',
        }}
        styleHead={{
          id: { position: 'tb_center' },
          work_date: { position: 'tb_center' },
          note: { position: 'tb_center' },
          checkin_original: { position: 'tb_center' },
          checkout_original: { position: 'tb_center' },
          unpaid_leave: { position: 'tb_center' },
          paid_leave: { position: 'tb_center' },
          in_office: { position: 'tb_center' },
          work_time: { position: 'tb_center' },
          ot_time: { position: 'tb_center' },
          late: { position: 'tb_center' },
          early: { position: 'tb_center' },
          lack: { position: 'tb_center' },
          compensation: { position: 'tb_center' },
          paid_leave: { position: 'tb_center' },
          unpaid_leave: { position: 'tb_center' },
        }}
        onRow={(record) => ({
          onClick: (e) => {
            if (
              e.target.className === 'action' ||
              e.target.className === 'action_false'
            ) {
              e.stopPropagation()
            } else {
              setModal({ open: true, date: record.work_date })
            }
          },
        })}
        pagination={{
          current: row.current_page,
          total: row.total,
          onShowSizeChange: onShowSizeChange,
          itemRender: itemRender,
          onChange: onChange,
        }}
      />
      {modal.open && <ModalLogTime modal={modal} handleClose={handleModal} />}

      {isOpen.isOpenForget && (
        <ForgetModal
          isOpen={true}
          row={checkModal.row}
          handleCloseForget={() => {
            setIsOpen((isOpen.isOpenForget = false))
          }}
        ></ForgetModal>
      )}
      {isOpen.isOpenLateEarly && (
        <LateEarlyModal
          isOpen={true}
          row={checkModal.row}
          handleCloseLateEarly={() => {
            setIsOpen((isOpen.isOpenLateEarly = false))
          }}
        ></LateEarlyModal>
      )}
      {isOpen.isOpenLeave && (
        <LeaveModal
          isOpen={true}
          row={checkModal.row}
          handleCloseLeave={() => {
            setIsOpen((isOpen.isOpenLeave = false))
          }}
        ></LeaveModal>
      )}
      {isOpen.isOpenOT && (
        <RegisterOT
          isOpen={true}
          row={checkModal.row}
          handleCloseOT={() => {
            setIsOpen((isOpen.isOpenOT = false))
          }}
        />
      )}
    </>
  )
}
TableTimesheet.propTypes = {
  row: PropTypes.object,
  params: PropTypes.object,
}

export default TableTimesheet
