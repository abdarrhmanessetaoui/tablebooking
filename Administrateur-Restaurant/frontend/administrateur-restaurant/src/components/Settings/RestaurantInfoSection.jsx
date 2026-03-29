import { Store, MapPin, Mail, Users, Phone, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { DARK, BORDER, GOLD } from './constants'
import Section    from './Section'
import Grid       from './Grid'
import Field      from './Field'
import TextInput  from './TextInput'
import SaveBtn    from './SaveBtn'

export default function RestaurantInfoSection({ info, setInfoField, saveInfo, savingInfo }) {
  const { t } = useTranslation()

  return (
    <Section
      icon={Store}
      title={t('settings_module.restaurant_info')}
      action={<SaveBtn onClick={saveInfo} saving={savingInfo} />}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Grid>
          <Field label={t('settings_module.restaurant_name')}>
            <TextInput
              icon={Store}
              value={info.form_name}
              onChange={v => setInfoField('form_name', v)}
              placeholder={t('settings_module.restaurant_name_placeholder')}
            />
          </Field>
          <Field label={t('settings_module.capacity')}>
            <TextInput
              icon={Users}
              value={info.capacity}
              onChange={v => setInfoField('capacity', v)}
              placeholder={t('settings_module.capacity_placeholder')}
              type="number"
            />
          </Field>
        </Grid>

        <Field label={t('settings_module.address')}>
          <TextInput
            icon={MapPin}
            value={info.address}
            onChange={v => setInfoField('address', v)}
            placeholder={t('settings_module.address_placeholder')}
          />
        </Field>

        <Grid>
          <Field label={t('settings_module.google_maps')}>
            <TextInput
              icon={MapPin}
              value={info.google_maps_link}
              onChange={v => setInfoField('google_maps_link', v)}
              placeholder={t('settings_module.google_maps_placeholder')}
            />
          </Field>
          <Field label={t('settings_module.website')}>
            <TextInput
              icon={Globe}
              value={info.website}
              onChange={v => setInfoField('website', v)}
              placeholder={t('settings_module.website_placeholder')}
            />
          </Field>
        </Grid>

        <Grid>
          <Field label={t('settings_module.phone')}>
            <TextInput
              icon={Phone}
              value={info.phone}
              onChange={v => setInfoField('phone', v)}
              placeholder={t('settings_module.phone_placeholder')}
              type="tel"
            />
          </Field>
          <Field label={t('settings_module.contact_email')}>
            <TextInput
              icon={Mail}
              value={info.contact_email}
              onChange={v => setInfoField('contact_email', v)}
              placeholder={t('settings_module.contact_email_placeholder')}
              type="email"
            />
          </Field>
        </Grid>

        <Field label={t('settings_module.description')}>
          <textarea
            value={info.description ?? ''}
            onChange={e => setInfoField('description', e.target.value)}
            placeholder={t('settings_module.description_placeholder')}
            rows={3}
            onFocus={e => (e.target.style.borderColor = GOLD)}
            onBlur={e => (e.target.style.borderColor = BORDER)}
            style={{
              width: '100%',
              padding: '11px 14px',
              border: `4px solid ${BORDER}`,
              fontSize: 13,
              fontWeight: 600,
              color: DARK,
              fontFamily: 'inherit',
              outline: 'none',
              background: '#fff',
              borderRadius: 0,
              resize: 'vertical',
              transition: 'border-color 0.15s',
            }}
          />
        </Field>
      </div>
    </Section>
  )
}