import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import LayoutFullpage from 'layout/LayoutFullpage';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import HtmlHead from 'components/html-head/HtmlHead';
import { useLogin } from 'utils/auth';
import clx from 'classnames';

const Login = () => {
  const { replace } = useHistory();
  const { requestLogin, isFetching } = useLogin();

  const { formatMessage: f } = useIntl();

  const title = f({ id: 'auth.login' });
  const description = f({ id: 'auth.description' });

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().min(6, 'Must be at least 6 chars!').required('Password is required'),
  });
  const initialValues = { username: '', password: '' };
  const onSubmit = async (values) => {
    // console.log('submit form', values);

    try {
      await requestLogin(values, true);
      replace('/');
    } catch (err) {
      console.error('Login error :  ', err);
    }
  };

  const formik = useFormik({ initialValues, validationSchema, onSubmit });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  const leftSide = (
    <div className="min-h-100 d-flex align-items-center">
      <div className="w-100 w-lg-75 w-xxl-50">
        <div>
          <div className="mb-5">
            <img className="w-100" src="/img/logo/logo.png" alt="Logo" />
          </div>
        </div>
      </div>
    </div>
  );

  const rightSide = (
    <div
      className={clx(' min-h-100 d-flex justify-content-center align-items-center py-5', {
        'overlay-spinner': isFetching,
      })}
      // style={{ background: '#f9f9f9' }}
    >
      <div
        className="p-6 px-4 d-flex flex-column justify-content-center align-items-center rounded"
        style={{ width: '540px', height: '458px', background: '#ffffff99' }}
      >
        <div className="mb-2">
          <h1 className="text-center font-weight-bold text-black" style={{ fontSize: '32px', lineHeight: '44px' }}>
            {f({ id: 'auth.login' })}
          </h1>
        </div>
        <div className="w-100">
          <form id="loginForm" className="tooltip-end-bottom" onSubmit={handleSubmit}>
            <div className="mb-3 form-group tooltip-end-top">
              <Form.Label className="col-form-label required">Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                className="rounded-sm sh-6"
                onChange={handleChange}
                value={values?.username}
                placeholder="Enter Username"
                // disabled={values?.id}
                isInvalid={errors.username && touched.username}
              />
              {errors.username && touched.username && <div className="d-block invalid-feedback">{f({ id: errors.username })}</div>}
            </div>
            <div className="mb-3 form-group tooltip-end-top">
              <Form.Label className="col-form-label">{f({ id: 'auth.password' })}</Form.Label>
              <Form.Control
                type="password"
                name="password"
                className="rounded-sm sh-6"
                onChange={handleChange}
                value={values.password}
                placeholder="Enter Password"
                disabled={isFetching}
                isInvalid={errors.password && touched.password}
              />
              {errors.password && touched.password && <div className="d-block invalid-feedback">{f({ id: errors.password })}</div>}
            </div>
            <Button className="w-100 mt-3" size="lg" type="submit">
              {f({ id: 'auth.login' })}
            </Button>
          </form>
        </div>
        <div className="mt-4 w-100">
            <div>วิธีการเข้าใช้งานระบบ</div>
            <div>1. กรอก Username และ Password เพื่อเข้าสู่ระบบ</div>
            <div>2. หากไม่สามารถเข้าใช้งานระบบได้ กรุณาติดต่อเจ้าหน้าที่ โทร 066-0529136</div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <HtmlHead title={title} description={description} />
      <LayoutFullpage left={leftSide} right={rightSide} />
    </>
  );
};

export default Login;
