<script>
    import {
        AlertCircle,
        ArrowLeft,
        CheckCircle,
        Mail,
        ShieldCheck,
        Sparkles,
        Zap,
    } from "lucide-svelte";
    import AuthPanel from "../../../lib/sections/AuthPanel.svelte";
    import { appName } from "$lib";
    import Input from "../../../lib/components/Input.svelte";
    import Button from "../../../lib/components/Button.svelte";
    import { goto } from "$app/navigation";
    import { onMount, onDestroy } from "svelte";
    import { page } from "$app/stores";
    import {
        forgotPasswordSchema,
        resetPasswordSchema,
    } from "$lib/validations/auth";
    import { apiUrl } from "$lib/utils/api_url";
    import { toast } from "svelte-sonner";

    let error = "";
    let currentStep = 1;
    let maxStep = 3;
    let time = 59;
    let interval;
    let resend = true;
    let tokenFromUrl = null;
    let done = false;
    let loading = false;

    let formData = {
        email: "",
        password: "",
        confirm: "",
    };

    onMount(() => {
        tokenFromUrl = $page.url.searchParams.get("token");

        if (tokenFromUrl) {
            currentStep = 3;
        }
    });

    onDestroy(() => {
        if (interval) clearInterval(interval);
    });

    function nextStep() {
        if (currentStep < maxStep) currentStep++;
    }

    function prevStep() {
        if (currentStep > 1) currentStep--;
    }

    function startCountdown() {
        if (interval) clearInterval(interval);

        interval = setInterval(() => {
            if (time > 0) {
                time--;
            } else {
                clearInterval(interval);
                resend = true;
            }
        }, 1000);
    }

    async function handleForgotPassword() {
        error = "";

        const parsed = forgotPasswordSchema.safeParse({
            email: formData.email,
        });

        if (!parsed.success) {
            error =
                Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ||
                "Adresse e-mail invalide";
            return;
        }

        loading = true;

        try {
            const response = await fetch(`${apiUrl}/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: formData.email,
                }),
            });

            const resp = await response.json();

            if (resp.status) {
                toast.success(resp.message || "Lien envoyé avec succès");
                resend = false;
                time = 59;
                startCountdown();
                if (currentStep === 1) {
                    nextStep();
                }
            } else {
                error = resp.message || "Impossible d'envoyer le lien";
                toast.error(error);
            }
        } catch (e) {
            error = "Une erreur est survenue";
            toast.error(error);
            console.error("forgot password error:", e);
        } finally {
            loading = false;
        }
    }

    async function handleResetPassword() {
        error = "";

        const parsed = resetPasswordSchema.safeParse({
            token: tokenFromUrl,
            password: formData.password,
            confirmPassword: formData.confirm,
        });

        if (!parsed.success) {
            error =
                Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ||
                "Données invalides";
            return;
        }

        if (!tokenFromUrl) {
            error = "Lien invalide ou expiré";
            return;
        }

        loading = true;

        try {
            const response = await fetch(`${apiUrl}/auth/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: tokenFromUrl,
                    password: formData.password,
                    confirmPassword: formData.confirm,
                }),
            });

            const resp = await response.json();

            if (resp.status) {
                toast.success(resp.message || "Mot de passe réinitialisé");
                done = true;
            } else {
                error =
                    resp.message ||
                    "Impossible de réinitialiser le mot de passe";
                toast.error(error);
            }
        } catch (e) {
            error = "Une erreur est survenue";
            toast.error(error);
            console.error("reset password error:", e);
        } finally {
            loading = false;
        }
    }

    async function handleSubmit() {
        if (currentStep === 1) {
            await handleForgotPassword();
            return;
        }

        if (currentStep === 3) {
            await handleResetPassword();
        }
    }

    async function handleResend() {
        if (!resend || loading) return;
        await handleForgotPassword();
    }

    function toLogin() {
        goto("/auth/login", { replaceState: true });
    }
</script>

