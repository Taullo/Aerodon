import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { injectIntl, defineMessages } from 'react-intl';

import classNames from 'classnames';
import { Helmet } from 'react-helmet';

import { connect } from 'react-redux';

import spring from 'react-motion/lib/spring';

import { mountCompose, unmountCompose } from 'flavours/aether/actions/compose';
import Column from 'flavours/aether/components/column';
import { mascot } from 'flavours/aether/initial_state';

import Motion from '../ui/util/optional_motion';

import ComposeFormContainer from './containers/compose_form_container';
import HeaderContainer from './containers/header_container';
import NavigationContainer from './containers/navigation_container';
import SearchContainer from './containers/search_container';
import SearchResultsContainer from './containers/search_results_container';

const messages = defineMessages({
  compose: { id: 'navigation_bar.compose', defaultMessage: 'Compose new post' },
});

const mapStateToProps = (state, ownProps) => ({
  showSearch: ownProps.multiColumn ? state.getIn(['search', 'submitted']) && !state.getIn(['search', 'hidden']) : false,
});

const mapDispatchToProps = (dispatch) => ({
  onMount () {
    dispatch(mountCompose());
  },

  onUnmount () {
    dispatch(unmountCompose());
  },
});

class Compose extends PureComponent {

  static propTypes = {
    multiColumn: PropTypes.bool,
    showSearch: PropTypes.bool,
    onMount: PropTypes.func,
    onUnmount: PropTypes.func,
    intl: PropTypes.object.isRequired,
  };

  componentDidMount () {
    this.props.onMount();
  }

  componentWillUnmount () {
    this.props.onUnmount();
  }

  render () {
    const {
      intl,
      multiColumn,
      showSearch,
    } = this.props;
    const computedClass = classNames('drawer');

    if (multiColumn) {
      return (
        <div className={computedClass} role='region' aria-label={intl.formatMessage(messages.compose)}>
          <HeaderContainer />

          {multiColumn && <SearchContainer />}

          <div className='drawer__pager'>
            <div className='drawer__inner'>
              <NavigationContainer />

              <ComposeFormContainer />

              <div className='drawer__inner__mascot'>
                {mascot ? <img alt='' draggable='false' src={mascot} /> : ''}
              </div>
            </div>

            <Motion defaultStyle={{ x: -100 }} style={{ x: spring(showSearch ? 0 : -100, { stiffness: 210, damping: 20 }) }}>
              {({ x }) => (
                <div className='drawer__inner darker' style={{ transform: `translateX(${x}%)`, visibility: x === -100 ? 'hidden' : 'visible' }}>
                  <SearchResultsContainer />
                </div>
              )}
            </Motion>
          </div>
        </div>
      );
    }

    return (
      <Column>
        <ComposeFormContainer />

        <Helmet>
          <meta name='robots' content='noindex' />
        </Helmet>
      </Column>
    );
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Compose));
