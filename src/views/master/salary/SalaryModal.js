import React from 'react';
import { Button, Col, FormControl, InputGroup, Modal, Row } from 'react-bootstrap';

import clx from 'classnames';
import { SERVICE_URL } from 'config';
import { request } from 'utils/axios-utils';
import { useMutation, useQuery } from 'react-query';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';

const callAddSalary = async ({ data = [], totalIncome = 0, id }) => {
  const res = await request({ url: `/salarys/${id}`, method: 'PATCH', data: { sub_salaries: data, total_income: totalIncome } });
  return res;
};

const SalaryModal = ({ id, setGetId, titleText, confirmText, okText, cancelText, show, className, loading, onCancel, ...rest }) => {
  const [idSalary, setIdSalary] = React.useState(id);
  const getSalaryFn = (isx) => () =>
    request({ url: `${SERVICE_URL}/salarys/${isx}` }).then((data) => {
      return data.data.data;
    });

  const useSalaryData = (idx) =>
    useQuery(`editSalaryData`, getSalaryFn(idx), {
      enabled: !!idx,
      refetchOnWindowFocus: false,
      onSuccess() {
        setGetId(undefined);
      },
      onError(err) {
        console.log(err);
        console.error('Error:', err);
      },
    });
  const { data: initResult, isFetching, refetch } = useSalaryData(id || idSalary);
  const formik = useFormik({ initialValues: initResult, enableReinitialize: true });
  const { handleChange, values } = formik;

  const { mutate: saveSalary } = useMutation((currentData) => callAddSalary(currentData), {
    onSuccess() {
      toast('success');
      refetch();
    },
    onError(error) {
      if (error.response) {
        toast.error(() => {
          return (
            <div style={{ width: 'auto' }}>
              {error.response.data.errors?.map((item, index) => (
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

  const handleChangeData = (e, index, name) => {
    if (/^[0-9]*\.?[0-9]*$/.test(e.target.value)) {
      if (index === 999) {
        handleChange({ target: { id: `${name}`, value: e.target.value } });
        handleChange({ target: { id: `isEdit`, value: true } });
      } else {
        handleChange({ target: { id: `sub_salaries2.${[index]}.isEdit`, value: true } });
        handleChange({ target: { id: `sub_salaries2.${[index]}.[${name}]`, value: Number(e.target.value) } });
      }
    }
  };

  const onConfirm = () => {
    const filterData = values?.sub_salaries2?.filter((item) => item?.isEdit === true);
    const data = filterData.map((item) => {
      return {
        id: item?.id,
        count: Number(item?.count),
        income: Number(item?.income),
      };
    });
    console.log(values);

    if (data.length > 0 || values?.isEdit) {
      saveSalary({ data, totalIncome: Number(values?.total_income), id: values?.id });
      setIdSalary(values?.id);
    }
  };

  return (
    <Modal
      className={clx('fade ', className)}
      show={show}
      onHide={onCancel}
      // centered
      contentClassName={clx({ 'overlay-spinner': loading })}
      // backdrop={loading ? 'static' : true}
      {...rest}
    >
      <Modal.Header closeButton>
        <Modal.Title as="h3" className="font-weight-bold">
          <Row className="gap-4">
            <Col sm="6" md="6" lg="6">
              ข้อมูลเงินเดือน {`${values?.first_name_th} ${values?.last_name_th}`}
            </Col>
            <Col sm="6" md="6" lg="5">
              <InputGroup>
                <FormControl disabled value="เงินเดือน" className="font-weight-bold" />
                <FormControl
                  value={values?.total_income}
                  className="font-weight-bold text-end w-30"
                  onChange={(e) => handleChangeData(e, 999, 'total_income')}
                />
                <FormControl disabled value="บาท" className="font-weight-bold" />
              </InputGroup>
            </Col>
          </Row>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <div
          className={clx(
            {
              'overlay-spinner': isFetching,
            },
            'd-flex flex-column justify-content-center align-items-center gap-1 position-relative'
          )}
        >
          <Row className="mb-2">
            {values?.sub_salaries2?.map((item, index) => (
              <Col xs="6" lg="2" key={index} className="mb-1">
                <h5 className="font-weight-bold">{item?.type_salary_name}</h5>
                <InputGroup className="mb-1" style={{ height: '2.5rem' }}>
                  <FormControl disabled value={item?.unit_sub} className="font-weight-bold" />
                  <FormControl value={item?.count} className="font-weight-bold text-end w-30" onChange={(e) => handleChangeData(e, index, 'count')} />
                </InputGroup>
                <InputGroup style={{ height: '2.5rem' }}>
                  <FormControl disabled value="Bath" className="font-weight-bold" />
                  <FormControl value={item?.income} className="font-weight-bold text-end w-30" onChange={(e) => handleChangeData(e, index, 'income')} />
                </InputGroup>
                <hr />
              </Col>
            ))}
          </Row>
        </div>
        <div className="d-flex flex-row gap-2 justify-content-end">
          <Button variant="outline-dark" onClick={onCancel} disabled={loading}>
            ยกเลิก
          </Button>
          <Button variant="success" className="text-white" onClick={onConfirm} disabled={loading}>
            ยืนยัน
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SalaryModal;
