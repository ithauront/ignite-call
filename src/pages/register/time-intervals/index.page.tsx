import {
  Button,
  Checkbox,
  Heading,
  MultiStep,
  Text,
  TextInput,
} from '@ignite-ui/react'
import { Container, FormError, Header } from '../styles'
import {
  IntervalBox,
  IntervalDay,
  IntervalInputs,
  IntervalItem,
  IntervalsContainer,
} from './styles'
import { ArrowRight } from 'phosphor-react'
import { z } from 'zod'
import { Controller, Form, useFieldArray, useForm } from 'react-hook-form'
import { getWeekDay } from '../../../utils/get-week-day'
import { zodResolver } from '@hookform/resolvers/zod'
import { convertTimeInMinutes } from '../../../utils/convert-time-in-minutes'
import { api } from '../../../lib/axios'

const timeIntervalsFormSchema = z.object({
  intervals: z
    .array(
      z.object({
        weekday: z.number().min(0).max(6),
        enabled: z.boolean(),
        startTime: z.string(),
        endTime: z.string(),
      }),
    )
    .length(7)
    .transform((intervals) => intervals.filter((interval) => interval.enabled))
    .refine((intervals) => intervals.length > 0, {
      message: 'Você precisa selecionar pelo menos um dia da semana.',
    })
    .transform((intervals) => {
      return intervals.map((interval) => {
        return {
          weekday: interval.weekday,
          startTimeInMinutes: convertTimeInMinutes(interval.startTime),
          endTimeInMinutes: convertTimeInMinutes(interval.endTime),
        }
      })
    })
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) =>
            interval.endTimeInMinutes - 60 >= interval.startTimeInMinutes,
        )
      },
      {
        message:
          'O horario de termino precisa ser pelo menos 1 hora apos o inicio.',
      },
    ),
})

type TimeIntervalsTypeFormInput = z.input<typeof timeIntervalsFormSchema>
type TimeIntervalsTypeFormOutput = z.output<typeof timeIntervalsFormSchema>

export default function TimeInterval() {
  const {
    register,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TimeIntervalsTypeFormInput>({
    resolver: zodResolver(timeIntervalsFormSchema),
    defaultValues: {
      intervals: [
        { weekday: 0, enabled: false, startTime: '08:00', endTime: '18:00' },
        { weekday: 1, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekday: 2, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekday: 3, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekday: 4, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekday: 5, enabled: true, startTime: '08:00', endTime: '18:00' },
        { weekday: 6, enabled: false, startTime: '08:00', endTime: '18:00' },
      ],
    },
  })

  const weekdays = getWeekDay()

  const { fields } = useFieldArray({
    control,
    name: 'intervals',
  })

  const intervals = watch('intervals')

  async function handleSetTimeIntervals(data: TimeIntervalsTypeFormOutput) {
    const { intervals } = data
    await api.post('/users/time-intervals', { intervals })
  }
  return (
    <Container>
      <Header>
        <Heading as="strong">Quase la!</Heading>
        <Text>
          Defina os intervalos de horarios que você esta disponivel em cada dia
          da semana.
        </Text>
        <MultiStep size={4} currentStep={3} />
      </Header>
      <Form<TimeIntervalsTypeFormInput, TimeIntervalsTypeFormOutput>
        control={control}
        onSubmit={async ({ data }) => await handleSetTimeIntervals(data)}
      >
        <IntervalBox>
          <IntervalsContainer>
            {fields.map((field, index) => {
              return (
                <IntervalItem key={field.id}>
                  <IntervalDay>
                    <Controller
                      name={`intervals.${index}.enabled`}
                      control={control}
                      render={({ field }) => {
                        return (
                          <Checkbox
                            onCheckedChange={(checked) => {
                              field.onChange(checked === true)
                            }}
                            checked={field.value}
                          />
                        )
                      }}
                    />
                    <Text>{weekdays[field.weekday]}</Text>
                  </IntervalDay>
                  <IntervalInputs>
                    <TextInput
                      size="sm"
                      type="time"
                      step={60}
                      disabled={intervals[index].enabled === false}
                      {...register(`intervals.${index}.startTime`)}
                    />
                    <TextInput
                      size="sm"
                      type="time"
                      step={60}
                      disabled={intervals[index].enabled === false}
                      {...register(`intervals.${index}.endTime`)}
                    />
                  </IntervalInputs>
                </IntervalItem>
              )
            })}
          </IntervalsContainer>

          {errors.intervals && (
            <FormError size="sm">{errors.intervals.root?.message}</FormError>
          )}

          <Button type="submit" disabled={isSubmitting}>
            Proximo passo
            <ArrowRight />
          </Button>
        </IntervalBox>
      </Form>
    </Container>
  )
}
