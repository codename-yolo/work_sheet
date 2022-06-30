import React, { useEffect, useState, useRef, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import RequestDetail from './requestDetail/RequestDetail'
import { checkConfirm } from './checkConfirm'
import { Tag, Button, Modal, Input } from 'antd'
import {
  DoubleLeftOutlined,
  LeftOutlined,
  DoubleRightOutlined,
  RightOutlined,
  CloseCircleOutlined,
  CloseCircleTwoTone,
  SearchOutlined,
} from '@ant-design/icons'
import {
  getRequests,
  putRequestsManager,
  putRequestsReject,
} from './slice/managerSlice'
import { searchFilterChange, filtersRequestSelector } from './slice/filterSlice'
import {
  checkRequestStatus,
  checkRequestStatusColor,
} from '../../../utils/checkRequest'
import {
  endPoint,
  dateTime,
  tryCatch,
  messageRequest,
  CMTable,
} from '../../../index'
import distance from '../../../utils/distance'
import '../../../common/createModal/ModalRequest.scss'
import './Requests.scss'

const Manager = () => {
  const [rowData, setRowData] = useState({})
  const [isOpen, setIsOpen] = useState(false)
  const [reload, setReload] = useState(false)
  const [heighTable, setHeightTable] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [commentEmpty, setCommentEmpty] = useState(false)
  const [searchText, setSearchText] = useState('')
  const commentInput = useRef(null)
  const dispatch = useDispatch()

  const { role: roleUser } = useSelector((state) => state.userInfo?.currentUser)
  const { status } = useSelector((state) => state.managerRequest)
  const requests = useSelector(filtersRequestSelector)

  const handleSearchTextChange = (e) => {
    const value = e.target.value
    setSearchText(value)
    dispatch(searchFilterChange(value))
  }
  useEffect(() => {
    const height = distance('RequestMN', 57)
    setHeightTable(height.heightTable)
  }, [])

  useEffect(() => {
    const getDataRequests = async () => {
      const url =
        roleUser === 'Admin'
          ? endPoint.GET_REQUEST_ADMIN
          : endPoint.GET_REQUEST_MANAGER
      await dispatch(
        getRequests({
          url,
        }),
      )
    }
    getDataRequests()
  }, [reload])

  const dataTable = useMemo(() => {
    const data = requests.map((request) => {
      const newRequest = { key: request.id, ...request }
      return newRequest
    })
    return data
  }, [requests])

  const onClickRejectManager = async () => {
    const comment = commentInput.current.resizableTextArea.props.value
    await tryCatch.handleTryCatch(
      dispatch(
        putRequestsReject({
          url: endPoint.PUT_REQUEST_MANAGER + rowData.id,
          data: {
            status: -1,
            comment: comment ? comment : 'Manager reject request',
          },
        }),
      ),
      messageRequest.MANAGER_REJECT,
      () => {
        setIsOpen(false)
        setReload(!reload)
      },
    )
  }

  const onClickRejectAdmin = async () => {
    const comment = commentInput.current.resizableTextArea.props.value
    await tryCatch.handleTryCatch(
      dispatch(
        putRequestsReject({
          url: endPoint.PUT_REQUEST_ADMIN + rowData.id,
          data: {
            status: -1,
            comment: comment ? comment : 'Admin reject request',
          },
        }),
      ),
      messageRequest.ADMIN_REJECT,
      () => {
        setIsOpen(false)
        setReload(!reload)
      },
    )
  }
  const confirmReject = () => {
    const user = roleUser.toUpperCase()
    const rejectFunction =
      user === 'ADMIN'
        ? onClickRejectAdmin
        : user === 'MANAGER'
        ? onClickRejectManager
        : ''
    Modal.confirm({
      title: 'REQUEST',
      icon: <CloseCircleTwoTone twoToneColor="red" />,
      content: 'Do you want reject request?',
      okText: 'Cancel',
      cancelText: 'OK',
      okButtonProps: {
        type: 'default',
      },
      cancelButtonProps: {
        style: { padding: '0 28px' },
        type: 'primary',
      },
      onCancel: rejectFunction,
    })
  }
  const onSubmit = async (e) => {
    const comment = commentInput.current.resizableTextArea.props.value
    if (!comment.trim()) {
      setCommentEmpty(true)
      return null
    }
    const buttonName = e.target.name
    switch (buttonName) {
      case 'managerConfirm':
        await tryCatch.handleTryCatch(
          dispatch(
            putRequestsManager({
              url: endPoint.PUT_REQUEST_MANAGER + rowData.id,
              data: {
                status: 1,
                comment,
              },
            }),
          ),
          messageRequest.MANAGER_CONFIRMED,
          () => {
            setIsOpen(false)
            setReload(!reload)
          },
        )
        break
      case 'adminApproved':
        await tryCatch.handleTryCatch(
          dispatch(
            putRequestsManager({
              url: endPoint.PUT_REQUEST_ADMIN + rowData.id,
              data: {
                status: 2,
                comment,
              },
            }),
          ),
          messageRequest.ADMIN_APPROVED,
          () => {
            setIsOpen(false)
            setReload(!reload)
          },
        )
        break
      case 'managerReject':
      case 'adminReject':
        confirmReject()
        break
      default:
        throw new Error('An error occurred')
    }
  }

  const confirmCloseModal = () => {
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
        handleCloseModal()
      },
    })
  }
  const handleCloseModal = () => {
    setIsOpen(false)
    setCommentEmpty(false)
  }

  const columns = [
    {
      title: <h4>NO</h4>,
      dataIndex: 'id',
      key: 'id',
      render: (_, record) => {
        return (
          <span className="tb_center">{currentPage - 1 + record.key + 1}</span>
        )
      },
    },
    {
      title: <h4>MEMBER NAME</h4>,
      dataIndex: 'full_name',
      key: 'full_name',
    },
    {
      title: <h4>EMAIL</h4>,
      dataIndex: 'email',
      key: 'email',
      render: (_, record) => {
        return <p className="textOverflow textCenter">{_}</p>
      },
    },
    {
      title: <h4>REQUEST TYPE</h4>,
      dataIndex: 'request_type',
      key: 'request_type',
      render: (type) => {
        switch (type) {
          case 1:
            return <span className="tb_center">Forget</span>
          case 2:
          case 3:
            return <span className="tb_center">Leave</span>
          case 4:
            return <span className="tb_center">Late/Early</span>
          case 5:
            return <span className="tb_center">OT</span>
          default:
            break
        }
      },
    },
    {
      title: <h4>REASON</h4>,
      dataIndex: 'reason',
      key: 'reason',
      render: (reason) => <p className="textOverflow ">{reason}</p>,
    },
    {
      title: <h4>DATE CREATED</h4>,
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => {
        return (
          <span className="tb_center">
            {dateTime.formatDateTimeTable(date)}
          </span>
        )
      },
    },
    {
      title: <h4>STATUS</h4>,
      dataIndex: 'status',
      key: 'status',
      render: (_) => {
        return (
          <>
            <div className="dFlex">
              <Tag color={checkRequestStatusColor(_)}>
                {checkRequestStatus(_)}
              </Tag>
            </div>
          </>
        )
      },
    },
  ]

  const itemRender = (_, type, originalElement) => {
    if (type === 'prev') {
      return (
        <>
          <Button
            icon={<DoubleLeftOutlined />}
            disabled={currentPage === 1}
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
      const lastPage = Math.ceil(dataTable.length / perPage)
      return (
        <>
          <Button
            className="ant-pagination-item"
            disabled={currentPage === lastPage}
            icon={<RightOutlined />}
          ></Button>
          <Button
            disabled={currentPage === lastPage}
            icon={<DoubleRightOutlined />}
            onClick={(e) => {
              e.stopPropagation()
              setCurrentPage(lastPage)
            }}
            className="ant-pagination-item"
          ></Button>
        </>
      )
    }

    return originalElement
  }

  return (
    <div id="RequestMN">
      <div className="searchInput">
        <Input
          size="large"
          placeholder="Search for name or email..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearchTextChange}
        />
      </div>
      {dataTable && (
        <>
          <CMTable
            title={() => {
              return (
                <>
                  <h2>List Request</h2>
                </>
              )
            }}
            loading={status === 'loading'}
            className="tableManager"
            data={dataTable}
            width={{
              id: '5%',
              full_name: '20%',
              email: '25%',
              request_type: '15%',
              reason: '30%',
              created_at: '15%',
              status: '10%',
            }}
            columns={columns}
            onRow={(record) => {
              return {
                onClick: () => {
                  setIsOpen(true)
                  setRowData(record)
                },
              }
            }}
            sorter={{ created_at: 'date', status: 'number' }}
            scroll={{
              x: 1000,
              y: heighTable,
            }}
            styleHead={{
              id: { position: 'tb_center' },
              reason: { position: 'tb_start' },
            }}
            styleBody={{
              full_name: { className: 'textCenter textOverflow' },
            }}
            pagination={{
              current: currentPage,
              onShowSizeChange: (page, size) => {
                setPerPage(size)
              },
              itemRender: itemRender,
              onChange: (size, page) => {
                setCurrentPage(size)
              },
            }}
          />
        </>
      )}
      {isOpen && (
        <Modal
          visible={isOpen}
          title="Request Detail"
          onCancel={checkConfirm(
            rowData.status,
            roleUser,
            handleCloseModal,
            confirmCloseModal,
          )}
          className="modalRequestContainer modalRequests"
          width={900}
          footer={
            roleUser === 'Manager'
              ? rowData.status !== 0
                ? [
                    <Button
                      key="cancel"
                      onClick={checkConfirm(
                        rowData.status,
                        roleUser,
                        handleCloseModal,
                        confirmCloseModal,
                      )}
                      style={{ padding: '0 25px' }}
                    >
                      Cancel
                    </Button>,
                  ]
                : [
                    <Button
                      key="confirm"
                      type="primary"
                      onClick={onSubmit}
                      name="managerConfirm"
                      loading={status === 'loadingManagerUpdate'}
                    >
                      Confirm
                    </Button>,
                    <Button
                      key="cancel"
                      onClick={checkConfirm(
                        rowData.status,
                        roleUser,
                        handleCloseModal,
                        confirmCloseModal,
                      )}
                      style={{ padding: '0 25px' }}
                    >
                      Cancel
                    </Button>,
                    <Button
                      key="reject"
                      type="primary"
                      onClick={onSubmit}
                      loading={status === 'loadingRejectRequest'}
                      style={{ padding: '0 30px' }}
                      name="managerReject"
                      danger
                    >
                      <span onClick={onSubmit}>Reject</span>
                    </Button>,
                  ]
              : roleUser === 'Admin'
              ? rowData.status !== 1
                ? [
                    <Button
                      key="cancel"
                      onClick={checkConfirm(
                        rowData.status,
                        roleUser,
                        handleCloseModal,
                        confirmCloseModal,
                      )}
                      style={{ padding: '0 25px' }}
                    >
                      Cancel
                    </Button>,
                  ]
                : [
                    <Button
                      key="approved"
                      type="primary"
                      onClick={onSubmit}
                      name="adminApproved"
                      loading={status === 'loadingManagerUpdate'}
                    >
                      Approved
                    </Button>,
                    <Button
                      key="cancel"
                      onClick={checkConfirm(
                        rowData.status,
                        roleUser,
                        handleCloseModal,
                        confirmCloseModal,
                      )}
                      style={{ padding: '0 25px' }}
                    >
                      Cancel
                    </Button>,
                    <Button
                      key="reject"
                      type="primary"
                      onClick={onSubmit}
                      loading={status === 'loadingRejectRequest'}
                      style={{ padding: '0 30px' }}
                      name="adminReject"
                      danger
                    >
                      Reject
                    </Button>,
                  ]
              : ''
          }
        >
          <RequestDetail
            row={rowData}
            refInput={commentInput}
            roleUser={roleUser}
            commentInput={{ value: commentEmpty, setEmpty: setCommentEmpty }}
          ></RequestDetail>
        </Modal>
      )}
    </div>
  )
}

export default Manager
