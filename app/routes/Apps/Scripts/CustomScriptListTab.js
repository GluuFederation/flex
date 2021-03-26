import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CustomScriptListTable from './CustomScriptListTable';

function CustomScriptListTab(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography component={'span'}>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

CustomScriptListTab.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function ScrollableTabsButtonAuto({ scripts, loading, removeRowAfterDelete }) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const scriptTypes = [...(new Set(scripts.map(item => item.scriptType)))];

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const toCamel = (s) => {
        return s.replace(/([-_][a-z])/ig, ($1) => {
            return $1.toUpperCase()
                .replace('-', ' ')
                .replace('_', ' ');
        });
    };

    return (
        <div className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                    aria-label="scrollable auto tabs example"
                >
                    {scriptTypes.map((item, index) => (<Tab key={index} label={toCamel(item)} {...a11yProps(index)} />))}
                </Tabs>
            </AppBar>
            {scriptTypes.map((item, index) => {
                const selectedScripts = scripts.filter((script) => (script.scriptType == item))
                return (
                <CustomScriptListTab key={index} value={value} index={index}>
                    <CustomScriptListTable key={index} selectedScripts={selectedScripts} loading={loading} removeRowAfterDelete={removeRowAfterDelete}/>
                </CustomScriptListTab>
                )
            }
            )}

        </div>
    );
}
