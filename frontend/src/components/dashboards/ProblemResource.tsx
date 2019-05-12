import React from 'react'
import {
  ArrayInput,
  Create,
  Datagrid,
  DisabledInput,
  Edit,
  Filter,
  FormTab,
  List,
  LongTextInput,
  ReferenceField,
  ReferenceInput,
  SelectInput,
  SimpleFormIterator,
  TabbedForm,
  TextField,
  TextInput
} from 'react-admin'
import { problemValidation, requiredField } from './validation'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

const ProblemFilter = (props: {}) => (
  <Filter {...props}>
    <TextInput label="Search by name" source="name" alwaysOn={true} />
  </Filter>
)

export const ProblemList = (props: {}) => (
  <List filters={<ProblemFilter />} {...props}>
    <Datagrid rowClick="edit">
      <TextField source="name" />
      <TextField source="id" />
      <ReferenceField source="group_id" reference="groups">
        <TextField source="name" />
      </ReferenceField>
    </Datagrid>
  </List>
)

const EditOrCreateProblemFile = (props: any) => {
  const chainSource = (prop: string) => `${props.source}.${prop}`
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <TextInput
          source={chainSource('name')}
          label="Name"
          validate={requiredField}
        />
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <LongTextInput source={chainSource('content')} label="Content" />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export const EditProblem = (props: {}) => (
  <Edit {...props}>
    <TabbedForm asyncValidate={problemValidation}>
      <FormTab label="General info">
        <TextInput source="name" />
        <DisabledInput source="id" />
        <ReferenceInput
          label="Group"
          reference="groups"
          source="groupId"
          validate={requiredField}
        >
          <SelectInput optionText="name" />
        </ReferenceInput>
      </FormTab>

      <FormTab label="Files">
        <ArrayInput source="files">
          <SimpleFormIterator>
            <EditOrCreateProblemFile />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
    </TabbedForm>
  </Edit>
)

export const CreateProblem = (props: {}) => (
  <Create {...props}>
    <TabbedForm asyncValidate={problemValidation}>
      <FormTab label="General info">
        <TextInput source="name" />
        <ReferenceInput
          label="Group"
          reference="groups"
          source="groupId"
          validate={requiredField}
        >
          <SelectInput optionText="name" />
        </ReferenceInput>
      </FormTab>

      <FormTab label="Files">
        <ArrayInput source="files" defaultValue={[]}>
          <SimpleFormIterator>
            <EditOrCreateProblemFile />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
    </TabbedForm>
  </Create>
)
