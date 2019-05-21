// @flow
import * as React from 'react'
import { List } from 'immutable'
import { withStyles } from '@material-ui/core/styles'
import Close from '@material-ui/icons/Close'
import InputAdornment from '@material-ui/core/InputAdornment'
import IconButton from '@material-ui/core/IconButton'
import Paragraph from '~/components/layout/Paragraph'
import Row from '~/components/layout/Row'
import GnoForm from '~/components/forms/GnoForm'
import Col from '~/components/layout/Col'
import Block from '~/components/layout/Block'
import Hairline from '~/components/layout/Hairline'
import ButtonLink from '~/components/layout/ButtonLink'
import Field from '~/components/forms/Field'
import TextField from '~/components/forms/TextField'
import { type Token } from '~/logic/tokens/store/model/token'
import { composeValidators, required, mustBeEthereumAddress } from '~/components/forms/validator'
import TokenSelectField from '~/routes/safe/components/Balances/SendModal/screens/SendFunds/TokenSelectField'
import SafeInfo from '~/routes/safe/components/Balances/SendModal/screens/SendFunds/SafeInfo'
import ArrowDown from './assets/arrow-down.svg'
import { styles } from './style'

type Props = {
  onClose: () => void,
  classes: Object,
  safeAddress: string,
  etherScanLink: string,
  safeName: string,
  ethBalance: string,
  tokens: List<Token>,
}

const SendFunds = ({
  classes, onClose, safeAddress, etherScanLink, safeName, ethBalance, tokens,
}: Props) => {
  const handleSubmit = () => {}
  const formMutators = {
    setMax: (args, state, utils) => {
      const { token } = state.formState.values

      utils.changeValue(state, 'amount', () => token && token.balance)
    },
    onTokenChange: (args, state, utils) => {
      utils.changeValue(state, 'amount', () => '')
    },
  }

  return (
    <React.Fragment>
      <Row align="center" grow className={classes.heading}>
        <Paragraph weight="bolder" className={classes.manage} noMargin>
          Send Funds
        </Paragraph>
        <IconButton onClick={onClose} disableRipple>
          <Close className={classes.closeIcon} />
        </IconButton>
      </Row>
      <Hairline />
      <Block className={classes.formContainer}>
        <SafeInfo safeAddress={safeAddress} etherScanLink={etherScanLink} safeName={safeName} ethBalance={ethBalance} />
        <Row margin="md">
          <Col xs={1}>
            <img src={ArrowDown} alt="Arrow Down" style={{ marginLeft: '8px' }} />
          </Col>
          <Col xs={11} center="xs" layout="column">
            <Hairline />
          </Col>
        </Row>
        <GnoForm onSubmit={handleSubmit} formMutators={formMutators}>
          {(...args) => {
            const formState = args[2]
            const mutators = args[3]
            const { token } = formState.values

            return (
              <React.Fragment>
                <Row margin="md">
                  <Col xs={12}>
                    <Field
                      name="recipientAddress"
                      component={TextField}
                      type="text"
                      validate={composeValidators(required, mustBeEthereumAddress)}
                      placeholder="Recipient*"
                      text="Recipient*"
                      className={classes.addressInput}
                    />
                  </Col>
                </Row>
                <Row margin="sm">
                  <Col>
                    <TokenSelectField tokens={tokens} onTokenChange={mutators.onTokenChange} />
                  </Col>
                </Row>
                <Row margin="xs">
                  <Col between="lg">
                    <Paragraph size="md" color="disabled" style={{ letterSpacing: '-0.5px' }} noMargin>
                      Amount
                    </Paragraph>
                    <ButtonLink weight="bold" onClick={mutators.setMax}>
                      Send max
                    </ButtonLink>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Field
                      name="amount"
                      component={TextField}
                      type="text"
                      validate={composeValidators(required)}
                      placeholder="Amount*"
                      text="Amount*"
                      className={classes.addressInput}
                      inputAdornment={
                        token && {
                          endAdornment: <InputAdornment position="end">{token.symbol}</InputAdornment>,
                        }
                      }
                    />
                  </Col>
                </Row>
              </React.Fragment>
            )
          }}
        </GnoForm>
      </Block>
    </React.Fragment>
  )
}

export default withStyles(styles)(SendFunds)
