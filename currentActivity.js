import React, {
  Component,
  StyleSheet,
  Text,
  ListView,
  View
} from 'react-native';

const styles = StyleSheet.create({
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    color: '#fff'
  },
  keyword: {
    fontSize: 24
  },
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 20,
    backgroundColor: '#1F85C7'
  }
});

export default class CurrentActivity extends Component {

  render() {
    if (!this.props.activity.loaded) {
      return <View></View>;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.label}>Working on</Text>
        <Text style={[styles.label, styles.keyword]}>{this.props.activity.keyword}</Text>
        <Text style={styles.label}>since {this.props.activity.timeAgo}</Text>
      </View>
    );
  }

}
