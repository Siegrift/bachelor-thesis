import React from 'react'
import {
  BooleanField,
  ChipField,
  Datagrid,
  DisabledInput,
  Edit,
  Filter,
  List,
  ReferenceArrayField,
  ReferenceArrayInput,
  SelectArrayInput,
  SimpleForm,
  SingleFieldList,
  TextField,
  TextInput
} from 'react-admin'
import { requiredField } from './validation'

const UserFilter = (props: {}) => (
  <Filter {...props}>
    <TextInput label="Search by name" source="name" alwaysOn={true} />
  </Filter>
)

export const UserList = (props: {}) => (
  <List filters={<UserFilter />} {...props}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="id" />
      <BooleanField source="is_admin" />
      <ReferenceArrayField label="Groups" reference="groups" source="groups">
        <SingleFieldList>
          <ChipField source="name" />
        </SingleFieldList>
      </ReferenceArrayField>
    </Datagrid>
  </List>
)

export const EditUser = (props: {}) => (
  <Edit {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <TextInput source="name" validate={requiredField} />
      <TextInput source="password" type="password" />
      <ReferenceArrayInput label="Groups" reference="groups" source="groups">
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
)
