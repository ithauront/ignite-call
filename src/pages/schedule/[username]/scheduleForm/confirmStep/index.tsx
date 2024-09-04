import { Button, Text, TextArea, TextInput } from '@ignite-ui/react'
import { ConfirmForm, FormActions, FormHeader } from './styles'
import { CalendarBlank, Clock } from 'phosphor-react'

export function ConfirmStep() {
  function handleConfirmScheduling() {}
  return (
    <ConfirmForm as="form" onSubmit={handleConfirmScheduling}>
      <FormHeader>
        <Text>
          <CalendarBlank /> 22 de setembro de 2024
        </Text>
        <Text>
          <Clock /> 18:00h
        </Text>
      </FormHeader>

      <label htmlFor="">
        <Text>Nome completo</Text>
        <TextInput placeholder="Seu nome" />
      </label>
      <label htmlFor="">
        <Text>Endereço de e-mail</Text>
        <TextInput type="email" placeholder="johndoe@example.com" />
      </label>
      <label htmlFor="">
        <Text>Observações</Text>
        <TextArea />
      </label>

      <FormActions>
        <Button type="button" variant="tertiary">
          Cancelar
        </Button>
        <Button type="submit">Confirmar</Button>
      </FormActions>
    </ConfirmForm>
  )
}
