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

const initialData = {
  employee_no: '',
  national_card_no: '',
  first_name_th: '',
  first_name_en: '',
  last_name_th: '',
  last_name_en: '',
  branch_id: '',
  username: '',
  password: '',
  description: '',
  emp_image: '',
  start_at: '',
  resign_at: '',
  blacklist: false,
  active: true,
  roles: '',
  bank_account_no: 0,
  company_id: '',
  bank_id: '',
  avatar: '',
};

const validationSchema = Yup.object().shape({
  employee_no: Yup.string().required('Please provide Employee Number'),
  national_card_no: Yup.string().required('Please provide National Card Number'),
  first_name_th: Yup.string().required('Please provide First Name (TH)'),
  last_name_th: Yup.string().required('Please provide Last Name (TH)'),
  branch_id: Yup.string().required('Please provide Branch ID'),
  username: Yup.string().required('Please provide Username'),
  password: Yup.string().required('Please provide Password'),
  emp_image: Yup.string().required('Please provide Employee Image'),
  start_at: Yup.string().required('Please provide Start Date'),
  blacklist: Yup.string().required('Please provide Blacklist Status'),
  active: Yup.string().required('Please provide Active Status'),
  roles: Yup.object().required('Please provide Roles'),
  bank_account_no: Yup.string().required('Please provide Bank Account Number'),
  company_id: Yup.string().required('Please provide Company ID'),
  bank_id: Yup.string().required('Please provide Bank ID'),
});

