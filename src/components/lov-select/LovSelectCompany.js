import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { SERVICE_URL } from 'config';
import { request } from 'utils/axios-utils';

const searchCompany = async () => {
  const res = await request({
    url: `${SERVICE_URL}/companys`,
    params: {},
  });
  return res.data.data;
};

const useGetCompanyList = () => {
  const searchCompanyList = useQuery(['company'], () => searchCompany(), {
    enabled: true,
    refetchOnWindowFocus: false,
    onSuccess() {},
    onError(err) {
      console.error('Error fetching list', err);
    },
  });
  return searchCompanyList;
};

function mapOptions(lovList, lovLabel, lovValue) {
  return (lovList || []).map((lov) => ({
    label: lov[lovLabel],
    value: lov[lovValue],
  }));
}

const LovSelectCompany = ({
  name,
  value,
  lov,
  lovLabel = 'name_en',
  lovValue = 'id',
  isClearable,
  isDisabled,
  onChange,
  placeholder,
  menuPlacement,
  ...props
}) => {
  const { formatMessage: f } = useIntl();

  const [internalValue, setInternalValue] = useState();
  const { data, isFetching } = useGetCompanyList();
  const selectPlaceholder = useMemo(() => placeholder || f({ id: 'common.select-placeholder' }), [f, placeholder]);

  const options = useMemo(() => {
    return mapOptions(data || [], lovLabel, lovValue);
  }, [data, lov, lovLabel, lovValue]);

  useEffect(() => {
    const findOption = options?.find((item) => item.value === value);
    setInternalValue(findOption);
  }, [lov, lovValue, options, value]);

  const internalOnChange = useCallback(
    (e) => {
      const { value: _value } = e || {};
      onChange?.(_value);
    },
    [onChange]
  );

  return (
    <Select
      name={name} //
      isDisabled={isDisabled}
      classNamePrefix="react-select"
      options={options}
      isLoading={isFetching}
      {...props}
      isClearable={isClearable}
      placeholder={selectPlaceholder}
      menuPlacement={menuPlacement}
      value={internalValue}
      onChange={internalOnChange}
    />
  );
};

export default LovSelectCompany;
