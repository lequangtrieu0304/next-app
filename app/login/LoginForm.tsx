'use client';

import Heading from "@/app/components/Heading";
import Input from "@/app/components/inputs/input";
import React, {useEffect, useState} from "react";
import {FieldValues, SubmitHandler, useForm} from "react-hook-form";
import Button from "@/app/components/Button";
import Link from "next/link";
import {AiOutlineGoogle} from "react-icons/ai";
import {signIn} from "next-auth/react";
import toast from "react-hot-toast";
import {useRouter} from "next/navigation";
import {SafeUser} from "@/types";

interface LoginFormProps {
  currentUser: SafeUser | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ currentUser }) => {
  const [ isLoading, setIsLoading ] = useState(false);
  const {register, handleSubmit, formState: {errors}} = useForm<FieldValues>({
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const router = useRouter();

  useEffect(() => {
    if (currentUser) {
      router.push('/cart');
      router.refresh();
    }
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    signIn('credentials', {
      ...data,
      redirect: false,
    })
      .then(callback => {
        setIsLoading(false);
        if (callback?.ok) {
          router.push('/cart')
          router.refresh()
          toast.success('Logged In')
        }
        if (callback?.error) {
          toast.error(callback.error);
        }
      })
  }

  if (currentUser) return <p>Logged in. Redirecting....</p>

  return (
    <>
      <Heading title="Sign in to Next-App" />
      <Button
        outline
        label="Continue with google"
        icon={AiOutlineGoogle}
        onClick={() => {}}
      />
      <hr className="bg-slate-300 w-full h-px" />
      <Input
        id="email"
        label="Email"
        disable={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        disable={isLoading}
        register={register}
        errors={errors}
        required
        type="password"
      />
      <Button
        label={isLoading ? "Loading" : "Login"}
        onClick={handleSubmit(onSubmit)}
      />
      <p className="text-sm">
        Do not have an account? <Link href="/register" className="underline" >Sign Up</Link>
      </p>
    </>
  )
}

export default LoginForm;