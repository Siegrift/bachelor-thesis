import React from 'react'
import {
  BooleanField,
  ChipField,
  Create,
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
import {
  createUserValidation,
  editUserValidation,
  requiredField
} from './validation'

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
    <SimpleForm asyncValidate={editUserValidation}>
      <DisabledInput source="id" />
      <TextInput source="name" validate={requiredField} />
      <TextInput label="New password" source="password" type="password" />
      <ReferenceArrayInput label="Groups" reference="groups" source="groups">
        <SelectArrayInput optionText="name" />
      </ReferenceArrayInput>
    </SimpleForm>
  </Edit>
)

export const CreateUser = (props: {}) => (
  <Create {...props}>
    <SimpleForm asyncValidate={createUserValidation}>
      <TextInput source="name" validate={requiredField} />
      <TextInput source="password" type="password" />
      <TextInput source="repeatPassword" type="password" />
    </SimpleForm>
  </Create>
)
