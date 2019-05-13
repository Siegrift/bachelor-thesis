import React from 'react'
import {
  ArrayField,
  BooleanField,
  Datagrid,
  DateField,
  FormTab,
  List,
  ReferenceField,
  Show,
  TabbedForm,
  TextField
} from 'react-admin'
import MuiTextField from '@material-ui/core/TextField'

export const UploadList = (props: {}) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <ReferenceField source="task_id" reference="tasks">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="user_id" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="created_at" showTime={true} />
      <TextField source="name" />
      <BooleanField source="is_autosave" />
    </Datagrid>
  </List>
)

export const ShowFile = (props: any) => {
  return (
    <React.Fragment>
      <MuiTextField
        label="Content"
        fullWidth={true}
        multiline={true}
        disabled={true}
        value={props.record.content}
        variant="outlined"
        style={{ marginTop: '16px', marginBottom: '16px' }}
      />
    </React.Fragment>
  )
}

export const ShowUpload = (props: {}) => (
  <Show {...props}>
    <TabbedForm toolbar={null}>
      <FormTab label="General info">
        <TextField source="id" />
        <ReferenceField source="task_id" reference="tasks">
          <TextField source="name" />
        </ReferenceField>
        <ReferenceField source="user_id" reference="users">
          <TextField source="name" />
        </ReferenceField>
        <DateField source="created_at" showTime={true} />
        <TextField source="name" />
        <BooleanField source="is_autosave" />
      </FormTab>

      <FormTab label="Files">
        <ArrayField source="files">
          <Datagrid rowClick="expand" expand={<ShowFile />}>
            <TextField source="name" />
          </Datagrid>
        </ArrayField>
      </FormTab>
    </TabbedForm>
  </Show>
)
