/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  ProgressBarAndroid
} from 'react-native';

import {
  BRIUM_TOKEN,
  BRIUM_WORKER_ID
} from './credentials';

import KeywordsList from './keywords';
import CurrentActivity from './currentActivity';
import Actions from './actions';

require("./array");

const ENTRIES_URL = `https://brium.me/api/entries.json?worker_id=${BRIUM_WORKER_ID}&since=SINCE&access_token=${BRIUM_TOKEN}`;
const MESSAGE_URL = `https://brium.me/api/messages?access_token=${BRIUM_TOKEN}`;

const log = (msg) => console.log(`${Math.round(new Date().getTime() /1000)} | ${msg}`);

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default class BriumClient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loaded: false,
      currentActivity: { loaded: false }
    };
  }

  componentDidMount() {
    this.loadKeywords().done();
    this.loadCurrentActivity();
  }

  sendMessage(msg) {
    return fetch(MESSAGE_URL, {method: 'POST', body: msg})
      .then((response) => {
        log(`Received response from sendMessage: ${response}`);
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

  extractKeywords(entries) {
    let today = new Date().toISOString().slice(0,10);
    let keywords = entries.map((e) => e.record).reverse().unique();
    let hours = entries.reduce((hs, e) => {
      if (e.worked_at == today) {
        hs[e.record] = (hs[e.record] || 0) + e.hours;
      }
      return hs;
    }, {});
    return keywords.map((k) => {return {name: k, hours: hours[k]}; });
  }

  loadKeywords() {
    return this.fetchEntries()
      .then((responseData) => {
        this.setState({
          keywords: this.extractKeywords(responseData),
          loaded: true,
        });
      });
  }

  lastWeekEntriesUrl(today) {
    let sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 3600 * 1000);
    let sevenDaysAgoDate = sevenDaysAgo.toISOString().slice(0,10);
    return ENTRIES_URL.replace('SINCE', sevenDaysAgoDate);
  }

  fetchEntries() {
    return fetch(this.lastWeekEntriesUrl(new Date()))
      .then((response) => response.json());
  }

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    let currentActivity = <CurrentActivity activity={this.state.currentActivity} />;
    return (
      <View style={styles.container}>
        <KeywordsList keywords={this.state.keywords}
                      onReport={this.handleReport.bind(this)}
                      onRefresh={this.handleRefresh.bind(this)}
                      refreshing={this.state.refreshing}
                      header={currentActivity}/>
        <Actions onReport={this.handleReport.bind(this)}/>
      </View>
    );
  }

  renderLoadingView() {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ProgressBarAndroid indeterminate={true}/>
        <Text>Loading your recent activities...</Text>
      </View>
    );
  }

  handleReport(keyword) {
    log(`Reporting ${keyword.name}`);
    this.setState({refreshing: true});
    this.sendMessage(keyword.name)
      .then(this.loadCurrentActivity.bind(this))
      .then(() => this.setState({refreshing: false}))
      .done();
  }

  handleRefresh() {
    log("Refreshing list of keywords");
    this.setState({refreshing: true});
    this.loadKeywords()
      .then(this.loadCurrentActivity.bind(this))
      .then(() => this.setState({refreshing: false}))
      .done();
  }
}
