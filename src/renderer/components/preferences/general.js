import PropTypes from 'prop-types';
import styled from 'styled-components';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import { Input as BaseInput } from '@buttercup/ui';
import { ipcRenderer as ipc } from 'electron';

import { languages } from '../../../shared/i18n';
import { getSetting } from '../../../shared/selectors';
import { setSetting } from '../../../shared/actions/settings';

const Input = styled(BaseInput)`
  font-weight: 300;
  display: inline-block;
  padding: 0 12px;
`;

const Range = styled(BaseInput)`
  display: inline-block;
  padding: 0;
`;

const Select = styled.select`
  font-weight: 300;
  height: auto;
  height: 43px;
  background-color: #fff;
  border: 2px solid #e4e9f2;
  padding: 0 12px;
  border-radius: 4px;
  display: inline-block;
  width: 100%;
  &:focus {
    border-color: #00b7ac;
  }
`;

const LabelWrapper = styled.label`
  min-height: var(--form-input-height);
  margin-right: var(--spacing-half);
  padding-right: var(--spacing-one);
  display: block;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 0.75em;
  margin: 0 0 20px;
  input,
  select {
    margin-top: 4px;
  }
`;

const Content = styled.div`
  height: 100%;
`;

class General extends PureComponent {
  static propTypes = {
    t: PropTypes.func,
    locale: PropTypes.string,
    isTrayIconEnabled: PropTypes.boolean,
    setIsTrayIconEnabled: PropTypes.func,
    condencedSidebar: PropTypes.boolean,
    setCondencedSidebar: PropTypes.func,
    referenceFontSize: PropTypes.number,
    setReferenceFontSize: PropTypes.func
  };

  state = {
    fontSize: 13,
    language: 'en'
  };

  changeInput = (e, name) => {
    this.setState({
      [name]: e.target.value
    });
  };

  render() {
    const {
      t,
      locale,
      isTrayIconEnabled,
      setIsTrayIconEnabled,
      condencedSidebar,
      setCondencedSidebar,
      referenceFontSize,
      setReferenceFontSize
    } = this.props;

    const { fontSize } = this.state;

    return (
      <Content>
        <h3>{t('preferences.general')}</h3>
        <LabelWrapper>
          {t('app-menu.view.enable-tray-icon')}
          <input
            type="checkbox"
            onChange={e => setIsTrayIconEnabled(e.target.checked)}
            checked={isTrayIconEnabled}
          />
        </LabelWrapper>

        <LabelWrapper>
          {t('app-menu.view.condensed-sidebar')}
          <input
            type="checkbox"
            onChange={e => setCondencedSidebar(e.target.checked)}
            checked={condencedSidebar}
          />
        </LabelWrapper>
        <LabelWrapper>
          font size
          <Range
            bordered
            min="0.5"
            step="0.1"
            max="2"
            onChange={e => setReferenceFontSize(e.target.value)}
            value={referenceFontSize}
            placeholder={t('archive-search.searchterm')}
            type="range"
          />
        </LabelWrapper>

        <LabelWrapper>
          {t('app-menu.view.language')}
          <Select
            value={locale}
            onChange={e => {
              ipc.send('change-locale-main', e.target.value);
              // quick fix to update tray icon translation
              if (isTrayIconEnabled) {
                setIsTrayIconEnabled(!isTrayIconEnabled);
                setIsTrayIconEnabled(isTrayIconEnabled);
              }
            }}
          >
            {Object.keys(languages).map(key => (
              <option key={key} value={key}>
                {languages[key].name}
              </option>
            ))}
          </Select>
        </LabelWrapper>
      </Content>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setIsTrayIconEnabled: payload => {
      dispatch(setSetting('isTrayIconEnabled', payload));
    },
    setCondencedSidebar: payload => {
      dispatch(setSetting('condencedSidebar', payload));
    },
    setReferenceFontSize: payload => {
      dispatch(setSetting('referenceFontSize', payload));
    }
  };
};

export default connect(
  state => ({
    locale: getSetting(state, 'locale'),
    isTrayIconEnabled: getSetting(state, 'isTrayIconEnabled'),
    condencedSidebar: getSetting(state, 'condencedSidebar'),
    referenceFontSize: getSetting(state, 'referenceFontSize')
  }),
  mapDispatchToProps
)(General, 'General');
