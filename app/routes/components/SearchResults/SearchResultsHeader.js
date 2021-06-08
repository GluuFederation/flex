import React from 'react';

import { 
  InputGroup,
  InputGroupAddon,
  Input,
  Button,
} from './../../../components';
import { useTranslation } from 'react-i18next'

const SearchResultsHeader = () => {
  const { t } = useTranslation()
  return (
    <React.Fragment>
      <div className="mb-4">
        <h4 className="mt-2 mb-3">
          <small className="mr-1">
            {t("Search Results for")}
        </small>{t("Content Designer")}
          <small className="mr-2">
            <small className="ml-3">
              {t("About")} 1,370 {t("result")} (0.13 {t("seconds")})
            </small>
          </small>
        </h4>
        <InputGroup>
          <Input placeholder="Search for..." className="bg-white" />
          <InputGroupAddon addonType="append">
            <Button color="primary">
              <i className="fa fa-search"></i>
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </React.Fragment>
  );
}

export { SearchResultsHeader };
