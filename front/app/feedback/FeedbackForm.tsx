'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCurrentUser } from '@/hooks/use-user'
import { type FeedbackForm, feedbackFormSchema } from '@/types/feedback-form.type'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import axios from 'axios'


const FeedbackForm = () => {
    const { user } = useCurrentUser()

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FeedbackForm>({
        resolver: zodResolver(feedbackFormSchema),
    });

    const onSubmit: SubmitHandler<FeedbackForm> = async (formData) => {
        try {
            await axios.post('https://script.google.com/macros/s/AKfycbxOtTGBaATdD0pChHWcCLAS19obTy_vzCVOd_VxO3-6EcXlBbkFtc4rb0WgrhdD2bWzSw/exec', formData)
            toast.success("Вы успешно отправили свое пожелание!", { duration: 1000 });
            setTimeout(() => {
            }, 1000);
        } catch (err: any) {
            toast.error('Ошибка при отправке формы!')
        }
    };

    useEffect(() => {
        setValue('nickName', user?.nickName ?? '')
        setValue('email', user?.email ?? '')
    })

    return (
        <Card className='dark max-w-[800px] mx-auto'>
            <CardHeader>
                <CardTitle>sdfsdf</CardTitle>
            </CardHeader>
            <CardContent>
                <form className='flex flex-col gap-5' onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        {errors.nickName && (
                            <span className="text-sm text-red-400">{errors.nickName.message}</span>
                        )}
                        <Input
                            {...register("nickName")}
                            disabled={user !== null}
                            placeholder="Напишите свой логин"
                            type="text"
                            className={
                                errors.email &&
                                "border-red-400 text-red-400 placeholder:text-red-400 focus-visible:border-red-400!"
                            }
                        />
                    </div>

                    <div>
                        {errors.email && (
                            <span className="text-sm text-red-400">{errors.email.message}</span>
                        )}
                        <Input
                            {...register("email")}
                            disabled={user !== null}
                            placeholder="Напишите свой email"
                            type="text"
                            className={
                                errors.email &&
                                "border-red-400 text-red-400 placeholder:text-red-400 focus-visible:border-red-400!"
                            }
                        />
                    </div>
                    <div>
                        {errors.message && (
                            <span className="text-sm text-red-400">{errors.message.message}</span>
                        )}
                        <Textarea
                            {...register("message")}
                            placeholder='Введите ваше пожелание'
                            className={`
                                ${errors.email &&
                                "border-red-400 text-red-400 placeholder:text-red-400 focus-visible:border-red-400!"} min-h-50 max-h-100` 
                            }
                        />
                    </div>
                    <Button type='submit'>Отправить</Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default FeedbackForm
