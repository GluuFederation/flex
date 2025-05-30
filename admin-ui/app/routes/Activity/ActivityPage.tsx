// @ts-nocheck
import { Box, Divider, Typography } from "@mui/material";
import React, { useContext } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import { ThemeContext } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import SetTitle from 'Utils/SetTitle'
import { useTranslation } from "react-i18next";

const ActivityPage = () => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const themeColors = getThemeColor(selectedTheme)

  SetTitle(t('menus.activity'))

  console.log(`themeColors`, themeColors, `selectedTheme`, selectedTheme)

  return (
    <Box
      maxWidth="1200px"
      display="flex"
      flexDirection="column"
      gap="2rem"
      margin="0 auto"
    >
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        gap="2rem"
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent={"flex-start"}
          width="100%"
          style={{
            padding: "16px",
            border: "1px solid rgba(112, 112, 112, 0.3)",
            borderRadius: "6px",
            boxShadow: `4px 9px 37px -10px rgba(0,0,0,0.75)`,
          }}
          className="txt-white"
        >
          <Box
            display="flex"
            flexDirection="row"
            gap=".5rem"
            alignItems="center"
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Logins{" "}
            </Typography>
            <Typography sx={{ color: themeColors.lightBackground }} variant="subtitle2">Daily</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="baseline"
            justifyContent={"flex-start"}
            gap={"1.5rem"}
          >
            <Typography variant="h1" fontWeight={600}>
              27{" "}
            </Typography>
            <ArrowCircleUpIcon
              fontSize="large"
              width={"120px"}
              height={"120px"}
            />
          </Box>
          <Typography sx={{ maxWidth: "60%" }} variant="subtitle2">
            Increase of 0.003% from previous day at the came timestamp
          </Typography>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          justifyContent={"flex-start"}
          width="100%"
          style={{
            padding: "16px",
            border: "1px solid rgba(112, 112, 112, 0.3)",
            borderRadius: "6px",
            boxShadow: `4px 9px 37px -10px rgba(0,0,0,0.75)`,
          }}
          className="txt-white"
        >
          <Box
            display="flex"
            flexDirection="row"
            gap=".5rem"
            alignItems="center"
          >
            <Typography variant="subtitle1" fontWeight={600}>
              Sign-ups{" "}
            </Typography>
            <Typography sx={{ color: themeColors.lightBackground }} variant="subtitle2">Daily</Typography>
          </Box>
          <Box
            display="flex"
            alignItems="baseline"
            justifyContent={"flex-start"}
            gap={"1.5rem"}
          >
            <Typography variant="h1" fontWeight={600}>
              13{" "}
            </Typography>
            <ArrowCircleUpIcon
              fontSize="large"
              width={"120px"}
              height={"120px"}
            />
          </Box>
          <Typography sx={{ maxWidth: "60%" }} variant="subtitle2">
            Increase of 0.003% from previous day at the came timestamp
          </Typography>
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="start"
        className="txt-white"
        py="16px"
        width="100%"
        height="400px"
        style={{
          border: "1px solid rgba(112, 112, 112, 0.3)",
          borderRadius: "6px",
          boxShadow: `4px 9px 37px -10px rgba(0,0,0,0.75)`,
        }}
      >
        <Box pl="16px" display="flex" flexDirection="row" gap=".5rem" alignItems="center">
          <Typography variant="subtitle1" fontWeight={600}>
            Combined activity{" "}
          </Typography>
          <Typography sx={{ color: themeColors.lightBackground }} variant="subtitle2">Daily</Typography>
        </Box>
        <Box pl="16px" mt={'8px'} mb="16px" gap="8px" display='flex' justifyContent={'start'}>
          <Box display='flex' flexDirection={'column'}>
            <Typography variant="subtitle2" sx={{ color: themeColors.lightBackground }}>Sign-ups</Typography>
            <Typography variant="subtitle2">230 <span style={{ color: 'green' }}>+134</span></Typography>
          </Box>
          <Divider sx={{ background: themeColors.lightBackground }} orientation="vertical" flexItem />
          <Box display='flex' flexDirection={'column'}>
            <Typography variant="subtitle2" sx={{ color: themeColors.lightBackground }}>Logins</Typography>
            <Typography variant="subtitle2">82 <span style={{ color: 'green' }}>+1</span></Typography>
          </Box>
        </Box>
        <ResponsiveContainer debounce={300} width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 10,
              bottom: 5,
            }}
          >
            {/* <CartesianGrid horizontalPoints={[80, 140, 200]} strokeDasharray="3 3" /> */}
            <XAxis dataKey="name" tick={{ fill: themeColors.lightBackground }} />
            <YAxis tick={{ fill: themeColors.lightBackground }} />
            <Tooltip />
            <Legend />
            <Line
              type="basic"
              dataKey="pv"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
            <Line type="basic" dataKey="uv" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default ActivityPage;

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
