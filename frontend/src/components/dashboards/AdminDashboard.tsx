import { Admin, Resource } from 'react-admin'
import {
  CreateUserGroup,
  EditUserGroup,
  UserGroupList
} from './UserGroupResource'
import jsonServerProvider from 'ra-data-json-server'
import { BASE_URL } from '../../constants'
import { CreateUser, EditUser, UserList } from './UserResource'
import React, { Component } from 'react'
import { CreateGroup, EditGroup, GroupList } from './GroupResource'
import UsersIcon from '@material-ui/icons/AccountCircle'
import GroupsIcon from '@material-ui/icons/Group'
import UserGroupsIcon from '@material-ui/icons/SettingsEthernet'
import ProblemsIcon from '@material-ui/icons/Assignment'
import { CreateProblem, EditProblem, ProblemList } from './ProblemResource'

const dataProvider = jsonServerProvider(BASE_URL)

export class AdminDashboard extends Component {
  componentDidMount() {
    [...(document.getElementsByClassName('fixedWindow') as any)].forEach(
      (elem) => {
        elem.classList.toggle('fixedWindow')
      },
    )
  }

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
        <Resource
          name="problems"
          list={ProblemList}
          edit={EditProblem}
          create={CreateProblem}
          icon={ProblemsIcon}
        />
      </Admin>
    )
  }
}

export default AdminDashboard