<div class="min-h-screen flex bg-base-100">
    <AuthPanel />
    <div class="flex-1 flex flex-col overflow-y-auto">
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
                <span class="font-display text-xl font-bold text-primary">
                    {appName}
                </span>
            </a>
        </div>

        {#if done}
            <div class="flex-1 flex items-center justify-center p-6 lg:p-10">
                <div class="w-full max-w-[420px]">
                    <div class="flex flex-col items-center text-center">
                        <div class="relative mb-7">
                            <div
                                class="w-24 h-24 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center"
                            >
                                <CheckCircle
                                    size={42}
                                    class="text-primary"
                                    strokeWidth={1.5}
                                />
                            </div>
                        </div>

                        <div>
                            <div
                                class="badge badge-outline border-primary/25 text-primary text-[10px] uppercase tracking-[0.2em] py-2 px-5 gap-2 mb-5"
                            >
                                <div
                                    class="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
                                ></div>
                                Mot de passe mis à jour
                            </div>
                            <h1
                                class="font-display text-3xl font-bold text-base-content mb-2 leading-tight"
                            >
                                C'est tout bon,
                                <em class="italic font-light text-primary">
                                    bienvenue&nbsp;!
                                </em>
                            </h1>
                            <p
                                class="text-sm text-base-content/42 leading-relaxed mb-8 max-w-xs mx-auto"
                            >
                                Votre mot de passe a été réinitialisé avec
                                succès. Vous pouvez maintenant vous connecter.
                            </p>
                            <div
                                class="card bg-base-200 border border-primary/10 p-4 text-left mb-7"
                            >
                                <div class="flex items-start gap-3">
                                    <ShieldCheck
                                        size={16}
                                        class="text-primary/50 shrink-0 mt-0.5"
                                    />
                                    <div>
                                        <p
                                            class="text-xs font-semibold text-base-content/60 mb-1"
                                        >
                                            Conseil de sécurité
                                        </p>
                                        <p
                                            class="text-[11px] text-base-content/35 leading-relaxed"
                                        >
                                            Si vous n'êtes pas à l'origine de
                                            cette demande, sécurisez votre
                                            adresse e-mail immédiatement et
                                            contactez notre support.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Button onClick={toLogin} label="Se connecter" />
                        </div>
                    </div>
                </div>
            </div>
        {:else if currentStep === 1}
            <div class="flex-1 flex items-center justify-center p-6 lg:p-10">
                <div class="w-full max-w-[420px]">
                    <div class="mb-7">
                        <h1
                            class="font-display text-3xl font-bold text-base-content mb-1"
                        >
                            Mot de passe
                            <em class="italic font-light text-primary">
                                oublié ?
                            </em>
                        </h1>
                        <p class="text-sm text-base-content/40">
                            Entrez votre adresse e-mail et nous vous enverrons
                            un lien de réinitialisation.
                        </p>
                    </div>

                    {#if error}
                        <div
                            class="mb-4 flex items-center gap-2.5 bg-error/10 border border-error/25 text-error rounded-xl px-4 py-3"
                        >
                            <AlertCircle size={15} class="shrink-0" />
                            <span class="text-xs font-medium">{error}</span>
                        </div>
                    {/if}

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
                        <div
                            class="flex items-start gap-3 bg-base-200 border border-primary/10 rounded-xl p-3.5"
                        >
                            <Sparkles
                                size={14}
                                class="text-primary/50 shrink-0 mt-0.5"
                            />
                            <p
                                class="text-[11px] text-base-content/38 leading-relaxed"
                            >
                                Un lien valable
                                <strong class="text-base-content/55"
                                    >30 min</strong
                                >
                                sera envoyé à votre adresse. Pensez à vérifier vos
                                spams.
                            </p>
                        </div>

                        <Button
                            label={loading ? "Envoi..." : "Envoyer le lien"}
                            type="submit"
                        />

                        <div class="divider">ou</div>

                        <button
                            type="button"
                            on:click={toLogin}
                            class="text-xs text-base-content/40 leading-relaxed text-cente cursor-pointer"
                        >
                            Vous vous souvenez de votre mot de passe ?
                            <span class="text-primary hover:underline">
                                Se connecter
                            </span>
                        </button>
                    </form>
                </div>
            </div>
        {:else if currentStep === 2}
            <div class="flex-1 flex items-center justify-center p-6 lg:p-10">
                <div class="w-full max-w-[420px]">
                    <div class="mb-8">
                        <button
                            on:click={prevStep}
                            class="inline-flex items-center gap-2 mb-8 text-xs uppercase tracking-wider text-base-content/30 hover:text-primary transition-colors duration-200 group"
                        >
                            <ArrowLeft
                                size={13}
                                class="group-hover:-translate-x-0.5 transition-transform duration-200"
                            />
                            Retour
                        </button>
                        <h1
                            class="font-display text-3xl font-bold text-base-content mb-2 leading-tight"
                        >
                            Vérifiez votre
                            <em class="italic font-light text-primary">
                                boîte mail
                            </em>
                        </h1>
                        <p
                            class="text-sm text-base-content/42 leading-relaxed mb-4"
                        >
                            Un lien de réinitialisation a été envoyé à :
                        </p>
                        <div
                            class="inline-flex items-center gap-2 bg-base-200 border border-primary/15 rounded-xl px-4 py-1.5"
                        >
                            <Mail size={12} class="text-primary/60" />
                            <span class="text-sm font-semibold text-primary/80">
                                {formData.email}
                            </span>
                        </div>
                    </div>

                    <div
                        class="card bg-base-200 border border-primary/10 p-4 mb-6"
                    >
                        <div class="flex items-start gap-3">
                            <ShieldCheck
                                size={15}
                                class="text-primary/50 shrink-0 mt-0.5"
                            />
                            <p
                                class="text-[11px] text-base-content/40 leading-relaxed"
                            >
                                Cliquez sur le lien dans l'email pour
                                réinitialiser votre mot de passe. Le lien expire
                                dans
                                <strong class="text-base-content/60"
                                    >30 min</strong
                                >.
                            </p>
                        </div>
                    </div>

                    <div class="flex flex-col gap-3 mt-4">
                        {#if resend}
                            <button
                                type="button"
                                on:click={handleResend}
                                class="flex items-center gap-1.5 text-xs text-primary/60 hover:text-primary transition-colors uppercase tracking-wider"
                            >
                                {loading ? "Envoi..." : "Renvoyer le lien"}
                            </button>
                        {:else}
                            <p class="text-xs text-base-content/30">
                                Renvoyer dans
                                <span
                                    class="font-mono font-bold text-primary/60 tabular-nums"
                                >
                                    {time}sec
                                </span>
                            </p>
                        {/if}
                    </div>
                </div>
            </div>
        {:else if currentStep === 3}
            <div class="flex-1 flex items-center justify-center p-6 lg:p-10">
                <div class="w-full max-w-[420px]">
                    <div class="mb-8">
                        <button
                            on:click={prevStep}
                            class="inline-flex items-center gap-2 mb-8 text-xs uppercase tracking-wider text-base-content/30 hover:text-primary transition-colors duration-200 group"
                        >
                            <ArrowLeft
                                size={13}
                                class="group-hover:-translate-x-0.5 transition-transform duration-200"
                            />
                            Retour
                        </button>
                        <h1
                            class="font-display text-3xl font-bold text-base-content mb-2 leading-tight"
                        >
                            Nouveau
                            <em class="italic font-light text-primary">
                                mot de passe
                            </em>
                        </h1>
                        <p class="text-sm text-base-content/42 leading-relaxed">
                            Choisissez un mot de passe fort et mémorable. Il
                            doit différer de l'ancien.
                        </p>
                    </div>

                    {#if !tokenFromUrl}
                        <div
                            class="flex items-center gap-2.5 bg-error/10 border border-error/25 text-error rounded-xl px-4 py-3 mb-5"
                        >
                            <AlertCircle size={15} class="shrink-0" />
                            <span class="text-xs font-medium">
                                Lien invalide ou expiré.
                                <a
                                    href="/auth/forget-password"
                                    class="underline"
                                >
                                    Refaire la demande
                                </a>
                            </span>
                        </div>
                    {/if}

                    {#if error}
                        <div
                            class="mb-4 flex items-center gap-2.5 bg-error/10 border border-error/25 text-error rounded-xl px-4 py-3"
                        >
                            <AlertCircle size={15} class="shrink-0" />
                            <span class="text-xs font-medium">{error}</span>
                        </div>
                    {/if}

                    <form
                        on:submit|preventDefault={handleSubmit}
                        class="flex flex-col gap-4"
                    >
                        <Input
                            label="Nouveau mot de passe"
                            type="password"
                            placeholder="********"
                            required={true}
                            bind:value={formData.password}
                        />
                        <Input
                            label="Confirmer le mot de passe"
                            type="password"
                            placeholder="********"
                            required={true}
                            bind:value={formData.confirm}
                        />
                        <Button
                            label={loading
                                ? "Enregistrement..."
                                : "Enregistrer"}
                            type="submit"
                        />
                    </form>
                </div>
            </div>
        {/if}
    </div>
</div>
