import React, {
  Component,
  StyleSheet,
  Text,
  ListView,
  View
} from 'react-native';

const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    padding: 6
  },
  name: {
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
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderKeyword}
        style={styles.list}
      />
    );
  }

  renderKeyword(keyword) {
    return (
      <View style={styles.item}>
        <Text style={styles.name}>{keyword}</Text>
      </View>
    );
  }

}
