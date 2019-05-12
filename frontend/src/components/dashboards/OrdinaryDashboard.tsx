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
  getUserGroupsAndProblems as _getGroupsAndProblems,
  setSelectedProblemId as _setSelectedProblemId
} from '../../actions/userActions'
import { Group, ObjectOf, PartialProblem, Problem } from '../../types/common'
import { map } from 'lodash'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

interface Props {
  getUserGroupsAndProblems: typeof _getGroupsAndProblems
  groups: ObjectOf<Group>
  problems: ObjectOf<PartialProblem[]>
  setSelectedProblemId: typeof _setSelectedProblemId
  selectedProblemId?: string
}

export class OrdinaryDashboard extends Component<Props> {
  onListItemClick = (id: string) => () => {
    this.props.setSelectedProblemId(id)
  }

  componentDidMount() {
    this.props.getUserGroupsAndProblems()
  }

  render() {
    const { problems, groups, selectedProblemId } = this.props

    if (selectedProblemId) return <MainScreen />
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
                  {map(problems[group.id], (problem) => (
                    <ListItem
                      key={problem.id}
                      button={true}
                      onClick={this.onListItemClick(problem.id)}
                    >
                      <ListItemText primary={problem.name} />
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
      problems: state.problems,
      selectedProblemId: state.selectedProblemId,
    }),
    {
      getUserGroupsAndProblems: _getGroupsAndProblems,
      setSelectedProblemId: _setSelectedProblemId,
    },
  ),
  // TODO: short term fix
)(OrdinaryDashboard as any)
