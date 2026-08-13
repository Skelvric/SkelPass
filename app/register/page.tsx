import { AuthForm } from '@/components/AuthForm/AuthForm';
import { AuthLayout } from '@/components/AuthLayout/AuthLayout';

import { content } from '@/data/content';

export default function RegisterPage() {
  return <AuthLayout title={content.auth.registerTitle} description={content.auth.registerDescription} footer={<span>{content.auth.hasAccount} <a href="/login" className="font-semibold text-indigo-600">{content.auth.loginLink}</a></span>}><AuthForm mode="register" /></AuthLayout>;
}
