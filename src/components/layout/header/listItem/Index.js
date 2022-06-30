import React from 'react'
import styles from './Index.module.scss'
import { Row, Col } from 'antd'
import { HomeOutlined, AuditOutlined, UserAddOutlined } from '@ant-design/icons'
import { NavLink } from 'react-router-dom'
import { Dropdown, Menu } from 'antd'
import {
  FormOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
} from '@ant-design/icons'
import { LOCAL_STORAGE } from '../../../constant/localStorage'
import './index.scss'

const Index = () => {
  const role = localStorage.getItem(LOCAL_STORAGE.ROLE)

  const menu = (
    <Menu
      className={styles.subMenu}
      items={[
        {
          key: '1',
          label: (
            <NavLink to={'/admin/manager'} id="subNav">
              List requests
            </NavLink>
          ),
          icon: (
            <DatabaseOutlined style={{ color: '#23466d', fontSize: '14px' }} />
          ),
        },
        {
          key: '2',
          label: (
            <NavLink to={'/admin/change-shift'} id="subNav">
              Change shift
            </NavLink>
          ),
          icon: (
            <ClockCircleOutlined
              style={{ color: '#23466d', fontSize: '14px' }}
            />
          ),
        },
        {
          key: '3',
          label: (
            <NavLink to={'/admin/notification'} id="subNav">
              Create notice
            </NavLink>
          ),
          icon: <FormOutlined style={{ color: '#23466d', fontSize: '14px' }} />,
        },
      ]}
    />
  )
  return (
    <div className={styles.ListItem}>
      <Row style={{ width: '100%', height: '100%' }}>
        {(role === 'Admin' || role === 'Manager') && (
          <>
            <Col xs={24} md={1} xl={3}></Col>
            <Col xs={24} md={7} xl={6} className={styles.column}>
              <NavLink to="/" className={styles.formGroup}>
                <HomeOutlined />
                <h4>HOME</h4>
                <div className={styles.progress} id="progress"></div>
              </NavLink>
            </Col>
            <Col xs={24} md={7} xl={6} className={styles.column}>
              <NavLink to="/timesheet" className={styles.formGroup}>
                <AuditOutlined />
                <h4>TIMESHEET</h4>
                <div className={styles.progress} id="progress"></div>
              </NavLink>
            </Col>

            <Col xs={24} md={7} xl={6} className={styles.column}>
              {role === 'Admin' && (
                <Dropdown overlay={menu}>
                  <NavLink
                    to={'/admin'}
                    className={styles.formGroup}
                    onClick={(e) => e.preventDefault()}
                  >
                    <UserAddOutlined />
                    <h4>MANAGER</h4>
                    <div className={styles.progress} id="progress"></div>
                  </NavLink>
                </Dropdown>
              )}
              {role === 'Manager' && (
                <NavLink to={'/admin/manager'} className={styles.formGroup}>
                  <UserAddOutlined />
                  <h4>MANAGER</h4>
                  <div className={styles.progress} id="progress"></div>
                </NavLink>
              )}
            </Col>
          </>
        )}
        {role === 'Member' && (
          <>
            <Col xs={24} md={8} xl={10}></Col>
            <Col xs={24} md={8} xl={6} className={styles.column}>
              <NavLink to="/" className={styles.formGroup}>
                <HomeOutlined />
                <h4>HOME</h4>
                <div className={styles.progress} id="progress"></div>
              </NavLink>
            </Col>
            <Col xs={24} md={8} xl={6} className={styles.column}>
              <NavLink to="/timesheet" className={styles.formGroup}>
                <AuditOutlined />
                <h4>TIMESHEET</h4>
                <div className={styles.progress} id="progress"></div>
              </NavLink>
            </Col>
            <Col xs={24} md={8} xl={2}></Col>
          </>
        )}
      </Row>
    </div>
  )
}

export default Index
