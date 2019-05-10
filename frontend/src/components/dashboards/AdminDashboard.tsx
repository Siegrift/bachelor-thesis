import React, { Component } from 'react'
import { Admin, Resource } from 'react-admin'
import jsonServerProvider from 'ra-data-json-server'
import { BASE_URL } from '../../constants'
import { EditUser, UserList } from './UserList'
import UserGroupList from './UserGroupList'
import { CreateGroup, EditGroup, GroupList } from './GroupList'

const dataProvider = jsonServerProvider(BASE_URL)

export class AdminDashboard extends Component {
  render() {
    return (
      <Admin dataProvider={dataProvider}>
        <Resource name="users" list={UserList} edit={EditUser} />
        <Resource
          name="groups"
          list={GroupList}
          edit={EditGroup}
          create={CreateGroup}
        />
        <Resource
          options={{ label: 'Connections' }}
          name="userGroups"
          list={UserGroupList}
        />
      </Admin>
    )
  }
}

export default AdminDashboard
