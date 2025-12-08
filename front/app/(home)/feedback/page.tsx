import React from 'react'
import FeedbackForm from './FeedbackForm'
import { MotionDiv } from '@/components/MotionDiv'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Bōdo - Обратная связь",
  description: "Страница с формой обратной связи по проекту",
  keywords: ["обратная связь", "отзыв", "оставить отзыв", "пожелание", "написать пожелание", "фидбек", "feedback"],
  icons: "/logo.svg",
};

const FeedbackPage = () => {
    return (
        <MotionDiv
            initial={{ y: 10, opacity: 0, filter: 'blur(10px)' }}
            animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            transition={{duration: 0.6}}
        >
            <FeedbackForm />
        </MotionDiv>
    )
}

export default FeedbackPage
