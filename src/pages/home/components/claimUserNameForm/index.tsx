import { Button, TextInput } from '@ignite-ui/react'
import { Form } from './styles'
import { ArrowRight } from 'phosphor-react'

export function ClaimUserNameForm() {
  return (
    <Form as="form">
      <TextInput size="sm" prefix="Ignite.com/" placeholder="Seu usuario" />
      <Button size="sm" type="submit">
        Reservar
        <ArrowRight />
      </Button>
    </Form>
  )
}
