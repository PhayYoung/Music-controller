import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { Link } from 'react-router-dom';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Collapse } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

export default class CreateRoomPage extends Component {
  static defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    updateCallback: () => {}
  };

  state = {
    guestCanPause: this.props.guestCanPause,
    votesToSkip: this.props.votesToSkip,
    errorMsg: '',
    successMsg: '',
  };

  handleVotesChange = e => {
    this.setState({
      votesToSkip: e.target.value
    });
  }

  handleGuestCanPauseChange = e => {
    this.setState({
      guestCanPause: e.target.value === 'true' ? true : false,
    });
  }

  handleRoomButtonPressed = () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause
      }),
    };
    fetch('/api/create-room', requestOptions)
    .then(response => response.json())
    .then(data => this.props.history.push('/room/' + data.code));
  }

  handleUpdateButtonPressed = () => {
    const requestOptions = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
        code: this.props.roomCode,
      }),
    };
    fetch('/api/update-room', requestOptions).then((response) => {
        if (response.ok) {
          this.setState({
            successMsg: 'Ajustes guardados',
          });
        } else {
          this.setState({
            errorMsg: 'Error actualizando la sala',
          });
        }
        this.props.updateCallback();
      });
    }

  renderCreateButtons() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align='center'>
          <Button 
            color='primary' 
            variant='contained' 
            onClick={this.handleRoomButtonPressed}
            >
            Crear la Sala
          </Button>      
        </Grid>
        <Grid item xs={12} align='center'>
          <Button color='secondary' variant='contained' to='/' component={Link}>
            Volver
          </Button>      
        </Grid>
      </Grid>
    );
  }

  renderUpdateButton() {
    return (
      <Grid item xs={12} align='center'>
        <Button 
          color='primary' 
          variant='contained' 
          onClick={this.handleUpdateButtonPressed}
        >
          Guardar Ajustes
        </Button>      
      </Grid>
    );
  }

  render() {
    const title = this.props.update ? 'Ajustes de Sala' : 'Crear una Sala';

    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align='center'>
          <Collapse 
            in={this.state.errorMsg != '' || this.state.successMsg != ''}
          >
            {this.state.succesMsg != '' ? (
              <Alert
               severity='success' 
               onClose={() => {
                 this.setState({ succesMsg:'' });
                }}
              >
                {this.state.successMsg}
              </Alert>
            ) : (
              <Alert 
                severity='error'
                onClose={() => {
                  this.setState({ errorMsg:'' });
              }}
            >
                {this.state.errorMsg}
              </Alert>
            )}
          </Collapse>
        </Grid>
        <Grid item xs={12} align='center'>
          <Typography component='h4' variant='h4'>
            {title}
          </Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          <FormControl component='fieldset'>
            <FormHelperText>
              <div algn='center' className='blanco'>Controles de invitados</div>
            </FormHelperText>
            <RadioGroup 
              row 
              defaultValue={this.props.guestCanPause.toString()}
              onChange={this.handleGuestCanPauseChange}
            >
              <FormControlLabel
                value='true' 
                control={<Radio color='primary' />}
                label='Play/Pausa'
                labelPlacement='bottom'
                className='blanco'
              />
              <FormControlLabel
                value='false' 
                control={<Radio color='secondary' />}
                label='Sin Control'
                labelPlacement='bottom'
                className='blanco'
              />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12} align='center'>
          <FormControl>
            <TextField 
              required={true} 
              type='number' 
              onChange={this.handleVotesChange}
              defaultValue={this.state.votesToSkip}
              inputProps={{
                min: 1,
                style: {textAlign: 'center'}
              }}
              className='blanco'
              />
              <FormHelperText>
                <div align='center' className='blanco'>Votos para saltear cancion</div>
              </FormHelperText>
          </FormControl>
        </Grid>
        { this.props.update 
          ? this.renderUpdateButton() 
          : this.renderCreateButtons() }
      </Grid>
    );
  }
}