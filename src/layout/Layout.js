/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { Row, Col, Modal, Button } from 'react-bootstrap';
import clx from 'classnames';
import { useLocation } from 'react-router-dom';
import useLayout from 'hooks/useLayout';
import { useIsMobile } from 'hooks/useIsMobile';
import { request } from 'utils/axios-utils';
import moment from 'moment';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { useIntl } from 'react-intl';
import Nav from 'layout/nav/Nav';
import NavBar from './nav/NavBar';

const Layout = ({ children }) => {
  useLayout();
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.click();
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, [pathname]);

  return (
    <NavBar>
      <Nav />
      <main className={`${useIsMobile() ? 'py-4' : ''}`}>
        <Row className="h-100">
          <Col className={`${useIsMobile() ? 'py-0' : 'py-5'} h-100`} id="contentArea">
            {children}
          </Col>
        </Row>
      </main>
    </NavBar>
  );
};

export default React.memo(Layout);
