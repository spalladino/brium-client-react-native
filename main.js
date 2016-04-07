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

import KeywordsList from './keywords';
import CurrentActivity from './currentActivity';

require("./array");

const ENTRIES_URL = `https://brium.me/api/entries.json?worker_id=${BRIUM_WORKER_ID}&since=2016-04-01&access_token=${BRIUM_TOKEN}`;
const MESSAGE_URL = `https://brium.me/api/messages?access_token=${BRIUM_TOKEN}`;

const log = (msg) => console.log(`${Math.round(new Date().getTime() /1000)} | ${msg}`);

let styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 10
  }
});

export default class BriumClient extends Component {
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

  sendMessage(msg) {
    return fetch(MESSAGE_URL, {method: 'POST', body: msg})
      .then((response) => {
        log(`Received response from sendMessage: ${response}`)
        return response.text();
      });
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
    const currentActivityRegex = /You said you were working on (.+?)\s*((?:about |less than )?(?:\d+|\s*an?)\s*(?:minutes?|hours?)\s*ago)/;
    return this.sendMessage('?')
      .then((response) => {
        log(response.split("\n")[0]);
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
        <KeywordsList keywords={this.state.keywords} onReport={this.handleReport.bind(this)} />
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

  handleReport(keyword) {
    log(`Reporting ${keyword}`);
    this.sendMessage(keyword)
      .then((r) => {
        log(r);
        return r;
      })
      // .then(this.loadCurrentActivity.bind(this))
      .done();
  }

}
