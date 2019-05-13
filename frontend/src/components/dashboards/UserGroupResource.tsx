import React from 'react'
import {
  Create,
  Datagrid,
  DisabledInput,
  Filter,
  List,
  ReferenceField,
  ReferenceInput,
  SelectInput,
  Show,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  TextInput
} from 'react-admin'
import { uniqueUserGroupValidation } from './validation'

const UserGroupFilter = (props: {}) => (
  <Filter {...props}>
    <TextInput label="User id" source="userId" />
    <TextInput label="Group id" source="groupId" />
  </Filter>
)

export const UserGroupList = (props: {}) => (
  <List filters={<UserGroupFilter />} {...props}>
    <Datagrid rowClick="show">
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

export const ShowUserGroup = (props: {}) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField source="user_id" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="group_id" reference="groups">
        <TextField source="name" />
      </ReferenceField>
    </SimpleShowLayout>
  </Show>
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
