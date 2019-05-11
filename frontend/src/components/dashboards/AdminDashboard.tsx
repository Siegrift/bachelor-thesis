import React, { Component } from 'react'
import { Admin, fetchUtils, Resource } from 'react-admin'
import jsonServerProvider from 'ra-data-json-server'
import { BASE_URL } from '../../constants'
import { CreateUser, EditUser, UserList } from './UserList'
import { CreateUserGroup, EditUserGroup, UserGroupList } from './UserGroupList'
import { CreateGroup, EditGroup, GroupList } from './GroupList'
import UsersIcon from '@material-ui/icons/AccountCircle'
import GroupsIcon from '@material-ui/icons/Group'
import UserGroupsIcon from '@material-ui/icons/SettingsEthernet'

const dataProvider = jsonServerProvider(BASE_URL)

export class AdminDashboard extends Component {
  render() {
    return (
      <Admin dataProvider={dataProvider}>
        <Resource
          name="users"
          list={UserList}
          edit={EditUser}
          create={CreateUser}
          icon={UsersIcon}
        />
        <Resource
          name="groups"
          list={GroupList}
          edit={EditGroup}
          create={CreateGroup}
          icon={GroupsIcon}
        />
        <Resource
          name="userGroups"
          list={UserGroupList}
          edit={EditUserGroup}
          create={CreateUserGroup}
          icon={UserGroupsIcon}
          options={{ label: 'Connections' }}
        />
      </Admin>
    )
  }
}

export default AdminDashboard
