// @ts-nocheck
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { buildPayload } from "Utils/PermChecker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDispatch } from "react-redux";
import { getMau } from "Plugins/admin/redux/features/mauSlice";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

export default function MaterialUIPickers() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  // The first commit of Material-UI
  const [startDate, setStartDate] = useState(dayjs().subtract(3, "months"));
  const [endDate, setEndDate] = useState(dayjs());
  const userAction = {};
  const options = {};

  useEffect(() => {
    options["startMonth"] = startDate.format("YYYYMM");
    options["endMonth"] = endDate.format("YYYYMM");
    buildPayload(userAction, "GET MAU", options);
    dispatch(getMau({ action: userAction }));
  }, [startDate, endDate]);

  const setDate = (val, type) => {
    if (type === "start") {
      setStartDate(dayjs(val));
    } else {
      setEndDate(dayjs(val));
    }
  };

  return (
    <Grid container gap={2}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="d-flex flex-column gap-4 my-3 align-items-center ">
          <DatePicker
            format="MM/DD/YYYY"
            label={t("dashboard.start_date")}
            value={startDate}
            onChange={(val) => setDate(val, "start")}
            slotProps={{
              textField: {
                size: "small",
                InputLabelProps: { shrink: true }, // Add this line
              },
            }}
            sx={{
              "& .MuiInputLabel-sizeSmall": {
                padding: "0 2px",
                background: "white",
                fontSize: "19px",
                marginTop: "-2px",
              },
            }}
          />
          <DatePicker
            format="MM/DD/YYYY"
            label={t("dashboard.end_date")}
            value={endDate}
            onChange={(val) => setDate(val, "end")}
            slotProps={{
              textField: {
                size: "small",
                InputLabelProps: { shrink: true }, // Add this line
              },
            }}
            sx={{
              "& .MuiInputLabel-sizeSmall": {
                padding: "0 2px",
                background: "white",
                fontSize: "19px",
                marginTop: "-2px",
              },
            }}
          />
        </div>
      </LocalizationProvider>
    </Grid>
  );
}
