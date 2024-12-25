import React, { useMemo, useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { useGlobalFilter, usePagination, useRowState, useSortBy, useTable } from 'react-table';
import Table from 'components/table/Table';

const ParcelList = ({ data, setData, isEditMode }) => {
  const { formatMessage: f } = useIntl();
  const [isChange, setIsChange] = useState(false);

  const columns = useMemo(() => {
    return [
      {
        accessor: 'id',
      },
      {
        Header: f({ id: 'payment.field.parcel-track-no' }),
        accessor: 'track_no',
        sortable: false,
        headerClassName: 'text-muted text-center',
        Cell: ({ cell }) => {
          return (
            <div className="text-center">
              <Form.Check
                className="position-absolute px-4"
                style={{ left: 25 }}
                defaultChecked={cell.row.original?.checked}
                onChange={(e) => {
                  cell.row.original.checked = e.target.checked;
                  setIsChange(e.target.checked);
                }}
                type="checkbox"
                label=""
                hidden={!isEditMode}
              />
              {cell?.value || '-'}
            </div>
          );
        },
      },
      {
        Header: f({ id: 'parcel.field.zto-track' }),
        accessor: 'zto_track_no',
        sortable: false,
        headerClassName: 'text-muted text-center',
        Cell: ({ cell }) => {
          return <div className="text-center">{cell?.value || '-'}</div>;
        },
      },
      {
        Header: f({ id: 'bill.field.parcel-weight' }),
        accessor: 'weight',
        sortable: false,
        headerClassName: 'text-muted text-center',
        Cell: ({ cell }) => {
          return <div className="text-center">{cell?.value?.toFixed(2) || '-'}</div>;
        },
      },
      {
        Header: f({ id: 'payment.field.parcel-price' }),
        accessor: 'price',
        sortable: false,
        headerClassName: 'text-muted text-center',
        Cell: ({ cell }) => {
          return <div className="text-center">{cell.value?.toFixed(2) || '-'}</div>;
        },
      },
      {
        Header: f({ id: 'payment.field.receipt' }),
        accessor: 'receipt_at',
        sortable: false,
        headerClassName: 'text-muted text-center',
        Cell: ({ cell }) => {
          return <div className="text-center">{cell.value || '-'}</div>;
        },
      },
      {
        Header: f({ id: 'payment.field.shippingDate' }),
        accessor: 'shipping_at',
        sortable: false,
        headerClassName: 'text-muted text-center',
        Cell: ({ cell }) => {
          return <div className="text-center">{cell.value || '-'}</div>;
        },
      },
    ];
  }, [f, isEditMode]);

  const [result, setResult] = useState(data || []);

  const tableInstance = useTable(
    {
      columns,
      data: result,
      setData: setResult,
      // manualPagination: false,
      // manualFilters: false,
      // manualSortBy: false,
      autoResetPage: false,
      autoResetSortBy: false,
      initialState: { pageIndex: 0, hiddenColumns: ['id'] },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowState
  );

  useEffect(() => {
    if (data?.length > 0) {
      setResult(data);
    } else {
      setResult([]);
    }
  }, [data]);

  useEffect(() => {
    setData(data);
  }, [isChange]);

  const rowStyle = {
    height: '40px',
    border: '1px solid rgba(0, 0, 0, 0)',
    borderWidth: '1px 0',
    background: 'var(--foreground)',
  };

  const customStyle = {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1ภpx',
  };
  return (
    <div className="half-padding">
      <Table
        tableInstance={tableInstance}
        customStyle={customStyle}
        rowStyle={rowStyle}
        hideControlSearch
        hideControlsPageSize
        hideControlsDateRange
        hideControlsStatus
        hideControlsStatusParcel
        hideControlsStatusVerify
        hideControlsStatusBill
        hideAddDelete
        isPage
      />
    </div>
  );
};

export default ParcelList;
