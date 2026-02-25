'use client'

import { Button } from '@/shared/ui-kit/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui-kit/card'
import { Input } from '@/shared/ui-kit/input'
import { Textarea } from '@/shared/ui-kit/textarea'
import { useCurrentUser } from '@/shared/hooks/use-user'
import { type FeedbackForm, feedbackFormSchema } from '@/features/add-feedback/model/feedback-form.type'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { usePostHog } from 'posthog-js/react'

const FeedbackForm = () => {
  const { user } = useCurrentUser()
  const posthog = usePostHog()
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackFormSchema),
  })

  useEffect(() => {
    setValue('nickName', user?.nickName ?? '')
    setValue('email', user?.email ?? '')
  }, [user, setValue])

  const onSubmit: SubmitHandler<FeedbackForm> = async (formData) => {
    if (!posthog) {
      toast.error('PostHog is not initialized!')
      return
    }

    try {
      setSubmitting(true)
      
      // Send event to PostHog
      posthog.capture('user_feedback_submitted', {
        nickName: formData.nickName,
        email: formData.email,
        message: formData.message,
        submitted_at: new Date().toISOString(),
      })

      toast.success('Your feedback has been successfully submitted!', { duration: 1500 })
      reset({ nickName: user?.nickName ?? '', email: user?.email ?? '', message: '' })
    } catch (err) {
      console.error(err)
      toast.error('Error submitting the form!')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="_container">
      <Card className="dark max-w-[800px] mx-auto mt-7">
        <CardHeader>
          <CardTitle>Feedback Form</CardTitle>
          <CardDescription>Send your suggestions or feedback to the developer!</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
              {errors.nickName && <span className="text-sm text-red-400">{errors.nickName.message}</span>}
              <Input
                {...register('nickName')}
                disabled={!!user}
                placeholder="Enter your username"
                type="text"
                className={errors.nickName ? 'border-red-400 text-red-400 placeholder:text-red-400 focus-visible:border-red-400!' : ''}
              />
            </div>

            <div>
              {errors.email && <span className="text-sm text-red-400">{errors.email.message}</span>}
              <Input
                {...register('email')}
                disabled={!!user}
                placeholder="Enter your email"
                type="text"
                className={errors.email ? 'border-red-400 text-red-400 placeholder:text-red-400 focus-visible:border-red-400!' : ''}
              />
            </div>

            <div>
              {errors.message && <span className="text-sm text-red-400">{errors.message.message}</span>}
              <Textarea
                {...register('message')}
                placeholder="Enter your feedback or suggestion"
                className={`min-h-50 max-h-80 ${errors.message ? 'border-red-400 text-red-400 placeholder:text-red-400 focus-visible:border-red-400!' : ''}`}
              />
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default FeedbackForm
