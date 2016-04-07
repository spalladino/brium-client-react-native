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
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15
  },
  name: {
    // textAlign: 'center'
  },
  list: {
    flex: 1
  }
});

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
    return (
      <TouchableHighlight onPress={() => this.props.onReport ? this.props.onReport(keyword) : null}>
        <View style={styles.item}>
          <Text style={styles.name}>{keyword}</Text>
        </View>
      </TouchableHighlight>
    );
  }

}
