import React from 'react'
import {
  Create,
  Datagrid,
  DisabledInput,
  Edit,
  List,
  SimpleForm,
  TextField,
  TextInput
} from 'react-admin'
import { requiredField } from './validation'

type Props = {}

export const GroupList = (props: Props) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="id" />
    </Datagrid>
  </List>
)

export const EditGroup = (props: {}) => (
  <Edit {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="name" validate={requiredField} />
    </SimpleForm>
  </Edit>
)

export const CreateGroup = (props: {}) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="name" validate={requiredField} />
    </SimpleForm>
  </Create>
)
