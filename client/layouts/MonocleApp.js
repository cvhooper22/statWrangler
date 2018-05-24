import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  Checkbox,
  Image,
  Tooltip,
  Slider
} from 'transcend-react';
import MentionCard from '../components/MentionCard';
import mentions from '../assets/data.json';

const MENTION_URL = "http://nuveye-hackathon.knex.deis.nuviapp.com/monitors/927f1489-01ae-46c6-b837-134567207713";
const filterKeys = [
  'branded',
  'positiveSentimentChecked',
  'negativeSentimentChecked',
  'neutralSentimentChecked',
  'usernameFilters',
  'entityFilters',
];


export default class MonocleApp extends React.Component {
  constructor(...args) {
    super(...args);
    this.onEntityClick = _.curry(this.onEntityClick, 2);
    this.state = {
      mentions: [],
      imageViewerOpen: false,
      branded: false,
      positiveSentimentChecked: false,
      negativeSentimentChecked: false,
      neutralSentimentChecked: false,
      usernameFilters: [],
      entityFilters: [],
    }
  }

  componentDidMount () {
    fetch('https://cors-anywhere.herokuapp.com/' + MENTION_URL)
      .then(response => response.json())
      .then((data) => {
        const myMentions = data.slice(0, 149);
        this.setState({ mentions: myMentions });
      })
      .catch(thing => console.log('the thing', thing));
  }

  prepData () {
    const preparedData = {
      mostReach: {},
      mostActive: {},
      entities: [],
    };
    const entitiesMap = {};
    const mostActiveMap = {};
    this.state.mentions.forEach((mention) => {
      this.addMentionEntities(entitiesMap, mention.image.entities);

      const currentMostReach = preparedData.mostReach.author_followers_count;
      if (currentMostReach && (mention.author_followers_count > currentMostReach)) {
        preparedData.mostReach = mention;
      } else if (!currentMostReach && (mention.author_followers_count > 0)){
        preparedData.mostReach = mention;
      }

      const username = mention.author_username;
      const currentAuthorMentionCount = mostActiveMap[username] && mostActiveMap[username].count;
      if (currentAuthorMentionCount) {
        mostActiveMap[username].count = currentAuthorMentionCount + 1;
      } else {
        mostActiveMap[username] = {
          username,
          profile_url: mention.author_picture_url,
          count: 1,
        };
      }
    })
    preparedData.entities = _.chain(entitiesMap).sortBy(entity => entity.count).reverse().value().slice(0,10);
    preparedData.mostActive = _.chain(mostActiveMap).map(influencer => influencer).maxBy('count').value() || {};
    return preparedData;
  }

  onTileClick = (mention) => {
    this.setState({
      imageViewerOpen: true,
      imageViewerMention: mention,
    });
  }

  onCloseViewerClick = () => {
    this.setState({
      imageViewerOpen: false,
    })
  }

  onBrandChange = () => {
    this.setState({
      branded: !this.state.branded,
    });
  }

  onPositiveSentimentClick = () => {
    this.setState({
      positiveSentimentChecked: !this.state.positiveSentimentChecked,
    });
  }
  onNegativeSentimentClick = () => {
    this.setState({
      negativeSentimentChecked: !this.state.negativeSentimentChecked,
    });
  }
  onNeutralSentimentClick = () => {
    this.setState({
      neutralSentimentChecked: !this.state.neutralSentimentChecked,
    });
  }

  onEntityClick = (entityName) => {
    console.log('the thing from checkbox', entityName);
    const filterEntities = _.cloneDeep(this.state.entityFilters);
    if (filterEntities.includes(entityName)) {
      _.remove(filterEntities, filterName => filterName === entityName);
    } else {
      filterEntities.push(entityName);
    }
    this.setState({ entityFilters: filterEntities });
  }

  onInfluencerMetricClick = (username) => {
    const filterNames = _.cloneDeep(this.state.usernameFilters);
    if (filterNames.includes(username)) {
      _.remove(filterNames, filterName => filterName === username);
    } else {
      filterNames.push(username);
    }
    this.setState({ usernameFilters: filterNames });
  }

