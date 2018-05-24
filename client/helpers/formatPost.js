import React from 'react';
import _ from 'lodash';
import he from 'he';

const LINK_REGEX = /(https?:\/\/)?(www\.)?[-a-z0-9@:%._\+~#=]{1,256}\.[a-z]{2,4}\b([-a-z0-9@:%_\+.~#?&()//=]*)/gi; // eslint-disable-line no-useless-escape

const nonzero = (hash, nonhash) => {
  return hash.length > 0 ? hash : nonhash;
};

const formatHashTags = (separators) => {
  if (separators.length === 0) {
    return null;
  }

  const hashtags = _.filter(separators, separator => separator.includes('#')).join('|');
  const nonhashtags = _.filter(separators, separator => !separator.includes('#')).join('|\\b');
  const result = (hashtags && nonhashtags) ? nonhashtags.concat(`|${hashtags}`) : nonzero(hashtags, nonhashtags);

  return _.head(result).includes('#') ? new RegExp(`(${_.escapeRegExp(result)})(?!\\w)`, 'gi')
    : new RegExp(`(\\b${_.escapeRegExp(result)})(?!\\w)`, 'gi');
};


const splitByMultiple = (string, separators, type) => {
  let regex = /.*/;
  if (type === 'urls') {
    regex = new RegExp(`(${separators.map(_.escapeRegExp).join('|')})(?!\\w)`, 'gi');
  } else if (type === 'hashtags') {
    regex = formatHashTags(separators);
  } else if (type === 'keywords') {
    regex = new RegExp(`\\b((?=[\\w])${separators.map(_.escapeRegExp).join('|')})(?!\\w)`, 'gi');
  }
  return separators.length > 0 ? string.split(regex) : [string];
};

const splitByKeyWords = (string, keywords) => {
  return splitByMultiple(string, keywords, 'keywords').reduce((accumulated, currentSection) => {
    return accumulated.concat(splitByMultiple(currentSection, keywords, 'hashtags'));
  }, []);
};

const splitByUrlsThenKeywords = (string, urls, keywords) => {
  return splitByMultiple(string, urls, 'urls').reduce((accumulated, currentSection) => {
    if (urls.includes(currentSection)) {
      return accumulated.concat(currentSection);
    } else {
      return accumulated.concat(splitMessageUp(currentSection, [], keywords)); // eslint-disable-line no-use-before-define
    }
  }, []);
};

const splitMessageUp = (string, urls, keywords) => {
  if (urls.length === 0) {
    return splitByKeyWords(string, keywords);
  } else if (urls.length > 0) {
    return splitByUrlsThenKeywords(string, urls, keywords);
  } else {
    return splitByMultiple(string, keywords);
  }
};

const renderKeyword = (phrase, index) => (
  <span key={ `keyword-${index}` } className="text--positive">{ phrase }</span>
);

const renderLink = (phrase, index) => {
  const validUrl = phrase.match(/^http(s?):/i) ? phrase : `http://${phrase}`;
  if (validUrl.match(LINK_REGEX) === null || validUrl.match(/\.\./) !== null) {
    return phrase;
  }

  return (
    <a
      key={ `link-${index}` }
      href={ validUrl }
      target="_blank"
      rel="noopener noreferrer"
    >{ phrase }</a>
  );
};

const filterWordpressTags = (post) => {
  const arry = Array.from(post);

  // Get open and close brackets positions.
  // returns [0, 121, 122, 129, 279, 295]
  const tagIdx = arry.reduce((all, char, idx) => {
    if (char === '[' || char === ']') {
      all.push(idx);
    }
    return all;
  }, []);

  // Get string inside of brackets to see if we have
  // a closing tag
  const words = tagIdx.reduce((all, item, idx) => {
    if (idx % 2 === 0) {
      const tag = {
        words: '',
        startsAtIdx: 0,
        endsAtIdx: 0,
        closingTag: false,
      };
      const word = arry.slice(tagIdx[idx] + 1, tagIdx[idx + 1]);
      let str = word.join('');
      if (str.startsWith('/')) {
        str = str.slice(1);
        tag.closingTag = true;
      }
      tag.words = str;
      tag.startsAtIdx = tagIdx[idx];
      tag.endsAtIdx = tagIdx[idx + 1];
      all.push(tag);
    }
    return all;
  }, []);

  // Determine if we found an actual WP tag or just
  // something someone put in brackets.
  const cuts = words.reduce((all, word, idx, ary) => {
    const matches = ary[idx - 1] ? ary[idx - 1].words.startsWith(word.words) : false;
    if (word.closingTag === true && matches) {
      const cut = {};
      cut.startAt = words[idx - 1].startsAtIdx;
      cut.endAt = word.endsAtIdx;
      all.push(cut);
    }
    return all;
  }, []);

  // Cut out the tags from the original post :)
  if (cuts.length === 0) {
    return post;
  } else {
    return cuts.reduce((all, word) => {
      const str = post.slice(word.startAt, word.endAt + 1);
      return all.replace(str, '[ *embed omitted* ]').trim();
    }, post);
  }
};

export default (originalMessage, keywords, network) => {
  const uniqueKeywords = _.uniq(keywords);

  let message = originalMessage;
  if (network === 'automattic') {
    message = filterWordpressTags(originalMessage);
  }

  const urls = message.match(LINK_REGEX) || [];
  const splitMessage = splitMessageUp(message, urls, uniqueKeywords);

  const highlightedPostMessage = splitMessage.map((phrase, index) => {
    if (uniqueKeywords.includes(phrase.toLowerCase())) {
      return renderKeyword(phrase, index);
    } else if (urls.includes(phrase)) {
      return renderLink(phrase, index);
    }
    return he.decode(phrase);
  });

  return highlightedPostMessage;
};
