import React from 'react';
import { Button, Col, FormControl, InputGroup, Modal, Row } from 'react-bootstrap';

import clx from 'classnames';
import { SERVICE_URL } from 'config';
import { request } from 'utils/axios-utils';
import { useMutation, useQuery } from 'react-query';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import './style.css';

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
    // const filterData = values?.sub_salaries2?.filter((item) => item?.isEdit === true);
    // const data = filterData.map((item) => {
    //   return {
    //     id: item?.id,
    //     count: Number(item?.count),
    //     income: Number(item?.income),
    //   };
    // });
    // console.log(values);
    // if (data.length > 0 || values?.isEdit) {
    //   saveSalary({ data, totalIncome: Number(values?.total_income), id: values?.id });
    //   setIdSalary(values?.id);
    // }
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
      <Modal.Header className="py-4" closeButton>
        <Modal.Title className="font-weight-bold">
          <Row className="gap-4">
            <Col sm="12" md="12" lg="12">
              <h6>สลิปเงินเดือน {`${values?.first_name_th} ${values?.last_name_th}`}</h6>
            </Col>
          </Row>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="w-100">
        <div
          className={clx(
            {
              'overlay-spinner': isFetching,
            },
            'd-flex flex-column justify-content-center align-items-center gap-0 position-relative'
          )}
        >
          <div>
            <div className="header">
              <p>บริษัท ฮิวแมนเซนเตอร์ จำกัด</p>
              <p>317/31หมู่ที่ 3 ตำบล บ่อวิน อำเภอ ศรีราชา จังหวัด ชลบุรี 20230 โทร : 033-681259</p>
              <p>317/31 M. 3 T. BORWIN A. SRIRACHA CHONBURI 20230 TEL. 033-681259</p>
            </div>
            <div className="details">
              <table>
                <tbody>
                  <tr>
                    <td>เลขที่บัญชี</td>
                  </tr>
                  <tr>
                    <td>186-3-63532-9</td>
                  </tr>
                </tbody>
              </table>
              <div className="row text-start">
                <div className="col-2">{values?.employee_no}</div>
                <div className="col-5 text-center">ใบรับค่าแรงประจำเดือน</div>
                <div className="col-5">1 สิงหาคม - 15 สิงหาคม 2567</div>
                <div className="col-5">บริษัทสุพรีม เฟลตัล ประเทศไทย จำกัด </div>
                <div className="col-2">พนักงาน </div>
                <div className="col-5">{`${values?.first_name_th} ${values?.last_name_th}`} </div>
              </div>
            </div>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th colSpan={10}>รายรับ</th>
                  <th colSpan={5}>รายการหัก</th>
                </tr>
              </thead>
              <tbody>
                {values?.sub_salaries2?.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item?.type_salary_name}</td>
                      <td>{item?.income}</td>
                      <td>บาท</td>
                      <td>จำนวน</td>
                      <td>{item?.count}</td>
                      <td>{item?.unit_sub}</td>
                      <td>=</td>
                      <td>{item?.income * item?.count}</td>
                      <td>บาท</td>
                    </tr>
                  );
                })}
                <tr>
                  <td />
                  <td colSpan={7}>รวมรายรับ</td>
                  <td>21,784.84</td>
                  <td>บาท</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="py-2">
        <div className="d-flex flex-row gap-2 justify-content-end">
          <Button variant="outline-dark" onClick={onCancel} disabled={loading}>
            ยกเลิก
          </Button>
          <Button variant="warning" className="text-white" onClick={onConfirm} disabled={loading}>
            พิมพ์
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default SalaryModal;
