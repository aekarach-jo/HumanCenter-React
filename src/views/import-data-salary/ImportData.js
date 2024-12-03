/* eslint-disable no-restricted-syntax */
import DropzoneTextFiles from 'components/dropzone/DropzoneTextFiles';
import HtmlHead from 'components/html-head/HtmlHead';
import PageTitle from 'components/page-title/PageTitle';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, Modal } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import { useMutation } from 'react-query';
import { request } from 'utils/axios-utils';
import CsLineIcons from 'cs-line-icons/CsLineIcons';
import { DatepickerRangeSingle } from 'components/datepicker/DatepickerRange';
import moment from 'moment';

const callImportData = async (data = {}, dateRage) => {
  const formData = new FormData();
  if (data) {
    formData.append('file', data.file);
    formData.append('start_at', dateRage.startAt);
    formData.append('end_at', dateRage.endAt);
  }

  const res = await request({ url: `/salarys/import`, method: 'POST', data: formData });
  return res;
};

const ImportData = () => {
  const { formatMessage: f } = useIntl();
  const title = 'นำเข้าข้อมูลการเงินเดือน';
  const [files, setFiles] = useState(false);
  const [cancelFiles, setCancalFiles] = useState(false);
  const [dateRage, setDateRange] = useState({ startAt: null, endAt: null });
  const [show, setShow] = useState(false);
  const [totalParcel, setTotalParcel] = useState(0);
  const description = '';

  const { mutate: saveFile, isLoading: isSaving } = useMutation((currentData) => callImportData(currentData, dateRage), {
    onSuccess(res) {
      toast('success');
      setShow(true);
      setTotalParcel(res.data?.data?.totalParcel);
      setCancalFiles(true);
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

  const ModalAlert = () => {
    return (
      <Modal className={classNames('small fade ')} show={show} onHide={() => setShow(false)} centered backdrop="static">
        <Modal.Body className="d-flex flex-column gap-3 text-center">
          <div className="d-flex jutify-center m-auto" style={{ width: '58px', height: '58px', borderRadius: '50%', background: '#ECF2FF' }}>
            <CsLineIcons className="m-auto text-primary" icon="check" size="" />
          </div>
          <div>
            <Modal.Title className="font-weight-bold">Import Successfull</Modal.Title>
            <div style={{ fontFamily: 'Inter' }}>{`Added ${totalParcel} new item`}</div>
          </div>
          <div className="d-flex flex-row gap-2 justify-content-center">
            <Button variant="primary" className="text-white" onClick={() => setShow(false)}>
              {f({ id: 'common.continue' })}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  const onSetFilterDateRange = (dataResult) => {
    const startData = dataResult.startDate ? moment(dataResult.startDate).format('YYYY-MM-DD') : null;
    const endDate = dataResult.endDate ? moment(dataResult.endDate).format('YYYY-MM-DD') : null;

    setDateRange({ startAt: startData, endAt: endDate });
  };
  return (
    <div>
      <HtmlHead title={title} description={description} />
      <PageTitle
        title={title}
        description={description}
        buttons={{
          cancel: { label: f({ id: 'common.cancel' }), onCancel: () => setCancalFiles(true) },
          import: { label: f({ id: 'common.import' }), onSubmit: () => saveFile(files) },
        }}
      />
      <Col md="4" className="mb-2">
        <Form.Label className="px-2 m-0 fs-7">{f({ id: 'common.dateRange' })}</Form.Label>
        <DatepickerRangeSingle className="ps-2" onChange={(e) => onSetFilterDateRange(e, { startAt: 'start_at', endAt: 'end_at' })} />
      </Col>
      <Card
        className={classNames('mb-5', {
          'overlay-spinner': isSaving,
        })}
      >
        <DropzoneTextFiles setFiles={setFiles} setCancalFiles={setCancalFiles} cancelFiles={cancelFiles} isLoading={isSaving} />
      </Card>
      <ModalAlert />
    </div>
  );
};

export default ImportData;
