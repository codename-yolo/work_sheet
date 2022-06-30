import React from 'react'
import { Row, Col } from 'antd'
import { NavLink } from 'react-router-dom'
import { Dropdown, Menu } from 'antd'
import { ProfileOutlined, KeyOutlined, LogoutOutlined } from '@ant-design/icons'
import { LOCAL_STORAGE } from '../../../constant/localStorage'
import UserEditForm from '../../../page/editProfileModal/UserEditForm'
import ChangePassword from '../../../page/changePassword/ChangePassword'
import Logout from '../../../page/logout/Logout'
import styles from './Index.module.scss'
import avatarDefault from './avatarDefault.png'

const Index = () => {
  const info = JSON.parse(localStorage.getItem(LOCAL_STORAGE.INF_USER))
  const role = localStorage.getItem(LOCAL_STORAGE.ROLE)
  const menu = (
    <Menu
      className={styles.subMenu}
      items={[
        {
          key: '0',
          type: 'group',
          label: (
            <div style={{ borderBottom: '1px solid #333', cursor: 'default' }}>
              <strong> {info?.name}</strong>
              <div style={{ fontStyle: 'italic', fontSize: '13px' }}>
                {role}
              </div>
            </div>
          ),
        },
        {
          key: '1',
          label: <UserEditForm>Edit Profile</UserEditForm>,
          icon: (
            <ProfileOutlined style={{ color: '#23466d', fontSize: '14px' }} />
          ),
        },
        {
          key: '2',
          label: <ChangePassword>Change Password</ChangePassword>,
          icon: <KeyOutlined style={{ color: '#23466d', fontSize: '14px' }} />,
        },
        {
          key: '3',
          label: <Logout>Sign Out</Logout>,
          icon: (
            <LogoutOutlined style={{ color: '#23466d', fontSize: '14px' }} />
          ),
        },
      ]}
    />
  )

  return (
    <div className={styles.Avatar}>
      <Row>
        <Col xs={4} md={4} xl={4}>
          <Dropdown overlay={menu}>
            <NavLink
              to={'/admin'}
              className={styles.formGroup}
              onClick={(e) => e.preventDefault()}
            >
              <div className={styles.formImg}>
                <div className={styles.Image}>
                  <img
                    src={
                      !info?.avatar.includes('13.215.174.125')
                        ? avatarDefault
                        : info?.avatar
                    }
                    alt="Avatar"
                  />
                </div>
              </div>
            </NavLink>
          </Dropdown>
        </Col>
      </Row>
    </div>
  )
}

export default Index
