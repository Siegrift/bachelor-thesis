import React from 'react'
import {
  Create,
  Datagrid,
  DisabledInput,
  Edit,
  Filter,
  List,
  ReferenceField,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextField,
  TextInput
} from 'react-admin'
import { uniqueUserGroupValidation } from './validation'

const UserGroupFilter = (props: {}) => (
  <Filter {...props}>
    <TextInput label="User id" source="user_id" />
    <TextInput label="Group id" source="group_id" />
  </Filter>
)

export const UserGroupList = (props: {}) => (
  <List filters={<UserGroupFilter />} {...props}>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ReferenceField source="user_id" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="group_id" reference="groups">
        <TextField source="name" />
      </ReferenceField>
    </Datagrid>
  </List>
)

export const EditUserGroup = (props: {}) => (
  <Edit {...props}>
    <SimpleForm>
      <DisabledInput source="id" />
      <DisabledInput label="User id" source="user_id" />
      <DisabledInput label="Group id" source="group_id" />
    </SimpleForm>
  </Edit>
)

export const CreateUserGroup = (props: {}) => (
  <Create {...props}>
    <SimpleForm asyncValidate={uniqueUserGroupValidation}>
      <ReferenceInput label="User id" source="userId" reference="users">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <ReferenceInput label="Group id" source="groupId" reference="groups">
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
)
