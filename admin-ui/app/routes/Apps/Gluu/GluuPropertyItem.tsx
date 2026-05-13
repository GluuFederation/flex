import { FormGroup, Col, Input, Button } from 'Components'
import { useTranslation } from 'react-i18next'
import { Box } from '@mui/material'
import { DeleteOutline } from '@/components/icons'
import customColors from '@/customColors'
import { useStyles } from './styles/GluuPropertyItem.style'
import type { GluuPropertyItemProps } from './types/GluuPropertyItem.types'

const GluuPropertyItem = ({
  property,
  position,
  keyPlaceholder,
  valuePlaceholder,
  onPropertyChange,
  onPropertyRemove,
  disabled = false,
  isInputLables = false,
  keyLabel = '',
  valueLabel = '',
  isRemoveButton,
  isKeys,
  sm = 6,
  multiProperties = false,
  destinationPlaceholder = '',
  sourcePlaceholder = '',
}: GluuPropertyItemProps) => {
  const { t } = useTranslation()
  const { classes } = useStyles()
  return (
    <FormGroup row>
      {isKeys && (
        <Col sm={4}>
          {isInputLables && <label>{keyLabel}</label>}
          <Input
            name={'key'}
            value={property.key}
            disabled={disabled}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onPropertyChange(position, event)
            }
            placeholder={keyPlaceholder ? t(keyPlaceholder) : t('placeholders.enter_property_key')}
          />
        </Col>
      )}
      <Col sm={sm}>
        {isInputLables && <label>{valueLabel}</label>}
        {!multiProperties ? (
          <Input
            name={'value'}
            value={property.value}
            disabled={disabled}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onPropertyChange(position, event)
            }
            placeholder={
              property.description ||
              (valuePlaceholder ? t(valuePlaceholder) : t('placeholders.enter_property_value'))
            }
          />
        ) : (
          <Box display="flex" gap={2} alignItems={'center'}>
            <Input
              name={'source'}
              value={property.source}
              disabled={disabled}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                onPropertyChange(position, event)
              }
              placeholder={
                sourcePlaceholder ? t(sourcePlaceholder) : t('placeholders.enter_source_value')
              }
            />
            <Input
              name={'destination'}
              value={property.destination}
              disabled={disabled}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                onPropertyChange(position, event)
              }
              placeholder={
                destinationPlaceholder
                  ? t(destinationPlaceholder)
                  : t('placeholders.enter_destination_value')
              }
            />
          </Box>
        )}
      </Col>
      {isRemoveButton && (
        <Col sm={2} className={isInputLables ? classes.removeButtonOffset : undefined}>
          <Button
            type="button"
            color="danger"
            style={{
              backgroundColor: customColors.accentRed,
              color: customColors.white,
            }}
            disabled={disabled}
            onClick={() => onPropertyRemove(position)}
          >
            <DeleteOutline fontSize="small" className={classes.actionIcon} />
            {t('actions.remove')}
          </Button>
        </Col>
      )}
    </FormGroup>
  )
}

export default GluuPropertyItem
