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
    backgroundColor: '#efa300'
  },
  byeButton: {
    backgroundColor: '#64a91a'
  },
  backToWorkButton: {
    backgroundColor: '#efa300'
  },
  button: {
    flex: 1,
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
    if (this.props.currentActivity.lunch) {
      return this.renderBackToWork();
    } else if (this.props.currentActivity.keyword) {
      return this.renderLunchBye();
    } else {
      return <View/>;
    }
  }

  renderBackToWork() {
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this.onBackToWork.bind(this)}
                            style={[styles.button, styles.backToWorkButton]}>
          <Text style={styles.buttonText}>Back to work</Text>
        </TouchableHighlight>
      </View>
    );
  }

  renderLunchBye() {
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

  onBackToWork() {
    if (this.props.onReport) {
      this.props.onReport({name: '.'});
    }
  }
}
