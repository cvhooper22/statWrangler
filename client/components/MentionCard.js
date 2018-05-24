import _ from 'lodash';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import numeral from 'numeral';
import { Image, ViewMore, Tooltip } from 'transcend-react';
import formatPost from '../helpers/formatPost';
import MentionCardInteractions from './MentionCardInteractions';

export default class MentionCard extends PureComponent {

  static propTypes = {
    mention: PropTypes.object.isRequired,
    className: PropTypes.string,
    keywords: PropTypes.array,
    maxTextLength: PropTypes.number,
  };

  onPostClick = () => {
    if (this.props.selectMode) {
      this.props.onSelectModeClick(this.props.mention.social_source_uid);
    }
  }

  onSentimentTooltipClick = () => {
    if (this.activeTooltip) {
      this.activeTooltip.trigger.close();
    }
  }

  getSafeNetworkName (network) {
  if (network === 'google' || network === 'google_plus') {
    return 'google-plus';
  } else {
    return network;
  }
}

  render () {
    const wrapperClassName = [
      'mention-card',
      this.props.className,
      this.props.selectMode ? 'mention-card--select-mode' : null,
    ].filter(Boolean).join(' ');
    const bodyClassName = [
      'panel__body',
      'mention-card__body',
      'fit',
      'pl-xlarge',
      'pb-xlarge',
      'pt-large',
      this.props.selectMode ? 'mention-card__select-mode-overlay' : null,
      this.props.selected ? 'mention-card__select-mode-overlay--selected' : null,
    ].filter(Boolean).join(' ');
    const network = this.props.mention.network;
    return (
      <div className={ wrapperClassName }>
        <div
          className={ bodyClassName }
          onClick={ this.onPostClick }
        >
          <div className="pb-large">
            <a
              className="flex ai-c"
              href={ this.props.mention.author_profile_url || this.props.mention.activity_url }
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                className={ 'avatar avatar--small' }
                src={ this.props.mention.author_picture_url }
                alt={ this.props.mention.author_username }
                isAvatar
                hideLoader
              />
              <div className="grow flex ai-b mention-card__names">
                { this.renderAuthorName() }
                <span className="text--small ml-small">
                  { this.renderAuthorUsername() }
                  <span className={ `icon--${this.getSafeNetworkName(network)} ml-xsmall` } />
                </span>
              </div>
              { this.renderAuthorInfluence() }
            </a>
          </div>
          { this.renderMedia() }
          <div>
            { this.renderSentiment() }
            <a
              className="my-small text--quiet text--xsmall caps"
              href={ this.props.mention.activity_url }
              target="_blank"
              rel="noopener noreferrer"
            >
              { this.renderCreatedAt() }
            </a>
          </div>
          <div className="mention-card__text my-medium">
            <ViewMore
              text={ this.props.mention.body_text || this.props.mention.raw_body_text || '' }
              transformText={ text => formatPost(text, this.props.keywords || [], this.props.mention.network) }
              length={ this.props.maxTextLength }
            />
          </div>
          <span className="grow" />
          { this.renderInteractions() }
        </div>
      </div>
    );
  }

  renderCreatedAt () {
    const createdAt = this.props.mention.post_created_at || this.props.mention.created_at;
    const created = new Date(createdAt);
    return moment(created).format('LLLL');
  }

  renderAuthorName = () => {
    if (this.props.mention.author_real_name.length > 0) {
      return (
        <span className="text--large ml-small text--default bold">
          { this.props.mention.author_real_name }
        </span>
      );
    } else {
      return undefined;
    }
  }

  renderAuthorUsername = () => {
    if (['twitter', 'instagram'].includes(this.props.mention.network)) {
      return `@${this.props.mention.author_username}`;
    } else if (this.props.mention.network === 'rss' && !this.props.mention.author_username) {
      return 'Blog, News, RSS';
    } else {
      return this.props.mention.author_username;
    }
  }

  renderAuthorInfluence = () => {
    if (this.props.mention.author_followers_count !== null) {
      const formatString = this.props.mention.author_followers_count > 999 ? '0.0a' : '0,0';
      return (
        <div
          className="badge ml-small"
          title="Author influence"
        >
          { numeral(this.props.mention.author_followers_count).format(formatString) }
        </div>
      );
    } else {
      return undefined;
    }
  }

  renderSentiment = () => {
    return (
      <span
        className={ `status status--${this.props.mention.sentiment_category} mr-small` }
        title={ `Sentiment: ${this.props.mention.sentiment_category}` }
      />
    );
  }

  renderMedia = () => {
    if (this.props.mention.post_media && this.props.mention.post_media.length) {
      return (
        <div className="mention-card__media flex flex-wrap mb-large">
          { this.props.mention.post_media.map((m, index) => (
            <a
              key={ `${m.media_url}${index}` }
              className="mention-card__media__link mb-small mr-small"
              href={ this.props.mention.activity_url }
              target="_blank"
              rel="noopener noreferrer"
            >
              <div
                className="mention-card__media__image rounded"
                style={{ backgroundImage: `url(${m.display_url || m.media_url})` }}
              />
            </a>
          )) }
        </div>
      );
    }
    return undefined;
  }

  renderInteractions = () => {
    return (
      <MentionCardInteractions
        mention={ this.props.mention }
      />
    );
  }

}
