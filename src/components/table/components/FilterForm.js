/* eslint-disable no-else-return */
import React from 'react';
import { useIntl } from 'react-intl';
import { Button, Col, Form, Row } from 'react-bootstrap';
import Select from 'react-select';
import { useFormik } from 'formik';
import LovSelectCompany from 'components/lov-select/LovSelectCompany';
import moment from 'moment';
import ControlsSearch from './ControlsSearch';
import DatepickerMonth from './DatepickerMonth';
import DatepickerYear from './DatepickerYear';

const initialValues = { year: '', month: '', company_id: '', employee_no: '', national_card_no: '', searchText: '', status: true };
const statusOptions = [
  { value: 'confirmed', label: 'ยืนยันแล้ว' },
  { value: 'wait_edit', label: 'รอแก้ไข' },
  { value: 'wait_approve', label: 'รอยืนยัน' },
];
const FilterForm = ({ tableInstance, hideControlSearch, isSelectYear, hideControlsStatus, isLoading, isCompany, isSearchButton, isEmployee }) => {
  const { gotoPage, setFilter } = tableInstance;

  const onSubmit = (values) => {
    let dataResult = {};

    if (values) {
      const filtersArray = [
        values?.status?.value && `status:eq:${values.status.value}`,
        values?.employee_no && `employee_no:like:${values.employee_no}`,
        values?.national_card_no && `national_card_no:like:${values.national_card_no}`,
      ].filter(Boolean);

      dataResult = {
        filters: filtersArray.join(','),
        searchText: values?.searchText ? `${values.searchText}` : undefined,
        company: values?.company_id ? `${values.company_id}` : undefined,
        year: values?.year !== '' ? `${values.year}` : undefined,
        month: values?.month !== '' ? `${values.month}` : undefined,
      };
      if (!dataResult.filters) {
        delete dataResult.filters;
      }
      // if (!dataResult.company) {
      //   delete dataResult.company;
      // }
    }
    console.log(dataResult);

    setFilter({ ...dataResult, page: 0 });
    gotoPage(0);
  };
  const formik = useFormik({ initialValues, onSubmit });
  const { handleSubmit, handleChange, values, handleReset } = formik;

  const onReset = (e) => {
    handleReset(e);
    setFilter({ page: 0 });
    gotoPage(0);
  };

  const handleChangeStatus = (value) => {
    handleChange({ target: { id: 'status', value } });
  };

  const handleChangeCompany = (value) => {
    handleChange({ target: { id: 'company_id', value } });
  };

  const onSetFilterDate = (dataResult, type) => {
    if (type === 'year') {
      const date = dataResult ? moment(dataResult).format('YYYY-01-01 00:00:00') : null;
      handleChange({ target: { id: 'year', value: moment(date).get('year') } });
    } else if (type === 'month') {
      const date = dataResult ? moment(dataResult).format('YYYY-MM-DD 00:00:00') : null;
      handleChange({ target: { id: 'month', value: moment(date).get('month') + 1 } });
    }
  };

  return (
    <Row>
      {!hideControlSearch && (
        <Col md="4" sm="12" xs="12">
          <Form.Label className="px-2 m-0 fs-7">Search</Form.Label>
          <div className="d-inline-block float-md-start ps-1 me-1 mb-1 mb-md-0 search-input-container w-100 shadow bg-foreground">
            <ControlsSearch tableInstance={tableInstance} />
          </div>
        </Col>
      )}
      {isSelectYear && (
        <Col md="2" sm="12" xs="12">
          <Form.Label className="px-2 m-0 fs-7">ปี</Form.Label>
          <DatepickerYear onChange={(e) => onSetFilterDate(e, 'year')} />
        </Col>
      )}
      {isSelectYear && (
        <Col md="2" sm="12" xs="12">
          <Form.Label className="px-2 m-0 fs-7">เดือน</Form.Label>
          <DatepickerMonth onChange={(e) => onSetFilterDate(e, 'month')} />
        </Col>
      )}
      {isCompany && (
        <Col md="2" sm="12" xs="12">
          <Form.Label className="px-2 m-0 fs-7">บริษัท</Form.Label>
          <LovSelectCompany isClearable onChange={handleChangeCompany} />
        </Col>
      )}
      {!hideControlsStatus && (
        <Col md="2" sm="12" xs="12">
          <Form.Label className="px-2 m-0 fs-7">สถานะ</Form.Label>
          <Select isClearable classNamePrefix="react-select" options={statusOptions || []} onChange={(e) => handleChangeStatus(e)} />
        </Col>
      )}
      {isEmployee && (
        <>
          <Col sm="12" md="12" lg="3">
            <Form.Label className="col-form-label required">รหัสพนักงาน</Form.Label>
            <Form.Control type="text" name="employee_no" onChange={handleChange} value={values?.employee_no} />
          </Col>
          <Col sm="12" md="12" lg="3">
            <Form.Label className="col-form-label required">ชื่อ-สกุล</Form.Label>
            <Form.Control type="text" name="searchText" onChange={handleChange} value={values?.searchText} />
          </Col>
          <Col sm="12" md="12" lg="3">
            <Form.Label className="col-form-label required">เลขบัตรประชาชน</Form.Label>
            <Form.Control type="text" name="national_card_no" onChange={handleChange} value={values?.national_card_no} />
          </Col>
        </>
      )}
      {isSearchButton && (
        <Col md="2" sm="12" xs="12" className="d-flex align-items-end">
          <Button variant="primary" onClick={() => handleSubmit()} disabled={isLoading}>
            ค้นหา
          </Button>
        </Col>
      )}
    </Row>
  );
};

export default FilterForm;
