<script>
    import { AlertCircle, Zap } from "lucide-svelte";
    import AuthPanel from "../../../lib/sections/AuthPanel.svelte";
    import { appName } from "$lib";
    import Input from "../../../lib/components/Input.svelte";
    import FileInput from "../../../lib/components/FileInput.svelte";
    import CheckBox from "../../../lib/components/CheckBox.svelte";
    import Button from "../../../lib/components/Button.svelte";
    import { goto, invalidateAll } from "$app/navigation";
    import { loginSchema } from "$lib/validations/auth";
    import { apiUrl } from "$lib/utils/api_url";
    import { toast } from "svelte-sonner";

    let error = "";

    let formData = {
        email: "",
        password: "",
    };

    async function handleSubmit() {
        error = "";
        const parsed = loginSchema.safeParse(formData);

        if (!parsed.success) {
            error = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData),
            });

            const resp = await response.json();

            if (resp.status) {
                toast.success(resp.message);
                await invalidateAll();
                goto("/user/profile", { replaceState: true });
            } else {
                error = resp.message;
            }
        } catch (e) {
            error = "Une erreur est survenue";
            console.error("error:", e);
        }
    }

    function toRegister() {
        goto("/auth/register", { replaceState: true });
    }

    function toForgotPassword() {
        goto("/auth/forget-password", { replaceState: true });
    }
</script>

<div class="min-h-screen flex bg-base-100">
    <AuthPanel type="login" />
    <div class="flex-1 flex flex-col overflow-y-auto">
        <!-- Mobile top bar -->
        <div
            class="lg:hidden flex items-center justify-between px-6 py-5 border-b border-primary/10"
        >
            <a href="/" class="flex items-center gap-2">
                <div
                    class="w-8 h-8 rounded-xl bg-primary flex items-center justify-center"
                >
                    <Zap
                        size={15}
                        class="text-primary-content"
                        fill="currentColor"
                    />
                </div>
                <span class="font-display text-xl font-bold text-primary"
                    >{appName}</span
                >
            </a>
        </div>

        <div class="flex-1 flex items-center justify-center p-6 lg:p-10">
            <div class="w-full max-w-[420px]">
                <!-- Header -->
                <div class="mb-7">
                    <h1
                        class="font-display text-2xl font-bold text-base-content mb-1"
                    >
                        Se connecter
                    </h1>
                    <p class="text-sm text-base-content/40">
                        Heureux de vous revoir !
                    </p>
                </div>

                <!-- Error banner -->
                {#if error}
                    <div
                        class="mb-4 flex items-center gap-2.5 bg-error/10 border border-error/25 text-error rounded-xl px-4 py-3"
                    >
                        <AlertCircle size={15} class="shrink-0" />
                        <span class="text-xs font-medium">{error}</span>
                    </div>
                {/if}

                <!-- Form -->
                <form
                    on:submit|preventDefault={handleSubmit}
                    class="flex flex-col gap-4"
                >
                    <Input
                        label="Adresse e-mail"
                        type="email"
                        placeholder="email@gmail.com"
                        required={true}
                        bind:value={formData.email}
                    />
                    <Input
                        label="Mot de passe"
                        type="password"
                        placeholder="********"
                        required={true}
                        bind:value={formData.password}
                    />
                    <Button label="Se connecter" type="submit" />
                    <div class="divider">ou</div>
                    <button
                        on:click={toForgotPassword}
                        class="text-xs text-base-content/40 leading-relaxed text-cente cursor-pointer"
                        >Mot de passe oublié?</button
                    >
                    <button
                        on:click={toRegister}
                        class="text-xs text-base-content/40 leading-relaxed text-cente cursor-pointer"
                        >Vous êtes nouveau? <span
                            class="text-primary hover:underline"
                            >Créer un compte</span
                        ></button
                    >
                </form>
            </div>
        </div>
    </div>
</div>
