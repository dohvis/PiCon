import { connect } from 'react-redux';
import React, { Component, cloneElement } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  PanResponder,
  View,
} from 'react-native';
import store from './store';
import { Col, Row, Grid } from "react-native-easy-grid";
import { incLeftSpeed, decLeftSpeed, incRightSpeed, decRightSpeed } from './actions';

const url = "http://192.168.43.34:5000";

class DirectionButton extends Component {
  constructor(props) {
    super(props);
    this.component = null;
    this.componentId = null;
  }

  componentWillMount() {

  }

  render() {
    const {sendAction, leftRight, forwardBackward} = this.props;
    const props = this.props;
    return (
      <TouchableOpacity onPress={() => sendAction(leftRight, forwardBackward)} >
      <View style={[styles.arraw, props.style]}>
          <Text style={styles.textItem}>{props.value}</Text>
      </View>
      </TouchableOpacity>
    );
  }
}

class SpeedController extends Component {
  constructor(props) {
    super(props);
    const { incDec } = store.getState();
    const { leftSpeed, rightSpeed } = incDec;
    this.state = { speed: props.leftRight == 'left' ? leftSpeed : rightSpeed };
  }

  componentWillReceiveProps(nextProps) {
    console.log('receive', nextProps);
  } 

  increase(amount) {
    this.props.increase(amount);
    const { incDec } = store.getState();
    const { leftSpeed, rightSpeed } = incDec;
    this.setState({ speed: this.props.leftRight == 'left' ? leftSpeed : rightSpeed });
  }

  decrease(amount) {
    this.props.decrease(amount);
    const { incDec } = store.getState();
    const { leftSpeed, rightSpeed } = incDec;
    this.setState({speed: this.props.leftRight == 'left' ? leftSpeed : rightSpeed });
  }

  render() {
    const { dispatch } = this.props; 
    const amount = 10;
    
    return (
      <Grid style={styles.speedContainer}>
        <TextInput value={this.state.speed.toString()}  style={{ width: 50 }}/>
        <TouchableOpacity onPress={() => this.increase(amount)} >
          <View style={styles.button}>
            <Text>+</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.decrease(amount)} >
          <View style={styles.button}>
            <Text>-</Text>
          </View>
        </TouchableOpacity>
      </Grid>
    );
  }
}

class DirectionController extends Component {
  constructor(props) {
    super(props);
    
    this.sendAction = this.sendAction.bind(this);
    this.sendStop = this.sendStop.bind(this);
  }
  
  sendAction(leftRight, forwardBackward) {
    const { incDec } = store.getState();
    const { leftSpeed, rightSpeed } = incDec;
    
    const data = new FormData();
    data.append('leftRight', leftRight)
    data.append('forwardBackward', forwardBackward)
    data.append('speed', leftRight === 'left' ? leftSpeed : rightSpeed );
    console.log('Send');
    fetch(`${url}/action`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: data,
    })
  }

  sendStop() {
    fetch(`${url}/stop`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  renderButtons(array) {
    return array.map((v,i) => {
      return (<Row key={i}>
        <DirectionButton
          style={styles.arrow}
          value={v.value}
          leftRight={v.leftRight}
          forwardBackward={v.forwardBackward}
          sendAction={(leftRight, forwardBackward) => this.sendAction(v.leftRight, v.forwardBackward)}
        />
      </Row>);
    });
  }


  render() {
    const leftDataArr = [
      {value: '왼쪽 전진', leftRight: 'left', forwardBackward: 'forward'},
      {value: '왼쪽 후진', leftRight: 'left', forwardBackward: 'backward'},
    ];

    const rightDataArr = [
      {value: '오른쪽 전진', leftRight: 'right', forwardBackward: 'forward'},
      {value: '오른쪽 후진', leftRight: 'right', forwardBackward: 'backward'},
    ];

    return [
      <Row>
      <TouchableOpacity onPress={() => this.sendStop()}>
      <View>
        <Text>Stop</Text>
      </View>
      </TouchableOpacity>
    </Row>,
      <Grid>
        <Col>
          {this.renderButtons(leftDataArr)}
        </Col>
        <Col>
          {this.renderButtons(rightDataArr)}
        </Col>
      </Grid>
    ];
  }
}

class App extends Component<{}> {
  constructor(props) {
    super(props);
    const { incDec } = store.getState();
    const { leftSpeed, rightSpeed } = incDec;
  }

  componentWillReceiveProps(nextProps) {
    console.log('receive', nextProps);
  }
  
  render() {
    const { onIncLeftSpeed, onDecLeftSpeed, onIncRightSpeed, onDecRightSpeed } = this.props;
    const amount = 10;
    return (
      <Grid style={styles.container}>
        <Col style={styles.speedContainer}>
          <SpeedController
            leftRight='left'
            increase={onIncLeftSpeed}
            decrease={onDecLeftSpeed}
          />
          <SpeedController
            leftRight='right'
            increase={onIncRightSpeed}
            decrease={onDecRightSpeed} 
          />
        </Col>
        <Col style={styles.directionContainer}>
          <DirectionController />
        </Col>
      </Grid>
    )
  }
}

const styles = StyleSheet.create({
  arraw: {
    width: 50,
    height: 50,
    backgroundColor: '#F4F4F4'
  },
  container: {
    paddingVertical: 20,
    backgroundColor: '#F0F0F0',
  },
  speedContainer: {
    width: 100,
  },
  button: {
    width: 40,
    height: 40,
    borderWidth: 1,
  },
  speedController: {

  }
});

const mapStateToProps = (state) => ({ 
  leftSpeed: state.leftSpeed,
  rightSpeed: state.rightSpeed,
  // any props you need else
});


let mapDispatchToProps = (dispatch) => {
  return {
      onIncLeftSpeed: (amount) => dispatch(incLeftSpeed(amount)),
      onDecLeftSpeed: (amount) => dispatch(decLeftSpeed(amount)),
      onIncRightSpeed: (amount) => dispatch(incRightSpeed(amount)),
      onDecRightSpeed: (amount) => dispatch(decRightSpeed(amount)),
  };
}


App = connect(null, mapDispatchToProps)(App);
export default App;
