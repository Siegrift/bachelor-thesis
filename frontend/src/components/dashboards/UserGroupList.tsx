import React from 'react'
import {
  Datagrid,
  Filter,
  List,
  ReferenceField,
  TextField,
  TextInput
} from 'react-admin'

const UserGroupFilter = (props: {}) => (
  <Filter {...props}>
    <TextInput label="Group id" source="groupId" />
    <TextInput label="User id" source="userId" />
  </Filter>
)

const UserGroupList = (props: {}) => (
  <List filters={<UserGroupFilter />} {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ReferenceField source="group_id" reference="groups">
        <TextField source="id" />
      </ReferenceField>
      <ReferenceField source="user_id" reference="users">
        <TextField source="id" />
      </ReferenceField>
    </Datagrid>
  </List>
)

export default UserGroupList
