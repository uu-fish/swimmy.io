import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import { FormControlLabel, FormGroup } from 'material-ui/Form'
import Block from '/client/components/UI-Block'
import Button from '/client/components/Button'
import Checkbox from 'material-ui/Checkbox'
import Layout from '/client/components/UI-Layout'
import Sheet from '/client/components/UI-Sheet'
import SheetActions from '/client/components/UI-SheetActions'
import SheetContent from '/client/components/UI-SheetContent'
import styles from './index.style'

@withStyles(styles)
@inject('snackbar', 'accounts')
@observer
export default class ConfigTwitter extends Component {
  render () {
    const {accounts, classes} = this.props
    return (
      <Layout>
        <Sheet>
          <SheetContent>
            <img
              className={classes.icon}
              src={accounts.services.twitter.profile_image_url_https.replace('_normal', '')} />
          </SheetContent>
          <SheetContent>
            <Typography type='title' align='center'>
              {accounts.services.twitter.screenName}
            </Typography>
          </SheetContent>
          <SheetActions>
            <Block align='center'>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={accounts.config.twitter.useIcon}
                      value='useIcon'
                      onChange={this.onSelectOption} />
                  }
                  label='アイコンを使用する' />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={accounts.config.twitter.publicAccount}
                      value='publicAccount'
                      onChange={this.onSelectOption} />
                  }
                  label='アカウントを表示する' />
              </FormGroup>
            </Block>
          </SheetActions>
          <SheetActions align='right'>
            <Block align='center'>
              <Button onClick={this.onUpdateRemoveTwitter}>
                disconnect
              </Button>
              <Button onClick={this.onUpdateTwitter}>
                update
              </Button>
            </Block>
          </SheetActions>
        </Sheet>
      </Layout>
    )
  }

  onSelectOption (event, checked) {
    const {value: name} = event.target
    this.props.accounts.updateConfigTwitter(name, checked)
    .catch(this.props.snackbar.error)
  }

  onSelectOption = ::this.onSelectOption

  onUpdateTwitter () {
    this.props.accounts.updateServicesTwitter()
    .then(() => { this.props.snackbar.show('アップデートに成功しました') })
    .catch(this.props.snackbar.error)
  }

  onUpdateTwitter = ::this.onUpdateTwitter

  onUpdateRemoveTwitter () {
    if (!window.confirm('解除してもいいですか？')) return
    this.props.accounts.updateRemoveServicesTwitter()
    .then(() => { this.props.snackbar.show('関連付けを解除しました') })
    .catch(this.props.snackbar.error)
  }

  onUpdateRemoveTwitter = ::this.onUpdateRemoveTwitter
}
