/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  ListView,
  View
} from 'react-native';

import {
  BRIUM_TOKEN,
  BRIUM_WORKER_ID
} from './credentials';

require("./array");

const ENTRIES_URL = `https://brium.me/api/entries.json?worker_id=${BRIUM_WORKER_ID}&since=2016-04-01&access_token=${BRIUM_TOKEN}`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  keyword: {
    flex: 1,
    alignItems: 'center'
  }
});

class BriumClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
  }

  componentDidMount() {
    this.fetchEntries();
  }

  fetchEntries() {
    fetch(ENTRIES_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          keywords: responseData.map((e) => e.record).reverse().unique().slice(0,5),
          loaded: true,
        });
      })
      .done();
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    return (
      <View style={styles.container}>
        <KeywordsList keywords={this.state.keywords} />
      </View>
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Text>Loading worker {BRIUM_WORKER_ID}...</Text>
      </View>
    );
  }
}

class KeywordsList extends Component {

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
        style={styles.listView}
      />
    );
  }

  renderKeyword(keyword) {
    return (
      <View style={styles.keyword}>
        <Text>{keyword}</Text>
      </View>
    );
  }

}

AppRegistry.registerComponent('BriumClient', () => BriumClient);
