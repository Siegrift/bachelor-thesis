import React from 'react'
import { Datagrid, List, ReferenceField, TextField } from 'react-admin'

export const SubmitList = (props: {}) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" />
      <ReferenceField source="user_id" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="task_id" reference="tasks">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="result" />
    </Datagrid>
  </List>
)
