import React, {
  View,
  Component,
  TouchableHighlight,
  Text,
  StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row'
  },
  lunchButton: {
    flex: 1,
    backgroundColor: 'orange'
  },
  byeButton: {
    flex: 1,
    backgroundColor: 'green'
  },
  button: {
    padding: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 24
  }
});

export default class Actions extends Component {
  render() {
    return (
        <View style={styles.container}>
          <TouchableHighlight onPress={this.onLunch.bind(this)}
                              style={[styles.button, styles.lunchButton]}>
            <Text style={styles.buttonText}>Lunch</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.onBye.bind(this)}
                              style={[styles.button, styles.byeButton]}>
            <Text style={styles.buttonText}>Bye</Text>
          </TouchableHighlight>
        </View>
    );
  }

  onLunch() {
    if (this.props.onReport) {
      this.props.onReport({name: 'lunch'});
    }
  }

  onBye() {
    if (this.props.onReport) {
      this.props.onReport({name: 'bye'});
    }
  }
}