  render () {
    const preppedData = this.prepData();
    const entities = preppedData.entities;
    return (
      <div className={ this.state.imageViewerOpen ? 'image-viewer-open' : ''}>
        <div className="sidebar border-right">
          <img src="adidas-logo.png" className="brand-logo center block mx-auto my-large" />
          <ul className="list list--unstyled list--settings text--xxsmall caps">
            <li className="border-bottom py-large px-small flex jc-sb ai-c">
              <span>Branded</span>
              <Slider
                id="branded"
                onChange={ this.onBrandChange }
                value="Brand"
                checked={ this.state.branded }
              />
            </li>
            <li className="border-bottom py-large px-small flex jc-sb ai-b">
              <span>Sentiment</span>
              <ul className="sentiment-toggles list list--inline">
                <li className={ `positive pointer ${this.state.positiveSentimentChecked ? 'checked' : ''}` } onClick={ this.onPositiveSentimentClick }>
                  <Tooltip
                    placement="top"
                    overlay={ <span className="text--small">Positive</span> }
                  >
                    <span className="toggle" />
                  </Tooltip>
                </li>
                <li className={ `negative pointer ${this.state.negativeSentimentChecked ? 'checked' : ''}` } onClick={ this.onNegativeSentimentClick }>
                  <Tooltip
                    placement="top"
                    overlay={ <span className="text--small">Negative</span> }
                  >
                    <span className="toggle" />
                  </Tooltip>
                </li>
                <li className={ `neutral pointer ${this.state.neutralSentimentChecked ? 'checked' : ''}` } onClick={ this.onNeutralSentimentClick }>
                  <Tooltip
                    placement="top"
                    overlay={ <span className="text--small">Neutral</span> }
                  >
                    <span className="toggle" />
                  </Tooltip>
                </li>
              </ul>
            </li>
            <li className="border-bottom py-large px-small flex jc-sb ai-c pointer" title={ preppedData.mostReach.author_username || mentions[0].author_username }>
              <span onClick={ this.onInfluencerMetricClick.bind(this, preppedData.mostReach.author_username) }>Top Influencer</span>
              <Tooltip
                placement="left"
                overlay={ <span className="text--small">{ preppedData.mostReach.author_username || mentions[0].author_username }</span> }
              >
                <img
                  className={ 'avatar avatar--small border circle' }
                  src={ preppedData.mostReach.author_picture_url || mentions[0].author_picture_url }
                  alt={ preppedData.mostReach.username || mentions[0].author_username }
                />
              </Tooltip>
            </li>
            <li
              className="border-bottom py-large px-small flex jc-sb ai-c pointer"
              onClick={ this.onInfluencerMetricClick.bind(this, preppedData.mostActive.username) }
              title={ preppedData.mostActive.username || mentions[3].author_username }
            >
              <span>Most Active</span>
              <Tooltip
                placement="left"
                overlay={ <span className="text--small">{ preppedData.mostActive.username || mentions[3].author_username }</span> }
              >
                <img
                  className={ 'avatar avatar--small border circle' }
                  src={ preppedData.mostActive.profile_url || mentions[3].author_picture_url }
                  alt={ preppedData.mostActive.username || mentions[3].author_username }
                />
              </Tooltip>
            </li>
          </ul>
          <ul className="list list--unstyled entities-list p-small capitalize">
            { this.renderEntities(preppedData.entities) }
          </ul>
        </div>
        <div className="main p-large">
          <div className="row small-grid-1 medium-grid-2 large-grid-3" style={{ maxWidth: '100%' }}>
            { this.renderImageTiles() }
          </div>
        </div>
        { this.renderImageViewer() }
      </div>
    );
  }

