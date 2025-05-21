import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import JsonViewer from './JsonViewer';
import PropTypes from 'prop-types';

const JsonViewerDialog = ({
    isOpen,
    toggle,
    data,
    title = 'JSON Viewer',
    theme = 'light',
    expanded = true
}) => {
    const { t } = useTranslation();
    return (
        <Modal
            isOpen={isOpen}
            toggle={toggle}
            size="lg"
            className="modal-outline-primary"
        >
            <ModalHeader toggle={toggle}>
                <i
                    style={{ color: 'green' }}
                    className="fa fa-2x fa-code fa-fw modal-icon mb-3"
                />
                {title}
            </ModalHeader>
            <ModalBody style={{ maxHeight: '70vh', overflow: 'auto' }}>
                <JsonViewer
                    data={data}
                    theme={theme}
                    expanded={expanded}
                />
            </ModalBody>
            <ModalFooter>
                <Button onClick={toggle}>
                    {t('actions.close')}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

JsonViewerDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    title: PropTypes.string,
    theme: PropTypes.string,
    expanded: PropTypes.bool
};

export default JsonViewerDialog;