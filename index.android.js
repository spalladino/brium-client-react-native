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
const MESSAGE_URL = `https://brium.me/api/messages?access_token=${BRIUM_TOKEN}`;

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 10
  },
  currentActivity: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center'
  },
  currentActivityKeyword: {
    fontSize: 24
  }
});

styles.keyword = StyleSheet.create({
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
})

class BriumClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      currentActivity: { loaded: false }
    };
  }

  componentDidMount() {
    this.loadKeywords();
    this.loadCurrentActivity();
  }

  postMessage(msg) {
    return fetch(MESSAGE_URL, {method: 'POST', body: msg})
      .then((response) => response.text());
  }

  loadCurrentActivity() {
    this.fetchCurrentActivity()
      .then((activity) => this.setState({
        currentActivity: {
          loaded: true,
          keyword: activity ? activity.keyword : null,
          timeAgo: activity ? activity.timeAgo : null
        }
      }))
      .done();
  }

  fetchCurrentActivity() {
    const currentActivityRegex = /You said you were working on (.+?) ((?:about |less than )?\d+ (?:minutes?|hours?) ago)/;
    return this.postMessage('?')
      .then((response) => {
        let match = response.match(currentActivityRegex);
        return match ? { keyword: match[1], timeAgo: match[2] } : null;
      });
  }

  loadKeywords() {
    this.fetchEntries()
      .then((responseData) => {
        this.setState({
          keywords: responseData.map((e) => e.record).reverse().unique().slice(0,5),
          loaded: true,
        });
      })
      .done();
  }

  fetchEntries() {
    return fetch(ENTRIES_URL)
      .then((response) => response.json());
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    return (
      <View style={styles.container}>
        <CurrentActivity activity={this.state.currentActivity} />
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

class CurrentActivity extends Component {

  render() {
    if (!this.props.activity.loaded) {
      return <View></View>;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.currentActivity}>Working on</Text>
        <Text style={styles.currentActivity, styles.currentActivityKeyword}>{this.props.activity.keyword}</Text>
        <Text style={styles.currentActivity}>since {this.props.activity.timeAgo}</Text>
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
        style={styles.keyword.list}
      />
    );
  }

  renderKeyword(keyword) {
    return (
      <View style={styles.keyword.item}>
        <Text style={styles.keyword.name}>{keyword}</Text>
      </View>
    );
  }

}

AppRegistry.registerComponent('BriumClient', () => BriumClient);
