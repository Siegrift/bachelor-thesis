import createTreeViewStyles from './treeViewStyles'
import React, { Children, Component } from 'react'
import { withTheme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import { withStyles, WithStyles } from '@material-ui/core'
import EditorScreen from './EditorScreen'
import CloseIcon from '@material-ui/icons/Close'
import { decorators, Treebeard } from 'react-treebeard'
import { compose } from 'redux'
import {
  CONTROL_PANEL_WIDTH,
  TAB_CLOSE_ICON_PADDING,
  TAB_TEXT_LEFT_PADDING,
  TAB_VIEW_HEIGHT,
  TREE_VIEW_WIDTH
} from '../constants'
import ControlPanel from './ControlPanel'
import TreebeardContainer from './TreebeardContainer'
import { connect } from 'react-redux'
import {
  closeTab as _closeTab,
  selectTab as _selectTab,
  setActiveTab as _setActiveTab,
  toggleTabExpand as _toggleTabExpand
} from '../actions/tabActions'
import { downloadTaskFiles as _downloadTaskFiles } from '../actions/editorActions'
import { State } from '../redux/types'
import { Tab as TabType } from '../types/common'
import { activeTabSelector } from '../selectors/tabSelectors'
import { filterTabs, isTabNode, mapTabs } from '../tabHelpers'

const styles = (theme: Theme) => ({
  grid: { height: '100%' },
  treeView: {
    width: TREE_VIEW_WIDTH,
  },
  tabbedEditor: {
    width: `calc(100% - ${TREE_VIEW_WIDTH}px - ${CONTROL_PANEL_WIDTH}px)`,
    height: '100%',
  },
  editor: {
    width: '100%',
    height: `calc(100% - ${TAB_VIEW_HEIGHT}px)`,
  },
  editorTab: {
    display: 'flex',
    cursor: 'pointer',
    borderRight: `1px solid ${theme.colors.background.editor}`,
    backgroundColor: theme.colors.background.editorTabColor,
  },
  settings: {
    width: CONTROL_PANEL_WIDTH,
  },
  tabs: {
    // this overrides mui default (min-height: 48px)
    minHeight: TAB_VIEW_HEIGHT,
  },
  tabText: {
    margin: 'auto',
    paddingLeft: TAB_TEXT_LEFT_PADDING,
  },
  tabIcon: {
    color: theme.palette.common.white,
    fontSize: TAB_VIEW_HEIGHT,
    padding: TAB_CLOSE_ICON_PADDING,
    '&:hover': {
      // simulate small zoom on hover
      padding: TAB_CLOSE_ICON_PADDING - 2,
    },
  },
  sidePanelHeaderText: {
    margin: 'auto',
    height: TAB_VIEW_HEIGHT,
    // FIXME: material ui doesn't allow textTransform
    textTransform: 'uppercase' as any,
  },
})

const CustomTabComponent = ({
  classNames,
  tabLabel,
  onClose,
  onSelect,
}: any) => {
  return (
    <div className={classNames.editorTab}>
      <Typography
        variant="body2"
        className={classNames.tabText}
        onClick={onSelect}
      >
        {tabLabel}
      </Typography>
      <CloseIcon className={classNames.tabIcon} onClick={onClose} />
    </div>
  )
}

interface Props extends WithStyles<typeof styles> {
  theme: Theme
  tabs: TabType[]
  downloadTaskFiles: typeof _downloadTaskFiles
  selectTab: typeof _selectTab
  setActiveTab: typeof _setActiveTab
  closeTab: typeof _closeTab
  toggleTabExpand: typeof _toggleTabExpand
  activeTab?: TabType
}

class MainScren extends Component<Props, {}> {
  componentDidMount() {
    this.props.downloadTaskFiles()
  }

  onToggle = (tab: TabType) => {
    if (isTabNode(tab)) this.props.toggleTabExpand(tab.id)
    else this.props.selectTab(tab.id)
  }

  handleTabChange = (id: string) => () => {
    this.props.setActiveTab(id)
  }

  handleTabClose = (id: string) => () => {
    this.props.closeTab(id)
  }

  render() {
    const { classes, theme, tabs, activeTab } = this.props
    const AnyTab = Tab as any

    return (
      <Grid container={true} className={classes.grid}>
        <Grid item={true} className={classes.treeView}>
          <Typography variant="h6" className={classes.sidePanelHeaderText}>
            Zoznam súborov
          </Typography>

          <Treebeard
            data={tabs}
            onToggle={this.onToggle}
            style={createTreeViewStyles(theme)}
            // NOTE: react-treebeard applies these styles to all elements which makes it
            // impossible to hover over list items (the whole tree is selected instead) without
            // using a custom container component.
            decorators={{ ...decorators, Container: TreebeardContainer }}
          />
        </Grid>

        <Grid item={true} className={classes.tabbedEditor}>
          {!!tabs.length && activeTab && (
            <Tabs
              className={classes.tabs}
              value={activeTab.id}
              variant="scrollable"
              scrollButtons="off"
              indicatorColor="primary"
              textColor="primary"
            >
              {filterTabs(tabs, (tab) => !!tab.selected).map((tab) => (
                <AnyTab
                  onSelect={this.handleTabChange(tab.id)}
                  onClose={this.handleTabClose(tab.id)}
                  component={CustomTabComponent}
                  classNames={classes}
                  tabLabel={tab.name}
                  value={tab.id}
                  key={tab.id}
                />
              ))}
            </Tabs>
          )}

          <Grid item={true} className={classes.editor}>
            <EditorScreen />
          </Grid>
        </Grid>

        <Grid item={true} className={classes.settings}>
          <Typography variant="h6" className={classes.sidePanelHeaderText}>
            Ovládací panel
          </Typography>

          <ControlPanel />
        </Grid>
      </Grid>
    )
  }
}

export default compose(
  withTheme(),
  withStyles(styles),
  connect(
    (state: State) => ({
      tabs: state.tabs,
      activeTab: activeTabSelector(state),
    }),
    {
      downloadTaskFiles: _downloadTaskFiles,
      selectTab: _selectTab,
      setActiveTab: _setActiveTab,
      closeTab: _closeTab,
      toggleTabExpand: _toggleTabExpand,
    },
  ),
)(MainScren) as any
