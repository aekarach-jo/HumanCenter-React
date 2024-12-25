/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
import HtmlHead from 'components/html-head/HtmlHead';
import PageTitle from 'components/page-title/PageTitle';
import Table from 'components/table/Table';
import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from 'react-query';
import { request } from 'utils/axios-utils';
import { Form } from 'react-bootstrap';
import { useIntl } from 'react-intl';
import { useGlobalFilter, usePagination, useRowState, useSortBy, useTable } from 'react-table';
import ConfirmDeleteModal from 'components/confirm-delete-modal/ConfirmDeleteModal';
import moment from 'moment';
import { NavLink } from 'react-router-dom/cjs/react-router-dom';
import useConvert from 'hooks/useConvert';
import { toast } from 'react-toastify';
import ConfirmModal from 'components/confirm-modal/ConfirmModal';

const searchBill = async ({ filter, page = 1, per_page = 10, sortBy = {} }) => {
  const sorts = sortBy.sortField ? `${sortBy.sortField}:${sortBy.sortDirection}` : 'created_at:desc';

  const res = await request({
    url: '/workings',
    method: 'GET',
    params: { ...filter, per_page, page: page + 1, sorts },
  });
  return res.data;
};

const Working = () => {
  const { formatMessage: f } = useIntl();
  const title = 'ข้อมูลการทำงาน';
  const description = '';
  const { useConvertCurrency } = useConvert();

  const [isDeleting, setIsDeleting] = useState(false);
  const [filter, setFilter] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [getId, setGetId] = useState();
  const [pageCount, setPageCount] = useState(1);
  const [pageC, setPageC] = useState(1);
  const [show, setShow] = useState(false);

  const [selectToShipping, setSelectToShipping] = useState([]);

  const token = localStorage.getItem('token');
  const roleResources = JSON.parse(token)?.user?.role_resources;
  const role = roleResources?.find((item) => item.resource_name.toLowerCase() === 'bill');

  const columns = useMemo(() => {
    return [
      {
        Header: 'ปี',
        accessor: 'year',
        sortable: false,
        headerClassName: 'text-medium text-muted-re',
        Cell: ({ cell }) => <div className="text-medium">{moment.utc(cell?.value || new Date()).format('YYYY') || '-'}</div>,
      },
      {
        Header: 'เดือน',
        accessor: 'month',
        sortable: false,
        headerClassName: 'text-medium text-muted-re',
        Cell: ({ cell }) => {
          const month = moment.utc(cell?.value || new Date()).format('MM');
          const monthNames = [
            'มกราคม',
            'กุมภาพันธ์',
            'มีนาคม',
            'เมษายน',
            'พฤษภาคม',
            'มิถุนายน',
            'กรกฎาคม',
            'สิงหาคม',
            'กันยายน',
            'ตุลาคม',
            'พฤศจิกายน',
            'ธันวาคม',
          ];
          return <div className="text-medium">{monthNames[parseInt(month, 10) - 1] || '-'}</div>;
        },
      },
      {
        Header: 'รหัสพนักงาน',
        accessor: 'employee_no',
        sortable: false,
        headerClassName: 'text-medium text-muted-re',
        Cell: ({ cell }) => <div className="text-medium">{cell.value || '-'}</div>,
      },
      {
        Header: 'ชื่อ',
        accessor: 'first_name_th',
        sortable: false,
        headerClassName: 'text-medium text-muted-re',
        Cell: ({ cell }) => <div className="text-medium">{cell.value || '-'}</div>,
      },
      {
        Header: 'นามสกุล',
        accessor: 'last_name_th',
        sortable: false,
        headerClassName: 'text-medium text-muted-re',
        Cell: ({ cell }) => <div className="text-medium">{cell.value || '-'}</div>,
      },
      {
        Header: 'สถานะ',
        accessor: 'status',
        sortable: false,
        headerClassName: 'text-medium text-muted-re',
        Cell: ({ cell }) => (
          <div className="text-medium">
            {(cell.value === 'wait_approve' && 'รอยืนยัน') || (cell.value === 'wait_edit' && 'รอแก้ไข') || (cell.value === 'confirmed' && 'ยืนยันแล้ว')}
          </div>
        ),
      },
      {
        Header: 'จัดการข้อมูล',
        accessor: 'action',
        sortable: false,
        headerClassName: 'text-medium text-muted-re',
        Cell: ({ cell, row }) => {
          return (
            <div className="text-medium d-flex flex-row gap-1 icon-hover" style={{ width: '4rem' }}>
              <div>
                <NavLink to={`/master/working-detail/${row.original.id}`} className=" text-truncate h-100 d-flex align-items-center">
                  <img src="/img/icons/edit.png" alt="edit" style={role?.can_view === 0 ? { opacity: '0.5' } : { cursor: 'pointer' }} />
                </NavLink>
              </div>
              {/* <div
                className="cursor-pointer"
                disabled={cell.row.original.status === 'waiting_payment'}
                style={
                  cell.row.original.status === 'waiting_payment' ||
                  cell.row.original.status === 'success' ||
                  cell.row.original.status === 'shipped' ||
                  role?.can_delete === 0
                    ? { opacity: '0.5', cursor: 'auto' }
                    : { cursor: 'pointer' }
                }
                onClick={() => {
                  if (cell.row.original.status !== 'waiting_payment' && cell.row.original.status !== 'success' && role?.can_delete === 1) {
                    setIsDeleting(true);
                    setGetId(row.values.id);
                  }
                }}
              >
                <img src="/img/icons/delete.png" alt="delete" />
              </div> */}
            </div>
          );
        },
      },
    ];
  }, [f]);

  const tableInstance = useTable(
    {
      columns,
      data,
      filter,
      setData,
      setFilter,
      manualPagination: true,
      manualGlobalFilter: true,
      manualSortBy: true,
      autoResetPage: false,
      autoResetSortBy: false,
      filterTypes: ['name', 'phone'],
      pageCount,
      pageC,
      total,
      setSelectToShipping,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowState
  );
  const {
    state: { globalFilter, pageIndex: page, pageSize, sortBy },
  } = tableInstance;

  const sortByFromTable = ([field]) => {
    if (!field) {
      return {};
    }

    return {
      sortField: field.id,
      sortDirection: field.desc ? 'desc' : 'asc',
    };
  };

  const { isFetching, refetch } = useQuery(
    ['searchBill', filter, pageSize, sortBy, page],
    () => searchBill({ filter, per_page: pageSize, page, sortBy: sortByFromTable(sortBy) }), // ใช้ฟังก์ชันนี้แทนการเรียกโดยตรง
    {
      refetchOnWindowFocus: false,
      onSuccess(resp) {
        const { data: result } = resp;
        const newArr = result?.data?.map((item) => ({ ...item, num: result.from }));
        setPageC(result.last_page);
        setPageCount(result.last_page);
        setTotal(result.total);
        setData(newArr);
      },
      onSettled(s) {
        console.log(s);
      },
      onError(err) {
        console.log(err);

        console.error('Search error :', err);
      },
    }
  );

  useEffect(() => {
    setFilter((currentFilter) => ({
      ...currentFilter,
      page,
    }));
  }, [page]);

  useEffect(() => {
    setFilter((currentFilter) => {
      const newFilter = { ...currentFilter, page: globalFilter !== undefined && 0 };
      if (globalFilter !== '') {
        newFilter.searchText = globalFilter;
      } else {
        delete newFilter.searchText;
      }
      return newFilter;
    });
  }, [globalFilter]);

  const handleDeleteCancel = () => {
    setIsDeleting(false);
    setShow(false);
  };
  const options = [
    { label: 'Ready', value: true },
    { label: 'Shipped', value: false },
  ];

  const handleConfirmDelete = async () => {
    await request({ url: `/bill/${getId}`, method: 'DELETE' });
    refetch();
    setIsDeleting(false);
  };

  const onClickShipped = async () => {
    const filterItemTpShipping = selectToShipping.filter((item) => item.status === 'ready');
    const selectToShipp = filterItemTpShipping.map((item) => item.bill_no);
    if (selectToShipp.length > 0) {
      try {
        const response = await request({
          url: `/shipping`,
          method: 'POST',
          data: { bill_no: selectToShipp },
        });
        refetch();
        setSelectToShipping([]);
        data.map((item) => {
          item.checked = false;
          return item;
        });
      } catch (error) {
        refetch();
        setSelectToShipping([]);
        data.map((item) => {
          item.checked = false;
          return item;
        });
        console.error('Download error:', error);
        toast.error('Please select ready status');
      }
    } else {
      toast.error('Please select ready status');
      setSelectToShipping([]);
      data.map((item) => {
        item.checked = false;
        return item;
      });
    }
    setShow(false);
  };

  return (
    <>
      <HtmlHead title={title} description={description} />
      <PageTitle
        title={title}
        description={description}
        // buttons={{ export: { onSubmit: () => handleExport() } }}
        // addButton={{ label: f({ id: 'bill.field.add' }), link: '/bill/new' }}
        isHideBtnAdd={role?.can_create === 0}
      />
      <Table tableInstance={tableInstance} isLoading={isFetching} isSelectYear isCompany isSearchButton hideControlSearch />
      <ConfirmModal
        show={show}
        className="rounded-sm"
        titleText="Shipping"
        size="md"
        confirmText="Are you sure you want to shipping ?"
        onConfirm={onClickShipped}
        onCancel={handleDeleteCancel}
      />
      <ConfirmDeleteModal
        show={isDeleting}
        className="rounded-sm"
        titleText="Delete"
        size="md"
        confirmText="Are you sure you want to delete ?"
        onConfirm={handleConfirmDelete}
        onCancel={handleDeleteCancel}
      />
    </>
  );
};

export default Working;
