import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { buildPayload } from "Utils/PermChecker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDispatch } from "react-redux";
import { getMau } from "Plugins/admin/redux/features/mauSlice";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";

interface UserAction {
  [key: string]: any;
}

interface Options {
  startMonth?: string;
  endMonth?: string;
  [key: string]: any;
}

export default function MaterialUIPickers(): JSX.Element {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(3, "months"));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());
  const userAction: UserAction = {};
  const options: Options = {};

  useEffect(() => {
    options["startMonth"] = startDate.format("YYYYMM");
    options["endMonth"] = endDate.format("YYYYMM");
    buildPayload(userAction, "GET MAU", options);
    dispatch(getMau({ action: userAction }));
  }, [startDate, endDate]);

  const setDate = (val: Dayjs | null, type: "start" | "end"): void => {
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
