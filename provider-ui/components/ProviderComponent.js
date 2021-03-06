import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {
  NoSsr, Typography, Button, ButtonGroup,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import dataFetch from '../lib/data-fetch';


const styles = (theme) => ({
  root: {
    padding: '80px 0px',
    textAlign: 'center',
  },
  container: {
    width: '60%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing(5),
  },
  logo: {
    width: theme.spacing(50),
  },
});

class ProviderComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        availableProviders: {},
        selectedRemote: '',
        selectedLocal: '',
        selectedProvider: '',
        open: false,
      };
    this.anchorRef = null;
  }

   loadProvidersFromServer() {
    const self = this;
      dataFetch('/api/providers', { 
        credentials: 'same-origin',
        method: 'GET',
        credentials: 'include',
      }, result => {
      if (typeof result !== 'undefined'){
        let selectedRemote = '';
        let selectedLocal = '';
        let selectedProvider = '';
        Object.keys(result).forEach(key => {
          if(result[key] === 'remote'){
            selectedRemote = key;
            selectedProvider = key;
          } else {
            selectedLocal = key;
          }
        })
        self.setState({availableProviders: result, selectedRemote, selectedLocal, selectedProvider});
        }
      }, error => {
        console.log(`there was an error fetching providers: ${error}`);
      });
  }
      componentDidMount = () => {
        this.loadProvidersFromServer();
      }

  handleMenuItemClick = (index) => {
    this.setState({ selectedProvider: index });
  };

  loadProvidersFromServer() {
    const self = this;
    dataFetch('/api/providers', {
      credentials: 'same-origin',
      method: 'GET',
      credentials: 'include',
    }, (result) => {
      if (typeof result !== 'undefined') {
        let selectedRemote = '';
        let selectedLocal = '';
        Object.keys(result).forEach((key) => {
          if (result[key] === 'remote') {
            selectedRemote = key;
          } else {
            selectedLocal = key;
          }
        });
        self.setState({ availableProviders: result, selectedRemote, selectedLocal });
      }
    }, (error) => {
      console.error(`there was an error fetching providers: ${error}`);
    });
  }

  handleToggle() {
    const self = this;
    return () => {
      self.setState({ open: !self.state.open });
    };
  }

  handleClose() {
    const self = this;
    return (event) => {
      if (self.anchorRef && self.anchorRef.contains(event.target)) {
        return;
      }
      self.setState({ open: false });
    };
  }

  render() {
    const { classes } = this.props;
    const { availableProviders, selectedRemote, selectedLocal, selectedProvider, open } = this.state;
    //selectedProvider=selectedRemote;
    const self = this;
    return (
      <NoSsr>
        <div className={classes.root}>
          <img className={classes.logo} src="/provider/static/img/meshery-logo/meshery-logo-light-text.png" alt="logo" />
          <Typography variant="h6" gutterBottom className={classes.chartTitle}>
            Please choose a provider to continue
          </Typography>
          <div className={classes.container}>
            <Grid container spacing={10}>
              {/* <Grid item xs={12} sm={6} justify="flex-end" alignItems="center">
          {selectedLocal !== '' &&
        <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            // onClick={self.handleLocalSubmit}
            href={`/api/provider?provider=${encodeURIComponent(selectedLocal)}`}
            // className={classes.button}
          >
           {selectedLocal}
          </Button>}
         </Grid> */}
              <Grid item xs={12} justify="center">
                {availableProviders !== ''
        && (
          <>
            <ButtonGroup variant="contained" color="primary" ref={(ref) => self.anchorRef = ref} aria-label="split button">
              <Button
                size="large"
            // onClick={self.handleRemoteSubmit(selectedRemote)}\
            // value={selectedRemote !==''?selectedRemote:"Select your provider"}
                href={selectedProvider == '' ? '' : `/api/provider?provider=${encodeURIComponent(selectedProvider)}`}
              >
                {selectedProvider !== '' ? selectedProvider : 'Select Your Provider'}
              </Button>
              <Button
                color="primary"
                size="small"
                aria-controls={open ? 'split-button-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-label="Select Provider"
                aria-haspopup="menu"
                onClick={self.handleToggle()}
              >
                <ArrowDropDownIcon />
              </Button>
            </ButtonGroup>
            <Popper open={open} anchorEl={self.anchorRef} role={undefined} transition disablePortal>
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
                  }}
                >
                  <Paper>
                    <ClickAwayListener onClickAway={self.handleClose()}>
                      <MenuList id="split-button-menu">
                        {Object.keys(availableProviders).map((key) => (
                          <MenuItem
                            key={key}
                        // disabled={index === 2}
                        // selected={key === selectedRemote}
                        // href={`/api/provider?provider=${encodeURIComponent(key)}`}
                            onClick={(ev) => self.handleMenuItemClick(key)}
                          >
                            {key}
                          </MenuItem>
                        ))}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </>
        )}
              </Grid>
            </Grid>
          </div>
        </div>
      </NoSsr>
    );
  }
}

ProviderComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProviderComponent);
