<script>
    import { AlertCircle, Zap } from "lucide-svelte";
    import AuthPanel from "../../../lib/sections/AuthPanel.svelte";
    import { appName } from "$lib";
    import Input from "$lib/components/Input.svelte";
    import FileInput from "$lib/components/FileInput.svelte";
    import CheckBox from "$lib/components/CheckBox.svelte";
    import Button from "$lib/components/Button.svelte";
    import { goto } from "$app/navigation";
    import { registerSchema } from "$lib/validations/auth";
    import { apiUrl } from "$lib/utils/api_url";
    import { toast } from "svelte-sonner";

    let error = "";

    let formData = {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        npi: "",
        agreeTerms: false,
    };

    let cip;

    function handleChange(checked) {
        formData.agreeTerms = checked;
    }

    async function handleSubmit() {
        error = "";
        const parsed = registerSchema.safeParse(formData);

        if (!parsed.success) {
            error = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
            return;
        }

        if (formData.cip == "") {
            error = "CIP requis";
            return;
        }

        const form = new FormData();
        form.append("firstName", formData.firstName);
        form.append("lastName", formData.lastName);
        form.append("email", formData.email);
        form.append("npi", formData.npi);
        form.append("password", formData.password);
        if (cip) form.append("cip", cip[0]);

        try {
            const response = await fetch(`${apiUrl}/auth/register`, {
                method: "POST",
                credentials: "include",
                body: form,
            });

            const resp = await response.json();

            if (resp.status) {
                toast.success(resp.message);
                toLogin();
            } else {
                error = resp.message;
            }
        } catch (e) {
            error = "Une erreur est survenue";
            console.error("error:", e);
        }
    }

    function toLogin() {
        goto("/auth/login", { replaceState: true });
    }
</script>

<div class="min-h-screen flex bg-base-100">
    <AuthPanel type="register" />
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
                        Créer un compte
                    </h1>
                    <p class="text-sm text-base-content/40">
                        Renseignez vos identifiants de connexion.
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
                    <div class="grid grid-cols-2 gap-3">
                        <Input
                            label="Prénom"
                            placeholder="Jean"
                            required={true}
                            bind:value={formData.firstName}
                        />
                        <Input
                            label="Nom"
                            placeholder="Dupon"
                            required={true}
                            bind:value={formData.lastName}
                        />

                        <Input
                            label="Adresse e-mail"
                            type="email"
                            placeholder="email@gmail.com"
                            required={true}
                            bind:value={formData.email}
                        />
                        <Input
                            label="npi"
                            placeholder="xxxxxxxxxx"
                            required={true}
                            bind:value={formData.npi}
                        />
                    </div>
                    <FileInput
                        label="Image de la carte CIP"
                        accept="image/*"
                        required={true}
                        bind:value={cip}
                    />
                    <Input
                        label="Mot de passe"
                        type="password"
                        placeholder="Min. 8 caractères"
                        required={true}
                        bind:value={formData.password}
                    />
                    <CheckBox
                        checked={formData.agreeTerms}
                        onchange={handleChange}
                    >
                        J'accepte les <a
                            href="/"
                            class="text-primary hover:underline"
                            >Conditions d'utilisation</a
                        >
                        et la
                        <a href="/" class="text-primary hover:underline"
                            >Politique de confidentialité</a
                        >
                    </CheckBox>
                    <Button
                        label="Créer mon compte"
                        type="submit"
                        disabled={!formData.agreeTerms}
                    />
                    <button
                        on:click={toLogin}
                        class="text-xs text-base-content/40 leading-relaxed cursor-pointer"
                        >Vous avez déjà un compte? <span
                            class="text-primary hover:underline"
                            >Se connecter</span
                        ></button
                    >
                </form>
            </div>
        </div>
    </div>
</div>