  renderEntities (entities) {
    return entities.map((entity) => {
      const title = _.upperFirst(entity.name.split(',')[0].trim());
      return (
        <li className="flex jc-sb">
          <Checkbox
            label={title}
            id={ entity.name }
            onClick={ this.onEntityClick(entity.name) }
          />
          <span className="quiet">{entity.count}</span>
        </li>
      );
    })
  }

  renderImageViewer = () => {
    if (this.state.imageViewerOpen) {
      return(
        <div className="image-view border-left">
          <i className="icon--circle-close pointer" onClick={ this.onCloseViewerClick } />
          <MentionCard mention={ this.state.imageViewerMention } />
        </div>
      );
    }
  }

  renderImageTiles = () => {
    const mentions = this.filterMentions();
    if (mentions.length < 1) {
      return (
        <div className="zero-state-wrapper">
          <span className="zero-state mt-xlarge text--xlarge">Current filters do not match any posts</span>
        </div>
      );
    }
    return mentions.map((mention) => {
      if (!mention.post_media[0].display_url) {
        mention.post_media = JSON.parse(mention.post_media);
      }
      const brandedClass = mention.image.logo ? 'branded' : '';
      return (
        <div className="column" key={ mention._id } onClick={ this.onTileClick.bind(this, mention) }>
          <div className={`panel ${brandedClass} panel--sentiment-${mention.sentiment_category}`}>
            <div className="sentiment-circle"></div>
            <img src="adidas-logo.png" className="brand-stamp" />
            <div className="panel-body">
              <div className="px-large">
                <Image
                  className={ 'center block mx-auto fit' }
                  src={ mention.post_media[0].display_url }
                  hideLoader
                />
              </div>
            </div>
          </div>
        </div>
      );
    });
  }

  filterMentions () {
    const filterOptions = this.setFilterConfiguration();
    if (!(_.keys(filterOptions).length)) {
      return this.state.mentions;
    }
    return _.filter(this.state.mentions, (mention) => {
      let matchesBranded = true;
      let matchesSentiment = true;
      let matchesUsernames = true;
      let matchesEntities = true;

      if (filterOptions.branded) {
        matchesBranded = !!mention.image.logo;
      }

      if (filterOptions.sentiment) {
        matchesSentiment = _.find(filterOptions.sentiment, (category) => { return category === mention.sentiment_category; });
      }

      if (filterOptions.usernameFilters) {
        matchesUsernames = _.find(filterOptions.usernameFilters, username => username === mention.author_username);
      }

      if (filterOptions.entityFilters) {
        const entities = mention.image.entities.map(entity => entity.name);
        const entityIntersection = _.intersection(filterOptions.entityFilters, entities);
        matchesEntities = entityIntersection.length
      }

      return matchesBranded && matchesSentiment && matchesUsernames && matchesEntities;
    })
  }

  setFilterConfiguration () {
    const filterOptions = {};
    const sentimentChecks = [];
    if (this.state.branded) {
      filterOptions.branded = true;
    }

    if (this.state.positiveSentimentChecked) {
      sentimentChecks.push('positive');
    }
    if (this.state.negativeSentimentChecked) {
      sentimentChecks.push('negative');
    }
    if (this.state.neutralSentimentChecked) {
      sentimentChecks.push('neutral');
    }
    if (sentimentChecks.length > 0 && sentimentChecks.length < 3) {
      filterOptions.sentiment = sentimentChecks;
    }

    if (this.state.usernameFilters.length) {
      filterOptions.usernameFilters = this.state.usernameFilters;
    }

    if (this.state.entityFilters.length) {
      filterOptions.entityFilters = this.state.entityFilters;
    }
    return filterOptions;
  }

  addMentionEntities (currentEntities, mentionEntities) {
    mentionEntities.forEach((entity) => {
      const entityName = entity.name.toLowerCase();
      const currentEntityCount = currentEntities[entityName] && currentEntities[entityName].count;
      if (currentEntityCount) {
        currentEntities[entityName].count  = currentEntityCount + 1;
      } else {
        currentEntities[entityName] = {
          name: entityName,
          count: 1
        };
      }
    });
  }
}
