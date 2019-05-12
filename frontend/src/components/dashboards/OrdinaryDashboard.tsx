import { connect } from 'react-redux'
import React, { Component } from 'react'
import DarkPaper from '../lib/DarkPaper'
import Typography from '@material-ui/core/Typography'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MainScreen from '../MainScreen'
import { compose } from 'redux'
import { State } from '../../redux/types'
import {
  getUserGroupsAndTasks as _getGroupsAndTasks,
  setSelectedTaskId as _setSelectedTaskId
} from '../../actions/userActions'
import { Group, ObjectOf, PartialTask, Task } from '../../types/common'
import { map } from 'lodash'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

interface Props {
  getUserGroupsAndTasks: typeof _getGroupsAndTasks
  groups: ObjectOf<Group>
  tasks: ObjectOf<PartialTask[]>
  setSelectedTaskId: typeof _setSelectedTaskId
  selectedTaskId?: string
}

export class OrdinaryDashboard extends Component<Props> {
  onListItemClick = (id: string) => () => {
    this.props.setSelectedTaskId(id)
  }

  componentDidMount() {
    this.props.getUserGroupsAndTasks()
  }

  render() {
    const { tasks, groups, selectedTaskId } = this.props

    if (selectedTaskId) return <MainScreen />
    else {
      return (
        <DarkPaper>
          <Typography variant="h3" gutterBottom={true}>
            Prehľad skupín a zadaní
          </Typography>

          {map(groups, (group) => (
            <ExpansionPanel key={group.id}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{group.name}</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <List dense={false} style={{ width: '100%' }}>
                  {map(tasks[group.id], (task) => (
                    <ListItem
                      key={task.id}
                      button={true}
                      onClick={this.onListItemClick(task.id)}
                    >
                      <ListItemText primary={task.name} />
                    </ListItem>
                  ))}
                </List>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          ))}
        </DarkPaper>
      )
    }
  }
}

export default compose(
  connect(
    (state: State) => ({
      groups: state.groups,
      tasks: state.tasks,
      selectedTaskId: state.selectedTaskId,
    }),
    {
      getUserGroupsAndTasks: _getGroupsAndTasks,
      setSelectedTaskId: _setSelectedTaskId,
    },
  ),
  // TODO: short term fix
)(OrdinaryDashboard as any)
