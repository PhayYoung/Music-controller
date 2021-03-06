import React, { Component } from 'react'
import { TextField, Button, Grid, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

export default class RoomJoinPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomCode: '',
      error: ''
    }
  }
  
  render() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align='center'>
          <Typography variant='h4' component='h4'>
            Entrar a una Sala
          </Typography>
        </Grid>
        <Grid item xs={12} align='center'>
          <TextField 
            error={this.state.error}
            label='codigo'
            placeholder='Escribe un codigo'
            value={this.state.roomCode}
            helperText={this.state.error}
            variant='outlined'
            onChange={this.handleTextFieldChange}
            />
        </Grid>
        <Grid item xs={12} align='center'>
          <Button variant='contained' color='primary' onClick={this.roomButtonPressed}>
            Entrar a la Sala
          </Button>
        </Grid>
        <Grid item xs={12} align='center'>
          <Button variant='contained' color='secondary' to='/' component={Link}>
            Volver
          </Button>
        </Grid>
      </Grid>
    );
  }

  handleTextFieldChange = e => {
    this.setState({
      roomCode: e.target.value
    })
  }

  roomButtonPressed = () => {
    const requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        code: this.state.roomCode
      })
    };
    fetch('/api/join-room', requestOptions)
      .then(response => {
        if (response.ok) {
          this.props.history.push(`/room/${this.state.roomCode}`)
        } else {
          this.setState({error: 'No se encontrĂ³ la sala'})
        }
      })
      .catch(error => {
        console.log(error);
      })
  }
}