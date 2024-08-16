import { Button, Text, TextInput } from '@ignite-ui/react'
import { Form, FormAnnotation } from './styles'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/router'

const claimUserNameFormSchema = z.object({
  userName: z
    .string()
    .min(3, { message: 'Usuario precisa ter pelo menos 3 letras' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'Usuario pode ter apenas letras e hifens',
    })
    .transform((userName) => userName.toLowerCase()),
})

type ClaimUserNameFormData = z.infer<typeof claimUserNameFormSchema>

export function ClaimUserNameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimUserNameFormData>({
    resolver: zodResolver(claimUserNameFormSchema),
  })

  const router = useRouter()

  async function handleClaimUserName(data: ClaimUserNameFormData) {
    const { userName } = data

    await router.push(`/register?userName=${userName}`)
  }

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUserName)}>
        <TextInput
          size="sm"
          prefix="Ignite.com/"
          placeholder="Seu usuario"
          {...register('userName')}
        />
        <Button size="sm" type="submit">
          Reservar
          <ArrowRight />
        </Button>
      </Form>
      <FormAnnotation>
        <Text size="sm">
          {errors.userName
            ? errors.userName.message
            : 'Digite o nome de usuario desejado'}
        </Text>
      </FormAnnotation>
    </>
  )
}