const callAddMasterEmployee = async (data = {}) => {
  const res = await request({ url: `/employees`, method: 'POST', data });
  return res;
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

const InformationForm = ({ id, mode }) => {
  const { formatMessage: f } = useIntl();
  const isEditMode = mode === 'new' || (mode === 'edit' && id) || mode !== 'view';
  const { push } = useHistory();
  const [preview, setPreview] = useState();
  const [selectedFile, setSelectedFile] = useState();
  const [fileSizeAlert, setFileSizeAlert] = useState(false);

  const useSetEmployeeData = (id) =>
    useQuery(['editCustomerData', id], () => getEmployee(id), {
      enabled: !!id,
      initialData,
      refetchOnWindowFocus: false,
      retry: 0,
      onSuccess(data) {
        console.log(data);
        data.roles = { value: data.roles, label: data.roles };
      },
      onError(err) {
        console.error('Error:', err);
      },
    });

  const { data: initResult, isFetching, refetch } = useSetEmployeeData(id);

  var init = '';
  if (id === undefined) {
    init = initialData;
  } else {
    init = initResult;
  }

  const formik = useFormik({ initialValues: init, validationSchema, enableReinitialize: true });
  const { handleSubmit, handleChange, values, touched, errors } = formik;

  const { mutate: saveEmployee, isLoading: isAdding } = useMutation((currentData) => callAddMasterEmployee(currentData), {
    onSuccess({ data: { message, error, data: savedData } }) {
      if (error) {
        console.error('save order error :', message);
      }
      push('/master/employee');
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

  const handleCancelClick = () => {
    push('/master/employee');
  };

  const handleSave = () => {
    console.log(values);
    
    var data = {
      id: values?.id,
      employee_no: values.employee_no,
      national_card_no: values.national_card_no,
      first_name_th: values.first_name_th,
      first_name_en: values.first_name_en,
      last_name_th: values.last_name_th,
      last_name_en: values.last_name_en,
      branch_id: values.branch_id,
      username: values.username,
      password: values.password,
      description: values.description,
      emp_image: values.emp_image,
      start_at: values.start_at === 'Invalid date' ? null : values.start_at,
      resign_at: values.resign_at === 'Invalid date' ? null : values.resign_at,
      blacklist: values.blacklist,
      active: values.active,
      roles: values.roles?.value ? values.roles?.value : values.roles,
      bank_account_no: values.bank_account_no || values.bank_id,
      company_id: Number(values.company_id),
      bank_id: Number(values.bank_id),
    };
    console.log(data);

    if (Object.keys(errors).length === 0 || values.username !== '') {
      if (!id) {
        data.password = values.national_card_no;
        saveEmployee(data);
      } else {
        updateEmployee({ ...data, id });
      }
    }
  };
  const onUploadFile = async (value) => {
    const formData = new FormData();
    formData.append('image', value);
    try {
      await axios
        .post(`${SERVICE_URL}/content/upload`, formData, {
          headers: {
            'content-type': 'application/json',
          },
        })
        .then((res) => {
          const { imageUrl } = res.data.data;
          handleChange({ target: { id: 'avatar', value: imageUrl } });
        });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return undefined;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    if (e.target.files[0].size > 1000000) {
      handleChange({ target: { id: 'avatar', value: '/img/userEmpty/account.png' } });
      setSelectedFile(undefined);
      setFileSizeAlert(true);
    } else {
      onUploadFile(e.target.files[0]);
      setSelectedFile(e.target.files[0]);
      setFileSizeAlert(false);
    }
  };

  const onChangeDate = (name, e) => {
    const format = moment(e).format('YYYY-MM-DD');
    handleChange({ target: { id: [name], value: format } });
  };
  const onChangeCardNo = (e) => {
    if (/^[0-9]*$/.test(e.target.value)) {
      handleChange({ target: { id: 'national_card_no', value: e.target.value } });
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <div className="page-title-container mb-0">
          <Row>
            <Col className="mb-0">
              <div className="page-title-container mb-3">
                <Col className="mb-2">
                  <h1 className="mb-2 pb-0 font-weight-bold">ข้อมูลพนักงาน</h1>
                </Col>
              </div>
            </Col>
          </Row>
        </div>
        <Card
          className={classNames('mb-5', {
            'overlay-spinner': isFetching,
          })}
        >
          <Card className="rounded-sm p-4">
            <Row>
              <Col sm="12" md="12" lg="9">
                <Card className="no-shadow border mt-2 p-2">
                  <Row className="mb-3">
                    <Col sm="12" md="12" lg="4" className="position-relative cursor-pointer">
                      <img
                        src={preview !== undefined ? preview : `${values.avatar ? values.avatar : '/img/blank/blank-profile.png'}`}
                        className="rounded pt-2 ms-3"
                        alt="thumb"
                        style={{ width: '11rem', height: '7.8rem', objectFit: 'contain' }}
                      />
                      <input
                        disabled={!isEditMode}
                        onChange={onSelectFile}
                        // value={values.logo}
                        className="border-2"
                        id="file-upload"
                        style={{
                          width: '180px',
                          height: '120px',
                          borderRadius: '100%',
                          position: 'absolute',
                          left: '26px',
                          top: '13px',
                          opacity: '0',
                          cursor: 'pointer',
                        }}
                        accept="image/jpeg, image/bmp, image/pmg, image/png"
                        // jpeg bmp pmg
                        type="file"
                      />
                    </Col>
                    <Col sm="12" md="12" lg="8">
                      <div className="h5 mb-0 font-weight-600 p-2">Upload new avatar</div>
                      <button disabled={!isEditMode} className="border-0 bg-white pb-2" type="button" style={{ borderRadius: '10px' }}>
                        <input
                          disabled={!isEditMode}
                          onChange={onSelectFile}
                          id="file-upload"
                          className="hidden form-control"
                          accept="image/jpeg, image/bmp, image/pmg, image/png"
                          type="file"
                        />
                      </button>
                      <div className="text-muted">
                        <span className={`${fileSizeAlert ? 'text-danger  p-2' : 'text-info p-2'}`}>The maximum file size allowed is 1MB.</span>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col sm="12" md="12" lg="3">
                <Form.Label className="col-form-label required">ชื่อ</Form.Label>
                <Form.Control
                  type="text"
                  name="first_name_th"
                  onChange={handleChange}
                  value={values?.first_name_th}
                  disabled={!isEditMode}
                  isInvalid={errors.first_name_th && touched.first_name_th}
                />
                {errors.first_name_th && touched.first_name_th && <div className="d-block invalid-feedback">{f({ id: errors.first_name_th })}</div>}
              </Col>
              <Col sm="12" md="12" lg="3">
                <Form.Label className="col-form-label required">นามสกุล</Form.Label>
                <Form.Control
                  type="text"
                  name="last_name_th"
                  onChange={handleChange}
                  value={values?.last_name_th}
                  disabled={!isEditMode}
                  isInvalid={errors.last_name_th && touched.last_name_th}
                />
                {errors.last_name_th && touched.last_name_th && <div className="d-block invalid-feedback">{f({ id: errors.last_name_th })}</div>}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col sm="12" md="12" lg="3">
                <Form.Label className="col-form-label required">เลขบัตรประชาชน</Form.Label>
                <Form.Control
                  type="text"
                  name="national_card_no"
                  onChange={onChangeCardNo}
                  value={values?.national_card_no}
                  disabled={!isEditMode}
                  isInvalid={errors.national_card_no && touched.national_card_no}
                />
                {errors.national_card_no && touched.national_card_no && <div className="d-block invalid-feedback">{f({ id: errors.national_card_no })}</div>}
              </Col>
              <Col sm="12" md="12" lg="3">
                <Form.Label className="col-form-label required">รหัสพนักงาน</Form.Label>
                <Form.Control
                  type="text"
                  name="employee_no"
                  onChange={handleChange}
                  value={values?.employee_no}
                  disabled={!isEditMode}
                  isInvalid={errors.employee_no && touched.employee_no}
                />
                {errors.employee_no && touched.employee_no && <div className="d-block invalid-feedback">{f({ id: errors.employee_no })}</div>}
              </Col>
              <Col sm="12" md="12" lg="3">
                <Form.Label className="col-form-label required">ประจำสาขา</Form.Label>
                <LovSelectCompany
                  value={Number(values?.company_id)}
                  isDisabled={!isEditMode}
                  onChange={(e) => handleChange({ target: { id: 'company_id', value: e } })}
                />
                {errors.company_id && touched.company_id && <div className="d-block invalid-feedback">{f({ id: errors.company_id })}</div>}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col sm="12" md="12" lg="3">
                <Form.Label className="col-form-label required">วันเริ่มงาน</Form.Label>
                <DatepickerBasic onChange={(e) => onChangeDate('start_at', e)} value={values?.start_at} disabled={!isEditMode} />
                {errors.start_at && touched.start_at && <div className="d-block invalid-feedback">{f({ id: errors.start_at })}</div>}
              </Col>
              <Col sm="12" md="12" lg="3">
                <Form.Label className="col-form-label required">วันลาออก</Form.Label>
                <DatepickerBasic onChange={(e) => onChangeDate('resign_at', e)} value={values?.resign_at} disabled={!isEditMode} />
                {errors.resign_at && touched.resign_at && <div className="d-block invalid-feedback">{f({ id: errors.resign_at })}</div>}
              </Col>
              <Col sm="12" md="12" lg="3">
                <Form.Label className="col-form-label required">เลขที่บัญชี</Form.Label>
                <Form.Control
                  type="text"
                  name="bank_account_no"
                  onChange={handleChange}
                  value={values?.bank_account_no}
                  disabled={!isEditMode}
                  isInvalid={errors.bank_account_no && touched.bank_account_no}
                />
                {errors.bank_account_no && touched.bank_account_no && <div className="d-block invalid-feedback">{f({ id: errors.bank_account_no })}</div>}
              </Col>
            </Row>
            <Row className="mb-2">
              <Col sm="12" md="12" lg="3">
                <Form.Label className="col-form-label required">ธนาคาร</Form.Label>
                <LovSelectBank
                  value={Number(values?.bank_id)}
                  onChange={(e) => handleChange({ target: { id: 'bank_id', value: e } })}
                  isDisabled={!isEditMode}
                />
                {errors.bank_id && touched.bank_id && <div className="d-block invalid-feedback">{f({ id: errors.bank_id })}</div>}
              </Col>
              <Col sm="12" md="12" lg="3">
                <Form.Label className="col-form-label required">ชื่อเข้าใช้งาน</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  onChange={handleChange}
                  value={values?.username}
                  disabled={!isEditMode}
                  isInvalid={errors.username && touched.username}
                />
                {errors.username && touched.username && <div className="d-block invalid-feedback">{f({ id: errors.username })}</div>}
              </Col>
              <Col sm="12" md="12" lg="3">
                <Form.Label className="col-form-label required">Role</Form.Label>
                <Select
                  classNamePrefix="react-select"
                  options={[
                    { value: 'admin', label: 'admin' },
                    { value: 'user', label: 'user' },
                  ]}
                  isDisabled={!isEditMode}
                  value={values?.roles || ''}
                  onChange={(e) => handleChange({ target: { name: 'roles', value: e } })}
                  required
                  isClearable
                />
                {errors.roles && touched.roles && <div className="d-block invalid-feedback">{f({ id: errors.roles })}</div>}
              </Col>
            </Row>
            <Row>
              <Col sm="12" md="12" lg="6">
                <Form.Label className="col-form-label required">รายละเอียดเกี่ยวกับพนักงาน</Form.Label>
                <Form.Control as="textarea" type="text" name="description" disabled={!isEditMode} onChange={handleChange} value={values?.description} />
              </Col>
              {mode !== 'view' && (
                <Col sm="12" md="12" lg="3">
                  <Form.Label className="col-form-label required">Black List</Form.Label>
                  <Form.Check
                    className="px-4"
                    defaultChecked={values?.blacklist === '1' ? true : false}
                    onChange={(e) => {
                      handleChange({ target: { id: 'blacklist', value: e.target.checked } });
                    }}
                    type="checkbox"
                    label=""
                    hidden={!isEditMode}
                  />
                </Col>
              )}
            </Row>
          </Card>
        </Card>
        <div className="page-title-container">
          <Row>
            <Col className="mb-2">
              <div className="page-title-container mb-3">
                <Row className="text-end">
                  <Col md="12">
                    <Button className="btn-icon" variant="foreground-alternate" onClick={handleCancelClick} disabled={isAdding || isSaving}>
                      ย้อนกลับ
                    </Button>{' '}
                    <Button className="btn-icon" variant="primary" type="submit" hidden={mode === 'view'} onClick={handleSave} disabled={isAdding || isSaving}>
                      บันทึก
                    </Button>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </Form>
    </>
  );
};

export default InformationForm;
