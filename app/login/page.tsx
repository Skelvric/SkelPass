import { AuthForm } from '@/components/AuthForm/AuthForm';
import { AuthLayout } from '@/components/AuthLayout/AuthLayout';

import { content } from '@/data/content';

export default function LoginPage() {
  return <AuthLayout title={content.auth.loginTitle} description={content.auth.loginDescription} footer={<span>{content.auth.noAccount} <a href="/register" className="font-semibold text-indigo-600">{content.auth.registerLink}</a></span>}><AuthForm mode="login" /></AuthLayout>;
}
