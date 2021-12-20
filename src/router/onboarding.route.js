// onboarding routes
import Signup from "@/views/onboardingPages/signup/Signup.vue";
import Signin from "@/views/onboardingPages/signin/Signin.vue";
import RecoverPassword from "@/views/onboardingPages/recoverPassword/RecoverPassword.vue";
import ForgotPassword from "@/views/onboardingPages/forgotPassword/ForgotPassword.vue";
import EmailVerification from "@/views/onboardingPages/emailVerification/EmailVerification.vue";
import ForgotPasswordVerification from "@/views/onboardingPages/forgotPasswordVerification/ForgotPasswordVerification.vue";
import Onboarding from "@/layouts/Onboarding.vue";

import { alreadyLogin, ifAccessPasswordRecoveryPage, ifAccessEmailVerifcationPage, ifAccessForgotPasswordVerificationPage } from "./controller.js";

// onboarding routes
export const onboardingRoutes = {
    path: '/signup',
    component: Onboarding,
    beforeEnter: alreadyLogin,
    children: [
        {
            path: "",
            name: "Signup",
            component: Signup,
        },
        {
            path: "/signin",
            name: "Signin",
            component: Signin,
        },
        {
            path: "/recover-password",
            name: "RecoverPassword",
            component: RecoverPassword,
            beforeEnter: ifAccessPasswordRecoveryPage,
            props: true
        },
        {
            path: "/forgot-password",
            name: "ForgotPassword",
            component: ForgotPassword,
        },
        {
            path: "/email-verification",
            name: "EmailVerification",
            component: EmailVerification,
            beforeEnter: ifAccessEmailVerifcationPage,
            props: true
        },
        {
            path: "/forgot-password-verification",
            name: "ForgotPasswordVerification",
            component: ForgotPasswordVerification,
            beforeEnter: ifAccessForgotPasswordVerificationPage,
            props: true
        },
    ]
}