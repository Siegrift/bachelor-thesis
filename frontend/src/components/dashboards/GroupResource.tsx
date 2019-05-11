import React from 'react'
import {
  Create,
  Datagrid,
  DisabledInput,
  Edit,
  Filter,
  List,
  SimpleForm,
  TextField,
  TextInput
} from 'react-admin'
import { groupNameUniqueValidation, requiredField } from './validation'

const GroupFilter = (props: {}) => (
  <Filter {...props}>
    <TextInput label="Search by name" source="name" alwaysOn={true} />
  </Filter>
)

export const GroupList = (props: {}) => (
  <List filters={<GroupFilter />} {...props}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="id" />
    </Datagrid>
  </List>
)

export const EditGroup = (props: {}) => (
  <Edit {...props}>
    <SimpleForm asyncValidate={groupNameUniqueValidation}>
      <DisabledInput source="id" />
      <TextInput source="name" validate={requiredField} />
    </SimpleForm>
  </Edit>
)

export const CreateGroup = (props: {}) => (
  <Create {...props}>
    <SimpleForm asyncValidate={groupNameUniqueValidation}>
      <TextInput source="name" validate={requiredField} />
    </SimpleForm>
  </Create>
)
