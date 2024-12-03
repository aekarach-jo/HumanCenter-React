/* eslint-disable no-nested-ternary */
/* eslint-disable react/button-has-type */
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
import { useHistory } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Card, Col, Form, Row, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { request } from 'utils/axios-utils';
import * as Yup from 'yup';
import classNames from 'classnames';
import AutoComplete from './AutoComplete';
import ParcelList from './ParcelList';
import LovCustomerSelect from './LovSelectCustomer';
import './style.css';

const initialData = {
  status: '',
  description: '',
  statusCheck: false,
  sub_workings: [],
  item: [],
};

const validationSchema = Yup.object().shape({});

const callAddMasterWorking = async (data = {}) => {
  const res = await request({ url: `/workings`, method: 'POST', data });
  return res;
};

const callUpdateMasterWorking = async (data = {}) => {
  const res = await request({ url: `/workings/${data.id}`, method: 'PATCH', data });
  return res;
};

const getWorking = async (id) => {
  const res = await request({ url: `/workings/${id}`, method: 'GET' });
  return {
    ...initialData,
    data: res.data.data,
  };
};

const InformationForm = ({ id, mode, customerLevelOption }) => {
  const { formatMessage: f } = useIntl();
  const isEditMode = mode === 'new' || (mode === 'edit' && id);
  const { push } = useHistory();
  const [parcelList, setParcelList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const useSetWorkingData = (id) =>
    useQuery(['editCustomerData', id], () => getWorking(id), {
      enabled: !!id,
      initialData,
      refetchOnWindowFocus: false,
      retry: 0,
      onSuccess({ data }) {
        setParcelList(data?.item || []);
        console.log(data);
      },
      onError(err) {
        console.error('Error:', err);
      },
    });

  const { data: initResult, isFetching, refetch } = useSetWorkingData(id);

  var init = '';
  if (id === undefined) {
    init = initialData;
  } else {
    init = initResult.data;
  }

  const formik = useFormik({ initialValues: init, validationSchema, enableReinitialize: true });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  const { mutate: saveWorking, isLoading: isAdding } = useMutation((currentData) => callAddMasterWorking(currentData), {
    onSuccess({ data: { message, error, data: savedData } }) {
      if (error) {
        console.error('save order error :', message);
      }
      push('./');
      toast('success');
    },
    onError(error) {
      if (error?.response) {
        toast.error(() => {
          return (
            <div style={{ width: 'auto' }}>
              {error?.response?.data?.errors.map((item, index) => (
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

  const { mutate: updateWorking, isLoading: isSaving } = useMutation((currentData) => callUpdateMasterWorking(currentData), {
    onSuccess({ data: { message, error, data: savedData } }) {
      if (error) {
        console.error('save order error :', message);
      }
      refetch();
      toast('success');
    },
    onError(error) {
      if (error?.response) {
        toast.error(() => {
          return (
            <div style={{ width: 'auto' }}>
              {error?.response?.data?.errors.map((item, index) => (
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

  const handleCancelClick = () => {
    push('/master/working');
  };

  const handleSave = () => {
    var data = {
      id: values?.id || '',
      description: values?.description || '',
      status: values?.status || '',
      sub_working: dataList,
    };

    if (Object.keys(errors).length === 0) {
      if (!id) {
        saveWorking(data);
      } else {
        updateWorking(data, values?.id);
      }
    }
  };

  const handleChangeValue = (e, item) => {
    const updatedSubWorkings = values?.sub_workings.map((subWorking) => {
      return {
        ...subWorking,
        list: subWorking.list.map((listItem) => {
          if (listItem.id === item.id) {
            const existingIndex = dataList.findIndex((data) => data.id === listItem.id);
            if (existingIndex !== -1) {
              setDataList((prev) => {
                const newDataList = [...prev];
                newDataList[existingIndex] = { ...newDataList[existingIndex], working_time: e };
                return newDataList;
              });
            } else {
              setDataList((prev) => [...prev, { id: listItem.id, working_time: e }]);
            }
            return { ...listItem, working_time: e };
          }
          return listItem;
        }),
      };
    });
    formik.setFieldValue('sub_workings', updatedSubWorkings);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  useEffect(() => {
    console.log(dataList);
  }, [dataList]);

  return (
    <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
      <div className="page-title-container mb-0">
        <Row>
          <Col className="mb-0">
            <div className="page-title-container mb-3">
              <Col className="mb-2">
                <h1 className="mb-2 pb-0 font-weight-bold">ข้อมูลการทำงาน</h1>
              </Col>
            </div>
          </Col>
        </Row>
      </div>
      <Card
        className={classNames('mb-5 p-4', {
          'overlay-spinner': isFetching,
        })}
      >
        <div className="container">
          <div className="header-section">
            <div className="img-logo">
              <img src="/img/logo/logo-human.jpg" alt="Company Logo" />
              <h1>บันทึกการทำงานรอบ 1 สิงหาคม - 15 สิงหาคม 2567</h1>
            </div>
          </div>
          <div className="table table-responsive">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th rowSpan={2}>ลำดับ</th>
                  <th rowSpan={2} className="col-size">
                    รหัสพนักงาน
                  </th>
                  <th rowSpan={2} className="col-size">
                    ชื่อ - นามสกุล
                  </th>
                  <th rowSpan={2}>แผนก</th>
                  <th rowSpan={2} className="col-day-size">
                    รายละเอียด
                  </th>
                  <th colSpan={15}>บันทึกการทำงานรอบ 1 สิงหาคม - 15 สิงหาคม 2567</th>
                  <th rowSpan={2}>ตกหล่น</th>
                </tr>
                <tr>
                  <th className="col-day-size">1</th>
                  <th className="col-day-size">2</th>
                  <th className="col-day-size">3</th>
                  <th className="col-day-size">4</th>
                  <th className="highlight-orange col-day-size">5</th>
                  <th className="col-day-size">6</th>
                  <th className="col-day-size">7</th>
                  <th className="col-day-size">8</th>
                  <th className="col-day-size">9</th>
                  <th className="col-day-size">10</th>
                  <th className="highlight-orange col-day-size">11</th>
                  <th className="highlight-green col-day-size">12</th>
                  <th className="col-day-size">13</th>
                  <th className="col-day-size">14</th>
                  <th className="col-day-size">15</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowSpan={11} className="highlight-green">
                    1
                  </td>
                  <td rowSpan={11}>13000195</td>
                  <td rowSpan={11}>
                    <div className="col">
                      <p className="mb-3 text-small">นายพรศักดิ์ ปรีชากุล</p>
                      <p className="mb-3 text-small">Mr.Pornsak preechakul</p>
                      <p className="mb-1 text-small">วันเริ่มงาน</p>
                      <p className="text-small">19 ก.ค. 24</p>
                    </div>
                  </td>
                  <td rowSpan={11} className="highlight-lightgreen mantfact-text-style">
                    Manufacturing Operator
                  </td>
                </tr>
                {values?.sub_workings?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item?.title}</td>
                      {item?.list?.map((list, index) => {
                        return (
                          <td
                            key={index}
                            className={`${list.day === '4' || list.day === '11' ? 'highlight-orange' : list.day === '12' ? 'highlight-green' : ''}`}
                          >
                            <Form.Control className="" type="text" value={list.working_time} onChange={(e) => handleChangeValue(e.target.value, list)} />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="request-details">
            <p>รายละเอียดการขอแก้ไข</p>
            <textarea name="description" defaultValue={values?.description} onChange={handleChange} />
          </div>
        </div>
      </Card>

      <Row>
        <Col className="mb-2">
          <div className="page-title-container mb-3">
            <Row className="text-end">
              <Col md="12">
                <Button className="btn-icon" variant="foreground-alternate" onClick={handleCancelClick} disabled={isAdding || isSaving}>
                  ย้อนกลับ
                </Button>{' '}
                <Button
                  className="btn-icon"
                  variant="primary"
                  type="submit"
                  onClick={handleSave}
                  // disabled={isAdding || isSaving }
                >
                  ยืนยันข้อมูล
                </Button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default InformationForm;
