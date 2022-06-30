import React, { useEffect, useState } from 'react'
import { Row, Col, Input, Button } from 'antd'
import {
  DoubleLeftOutlined,
  LeftOutlined,
  DoubleRightOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { SearchOutlined } from '@ant-design/icons'
import { getDataListUser } from './slice/slice'
import { useDispatch, useSelector } from 'react-redux'
import TableCs from '../../../common/table/Table'
import debounce from '../../../utils/debounce'
import distance from '../../../utils/distance'
import Modal from './Modal'
import './ChangeShift.scss'

const ChangeShift = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [modal, setModal] = useState({ isOpen: false, data: [] })
  const [heightTable, setHeightTable] = useState(200)
  const [loading, setLoading] = useState(false)

  const changeShift = useSelector((state) => {
    return state?.changeShift
  })

  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getDataListUser(''))
  }, [loading])

  useEffect(() => {
    const height = distance('change_Shift', 57)
    setHeightTable(height.heightTable)
  }, [])

  const handleUpdate = () => {
    setLoading((prev) => !prev)
  }

  const onChangeData = (e) => {
    dispatch(getDataListUser(e.target.value))
  }

  const handleSearchUser = debounce(onChangeData, 500)

  const handleCloseModal = () => {
    setModal({ isOpen: false, data: [] })
  }

  const onShowSizeChange = (page, size) => {
    setPerPage(size)
  }

  const onChange = (size, page) => {
    setCurrentPage(size)
  }

  const itemRender = (_, type, originalElement) => {
    if (type === 'prev') {
      return (
        <>
          <Button
            disabled={currentPage === 1}
            icon={<DoubleLeftOutlined />}
            onClick={(e) => {
              e.stopPropagation()
              setCurrentPage(1)
            }}
            className="ant-pagination-item"
          ></Button>
          <Button
            className="ant-pagination-item"
            disabled={currentPage === 1}
            icon={<LeftOutlined />}
          ></Button>
        </>
      )
    }

    if (type === 'next') {
      const lastPage = Math.ceil(changeShift.userList.length / perPage)
      return (
        <>
          <Button
            className="ant-pagination-item"
            disabled={currentPage === lastPage}
            icon={<RightOutlined />}
          ></Button>
          <Button
            className="ant-pagination-item"
            disabled={currentPage === lastPage}
            icon={<DoubleRightOutlined />}
            onClick={(e) => {
              e.stopPropagation()
              setCurrentPage(lastPage)
            }}
          ></Button>
        </>
      )
    }

    return originalElement
  }

  const columns = [
    {
      title: <h4>NO</h4>,
      dataIndex: 'id',
      key: 'id',
      render: (payload, record) => {
        return (
          <div className="resetMargin tb_center">
            <> {currentPage - 1 + Number(record.key) + 1}</>
          </div>
        )
      },
    },
    {
      title: <h4 className="tb_center">MEMBER NAME</h4>,
      dataIndex: 'member_name',
      key: 'member_name',
      render: (payload, record) => {
        return <div className="textOverflow tb_center">{payload}</div>
      },
    },
    {
      title: <h4 style={{ textAlign: 'left' }}>EMAIL</h4>,
      dataIndex: 'email',
      key: 'email',
      render: (payload, record) => {
        return <div className="textOverflow">{payload}</div>
      },
    },
    {
      title: <h4>WORK TYPE</h4>,
      dataIndex: 'part_time',
      key: 'part_time',
      render: (payload, record) => {
        return (
          <div className="tb_center">
            {payload === 0 ? 'Full time' : 'Part time'}
          </div>
        )
      },
    },
    {
      title: <h4>DIVISION NAME</h4>,
      dataIndex: 'division_name',
      key: 'division_name',
      render: (payload, record) => {
        return <div className="tb_center">{payload}</div>
      },
    },
    {
      title: <h4>SHIFT NAME</h4>,
      dataIndex: 'shift_name',
      key: 'shift_name',
      render: (payload, record) => {
        const {
          shift_name: shiftName,
          check_in: checkIn,
          check_out: checkOut,
        } = record
        return (
          <div className="tb_center">{`${shiftName} - (${checkIn} - ${checkOut})`}</div>
        )
      },
    },
  ]

  return (
    <div className="ChangeShift" id="change_Shift">
      <Row>
        <Col xs={24} md={22} xl={22}>
          <Input
            size="large"
            placeholder="Search for name..."
            prefix={<SearchOutlined />}
            onChange={handleSearchUser}
          />
          <TableCs
            className="Table__User"
            title={() => {
              return <h2>List Member Shift </h2>
            }}
            data={changeShift.userList}
            columns={columns}
            width={{
              id: '5%',
              member_name: '20%',
              part_time: '15%',
              division_name: '15%',
              shift_name: '15%',
            }}
            loading={changeShift.loading}
            scroll={{
              x: 1000,
              y: heightTable,
            }}
            onRow={(record) => {
              return {
                onClick: () => {
                  setModal({ isOpen: true, data: record })
                },
              }
            }}
            pagination={{
              current: currentPage,
              total: changeShift.userList.length,
              onShowSizeChange: onShowSizeChange,
              itemRender: itemRender,
              onChange: onChange,
            }}
          />
        </Col>
      </Row>
      {modal.isOpen && (
        <Modal
          modal={modal}
          handleClose={handleCloseModal}
          handleUpdate={handleUpdate}
        />
      )}
    </div>
  )
}

export default ChangeShift
