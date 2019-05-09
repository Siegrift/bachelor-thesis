import { Theme } from '@material-ui/core/styles/createMuiTheme'

const createTreeViewStyles = (theme: Theme) => ({
  tree: {
    base: {
      listStyle: 'none',
      backgroundColor: theme.colors.background.editorTabColor,
      padding: 0,
      margin: 0,
      height: '100%',
    },
    node: {
      base: {
        position: 'relative',
        cursor: 'pointer',
      },
      link: {
        position: 'relative',
        padding: '0px 5px',
        display: 'block',
      },
      activeLink: {
        background: '#31363F',
      },
      header: {
        base: {
          display: 'inline-block',
          verticalAlign: 'top',
          color: theme.palette.common.white,
        },
        connector: {
          width: '2px',
          height: '12px',
          borderLeft: 'solid 2px black',
          borderBottom: 'solid 2px black',
          position: 'absolute',
          top: '0px',
          left: '-21px',
        },
        title: {
          lineHeight: '24px',
          verticalAlign: 'middle',
        },
      },
      subtree: {
        listStyle: 'none',
        paddingLeft: '19px',
      },
      loading: {
        color: '#E2C089',
      },
    },
  },
})

export default createTreeViewStyles
