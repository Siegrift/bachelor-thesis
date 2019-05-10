import React from 'react'
import { Datagrid, List, ReferenceField, TextField } from 'react-admin'

type Props = {}

const UserGroupList = (props: Props) => (
  <List {...props}>
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
