import { Admin, ListGuesser, Resource } from 'react-admin'
import {
  CreateUserGroup,
  ShowUserGroup,
  UserGroupList
} from './UserGroupResource'
import jsonServerProvider from 'ra-data-json-server'
import { BASE_URL } from '../../constants'
import { CreateUser, EditUser, UserList } from './UserResource'
import React, { Component } from 'react'
import { CreateGroup, EditGroup, GroupList } from './GroupResource'
import UsersIcon from '@material-ui/icons/AccountCircle'
import GroupsIcon from '@material-ui/icons/Group'
import UploadsIcon from '@material-ui/icons/Unarchive'
import SubmitsIcon from '@material-ui/icons/Computer'
import UserGroupsIcon from '@material-ui/icons/SettingsEthernet'
import TasksIcon from '@material-ui/icons/Assignment'
import { CreateTask, EditTask, TaskList } from './TaskResource'
import { ShowTask, SubmitList } from './SubmitResource'
import { ShowUpload, UploadList } from './UploadResource'

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
          create={CreateUserGroup}
          show={ShowUserGroup}
          icon={UserGroupsIcon}
          options={{ label: 'Connections' }}
        />
        <Resource
          name="tasks"
          list={TaskList}
          edit={EditTask}
          create={CreateTask}
          icon={TasksIcon}
        />
        <Resource
          name="uploads"
          list={UploadList}
          show={ShowUpload}
          icon={UploadsIcon}
        />
        <Resource
          name="submits"
          list={SubmitList}
          show={ShowTask}
          icon={SubmitsIcon}
        />
      </Admin>
    )
  }
}

export default AdminDashboard
