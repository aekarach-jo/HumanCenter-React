import React, { useEffect } from 'react';
import { Col, Dropdown } from 'react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom';
import useLayout from 'hooks/useLayout';
import { useIsMobile } from 'hooks/useIsMobile';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from 'auth/authSlice';
import NavLanguageSwitcher from './NavLanguageSwitcher';
import NavMobileButtons from './NavMobileButtons';

const NavBar = ({ children }) => {
  useLayout();
  const { pathname } = useLocation();
  const { push } = useHistory();
  const getName = JSON.parse(localStorage.getItem('token'));
  useEffect(() => {
    document.documentElement.click();
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleLogout = () => {
    push('/login');
  };

  return (
    <Col className="h-100">
      <nav
        style={{ height: '68px', background: 'white', zIndex: '1002', position: 'static' }}
        className="text-center d-flex flex-row justify-content-between align-items-center px-5"
      >
        {useIsMobile() && <NavMobileButtons />}
        <img src="/img/logo/logo-human.jpg" alt="logo" style={{ width: '100px', height: '50px' }} />
        <Dropdown className="d-inline-block">
          <Dropdown.Toggle className="mb-1 cursor-pointer" as="p" href="#">
            <img src="/img/blank/blank-profile.png" alt="profile" className="rounded-circle mx-2" style={{ width: '39px', height: '39px' }} />
            {`${getName?.user?.first_name_th || ''} ${getName?.user?.last_name_th || ''}`}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {/* <Dropdown.Item>
              <NavLanguageSwitcher />
            </Dropdown.Item> */}
            <Dropdown.Item onClick={handleLogout}>
              <CsLineIcons icon="logout" className="me-2" size="17" /> <span className="align-middle">Logout</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </nav>
      <Col id="contentArea">{children}</Col>
    </Col>
  );
};

export default NavBar;
