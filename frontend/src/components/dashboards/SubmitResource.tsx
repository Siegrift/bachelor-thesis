import React from 'react'
import {
  Datagrid,
  List,
  ReferenceField,
  Show,
  SimpleShowLayout,
  TextField
} from 'react-admin'

// TODO: link to upload

export const SubmitList = (props: {}) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <ReferenceField source="user_id" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="task_id" reference="tasks">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="upload_id" reference="uploads">
        <TextField source="id" />
      </ReferenceField>
      <TextField source="result" />
    </Datagrid>
  </List>
)

export const ShowTask = (props: {}) => (
  <Show {...props} actions={null}>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField reference="users" source="user_id">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField reference="tasks" source="task_id">
        <TextField source="name" />
      </ReferenceField>
    </SimpleShowLayout>
  </Show>
)
