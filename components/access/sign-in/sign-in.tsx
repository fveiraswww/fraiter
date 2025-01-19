/* eslint-disable no-console */
/* eslint-disable react/hook-use-state */
"use client";

import {useState} from "react";
import {Loader} from "lucide-react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
// biome-ignore lint/style/useImportType: <explanation>
import {z} from "zod";
import {toast} from "sonner";

import {SignInSchema} from "./signin.zod";

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {createClient} from "@/lib/supabase/client";

export default function SignInForm() {
  const [issubmited, setIsSubmited] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const signInByEmail = async (data: z.infer<typeof SignInSchema>) => {
    setIsSubmited(true);

    try {
      const {error, data: logged_user} = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error?.status === 400) {
        toast.error("Credenciales invalidas", {
          description: "Email o contraseña incorrectos.",
        });
      }

      if (error) throw new Error(error.message);

      const {error: user_details_error, data: user_details} = await supabase
        .from("user_details")
        .select()
        .eq("user_id", logged_user.user.id)
        .single();

      if (user_details_error) {
        router.push("/auth/callback");

        return;
      }

      router.push(`/dashboard/${user_details?.username}`);
    } catch (error) {
      const {message} = error as Error;

      setIsSubmited(false);

      console.error(message);
    }
  };

  return (
    <Form {...form}>
      <form className="flex flex-col space-y-[33px]" onSubmit={form.handleSubmit(signInByEmail)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({field}) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Email" type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({field}) => (
              <FormItem>
                <FormControl>
                  <Input {...field} placeholder="Password" type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="!h-10 px-8" name="submit" type="submit" variant="outline">
          <span className="inline-flex w-full items-center justify-center space-x-1.5">
            {issubmited ? (
              <Loader className="h-4 w-4 animate-spin" strokeWidth="1px" />
            ) : (
              <span>Log In</span>
            )}
          </span>
        </Button>
      </form>
    </Form>
  );
}
