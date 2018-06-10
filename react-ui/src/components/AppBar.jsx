import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as MidiSlidersAction from '../actions/midi-sliders.js'
import * as ColorSettingsActions from '../actions/color-settings'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import AddIcon from '@material-ui/icons/Add'
import AccountCircle from '@material-ui/icons/AccountCircle'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import Tooltip from '@material-ui/core/Tooltip'

class MenuAppBar extends React.Component {
  state = {
    auth: true,
    anchorEl: null
  }

  render () {
    const { classes } = this.props
    const { auth, anchorEl } = this.state
    const open = Boolean(anchorEl)

    return (
      <div className={classes.root}>
        <AppBar
          position='static'
          style={this.getBackgroundStyle(this.props.colorSettings.colorBackgroundAppbar)}>
          <Toolbar>
            <IconButton
              onClick={this.props.handleDrawerToggle}
              className={classes.menuButton}
              style={this.getForegroundStyle(this.props.colorSettings.colorFontAppbar)}
              color='inherit'
              aria-label='Menu'
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant='title'
              color='inherit'
              className={classes.flex}
              style={this.getForegroundStyle(this.props.colorSettings.colorFontAppbar)}
            >
              MIDI Sliders
            </Typography>
            <div>
              <Tooltip
                placement='right'
                title='Add Slider'
              >
                <IconButton
                  aria-owns={open ? 'addSlider-appbar' : null}
                  aria-haspopup='true'
                  onClick={() => this.props.actionsMidiSlider.addSlider()}
                  color='inherit'
                  style={this.getForegroundStyle(this.props.colorSettings.colorFontAppbar)}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <IconButton
                aria-owns={open ? 'menu-appbar' : null}
                aria-haspopup='true'
                onClick={this.handleMenu}
                color='inherit'
                style={this.getForegroundStyle(this.props.colorSettings.colorFontAppbar)}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id='menu-appbar'
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                open={open}
                onClose={this.handleClose}
              >
                <MenuItem onClick={this.handleCollapse}>
                  Collapse Sliders
                </MenuItem>
                <MenuItem onClick={this.handleExpand}>
                  Expand Sliders
                </MenuItem>
                <MenuItem onClick={this.showColorSettings}>
                  Toggle Color Settings
                </MenuItem>
              </Menu>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    )
  }

  getForegroundStyle = (clr) => (clr ? { color: `rgba(${clr.rgb.r}, ${clr.rgb.g}, ${clr.rgb.b}, ${clr.rgb.a})` } : {})

  getBackgroundStyle = (colorBody) => (colorBody ? { backgroundColor: `rgba(${colorBody.rgb.r}, ${colorBody.rgb.g}, ${colorBody.rgb.b}, ${colorBody.rgb.a})` } : {})

  showColorSettings = (e) => {
    this.props.actionsColorSettings.showColorSettings()
    this.handleClose()
  }

  handleChange = (event, checked) => {
    this.setState({ auth: checked })
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  handleExpand = () => {
    this.props.actionsMidiSlider.expandSliders()
    this.handleClose()
  }

  handleCollapse = () => {
    this.props.actionsMidiSlider.collapseSliders()
    this.handleClose()
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired
}

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
})

function mapStateToProps (state) {
  return {
    sliderList: state.sliderList,
    colorSettings: state.colorSettings
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actionsMidiSlider: bindActionCreators(MidiSlidersAction, dispatch),
    actionsColorSettings: bindActionCreators(ColorSettingsActions, dispatch)
  }
}

export default (withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MenuAppBar)))
