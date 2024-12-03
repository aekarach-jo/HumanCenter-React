/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { NavLink, useHistory } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Card, Col, Form, Row, Button, InputGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useFormik, FieldArray, FormikProvider } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import classNames from 'classnames';
import { SERVICE_URL } from 'config';
import Select from 'react-select';
import { request } from 'utils/axios-utils';
import DatepickerBasic from 'components/datepicker/DatepickerBasic';
import moment from 'moment';
import LovSelectCompany from 'components/lov-select/LovSelectCompany';
import LovSelectBank from 'components/lov-select/LovSelectBank';
import './style.css';

const initialData = {
  password: '',
};

const callUpdateMasterEmployee = async (data = {}) => {
  const res = await request({ url: `/employees/${data.id}`, method: 'PUT', data });
  return res;
};

const getEmployee = async (id) => {
  const res = await request({ url: `/employees/${id}`, method: 'GET' });
  return {
    ...initialData,
    ...res.data.data,
  };
};

const Home = () => {
  const storedValue = localStorage.getItem('token');
  const token = JSON.parse(storedValue);

  const useSetEmployeeData = (id) =>
    useQuery(['editCustomerData', id], () => getEmployee(id), {
      enabled: !!id,
      initialData,
      refetchOnWindowFocus: false,
      retry: 0,
      onSuccess(data) {},
      onError(err) {
        console.error('Error:', err);
      },
    });

  const { data: initResult, isFetching, refetch } = useSetEmployeeData(token.user.id);

  const formik = useFormik({ initialValues: initResult, enableReinitialize: true });
  const { handleSubmit, handleChange, values, touched, errors } = formik;
  const { mutate: updateEmployee, isLoading: isSaving } = useMutation((currentData) => callUpdateMasterEmployee(currentData), {
    onSuccess({ data: { message, error, data: savedData } }) {
      if (error) {
        console.error('save order error :', message);
      }
      refetch();
      toast('success');
    },
    onError(error) {
      if (error.response) {
        toast.error(() => {
          return (
            <div style={{ width: 'auto' }}>
              {error.response.data.errors.map((item, index) => (
                <div className="mb-2" key={index}>
                  {item}
                  <hr />
                </div>
              ))}
            </div>
          );
        });
      }
    },
  });

  const handleSave = () => {
    var data = {
      ...values,
      password: values.password,
    };
    console.log(data);

    updateEmployee(data);
  };

  return (
    <>
      <div className="profile-container">
        <div className="wrap-img">
          <img src="/img/blank/blank-profile.png" alt="Profile Picture" />
        </div>
        <table className="profile-table">
          <tr>
            <th>ชื่อ - นามสกุล</th>
            <td>{`${values?.first_name_th} ${values?.last_name_th}`}</td>
          </tr>
          <tr>
            <th>ประจำสาขา</th>
            <td>{`${values?.company?.name_th}`}</td>
          </tr>
          <tr>
            <th>รหัสพนักงาน</th>
            <td>{values?.employee_no}</td>
          </tr>
          <tr>
            <th>วันเริ่มงาน</th>
            <td>{moment(values?.start_at).format('DD MMMM YYYY')}</td>
          </tr>
          <tr>
            <th>เลขที่บัญชี</th>
            <td>{values?.bank_account_no}</td>
          </tr>
          <tr>
            <th>ธนาคาร</th>
            <td>{values?.bank?.bank_name}</td>
          </tr>
          <tr>
            <th>รหัสผ่าน</th>
            <td className="d-flex flex-row gap-2 p-0">
              <Form.Control className="form-control border-0" type="text" name="password" onChange={handleChange} />
              <button type="button" className="btn btn-primary btn-sm m-1" onClick={() => handleSave()}>
                แก้ไข
              </button>
            </td>
          </tr>
        </table>
      </div>
    </>
  );
};

export default Home;
