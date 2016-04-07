import React, {
  Component,
  StyleSheet,
  Text,
  ListView,
  View,
  TouchableHighlight,
  RefreshControl
} from 'react-native';

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
    borderBottomColor: '#A2D0EC',
    borderBottomWidth: 1,
    backgroundColor: '#fff'
  },
  name: {
    color: '#333',
    fontSize: 20,
    flex: 1
  },
  hours: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'right'
  },
  list: {
    flex: 1
  }
});

function formatHours(time) {
  if (!time) return '';
  if (time < 1) {
    return Math.round(time * 60) + "m";
  } else {
    let hours = Math.trunc(time);
    let minutes = Math.round((time - hours) * 60);
    return `${hours}h${minutes}m`;
  }
}
export default class KeywordsList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      }).cloneWithRows(props.keywords)
    };
  }

  render() {
    let refresh = <RefreshControl refreshing={this.props.refreshing} onRefresh={this.onRefresh.bind(this)} />;
    return (
      <ListView
         dataSource={this.state.dataSource}
         renderRow={this.renderKeyword.bind(this)}
         style={styles.list}
         renderHeader={() => this.props.header}
         refreshControl={refresh} />
    );
  }

  onRefresh() {
    if (this.props.onRefresh) {
      this.props.onRefresh();
    }
  }

  renderKeyword(keyword) {
    let hoursLabel = keyword.hours ? <Text style={styles.hours}>{formatHours(keyword.hours)}</Text> : null;
    return (
      <TouchableHighlight onPress={() => this.props.onReport ? this.props.onReport(keyword) : null}>
        <View style={styles.item}>
          <Text style={styles.name}>{keyword.name}</Text>
          {hoursLabel}
        </View>
      </TouchableHighlight>
    );
  }

}
