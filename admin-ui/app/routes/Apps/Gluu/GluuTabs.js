import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'


const TabPanel = (props) => {
    const { children, value, px, py, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box px={px} py={py}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const a11yProps = (index) => {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export default function GluuTabs({
    tabNames,
    tabToShow,
    textColor = "black"
}) {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", }}>
                <Tabs
                    value={value}
                    textColor={textColor}
                    variant="scrollable"
                    onChange={handleChange}
                >
                    {tabNames?.map((name, index) => (
                        <Tab
                            key={index}
                            label={name}
                            {...a11yProps(index)}
                        />
                    ))}
                </Tabs>
            </Box>
            {tabNames?.map((name, index) => (
                <TabPanel value={value} key={index} index={index}>
                    {tabToShow(name)}
                </TabPanel>
            ))}
        </Box>
    );
}
