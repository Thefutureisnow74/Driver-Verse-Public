import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import sendEmail from "./email";
import { emailVerificationTemplate, passwordResetTemplate } from "@/emails/auth";
import { nextCookies } from "better-auth/next-js";
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    socialProviders: {
        google: {
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    emailVerification: {
        sendVerificationEmail: async ({ user, url, token }: { user: any, url: string, token: string }, request: any) => {
            console.log('📧 Sending email verification to:', user.email)
            const emailContent = emailVerificationTemplate({ user, url, token });

            await sendEmail({
                to: user.email,
                subject: emailContent.subject,
                text: emailContent.text,
                html: emailContent.html
            })
        },
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
    },
    // forgetPassword: {
    //     sendResetPassword: async ({ user, url, token }: { user: any, url: string, token: string }, request: any) => {
    //         console.log('📧 Sending password reset email to:', user.email)
    //         const emailContent = passwordResetTemplate({ user, url, token });

    //         await sendEmail({
    //             to: user.email,
    //             subject: emailContent.subject,
    //             text: emailContent.text,
    //             html: emailContent.html
    //         })
    //     },
    // },
    plugins: [
        nextCookies(),
    ],
    user: {
        additionalFields: {
            totalEarnings: {
                type: "number",
                default: 0
            },
            completedGigs: {
                type: "number",
                default: 0
            },
            rating: {
                type: "number",
                default: 0
            }
        },
        update: async ({ user, data }: { user: any, data: any }) => {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    totalEarnings: data.totalEarnings,
                    completedGigs: data.completedGigs,
                    rating: data.rating
                }
            })
        }
    }

});