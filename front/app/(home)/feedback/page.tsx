import React from 'react'
import FeedbackForm from './FeedbackForm'
import { MotionDiv } from '@/components/MotionDiv'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Bōdo - Feedback",
  description: "Page with a feedback form for the project",
  keywords: [
    "feedback",
    "review",
    "leave a review",
    "suggestion",
    "submit a suggestion",
    "feedback form",
  ],
  icons: "/logo.svg",
  robots: {
    index: true,
    follow: true,
  },
  authors: [
    {
      name: "Bōdo Team",
      url: "https://bodo-planner.com",
    },
  ],
  openGraph: {
    title: "Bōdo - Feedback",
    description: "Share your feedback and suggestions for the Bōdo project.",
    url: "https://bodo-planner.com/feedback",
    siteName: "Bōdo",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "Bōdo Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bōdo - Feedback",
    description: "Share your feedback and suggestions for the Bōdo project.",
    images: ["/logo.svg"],
    creator: "@Bodo",
  },
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
