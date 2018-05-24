import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import pluralize from 'pluralize';
import {
  Tooltip,
  IconDropdown,
} from 'transcend-react';

export default class MentionCardInteractions extends Component {

  static propTypes = {
    mention: PropTypes.object.isRequired,
  };

  constructor (...args) {
    super(...args);
    const [props] = args;
    this.state = {
      interaction: {
        showShareForm: false,
        showCommentForm: false,
        showLikeForm: false,
        showUnlikeForm: false,
        showRetweetForm: false,
        showReplyForm: false,
        showQuoteForm: false,
        showFollowForm: false,
        showTagForm: false,
        showEmailForm: false,
        showInternalCommentForm: false,
        showMarkAsSpamForm: false,
        showDeleteForm: false,
      },
    };
  }

  onInteractionClick = (stateKey) => {
    console.log('thanks for clicking bud', stateKey);
  }

  onShareClick = this.onInteractionClick.bind(this, 'showShareForm');
  onCommentClick = this.onInteractionClick.bind(this, 'showCommentForm');
  onLikeClick = this.onInteractionClick.bind(this, 'showLikeForm');
  onUnlikeClick = this.onInteractionClick.bind(this, 'showUnlikeForm');
  onRetweetClick = this.onInteractionClick.bind(this, 'showRetweetForm');
  onReplyClick = this.onInteractionClick.bind(this, 'showReplyForm');
  onQuoteClick = this.onInteractionClick.bind(this, 'showQuoteForm');
  onFollowClick = this.onInteractionClick.bind(this, 'showFollowForm');
  onTagClick = this.onInteractionClick.bind(this, 'showTagForm');
  onEmailClick = this.onInteractionClick.bind(this, 'showEmailForm');
  onInternalCommentClick = this.onInteractionClick.bind(this, 'showInternalCommentForm');
  onMarkAsSpamClick = this.onInteractionClick.bind(this, 'showMarkAsSpamForm');
  onDeleteClick = this.onInteractionClick.bind(this, 'showDeleteForm');

  render () {
    const optionContainerClassName = [
      'flex',
      'ai-b',
      'text--small',
      'mention-card__interactions',
      this.isInteracting() ? 'mention-card__interactions--active' : undefined,
    ].filter(Boolean).join(' ');

    return (
      <div className="pt-small">
        <div className={ optionContainerClassName }>
          { this.renderNetworkOptions() }
          { this.renderStandardOptions() }
          <div className="grow flex ai-b jc-fe">
            { this.renderMoreInteractions() }
          </div>
        </div>
      </div>
    );
  }

  renderOption (overlay, iconName, onClick, isActive, buttonExtraClassName, extraText) {
    const buttonClassName = [
      'button--clean',
      'button--no-pad',
      !isActive && this.isInteracting() ? 'mention-card__interactions__interaction--inactive' : undefined,
      buttonExtraClassName,
    ].filter(Boolean).join(' ');

    const renderButton = () => (
      <button
        className={ `button--clean button--no-pad ${buttonClassName}` }
        key={ `${iconName}-${this.props.mention.social_source_uid}` }
      >
        <span className={ `icon--${iconName}` } />
        { extraText }
      </button>
    );

    if (!overlay) {
      return renderButton();
    } else {
      return (
        <Tooltip placement="top" overlay={ overlay }>
          { renderButton() }
        </Tooltip>
      );
    }
  }

  renderNetworkOptions () {
    switch (this.props.mention.network) {
      case 'twitter':
        return (
          <span className="border-right pr-medium mr-medium">
            { this.state.liked
              ? this.renderOption('Unlike', 'heart text--negative', this.onUnlikeClick, this.state.interaction.showUnlikeForm)
              : this.renderOption('Like', 'heart', this.onLikeClick, this.state.interaction.showLikeForm)
            }
            { this.renderOption('Retweet', 'repost', this.onRetweetClick, this.state.interaction.showRetweetForm) }
            { this.renderOption('Quote', 'quote', this.onQuoteClick, this.state.interaction.showQuoteForm) }
            { this.renderOption('Comment', 'edit', this.onCommentClick, this.state.interaction.showCommentForm) }
            { this.renderOption('Follow', 'plus', this.onFollowClick, this.state.interaction.showFollowForm) }
          </span>
        );
      case 'facebook':
        return (
          <span className="border-right pr-medium mr-medium">
            { this.state.liked
              ? this.renderOption('Unlike', 'facebook-like text--negative', this.onUnlikeClick, this.state.interaction.showUnlikeForm)
              : this.renderOption('Like', 'facebook-like', this.onLikeClick, this.state.interaction.showLikeForm)
            }
            { this.renderOption('Comment', 'edit', this.onCommentClick, this.state.interaction.showCommentForm) }
            { this.renderOption('Share', 'share', this.onShareClick, this.state.interaction.showShareForm) }
          </span>
        );
      case 'instagram':
        return (
          <span className="border-right pr-medium mr-medium">
            { this.state.liked
              ? this.renderOption('Unlike', 'heart text--negative', this.onUnlikeClick, this.state.interaction.showUnlikeForm)
              : this.renderOption('Like', 'heart', this.onLikeClick, this.state.interaction.showLikeForm)
            }
            { this.renderOption('Comment', 'edit', this.onCommentClick, this.state.interaction.showCommentForm) }
          </span>
        );
      case 'pinterest':
        return (
          <span className="border-right pr-medium mr-medium">
            { this.renderOption('Comment', 'edit', this.onCommentClick, this.state.interaction.showCommentForm) }
          </span>
        );
      default:
        return null;
    }
  }

  renderStandardOptions () {
    const tagCount = _.get(this.props, 'mention.tags.length', 0);
    const commentCount = _.get(this.props, `commentCounts.data.${this.props.mention._id}`, 0);
    return (
      <span>
        { this.renderOption(
          'Tag',
          'tag',
          this.onTagClick,
          this.state.interaction.showTagForm,
          tagCount > 0 ? 'button--positive' : null,
        ) }
        { this.renderOption(
          'Note',
          'comment',
          this.onInternalCommentClick,
          this.state.interaction.showInternalCommentForm,
          null,
        ) }
        { this.renderOption('Email', 'mail', this.onEmailClick, this.state.interaction.showEmailForm) }
      </span>
    );
  }

  renderMoreInteractions () {
    const spamButton =
      <span className={ 'ml-small button--clean button--plain button--no-pad' }>Mark author as spam</span>;
    const deleteButton =
      <span className={ 'ml-small button--clean button--plain button--no-pad' }>Delete mention</span>;
    return (
      <IconDropdown className="ml-medium icon icon--more-vertical" bottom>
        <span>MOAR OPTIONS!!</span>
      </IconDropdown>
    );
  }

  isInteracting = () => Object.values(this.state.interaction).some(_.identity);
}
