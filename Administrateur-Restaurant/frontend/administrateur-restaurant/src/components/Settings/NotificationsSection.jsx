import { Bell, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DARK } from './constants'
import Section   from './Section'
import Grid      from './Grid'
import Field     from './Field'
import TextInput from './TextInput'
import TabBtn    from './TabBtn'
import Label     from './Label'
import SaveBtn   from './SaveBtn'

export default function NotificationsSection({ notifications, setNotifField, saveNotif, savingNotif }) {
  const { t } = useTranslation()

  return (
    <Section
      icon={Bell}
      title={t('settings_module.email_notifications')}
      defaultOpen={false}
      action={<SaveBtn onClick={saveNotif} saving={savingNotif} />}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <Grid>
          <Field label={t('settings_module.sender_name')}>
            <TextInput
              readOnly
              value={notifications.fp_from_name}
              onChange={v => setNotifField('fp_from_name', v)}
              placeholder={t('settings_module.sender_name_placeholder')}
            />
          </Field>
          <Field label={t('settings_module.sender_email')}>
            <TextInput
              readOnly
              icon={Mail}
              value={notifications.fp_from_email}
              onChange={v => setNotifField('fp_from_email', v)}
              placeholder={t('settings_module.sender_email_placeholder')}
              type="email"
            />
          </Field>
        </Grid>

        <Field label={t('settings_module.dest_emails')}>
          <TextInput
            icon={Mail}
            value={notifications.fp_destination_emails}
            onChange={v => setNotifField('fp_destination_emails', v)}
            placeholder={t('settings_module.dest_emails_placeholder')}
          />
        </Field>

        <div style={{ height: 4, background: DARK, opacity: 0.08 }} />

        <div>
          <Label>{t('settings_module.default_status')}</Label>
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {['Pending', 'Confirmed'].map(s => (
              <TabBtn
                key={s}
                active={notifications.defaultstatus === s}
                onClick={() => setNotifField('defaultstatus', s)}
              >
                {s === 'Pending' ? t('settings_module.pending') : t('settings_module.confirmed')}
              </TabBtn>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
}
