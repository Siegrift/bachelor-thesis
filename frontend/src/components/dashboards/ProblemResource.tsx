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
  SimpleFormIterator,
  TabbedForm,
  TextField,
  TextInput
} from 'react-admin'
import { requiredField, uniqueProblemNameValidation } from './validation'
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
    </Datagrid>
  </List>
)

const EditProblemFile = (props: any) => {
  const chainSource = (prop: string) => `${props.source}.${prop}`
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <TextInput source={chainSource('name')} label="Name" />
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <LongTextInput source={chainSource('content')} label="Content" />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  )
}

export const EditProblem = (props: {}) => (
  <Edit {...props}>
    <TabbedForm asyncValidate={uniqueProblemNameValidation}>
      <FormTab label="General info">
        <TextInput source="name" validate={requiredField} />
        <DisabledInput source="id" />
      </FormTab>

      <FormTab label="Files">
        <ArrayInput source="files">
          <SimpleFormIterator>
            <EditProblemFile />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
    </TabbedForm>
  </Edit>
)

export const CreateProblem = (props: {}) => (
  <Create {...props}>
    <TabbedForm asyncValidate={uniqueProblemNameValidation}>
      <FormTab label="General info">
        <TextInput source="name" validate={requiredField} />
      </FormTab>

      <FormTab label="Files">
        <ArrayInput source="files">
          <SimpleFormIterator>
            <EditProblemFile />
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
    </TabbedForm>
  </Create>
)
