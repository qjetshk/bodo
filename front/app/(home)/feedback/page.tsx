import React from 'react'
import FeedbackForm from './FeedbackForm'
import { MotionDiv } from '@/components/MotionDiv'

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
